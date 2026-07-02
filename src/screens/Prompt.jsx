import { useState } from 'react'
import { askClaude, extractJSON } from '../lib/claude.js'

const SYSTEM = `You create speaking-practice material for a B1-B2 German learner
with a STEM/engineering background preparing for iTalki conversation lessons.
Respond with ONLY a JSON object, no other text:
{
  "prompt": "an engaging B1-B2 speaking prompt in German (2-3 sentences) about a STEM or engineering topic, phrased as something to discuss or explain",
  "vocab": [{ "german": "word", "english": "translation" }],
  "starters": ["useful German sentence starter"]
}
Include exactly 5 vocab entries and exactly 3 sentence starters.
Vary topics between calls: energy, transport, software, materials, space, biotech, robotics, etc.`

export default function Prompt() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const raw = await askClaude({
        system: SYSTEM,
        prompt: 'Generate a new speaking prompt. Pick a different topic than usual.',
      })
      setResult(extractJSON(raw))
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={generate}
        disabled={loading}
        className="w-full rounded-2xl bg-emerald-600 py-3 font-semibold transition-colors hover:bg-emerald-500 disabled:opacity-40"
      >
        {loading ? 'Generating…' : result ? 'New prompt' : 'Generate prompt'}
      </button>

      {error && (
        <div className="rounded-2xl border border-red-800 bg-red-950/50 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-800 p-5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Speaking prompt
            </h2>
            <p className="leading-relaxed">{result.prompt}</p>
          </div>

          <div className="rounded-2xl bg-slate-800 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Key vocab
            </h2>
            <ul className="space-y-2">
              {result.vocab?.map((v, i) => (
                <li key={i} className="flex justify-between gap-4 text-sm">
                  <span className="font-medium text-emerald-300">{v.german}</span>
                  <span className="text-right text-slate-400">{v.english}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-800 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Sentence starters
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
              {result.starters?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <p className="pt-8 text-center text-sm text-slate-500">
          Get a STEM-flavoured German speaking prompt for your next iTalki lesson.
        </p>
      )}
    </div>
  )
}
