import { useState } from 'react'
import { askClaude, extractJSON } from '../lib/claude.js'
import { diffWords } from '../lib/diff.js'
import { Card, CardLabel, PillButton, ErrorNote } from '../components/ui.jsx'

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

  const perfect = result && !result.tokens.some((t) => t.changed)

  return (
    <div className="space-y-4">
      <div className="rise">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Schreib ein paar Sätze auf Deutsch…"
          rows={6}
          className="w-full resize-y rounded-3xl border border-sand bg-white p-5 font-display text-lg leading-relaxed shadow-[0_1px_3px_rgb(0_0_0_/_0.04)] placeholder:font-sans placeholder:text-base placeholder:text-fog/70 focus:border-clay focus:outline-none focus:ring-4 focus:ring-clay/10"
        />
      </div>

      <div className="rise" style={{ animationDelay: '60ms' }}>
        <PillButton onClick={check} disabled={loading || !text.trim()} loading={loading}>
          {loading ? 'Checking…' : 'Check my German'}
        </PillButton>
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}

      {result && (
        <div className="space-y-4">
          <Card>
            <div className="flex items-baseline justify-between">
              <CardLabel>Corrected</CardLabel>
              {perfect && (
                <span className="pop text-xs font-semibold text-moss">Perfekt — no changes ✓</span>
              )}
            </div>
            <p className="font-display text-lg leading-relaxed">
              {result.tokens.map((t, i) =>
                t.changed ? (
                  <span
                    key={i}
                    className="rounded-md bg-moss-soft px-1 font-medium text-moss-deep"
                  >
                    {t.text}
                  </span>
                ) : (
                  <span key={i}>{t.text}</span>
                ),
              )}
            </p>
          </Card>

          {result.explanations?.length > 0 && (
            <Card delay={60}>
              <CardLabel>Why</CardLabel>
              <ul className="space-y-3 text-[15px] leading-relaxed text-ink/80">
                {result.explanations.map((e, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-[3px] shrink-0 select-none font-display text-clay">
                      {i + 1}.
                    </span>
                    {e}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {result.ankiWord && (
            <Card delay={120} className="border-clay/25 bg-clay-soft/60">
              <CardLabel>Add to Anki</CardLabel>
              <p className="font-display text-xl">
                {result.ankiWord.german}
                <span className="ml-3 font-sans text-sm text-fog">{result.ankiWord.english}</span>
              </p>
            </Card>
          )}
        </div>
      )}

      {!result && !loading && !error && (
        <p className="rise px-8 pt-10 text-center text-sm leading-relaxed text-fog" style={{ animationDelay: '120ms' }}>
          Write a few German sentences and get them back corrected, with every change explained.
        </p>
      )}
    </div>
  )
}
