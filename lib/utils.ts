export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
export function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - new Date().getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}
