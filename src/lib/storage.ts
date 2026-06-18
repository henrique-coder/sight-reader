import type { HotkeyMap, NotationSystem, Theme } from '../types'

export const HOTKEY_STORAGE_KEY = 'sight_reader_hotkeys'
export const THEME_STORAGE_KEY = 'sight_reader_theme'
export const NOTATION_STORAGE_KEY = 'sight_reader_notation_system'

export function readHotkeys(notes: readonly string[]): HotkeyMap {
  const base = Object.fromEntries(notes.map((note) => [note, null])) as HotkeyMap

  try {
    const saved = localStorage.getItem(HOTKEY_STORAGE_KEY)
    if (!saved) return base

    const parsed = JSON.parse(saved) as HotkeyMap
    return Object.fromEntries(
      notes.map((note) => [note, parsed[note] ?? null]),
    ) as HotkeyMap
  } catch {
    return base
  }
}

export function saveHotkeys(hotkeys: HotkeyMap) {
  localStorage.setItem(HOTKEY_STORAGE_KEY, JSON.stringify(hotkeys))
}

export function readTheme(): Theme {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

export function saveTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function readNotationSystem(): NotationSystem {
  const saved = localStorage.getItem(NOTATION_STORAGE_KEY)

  if (saved === 'solfege') return 'solfege'
  return 'scientific'
}

export function saveNotationSystem(notationSystem: NotationSystem) {
  localStorage.setItem(NOTATION_STORAGE_KEY, notationSystem)
}
