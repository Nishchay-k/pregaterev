const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function callGemini(messages: { role: string; content: string }[], systemPrompt?: string) {
  if (!GEMINI_API_KEY) {
    return { text: "⚠️ **Gemini API key not configured.**\n\nTo enable AI features:\n1. Get a free key at https://aistudio.google.com/\n2. Add `GEMINI_API_KEY=your_key` to `.env.local`\n3. Restart the dev server\n\nI can still help with anything stored in the app!", error: true }
  }
  try {
    const contents = messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }))
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system_instruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined, contents, generationConfig: { maxOutputTokens: 2048, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } } })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.', error: false }
  } catch (e: any) { return { text: `Error: ${e.message}`, error: true } }
}

async function callGeminiJSON(prompt: string, maxTokens = 8192): Promise<{ data: any[] | null; error: string | null }> {
  if (!GEMINI_API_KEY) {
    return { data: null, error: 'No GEMINI_API_KEY found in .env.local (or dev server was not restarted after adding it).' }
  }
  let res: Response
  let data: any
  try {
    res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.4,
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    })
    data = await res.json()
  } catch (e: any) {
    console.error('[Gemini] Network/fetch error:', e.message)
    return { data: null, error: `Network error reaching Gemini: ${e.message}` }
  }

  if (!res.ok || data.error) {
    const msg = data.error?.message || `HTTP ${res.status} ${res.statusText}`
    console.error('[Gemini] API error response:', JSON.stringify(data).slice(0, 800))
    return { data: null, error: `Gemini API error: ${msg}` }
  }

  const candidate = data.candidates?.[0]
  const text = candidate?.content?.parts?.[0]?.text
  if (!text) {
    const finishReason = candidate?.finishReason || 'unknown'
    console.error('[Gemini] No text in response. finishReason:', finishReason, JSON.stringify(data).slice(0, 800))
    return { data: null, error: `Gemini returned no content (finishReason: ${finishReason}). May be blocked by safety filters.` }
  }

  try {
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      console.error('[Gemini] Parsed JSON is not a non-empty array:', cleaned.slice(0, 500))
      return { data: null, error: 'Gemini response parsed but was not a valid question array.' }
    }
    return { data: parsed, error: null }
  } catch (parseErr: any) {
    console.error('[Gemini] JSON parse failed. Raw text was:', text.slice(0, 800))
    return { data: null, error: `Gemini response wasn't valid JSON: ${parseErr.message}. Check server terminal for raw output.` }
  }
}

export async function generateTestQuestions(topics: string[], count: number, exam: string) {
  const prompt = `Generate exactly ${count} GATE ${exam} exam questions on these topics: ${topics.join(', ')}.

Return ONLY a valid JSON array. No markdown fences, no explanation. Format:
[{"questionText":"...","optionA":"...","optionB":"...","optionC":"...","optionD":"...","correctOption":0,"explanation":"...","difficulty":"Medium","questionType":"MCQ","marks":1}]

Rules: correctOption is 0=A, 1=B, 2=C, 3=D. Keep explanations concise (2-3 sentences). Mix Easy/Medium/Hard. Mix 1-mark and 2-mark questions. GATE-level standard.`
  return callGeminiJSON(prompt)
}

export async function generatePYQStyleQuestions(topics: string[], count: number, exam: string, year: number) {
  const prompt = `Generate exactly ${count} original practice questions in the style, format, and difficulty level of the GATE ${exam} ${year} exam, on these topics: ${topics.join(', ')}.

These are AI-generated practice questions inspired by typical GATE ${year} difficulty — not reproductions of any official paper.

Return ONLY a valid JSON array. No markdown fences, no explanation. Format:
[{"questionText":"...","optionA":"...","optionB":"...","optionC":"...","optionD":"...","correctOption":0,"explanation":"...","difficulty":"Medium","questionType":"MCQ","marks":1}]

Rules: correctOption is 0=A, 1=B, 2=C, 3=D. Keep explanations concise (2-3 sentences). Mix Easy/Medium/Hard. Mix 1-mark and 2-mark questions.`
  return callGeminiJSON(prompt)
}