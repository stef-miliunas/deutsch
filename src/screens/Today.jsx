import { useEffect, useState } from 'react'
import { useStoredState } from '../lib/storage.js'
import { todayKey, computeStreak, msUntilMidnight } from '../lib/dates.js'
import { Card, CardLabel } from '../components/ui.jsx'

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

function HabitRow({ habit, checked, onToggle }) {
  return (
    <label
      className={`flex cursor-pointer select-none items-center gap-4 px-5 py-4 transition-colors duration-200 ${
        checked ? 'bg-moss-soft/70' : 'bg-white active:bg-cream/60'
      }`}
    >
      <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only" />
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200 ${
          checked ? 'border-moss bg-moss' : 'border-sand bg-white'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 text-white transition-opacity duration-150 ${checked ? 'opacity-100' : 'opacity-0'}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 12.5l5 5L20 6.5" strokeDasharray="24" className={checked ? 'check-draw' : ''} />
        </svg>
      </span>
      <span className="flex-1">
        <span
          className={`font-medium transition-all duration-200 ${
            checked ? 'text-moss-deep line-through decoration-moss/40 decoration-2' : ''
          }`}
        >
          {habit.label}
        </span>
        <span className="ml-2 text-sm text-fog">{habit.detail}</span>
      </span>
      {checked && <span className="pop text-sm font-semibold text-moss">✓</span>}
    </label>
  )
}

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
  const doneCount = HABITS.filter((h) => checks[h.id]).length
  const allDone = doneCount === HABITS.length

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
      checks: {
        ...emptyDay(date).checks,
        ...(prev.date === date ? prev.checks : {}),
        [id]: !checks[id],
      },
    }))
  }

  const dateLabel = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="space-y-4">
      <p className="rise px-1 font-display text-lg italic text-fog">{dateLabel}</p>

      <Card
        delay={40}
        className={`text-center transition-colors duration-500 ${allDone ? '!border-moss/30 !bg-moss-soft' : ''}`}
      >
        <div className={`font-display text-7xl font-medium ${allDone ? 'pop' : ''}`}>
          {streak}
        </div>
        <div className="mt-2 text-sm text-fog">
          {streak === 1 ? 'day in a row' : 'days in a row'}
          {streak > 0 && ' 🔥'}
        </div>
        {allDone && (
          <p className="pop mt-3 text-sm font-semibold text-moss-deep">
            Alles erledigt — see you tomorrow.
          </p>
        )}
      </Card>

      <Card delay={80} className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 pb-2 pt-5">
          <CardLabel>Daily habits</CardLabel>
          <span className="text-xs font-medium text-fog">{doneCount} / 3</span>
        </div>
        <div className="divide-y divide-sand/60">
          {HABITS.map((h) => (
            <HabitRow key={h.id} habit={h} checked={checks[h.id]} onToggle={() => toggle(h.id)} />
          ))}
        </div>
        <div className="h-1.5 w-full bg-cream">
          <div
            className="h-full bg-moss transition-all duration-500 ease-out"
            style={{ width: `${(doneCount / 3) * 100}%` }}
          />
        </div>
      </Card>

      <Card delay={120}>
        <div className="mb-4 flex items-baseline justify-between">
          <CardLabel>Level progress</CardLabel>
          <span className="font-display text-2xl">{progress}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="slider w-full"
          style={{
            background: `linear-gradient(to right, var(--color-clay) ${progress}%, var(--color-sand) ${progress}%)`,
          }}
          aria-label="B1 to B2 progress"
        />
        <div className="mt-2 flex justify-between text-xs font-semibold text-fog">
          <span>B1</span>
          <span>B2</span>
        </div>
      </Card>

      <Card delay={160} className="flex items-center justify-between">
        <div>
          <CardLabel>ETH deadline</CardLabel>
          <p className="text-sm text-fog">31 March 2027</p>
        </div>
        <div className="text-right">
          <span className="font-display text-4xl font-medium">{daysLeft}</span>
          <span className="ml-1.5 text-sm text-fog">days</span>
        </div>
      </Card>
    </div>
  )
}
