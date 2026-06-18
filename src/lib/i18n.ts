import type { Clef } from '../types'

export const notationData = {
  scientific: {
    name: 'Scientific pitch notation (A-B-C)',
    notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  },
  solfege: {
    name: 'Fixed-do solfege (Dó-Ré-Mi)',
    notes: ['Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá', 'Si'],
  },
} as const

type TranslationKey =
  | 'appTitle'
  | 'score'
  | 'subtitle'
  | 'loadingScore'
  | 'renderError'
  | 'noteRange'
  | 'lowDown'
  | 'lowUp'
  | 'highDown'
  | 'highUp'
  | 'settings'
  | 'closeSettings'
  | 'notationSystem'
  | 'clef'
  | 'hotkeys'
  | 'change'
  | 'clear'
  | 'unset'
  | 'cancel'
  | 'hotkeyPrompt'
  | 'invalidKey'
  | 'keyInUse'
  | 'darkTheme'
  | 'lightTheme'
  | 'github'
  | Clef

const translations: Record<TranslationKey, string> = {
  appTitle: 'Sight Reader',
  subtitle: 'Practice note reading with clefs, hotkeys, and an adjustable range.',
  score: 'Score',
  loadingScore: 'Loading stave...',
  renderError: 'The stave could not be rendered.',
  noteRange: 'Note range',
  lowDown: 'Lower low note',
  lowUp: 'Raise low note',
  highDown: 'Lower high note',
  highUp: 'Raise high note',
  settings: 'Settings',
  closeSettings: 'Close',
  notationSystem: 'Note naming system',
  clef: 'Clef',
  hotkeys: 'Hotkeys',
  change: 'Change',
  clear: 'Clear',
  unset: 'N/A',
  cancel: 'Cancel',
  hotkeyPrompt: 'Press a key for {note}. Esc cancels.',
  invalidKey: 'Use letters, numbers, arrows, F1-F12, or common symbols.',
  keyInUse:
    'The key {key} was already assigned to {note}; the old mapping was cleared.',
  darkTheme: 'Dark theme',
  lightTheme: 'Light theme',
  github: 'View on GitHub',
  treble: 'Treble',
  bass: 'Bass',
  alto: 'Alto',
}

export function t(
  key: TranslationKey,
  replacements: Record<string, string> = {},
) {
  let text = translations[key]

  for (const [token, value] of Object.entries(replacements)) {
    text = text.replaceAll(`{${token}}`, value)
  }

  return text
}
