import { NextResponse } from 'next/server'
import { prisma, getOrCreateUser } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  try {
    const user = await getOrCreateUser()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const where: any = { userId: user.id }
    if (search) where.OR = [{ title: { contains: search } }, { content: { contains: search } }]
    const notes = await prisma.note.findMany({ where, orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }] })
    return NextResponse.json({ notes })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser()
    const { action, id, ...data } = await req.json()
    if (action === 'create') { const note = await prisma.note.create({ data: { ...data, userId: user.id } }); return NextResponse.json({ note }) }
    if (action === 'update') { const note = await prisma.note.update({ where: { id }, data }); return NextResponse.json({ note }) }
    if (action === 'delete') { await prisma.note.delete({ where: { id } }); return NextResponse.json({ success: true }) }
    if (action === 'pin') { const note = await prisma.note.findUnique({ where: { id } }); await prisma.note.update({ where: { id }, data: { isPinned: !note?.isPinned } }); return NextResponse.json({ success: true }) }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
