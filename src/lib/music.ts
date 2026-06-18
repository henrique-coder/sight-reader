import type { Clef, NoteName, Pitch } from '../types'

export const PITCHES: Pitch[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
export const MIN_OCTAVE = 2
export const MAX_OCTAVE = 6
export const DEFAULT_CLEF_RANGES: Record<
  Clef,
  { low: NoteName; high: NoteName }
> = {
  treble: { low: 'G/3', high: 'G/6' },
  alto: { low: 'C/3', high: 'C/6' },
  bass: { low: 'G/2', high: 'G/5' },
}

export const clefs: Record<Clef, string> = {
  treble: 'Treble',
  bass: 'Bass',
  alto: 'Alto',
}

export function parseNote(note: NoteName) {
  const [pitch, octave] = note.split('/') as [Pitch, string]
  return { pitch, octave: Number(octave) }
}

export function noteValue(note: NoteName) {
  const { pitch, octave } = parseNote(note)
  return octave * PITCHES.length + PITCHES.indexOf(pitch)
}

export function noteFromValue(value: number): NoteName {
  const pitch = PITCHES[value % PITCHES.length]
  const octave = Math.floor(value / PITCHES.length)
  return `${pitch}/${octave}`
}

export function getDefaultRangeForClef(clef: Clef) {
  return DEFAULT_CLEF_RANGES[clef]
}

export function moveNote(note: NoteName, direction: 'up' | 'down'): NoteName {
  const next = noteValue(note) + (direction === 'up' ? 1 : -1)
  const min = noteValue('C/2')
  const max = noteValue('B/6')
  return noteFromValue(Math.min(max, Math.max(min, next)))
}

export function notesInRange(low: NoteName, high: NoteName) {
  const lowValue = noteValue(low)
  const highValue = noteValue(high)

  if (lowValue > highValue) return []

  return Array.from({ length: highValue - lowValue + 1 }, (_, index) =>
    noteFromValue(lowValue + index),
  )
}

export function generateRandomNote(low: NoteName, high: NoteName): NoteName {
  const lowValue = noteValue(low)
  const highValue = noteValue(high)

  if (lowValue >= highValue) return low

  const randomValue =
    Math.floor(Math.random() * (highValue - lowValue + 1)) + lowValue

  return noteFromValue(randomValue)
}

export function pitchFromNote(note: NoteName) {
  return parseNote(note).pitch
}

export function canMoveLowBoundary(
  nextLow: NoteName,
  currentHigh: NoteName,
) {
  return noteValue(nextLow) < noteValue(currentHigh)
}

export function canMoveHighBoundary(
  currentLow: NoteName,
  nextHigh: NoteName,
) {
  return noteValue(nextHigh) > noteValue(currentLow)
}
