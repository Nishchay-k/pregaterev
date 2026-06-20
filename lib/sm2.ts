export type Rating = 'Hard' | 'Medium' | 'Easy'
export function sm2(prevInterval: number, prevEF: number, revCount: number, rating: Rating) {
  const quality = rating === 'Easy' ? 5 : rating === 'Medium' ? 3 : 1
  let ef = Math.max(1.3, prevEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
  let interval: number
  if (quality < 2) { interval = 1; ef = Math.max(1.3, prevEF - 0.2) }
  else if (revCount === 0) { interval = 1 }
  else if (revCount === 1) { interval = 6 }
  else { interval = Math.round(prevInterval * ef) }
  const nextRevisionDate = new Date()
  nextRevisionDate.setDate(nextRevisionDate.getDate() + interval)
  return { interval, easeFactor: ef, nextRevisionDate }
}
