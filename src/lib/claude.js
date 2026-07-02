import Anthropic from '@anthropic-ai/sdk'

export const MODEL = 'claude-sonnet-4-6'

export function getApiKey() {
  return localStorage.getItem('deutsch.apiKey') || ''
}

export function setApiKey(key) {
  localStorage.setItem('deutsch.apiKey', key.trim())
}

export async function askClaude({ system, prompt, maxTokens = 1024 }) {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('No API key set. Open Settings (gear icon) and paste your Anthropic API key.')
  }
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: prompt }],
  })
  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
}

// Pull a JSON object out of a model response that may wrap it in prose/fences
export function extractJSON(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced ? fenced[1] : text
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Could not parse the response. Try again.')
  return JSON.parse(candidate.slice(start, end + 1))
}
