import { useState } from 'react'
import { getApiKey, setApiKey } from '../lib/claude.js'

export default function Settings({ onClose }) {
  const [key, setKey] = useState(getApiKey())
  const [saved, setSaved] = useState(false)

  function save() {
    setApiKey(key)
    setSaved(true)
    setTimeout(onClose, 600)
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-start justify-center bg-ink/30 p-4 pt-24 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="rise w-full max-w-md rounded-3xl border border-sand bg-paper p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-medium">Settings</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-fog transition-colors hover:bg-cream hover:text-ink"
            aria-label="Close settings"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-fog">
          Anthropic API key
        </label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-ant-…"
          className="w-full rounded-2xl border border-sand bg-white p-3.5 text-sm placeholder:text-fog/60 focus:border-clay focus:outline-none focus:ring-4 focus:ring-clay/10"
        />
        <p className="mt-3 text-xs leading-relaxed text-fog">
          Stored only in this browser's localStorage. Calls go directly to the Anthropic API.
        </p>
        <button
          onClick={save}
          className="mt-5 w-full rounded-full bg-ink py-3 font-semibold text-paper transition-all duration-150 hover:bg-ink/85 active:scale-[0.98]"
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
    </div>
  )
}
