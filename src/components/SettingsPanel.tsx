import type { Clef, HotkeyMap, NotationSystem } from '../types'
import { clefs } from '../lib/music'
import { notationData, t } from '../lib/i18n'
import { formatHotkey } from '../lib/hotkeys'

interface SettingsPanelProps {
  notationSystem: NotationSystem
  clef: Clef
  notes: readonly string[]
  hotkeys: HotkeyMap
  configuringNote: string | null
  message: string | null
  onNotationSystemChange: (notationSystem: NotationSystem) => void
  onClefChange: (clef: Clef) => void
  onConfigure: (note: string) => void
  onClear: (note: string) => void
  onCancel: () => void
}

export function SettingsPanel({
  notationSystem,
  clef,
  notes,
  hotkeys,
  configuringNote,
  message,
  onNotationSystemChange,
  onClefChange,
  onConfigure,
  onClear,
  onCancel,
}: SettingsPanelProps) {
  return (
    <aside className="settings-panel" aria-label={t('settings')}>
      <div className="field-grid">
        <label>
          <span>{t('notationSystem')}</span>
          <select
            value={notationSystem}
            disabled={!!configuringNote}
            onChange={(event) =>
              onNotationSystemChange(event.target.value as NotationSystem)
            }
          >
            {Object.entries(notationData).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>{t('clef')}</span>
          <select
            value={clef}
            disabled={!!configuringNote}
            onChange={(event) => onClefChange(event.target.value as Clef)}
          >
            {Object.keys(clefs).map((clefKey) => (
              <option key={clefKey} value={clefKey}>
                {t(clefKey as Clef)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="hotkeys-panel">
        <div className="panel-title">{t('hotkeys')}</div>
        {configuringNote && (
          <p className="hotkey-prompt">
            {t('hotkeyPrompt', { note: configuringNote })}
          </p>
        )}
        {message && <p className="inline-message">{message}</p>}
        <div className="hotkey-list">
          {notes.map((note) => (
            <div className="hotkey-row" key={note}>
              <span>{note}</span>
              <kbd>{formatHotkey(hotkeys[note]) ?? t('unset')}</kbd>
              <button
                type="button"
                disabled={!!configuringNote}
                onClick={() => onConfigure(note)}
              >
                {t('change')}
              </button>
              <button
                type="button"
                disabled={!!configuringNote || !hotkeys[note]}
                onClick={() => onClear(note)}
              >
                {t('clear')}
              </button>
            </div>
          ))}
        </div>
        {configuringNote && (
          <button type="button" className="secondary-action" onClick={onCancel}>
            {t('cancel')}
          </button>
        )}
      </section>
    </aside>
  )
}
