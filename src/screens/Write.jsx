import { useState } from 'react'
import { askClaude, extractJSON } from '../lib/claude.js'
import { diffWords } from '../lib/diff.js'

const SYSTEM = `You are a German teacher checking a B1-B2 learner's writing.
Respond with ONLY a JSON object, no other text:
{
  "corrected": "the learner's text with the minimal changes needed to make it correct and natural",
  "explanations": ["one sentence per correction explaining what was wrong and why"],
  "ankiWord": { "german": "one useful word from or related to the text worth adding to Anki", "english": "its English translation" }
}
Keep corrections minimal — preserve the learner's wording wherever it is already correct.
If the text is already perfect, return it unchanged with an empty explanations array.`

export default function Write() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function check() {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const raw = await askClaude({ system: SYSTEM, prompt: text })
      const parsed = extractJSON(raw)
      setResult({ ...parsed, tokens: diffWords(text, parsed.corrected || '') })
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Schreib ein paar Sätze auf Deutsch…"
        rows={6}
        className="w-full resize-y rounded-2xl border border-slate-700 bg-slate-800 p-4 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
      />
      <button
        onClick={check}
        disabled={loading || !text.trim()}
        className="w-full rounded-2xl bg-emerald-600 py-3 font-semibold transition-colors hover:bg-emerald-500 disabled:opacity-40"
      >
        {loading ? 'Checking…' : 'Check my German'}
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
              Corrected
            </h2>
            <p className="leading-relaxed">
              {result.tokens.map((t, i) =>
                t.changed ? (
                  <span key={i} className="rounded bg-emerald-900 px-0.5 font-medium text-emerald-300">
                    {t.text}
                  </span>
                ) : (
                  <span key={i}>{t.text}</span>
                ),
              )}
            </p>
          </div>

          {result.explanations?.length > 0 && (
            <div className="rounded-2xl bg-slate-800 p-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Corrections
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                {result.explanations.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {result.ankiWord && (
            <div className="rounded-2xl bg-slate-800 p-5">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Add to Anki
              </h2>
              <p>
                <span className="font-semibold text-emerald-300">{result.ankiWord.german}</span>
                <span className="text-slate-400"> — {result.ankiWord.english}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
