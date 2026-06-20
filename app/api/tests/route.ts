import { NextResponse } from 'next/server'
import { prisma, getOrCreateUser } from '@/lib/prisma'
import { generateTestQuestions } from '@/lib/gemini'

export const dynamic = 'force-dynamic'

// Builds a question set for one "bucket" (e.g. General Aptitude, or core subjects):
// fresh real PYQs first -> AI fill for the gap -> repeat previously-correct PYQs as last resort
async function buildQuestionPool(opts: {
  subjectIds: string[]; topicIds: string[]; want: number; correctIds: string[]; exam: string
}) {
  const { subjectIds, topicIds, want, correctIds, exam } = opts
  if (want <= 0 || (subjectIds.length === 0 && topicIds.length === 0)) {
    return { ids: [] as string[], pyqCount: 0, aiCount: 0, repeatedCount: 0, aiError: '' }
  }

  const scopeFilter = {
    OR: [
      ...(subjectIds.length ? [{ subjectId: { in: subjectIds } }] : []),
      ...(topicIds.length ? [{ topicId: { in: topicIds } }] : []),
    ],
  }

  const fresh = await prisma.question.findMany({
    where: { ...scopeFilter, source: 'PYQ', id: { notIn: correctIds } },
    orderBy: { year: 'desc' }, take: want
  })
  let ids = fresh.map(q => q.id)
  let pyqCount = ids.length
  let aiCount = 0
  let repeatedCount = 0
  let aiError = ''

  if (ids.length < want) {
    const aiNeeded = want - ids.length
    let topicNames: string[] = []
    if (topicIds.length) {
      topicNames = (await prisma.topic.findMany({ where: { id: { in: topicIds } }, select: { name: true } })).map(t => t.name)
    } else if (subjectIds.length) {
      topicNames = (await prisma.topic.findMany({ where: { subjectId: { in: subjectIds } }, select: { name: true }, take: 6 })).map(t => t.name)
    }
    const aiResult = topicNames.length > 0
      ? await generateTestQuestions(topicNames, aiNeeded, exam)
      : { data: null, error: 'No topics resolved for AI generation.' }

    if (aiResult.data && aiResult.data.length > 0) {
      const subjId = subjectIds[0]
      const topId = topicIds[0] || (subjId ? (await prisma.topic.findFirst({ where: { subjectId: subjId } }))?.id : undefined)
      if (subjId && topId) {
        for (const q of aiResult.data.slice(0, aiNeeded)) {
          const created = await prisma.question.create({ data: { ...q, subjectId: subjId, topicId: topId, source: 'AI' } })
          ids.push(created.id)
          aiCount++
        }
      }
    } else if (aiResult.error) {
      aiError = aiResult.error
    }
  }

  if (ids.length < want) {
    const repeatNeeded = want - ids.length
    const repeats = await prisma.question.findMany({
      where: { ...scopeFilter, id: { notIn: ids } },
      orderBy: { year: 'desc' }, take: repeatNeeded
    })
    ids.push(...repeats.map(q => q.id))
    repeatedCount = repeats.length
    pyqCount += repeats.length
  }

  return { ids, pyqCount, aiCount, repeatedCount, aiError }
}

