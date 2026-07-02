import { useState } from 'react'
import Today from './screens/Today.jsx'
import Write from './screens/Write.jsx'
import Prompt from './screens/Prompt.jsx'
import Settings from './screens/Settings.jsx'

const TABS = [
  { id: 'today', label: 'Today', icon: '📅', component: Today },
  { id: 'write', label: 'Write', icon: '✍️', component: Write },
  { id: 'prompt', label: 'Prompt', icon: '💬', component: Prompt },
]

export default function App() {
  const [tab, setTab] = useState('today')
  const [showSettings, setShowSettings] = useState(false)

  const Screen = TABS.find((t) => t.id === tab).component

  return (
    <div className="mx-auto flex min-h-svh max-w-lg flex-col bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-slate-900/90 px-5 pb-3 pt-[calc(env(safe-area-inset-top)+0.75rem)] backdrop-blur">
        <h1 className="text-xl font-bold tracking-tight">
          deutsch <span className="text-sm font-normal text-slate-400">B1 → B2</span>
        </h1>
        <button
          onClick={() => setShowSettings(true)}
          className="rounded-full p-2 text-xl transition-colors hover:bg-slate-800"
          aria-label="Settings"
        >
          ⚙️
        </button>
      </header>

      <main className="flex-1 px-5 pb-28 pt-2">
        <Screen />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-800 bg-slate-900/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto flex max-w-lg">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
                tab === t.id ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  )
}
