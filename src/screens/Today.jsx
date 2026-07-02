import { useEffect, useState } from 'react'
import { useStoredState } from '../lib/storage.js'
import { todayKey, computeStreak, msUntilMidnight } from '../lib/dates.js'

const HABITS = [
  { id: 'anki', label: 'Anki', detail: '15 min' },
  { id: 'listening', label: 'Listening', detail: '60 min' },
  { id: 'speaking', label: 'Speaking', detail: 'any session' },
]

const ETH_DEADLINE = new Date(2027, 2, 31) // March 31, 2027

const emptyDay = (date) => ({
  date,
  checks: { anki: false, listening: false, speaking: false },
})

export default function Today() {
  const [date, setDate] = useState(todayKey())
  const [day, setDay] = useStoredState('deutsch.today', emptyDay(date))
  const [completedDates, setCompletedDates] = useStoredState('deutsch.completedDates', [])
  const [progress, setProgress] = useStoredState('deutsch.b2progress', 0)

  // Roll the date over at midnight while the app is open
  useEffect(() => {
    const timer = setTimeout(() => setDate(todayKey()), msUntilMidnight() + 1000)
    return () => clearTimeout(timer)
  }, [date])

  // Stored checkboxes belong to a previous day — reset them
  useEffect(() => {
    if (day.date !== date) setDay(emptyDay(date))
  }, [day.date, date, setDay])

  const checks = day.date === date ? day.checks : emptyDay(date).checks
  const allDone = HABITS.every((h) => checks[h.id])

  // Keep the completed-dates log in sync with today's checkboxes
  useEffect(() => {
    setCompletedDates((prev) => {
      const has = prev.includes(date)
      if (allDone && !has) return [...prev, date].sort()
      if (!allDone && has) return prev.filter((d) => d !== date)
      return prev
    })
  }, [allDone, date, setCompletedDates])

  const streak = computeStreak(completedDates, date)
  const daysLeft = Math.max(0, Math.ceil((ETH_DEADLINE - new Date()) / 86400000))

  function toggle(id) {
    setDay((prev) => ({
      date,
      checks: { ...emptyDay(date).checks, ...(prev.date === date ? prev.checks : {}), [id]: !checks[id] },
    }))
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-slate-800 p-6 text-center">
        <div className="text-5xl font-bold text-amber-400">
          {streak > 0 ? `🔥 ${streak}` : '0'}
        </div>
        <div className="mt-1 text-sm text-slate-400">
          {streak === 1 ? 'day streak' : 'days streak'}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-800 p-5">
        <div className="mb-2 flex justify-between text-sm font-medium">
          <span>B1</span>
          <span className="text-slate-400">{progress}%</span>
          <span>B2</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full accent-emerald-500"
          aria-label="B1 to B2 progress"
        />
      </div>

      <div className="space-y-3">
        {HABITS.map((h) => (
          <label
            key={h.id}
            className={`flex cursor-pointer items-center gap-4 rounded-2xl p-4 transition-colors ${
              checks[h.id] ? 'bg-emerald-900/60' : 'bg-slate-800'
            }`}
          >
            <input
              type="checkbox"
              checked={checks[h.id]}
              onChange={() => toggle(h.id)}
              className="h-6 w-6 shrink-0 accent-emerald-500"
            />
            <span className={checks[h.id] ? 'text-emerald-300' : ''}>
              <span className="font-medium">{h.label}</span>
              <span className="ml-2 text-sm text-slate-400">{h.detail}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="rounded-2xl bg-slate-800 p-5 text-center">
        <div className="text-3xl font-bold">{daysLeft}</div>
        <div className="mt-1 text-sm text-slate-400">days until ETH deadline · 31 Mar 2027</div>
      </div>
    </div>
  )
}
