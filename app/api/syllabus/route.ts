import { NextResponse } from 'next/server'
import { prisma, getOrCreateUser } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const user = await getOrCreateUser()
    const subjects = await prisma.subject.findMany({
      include: { topics: { include: { userProgress: { where: { userId: user.id } } }, orderBy: { name: 'asc' } } },
      orderBy: { order: 'asc' }
    })
    const data = subjects.map(s => ({ ...s, topics: s.topics.map(t => ({ ...t, status: t.userProgress[0]?.status || 'Not Started' })) }))
    return NextResponse.json({ subjects: data })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser()
    const { topicId, status } = await req.json()
    await prisma.userTopicProgress.upsert({
      where: { userId_topicId: { userId: user.id, topicId } },
      update: { status }, create: { userId: user.id, topicId, status }
    })
    return NextResponse.json({ success: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
