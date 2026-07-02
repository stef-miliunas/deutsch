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
    <div className="fixed inset-0 z-20 flex items-start justify-center bg-black/60 p-4 pt-24" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close settings">
            ✕
          </button>
        </div>
        <label className="mb-2 block text-sm text-slate-400">Anthropic API key</label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-ant-…"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
        />
        <p className="mt-2 text-xs text-slate-500">
          Stored only in this browser's localStorage. Calls go directly to the Anthropic API.
        </p>
        <button
          onClick={save}
          className="mt-4 w-full rounded-xl bg-emerald-600 py-2.5 font-semibold transition-colors hover:bg-emerald-500"
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
    </div>
  )
}
