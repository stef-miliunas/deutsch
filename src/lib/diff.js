// Word-level LCS diff: returns corrected-text tokens with `changed` flags
// so additions/replacements can be highlighted.
export function diffWords(original, corrected) {
  const a = original.split(/(\s+)/).filter((t) => t.length)
  const b = corrected.split(/(\s+)/).filter((t) => t.length)
  const norm = (t) => t.replace(/[.,!?;:„“"']/g, '').toLowerCase()

  const n = a.length
  const m = b.length
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        norm(a[i]) === norm(b[j])
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const result = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (norm(a[i]) === norm(b[j])) {
      result.push({ text: b[j], changed: a[i] !== b[j] && /\S/.test(b[j]) })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++
    } else {
      result.push({ text: b[j], changed: /\S/.test(b[j]) })
      j++
    }
  }
  while (j < m) {
    result.push({ text: b[j], changed: /\S/.test(b[j]) })
    j++
  }
  return result
}
