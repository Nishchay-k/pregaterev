import { NextResponse } from 'next/server'
import { prisma, getOrCreateUser } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const user = await getOrCreateUser()
    const analytics = await prisma.analytics.findUnique({ where: { userId: user.id } })
    const sessions = await prisma.studySession.findMany({ where: { userId: user.id }, orderBy: { date: 'asc' }, take: 30 })
    const attempts = await prisma.testAttempt.findMany({
      where: { userId: user.id, status: 'Submitted' }, include: { test: { select: { name: true, type: true } } }, orderBy: { startedAt: 'desc' }, take: 10
    })
    const chartData = sessions.map(s => ({
      date: new Date(s.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      hours: +(s.duration / 60).toFixed(1), questions: s.questionsAttempted,
      accuracy: s.questionsAttempted > 0 ? Math.round((s.questionsCorrect / s.questionsAttempted) * 100) : 0
    }))
    return NextResponse.json({ analytics, chartData, attempts })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
