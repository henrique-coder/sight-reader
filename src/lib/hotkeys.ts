export function isValidHotkey(key: string) {
  const normalized = key.toLowerCase()

  return (
    /^[a-z0-9]$/.test(normalized) ||
    normalized.startsWith('arrow') ||
    /^f([1-9]|1[0-2])$/.test(normalized) ||
    /^[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]$/.test(normalized) ||
    normalized === ' '
  )
}

export function formatHotkey(key: string | null) {
  if (!key) return null
  if (key === ' ') return 'Space'
  return key.length === 1 ? key.toUpperCase() : key
}
