import type { NoteName } from '../types'
import { t } from '../lib/i18n'

interface RangeControlsProps {
  low: NoteName
  high: NoteName
  disabled: boolean
  onMoveLow: (direction: 'up' | 'down') => void
  onMoveHigh: (direction: 'up' | 'down') => void
}

export function RangeControls({
  low,
  high,
  disabled,
  onMoveLow,
  onMoveHigh,
}: RangeControlsProps) {
  return (
    <div className="range-controls">
      <div className="range-heading">
        <span>{t('noteRange')}</span>
        <strong>
          {low} - {high}
        </strong>
      </div>
      <div className="range-buttons">
        <button
          className="range-step range-step-low"
          disabled={disabled}
          onClick={() => onMoveLow('down')}
        >
          <span className="step-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </span>
          <span>{t('lowDown')}</span>
        </button>
        <button
          className="range-step range-step-low"
          disabled={disabled}
          onClick={() => onMoveLow('up')}
        >
          <span className="step-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </span>
          <span>{t('lowUp')}</span>
        </button>
        <button
          className="range-step range-step-high"
          disabled={disabled}
          onClick={() => onMoveHigh('down')}
        >
          <span className="step-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </span>
          <span>{t('highDown')}</span>
        </button>
        <button
          className="range-step range-step-high"
          disabled={disabled}
          onClick={() => onMoveHigh('up')}
        >
          <span className="step-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </span>
          <span>{t('highUp')}</span>
        </button>
      </div>
    </div>
  )
}
