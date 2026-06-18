import type { HotkeyMap } from '../types'
import { formatHotkey } from '../lib/hotkeys'

interface AnswerGridProps {
  notes: readonly string[]
  hotkeys: HotkeyMap
  disabled: boolean
  onAnswer: (note: string) => void
}

export function AnswerGrid({
  notes,
  hotkeys,
  disabled,
  onAnswer,
}: AnswerGridProps) {
  return (
    <div className="answer-grid" aria-label="Answer choices">
      {notes.map((note) => (
        <button
          key={note}
          type="button"
          className="note-button"
          disabled={disabled}
          onClick={() => onAnswer(note)}
        >
          <span>{note}</span>
          {hotkeys[note] && <small>{formatHotkey(hotkeys[note])}</small>}
        </button>
      ))}
    </div>
  )
}
