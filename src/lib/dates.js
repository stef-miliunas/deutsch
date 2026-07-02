// Local-timezone date key, e.g. "2026-07-02"
export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(key, n) {
  const [y, m, d] = key.split('-').map(Number)
  return todayKey(new Date(y, m - 1, d + n))
}

export function msUntilMidnight(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return next.getTime() - now.getTime()
}

// Consecutive-day streak ending today or yesterday
export function computeStreak(completedDates, today = todayKey()) {
  const set = new Set(completedDates)
  let cursor = set.has(today) ? today : addDays(today, -1)
  let streak = 0
  while (set.has(cursor)) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}
