const DAY = 24 * 60 * 60 * 1000

/** 오늘 기준 D-day (당일 0, 지난 날은 음수) */
export function getDday(target: Date, now = new Date()): number {
  const t = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate())
  const n = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((t - n) / DAY)
}

/** 일요일 시작 달력 행렬. 빈 칸은 null */
export function buildMonthMatrix(year: number, month: number): (number | null)[][] {
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]
  while (cells.length % 7) cells.push(null)
  return Array.from({ length: cells.length / 7 }, (_, r) => cells.slice(r * 7, r * 7 + 7))
}
