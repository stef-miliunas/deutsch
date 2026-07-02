import { useState } from 'react'
import Today from './screens/Today.jsx'
import Write from './screens/Write.jsx'
import Prompt from './screens/Prompt.jsx'
import Settings from './screens/Settings.jsx'

function IconCalendar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function IconPen(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  )
}

function IconChat(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconGear(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

const TABS = [
  { id: 'today', label: 'Today', Icon: IconCalendar, component: Today },
  { id: 'write', label: 'Write', Icon: IconPen, component: Write },
  { id: 'prompt', label: 'Prompt', Icon: IconChat, component: Prompt },
]

export default function App() {
  const [tab, setTab] = useState('today')
  const [showSettings, setShowSettings] = useState(false)

  const Screen = TABS.find((t) => t.id === tab).component

  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col bg-paper text-ink">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-sand/70 bg-paper/90 px-6 pb-3 pt-[calc(env(safe-area-inset-top)+0.9rem)] backdrop-blur-md">
        <h1 className="font-display text-2xl font-medium tracking-tight">
          deutsch
          <span className="ml-2.5 align-middle font-sans text-xs font-medium tracking-wide text-fog">
            B1 → B2
          </span>
        </h1>
        <button
          onClick={() => setShowSettings(true)}
          className="rounded-full p-2 text-fog transition-colors duration-150 hover:bg-cream hover:text-ink"
          aria-label="Settings"
        >
          <IconGear className="h-5 w-5" />
        </button>
      </header>

      <main className="flex-1 px-5 pb-32 pt-5">
        <Screen key={tab} />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-sand bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto flex max-w-lg px-4 py-1.5">
          {TABS.map(({ id, label, Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`group flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-semibold tracking-wide transition-colors duration-150 ${
                  active ? 'text-clay-deep' : 'text-fog hover:text-ink'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full transition-all duration-200 ${
                    active ? 'bg-clay-soft' : 'group-active:scale-90'
                  }`}
                >
                  <Icon className="h-[22px] w-[22px]" />
                </span>
                {label}
              </button>
            )
          })}
        </div>
      </nav>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  )
}
