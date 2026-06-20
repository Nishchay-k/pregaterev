import { NextResponse } from 'next/server'
import { prisma, getOrCreateUser } from '@/lib/prisma'
import { sm2 } from '@/lib/sm2'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const user = await getOrCreateUser()
    const due = await prisma.revision.findMany({
      where: { userId: user.id, nextRevisionDate: { lte: new Date() } },
      include: { question: { include: { subject: true, topic: true } }, topic: true },
      orderBy: { nextRevisionDate: 'asc' }, take: 30
    })
    const upcoming = await prisma.revision.count({ where: { userId: user.id, nextRevisionDate: { gt: new Date() } } })
    return NextResponse.json({ due, upcoming, total: due.length + upcoming })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser()
    const { revisionId, rating } = await req.json()
    const revision = await prisma.revision.findUnique({ where: { id: revisionId } })
    if (!revision) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const { interval, easeFactor, nextRevisionDate } = sm2(revision.interval, revision.easeFactor, revision.revisionCount, rating)
    await prisma.revision.update({ where: { id: revisionId }, data: { interval, easeFactor, nextRevisionDate, revisionCount: { increment: 1 }, lastRating: rating } })
    return NextResponse.json({ success: true, nextRevisionDate, interval })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
