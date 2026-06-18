export type NotationSystem = 'scientific' | 'solfege'
export type Clef = 'treble' | 'bass' | 'alto'
export type Theme = 'light' | 'dark'
export type Pitch = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
export type NoteName = `${Pitch}/${number}`

export type HotkeyMap = Record<string, string | null>

export interface NoteRange {
  low: NoteName
  high: NoteName
}
