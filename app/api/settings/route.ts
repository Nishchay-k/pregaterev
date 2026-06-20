import { NextResponse } from 'next/server'
import { prisma, getOrCreateUser } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  try { const user = await getOrCreateUser(); return NextResponse.json({ user }) }
  catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser()
    const { action, ...data } = await req.json()
    if (action === 'update') { const u = await prisma.user.update({ where: { id: user.id }, data }); return NextResponse.json({ user: u }) }
    if (action === 'reset') {
      await prisma.userTopicProgress.deleteMany({ where: { userId: user.id } })
      await prisma.testAttempt.deleteMany({ where: { userId: user.id } }) // cascades to Answer
      await prisma.studySession.deleteMany({ where: { userId: user.id } })
      await prisma.revision.deleteMany({ where: { userId: user.id } })
      await prisma.analytics.upsert({
        where: { userId: user.id },
        update: { totalQuestionsAttempted: 0, totalCorrect: 0, totalHoursStudied: 0, studyStreak: 0, longestStreak: 0 },
        create: { userId: user.id }
      })
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
