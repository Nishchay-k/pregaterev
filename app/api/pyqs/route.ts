import { NextResponse } from 'next/server'
import { prisma, getOrCreateUser } from '@/lib/prisma'
import { generatePYQStyleQuestions } from '@/lib/gemini'
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  try {
    const user = await getOrCreateUser()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const subjectId = searchParams.get('subject') || ''
    const year = searchParams.get('year') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const bookmarked = searchParams.get('bookmarked') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 12
    const where: any = {}
    if (search) where.questionText = { contains: search }
    if (subjectId) where.subjectId = subjectId
    if (year) where.year = parseInt(year)
    if (difficulty) where.difficulty = difficulty
    if (bookmarked) where.bookmarks = { some: { userId: user.id } }
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where, include: { subject: { select: { name: true, color: true, exams: true } }, topic: { select: { name: true } }, bookmarks: { where: { userId: user.id } } },
        orderBy: [{ year: 'desc' }], skip: (page - 1) * limit, take: limit
      }),
      prisma.question.count({ where })
    ])
    const subjects = await prisma.subject.findMany({ select: { id: true, name: true, exams: true }, orderBy: { order: 'asc' } })
    // Static year range so unsesed years are still selectable (triggers AI generation)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 2013 }, (_, i) => currentYear - i) // e.g. 2026..2014
    return NextResponse.json({ questions: questions.map(q => ({ ...q, isBookmarked: q.bookmarks.length > 0 })), total, pages: Math.ceil(total / limit), subjects, years })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser()
    const body = await req.json()
    const { action } = body

    if (action === 'bookmark') {
      const { questionId } = body
      const existing = await prisma.bookmark.findUnique({ where: { userId_questionId: { userId: user.id, questionId } } })
      if (existing) { await prisma.bookmark.delete({ where: { userId_questionId: { userId: user.id, questionId } } } as any); return NextResponse.json({ bookmarked: false }) }
      await prisma.bookmark.create({ data: { userId: user.id, questionId } }); return NextResponse.json({ bookmarked: true })
    }

    if (action === 'add_revision') {
      const { questionId } = body
      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
      await prisma.revision.create({ data: { userId: user.id, questionId, nextRevisionDate: tomorrow, source: 'Manual' } })
      return NextResponse.json({ success: true })
    }

    if (action === 'generate_for_year') {
      const { subjectId, year, count } = body
      if (!subjectId || !year) return NextResponse.json({ error: 'Subject and year are required' }, { status: 400 })

      const subject = await prisma.subject.findUnique({ where: { id: subjectId }, include: { topics: true } })
      if (!subject || subject.topics.length === 0) return NextResponse.json({ error: 'Subject has no topics to generate from' }, { status: 404 })

      const topicNames = subject.topics.slice(0, 6).map(t => t.name)
      const exam = subject.exams.includes('DA') && !subject.exams.includes('CSE') ? 'DA' : 'CSE'

      const aiResult = await generatePYQStyleQuestions(topicNames, count || 8, exam, parseInt(year))
      if (!aiResult.data || aiResult.data.length === 0) {
        return NextResponse.json({ error: aiResult.error || 'AI generation failed for an unknown reason.' }, { status: 400 })
      }

      let created = 0
      for (const q of aiResult.data) {
        const topic = subject.topics[created % subject.topics.length]
        await prisma.question.create({ data: { ...q, subjectId: subject.id, topicId: topic.id, year: parseInt(year), source: 'AI' } })
        created++
      }
      return NextResponse.json({ success: true, count: created })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
