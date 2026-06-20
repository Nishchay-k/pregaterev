import { NextResponse } from 'next/server'
import { callGemini } from '@/lib/gemini'
const SYS = `You are GateForge AI — an expert tutor for GATE CSE and GATE DA preparation. Explain concepts clearly, solve problems step-by-step, and keep answers concise and GATE-focused. Use markdown formatting.`
export const dynamic = 'force-dynamic'
export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const result = await callGemini(messages.slice(-10), SYS)
    return NextResponse.json(result)
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
