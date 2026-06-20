import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    const subjectCount = await prisma.subject.count()
    return NextResponse.json({ initialized: subjectCount > 0, subjects: subjectCount })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
