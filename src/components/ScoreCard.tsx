import type { NoteName } from '../types'
import { t } from '../lib/i18n'

interface ScoreCardProps {
  score: number
  currentNote: NoteName
}

export function ScoreCard({ score, currentNote }: ScoreCardProps) {
  return (
    <section className="score-card" aria-label="Current score">
      <div>
        <span>{t('score')}</span>
        <strong>{score}</strong>
      </div>
      <small data-testid="current-note">Current note: {currentNote}</small>
    </section>
  )
}