export async function GET(req: Request) {
  try {
    const user = await getOrCreateUser()
    const { searchParams } = new URL(req.url)
    const testId = searchParams.get('testId')
    const attemptId = searchParams.get('attemptId')
    if (attemptId) {
      const attempt = await prisma.testAttempt.findUnique({
        where: { id: attemptId },
        include: { test: true, answers: { include: { question: { include: { subject: true, topic: true } } } } }
      })
      return NextResponse.json({ attempt })
    }
    if (testId) {
      const test = await prisma.test.findUnique({ where: { id: testId } })
      if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const questionIds = JSON.parse(test.topicIds || '[]')
      const questions = questionIds.length > 0
        ? await prisma.question.findMany({ where: { id: { in: questionIds } }, include: { subject: true, topic: true } })
        : []
      const ordered = questionIds.map((id: string) => questions.find(q => q.id === id)).filter(Boolean)
      return NextResponse.json({ test, questions: ordered })
    }
    const attempts = await prisma.testAttempt.findMany({
      where: { userId: user.id, status: 'Submitted' },
      include: { test: true }, orderBy: { startedAt: 'desc' }, take: 10
    })
    return NextResponse.json({ attempts })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser()
    const body = await req.json()
    const { action } = body

    if (action === 'create') {
      const { type, subjectIds, topicIds, duration, questionCount, exam } = body
      const want = type === 'Full Mock' ? 65 : (questionCount || 15)
      const finalDuration = type === 'Full Mock' ? 180 : (duration || 60)

      const testCount = await prisma.test.count()
      const dateLabel = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      const name = `Test #${testCount + 1} · ${dateLabel}`

      const correctAnswers = await prisma.answer.findMany({
        where: { isCorrect: true, attempt: { userId: user.id } },
        select: { questionId: true }
      })
      const correctIds = correctAnswers.map(a => a.questionId)

      let pyqCount = 0, aiCount = 0, repeatedCount = 0, questionIds: string[] = [], aiError = ''

      if (type === 'Full Mock') {
        // Mirrors real GATE composition: ~15% General Aptitude (mandatory on every paper) + rest core subjects
        const gaSubject = await prisma.subject.findFirst({ where: { name: 'General Aptitude' } })
        const gaWant = gaSubject ? Math.max(1, Math.round(want * 0.15)) : 0
        const coreWant = want - gaWant

        const [gaResult, coreResult] = await Promise.all([
          gaWant > 0 ? buildQuestionPool({ subjectIds: [gaSubject!.id], topicIds: [], want: gaWant, correctIds, exam: exam || 'CSE' }) : Promise.resolve({ ids: [], pyqCount: 0, aiCount: 0, repeatedCount: 0, aiError: '' }),
          buildQuestionPool({ subjectIds: subjectIds || [], topicIds: [], want: coreWant, correctIds, exam: exam || 'CSE' }),
        ])

        questionIds = [...gaResult.ids, ...coreResult.ids]
        pyqCount = gaResult.pyqCount + coreResult.pyqCount
        aiCount = gaResult.aiCount + coreResult.aiCount
        repeatedCount = gaResult.repeatedCount + coreResult.repeatedCount
        aiError = coreResult.aiError || gaResult.aiError
      } else {
        const result = await buildQuestionPool({ subjectIds: subjectIds || [], topicIds: topicIds || [], want, correctIds, exam: exam || 'CSE' })
        questionIds = result.ids
        pyqCount = result.pyqCount; aiCount = result.aiCount; repeatedCount = result.repeatedCount; aiError = result.aiError
      }

      if (questionIds.length === 0) {
        return NextResponse.json({ error: 'No questions available for the selected subjects/topics. Pick different subjects or add a Gemini API key for AI generation.' }, { status: 400 })
      }

      let message = ''
      if (repeatedCount > 0) {
        message = `Limited fresh content for this selection — reused ${repeatedCount} question${repeatedCount === 1 ? '' : 's'} you've already solved correctly to complete the test.`
        if (aiError) message += ` (AI fill skipped: ${aiError})`
      }

      const test = await prisma.test.create({
        data: { name, type: type || 'Topic Test', duration: finalDuration, totalMarks: questionIds.length, subjectIds: JSON.stringify(subjectIds || []), topicIds: JSON.stringify(questionIds) }
      })
      return NextResponse.json({ test, meta: { pyqCount, aiCount, repeatedCount, requested: want, message } })
    }

    if (action === 'start') {
      const { testId } = body
      const test = await prisma.test.findUnique({ where: { id: testId } })
      if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const attempt = await prisma.testAttempt.create({ data: { userId: user.id, testId, totalMarks: test.totalMarks } })
      return NextResponse.json({ attempt })
    }

    if (action === 'submit') {
      const { attemptId, answers, timeSpent } = body
      let score = 0; let correct = 0
      const records = []

      for (const ans of answers) {
        const q = await prisma.question.findUnique({ where: { id: ans.questionId } })
        if (!q) continue

        let isCorrect = false
        let attempted = false

        if (q.questionType === 'MSQ') {
          const sel: number[] = Array.isArray(ans.selectedOptions) ? ans.selectedOptions : []
          attempted = sel.length > 0
          if (attempted) {
            const correctSet = q.correctOptions.split(',').filter(Boolean).map(Number).sort((a, b) => a - b).join(',')
            const selectedSet = [...sel].sort((a, b) => a - b).join(',')
            isCorrect = correctSet === selectedSet
          }
          if (isCorrect) { score += q.marks; correct++ }
          // No negative marking for MSQ — GATE rule
        } else if (q.questionType === 'NAT') {
          const val = ans.natValue
          attempted = val !== null && val !== undefined && val !== ''
          if (attempted && q.natAnswer !== null) {
            isCorrect = Math.abs(parseFloat(val) - q.natAnswer) <= (q.natTolerance || 0.01)
          }
          if (isCorrect) { score += q.marks; correct++ }
          // No negative marking for NAT — GATE rule
        } else {
          // MCQ — only type with negative marking
          attempted = ans.selectedOption !== null && ans.selectedOption !== undefined
          isCorrect = attempted && ans.selectedOption === q.correctOption
          if (isCorrect) { score += q.marks; correct++ }
          else if (attempted) score -= q.marks / 3
        }

        records.push({
          attemptId, questionId: ans.questionId,
          selectedOption: ans.selectedOption ?? null,
          selectedOptions: Array.isArray(ans.selectedOptions) ? ans.selectedOptions.join(',') : '',
          natAnswer: attempted && q.questionType === 'NAT' ? parseFloat(ans.natValue) : null,
          isCorrect, timeSpent: ans.timeSpent || 0
        })

        if (!isCorrect && attempted) {
          const nd = new Date(); nd.setDate(nd.getDate() + 1)
          await prisma.revision.create({ data: { userId: user.id, questionId: ans.questionId, nextRevisionDate: nd, source: 'Test Error' } }).catch(() => {})
        }
      }

      await prisma.answer.createMany({ data: records })
      const accuracy = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0
      const updated = await prisma.testAttempt.update({
        where: { id: attemptId },
        data: { score: Math.max(0, score), accuracy, status: 'Submitted', submittedAt: new Date(), timeSpent: timeSpent || 0 }
      })
      await prisma.analytics.upsert({
        where: { userId: user.id },
        update: { totalQuestionsAttempted: { increment: answers.length }, totalCorrect: { increment: correct } },
        create: { userId: user.id, totalQuestionsAttempted: answers.length, totalCorrect: correct }
      })
      await prisma.studySession.create({ data: { userId: user.id, questionsAttempted: answers.length, questionsCorrect: correct, duration: Math.round((timeSpent || 0) / 60) } })
      return NextResponse.json({ attempt: updated, score: Math.max(0, score), accuracy })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
