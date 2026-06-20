import { NextResponse } from 'next/server'
import { prisma, getOrCreateUser } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const user = await getOrCreateUser()
    const analytics = await prisma.analytics.findUnique({ where: { userId: user.id } }) || { totalQuestionsAttempted: 0, totalCorrect: 0, totalHoursStudied: 0, studyStreak: 0, longestStreak: 0 }
    const subjects = await prisma.subject.findMany({
      include: { topics: { include: { userProgress: { where: { userId: user.id } } } } },
      orderBy: { order: 'asc' }
    })
    const subjectProgress = subjects.map(s => {
      const total = s.topics.length
      const mastered = s.topics.filter(t => t.userProgress[0]?.status === 'Mastered').length
      const inProgress = s.topics.filter(t => ['Learning','Practicing','Revised'].includes(t.userProgress[0]?.status || '')).length
      return { id: s.id, name: s.name, color: s.color, exams: s.exams, total, mastered, inProgress, percent: total > 0 ? Math.round((mastered / total) * 100) : 0 }
    })
    const sessions = await prisma.studySession.findMany({ where: { userId: user.id }, orderBy: { date: 'asc' }, take: 14 })
    const chartData = sessions.map(s => ({
      date: new Date(s.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      questions: s.questionsAttempted, correct: s.questionsCorrect, hours: +(s.duration / 60).toFixed(1)
    }))
    const dueRevisions = await prisma.revision.count({ where: { userId: user.id, nextRevisionDate: { lte: new Date() } } })
    const totalTopics = subjects.reduce((a, s) => a + s.topics.length, 0)
    const masteredTopics = subjects.reduce((a, s) => a + s.topics.filter(t => t.userProgress[0]?.status === 'Mastered').length, 0)
    return NextResponse.json({ user, analytics, subjectProgress, chartData, dueRevisions, totalTopics, masteredTopics })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
