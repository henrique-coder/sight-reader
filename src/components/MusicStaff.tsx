import { useEffect, useRef, useState } from 'react'
import {
  Formatter,
  Renderer,
  Stave,
  StaveNote,
  Voice,
  type RenderContext,
} from 'vexflow'
import type { Clef, NoteName, Theme } from '../types'
import { notesInRange } from '../lib/music'
import { t } from '../lib/i18n'

interface MusicStaffProps {
  clef: Clef
  note?: NoteName
  low?: NoteName
  high?: NoteName
  label: string
  theme: Theme
  compact?: boolean
}

export function MusicStaff({
  clef,
  note,
  low,
  high,
  label,
  theme,
  compact = false,
}: MusicStaffProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    document.fonts.ready.then(() => setReady(true)).catch(() => setReady(true))
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !ready) return

    container.innerHTML = ''

    try {
      const staveNotes = createNotes({ note, low, high, clef })
      const width = getStaffWidth(staveNotes.length, compact)
      const height = compact ? 130 : 160
      const renderer = new Renderer(container, Renderer.Backends.SVG)
      renderer.resize(width, height)

      const context = renderer.getContext()
      const stave = new Stave(12, 18, width - 24)
      stave.addClef(clef).setContext(context).draw()

      if (staveNotes.length > 0) {
        drawNotes(context, stave, staveNotes, width)
      }
      applySvgTheme(container, theme)
    } catch {
      container.innerHTML = ''
      const errorMessage = document.createElement('p')
      errorMessage.className = 'inline-error'
      errorMessage.textContent = t('renderError')
      container.append(errorMessage)
    }
  }, [clef, compact, high, low, note, ready, theme])

  return (
    <div className="staff-shell" aria-label={label}>
      <div ref={containerRef} className="staff-canvas">
        {!ready && <p>{t('loadingScore')}</p>}
      </div>
    </div>
  )
}

function createNotes({
  note,
  low,
  high,
  clef,
}: {
  note?: NoteName
  low?: NoteName
  high?: NoteName
  clef: Clef
}) {
  if (note) {
    return [
      new StaveNote({
        clef,
        keys: [note],
        duration: 'w',
      }),
    ]
  }

  if (!low || !high) return []

  return notesInRange(low, high).map((rangeNote) => {
    const staveNote = new StaveNote({
      clef,
      keys: [rangeNote],
      duration: 'q',
    })

    staveNote.setStyle(
      rangeNote === low || rangeNote === high
        ? { fillStyle: '#2563eb', strokeStyle: '#2563eb' }
        : { fillStyle: '#64748b', strokeStyle: '#64748b' },
    )

    return staveNote
  })
}

function getStaffWidth(noteCount: number, compact: boolean) {
  if (!compact) return 620
  return Math.max(620, 90 + noteCount * 34)
}

function drawNotes(
  context: RenderContext,
  stave: Stave,
  notes: StaveNote[],
  width: number,
) {
  const voice = new Voice({
    numBeats: Math.max(1, notes.length),
    beatValue: 4,
  })

  voice.setStrict(false)
  voice.addTickables(notes)

  new Formatter().joinVoices([voice]).format([voice], width - 90)
  voice.draw(context, stave)
}

function applySvgTheme(container: HTMLElement, theme: Theme) {
  if (theme !== 'dark') return

  const svg = container.querySelector('svg')
  if (!svg) return

  svg.style.color = '#f8fafc'

  svg.querySelectorAll<SVGElement>('[stroke]').forEach((element) => {
    element.setAttribute('stroke', '#f8fafc')
  })

  svg.querySelectorAll<SVGElement>('[fill]').forEach((element) => {
    const fill = element.getAttribute('fill')
    if (fill && fill !== 'none') {
      element.setAttribute('fill', '#f8fafc')
    }
  })
}
