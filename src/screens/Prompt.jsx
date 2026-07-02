import { useState } from 'react'
import { askClaude, extractJSON } from '../lib/claude.js'
import { Card, CardLabel, PillButton, ErrorNote } from '../components/ui.jsx'

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
      <div className="rise">
        <PillButton onClick={generate} disabled={loading} loading={loading}>
          {loading ? 'Generating…' : result ? 'New prompt' : 'Generate prompt'}
        </PillButton>
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}

      {result && (
        <div className="space-y-4" key={result.prompt}>
          <Card className="border-clay/25 bg-clay-soft/50">
            <CardLabel>Speaking prompt</CardLabel>
            <p className="font-display text-xl leading-relaxed">{result.prompt}</p>
          </Card>

          <Card delay={60} className="!p-0 overflow-hidden">
            <div className="px-6 pb-1 pt-6">
              <CardLabel>Key vocab</CardLabel>
            </div>
            <ul className="divide-y divide-sand/60">
              {result.vocab?.map((v, i) => (
                <li key={i} className="flex items-baseline justify-between gap-4 px-6 py-3">
                  <span className="font-display text-lg">{v.german}</span>
                  <span className="text-right text-sm text-fog">{v.english}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card delay={120}>
            <CardLabel>Sentence starters</CardLabel>
            <ul className="space-y-3">
              {result.starters?.map((s, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="mt-px select-none font-display text-clay">—</span>
                  <span className="font-display text-base">{s}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {!result && !loading && !error && (
        <p className="rise px-8 pt-10 text-center text-sm leading-relaxed text-fog" style={{ animationDelay: '120ms' }}>
          Get a STEM-flavoured German speaking prompt for your next iTalki lesson, with vocab and
          sentence starters to lean on.
        </p>
      )}
    </div>
  )
}
