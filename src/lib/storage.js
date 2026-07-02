import { useEffect, useState } from 'react'

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => loadJSON(key, fallback))
  useEffect(() => {
    saveJSON(key, value)
  }, [key, value])
  return [value, setValue]
}
