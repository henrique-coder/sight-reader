import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { AnswerGrid } from './components/AnswerGrid'
import { GitHubIcon, MoonIcon, SunIcon } from './components/Icons'
import { MusicStaff } from './components/MusicStaff'
import { RangeControls } from './components/RangeControls'
import { ScoreCard } from './components/ScoreCard'
import { SettingsPanel } from './components/SettingsPanel'
import { isValidHotkey } from './lib/hotkeys'
import { notationData, t } from './lib/i18n'
import {
  canMoveHighBoundary,
  canMoveLowBoundary,
  generateRandomNote,
  getDefaultRangeForClef,
  moveNote,
  pitchFromNote,
  PITCHES,
} from './lib/music'
import {
  readHotkeys,
  readNotationSystem,
  readTheme,
  saveHotkeys,
  saveNotationSystem,
  saveTheme,
} from './lib/storage'
import type { Clef, HotkeyMap, NoteName, NotationSystem, Theme } from './types'

function App() {
  const [notationSystem, setNotationSystem] = useState<NotationSystem>(() =>
    readNotationSystem(),
  )
  const [clef, setClef] = useState<Clef>('treble')
  const [theme, setTheme] = useState<Theme>(() => readTheme())
  const defaultRange = getDefaultRangeForClef('treble')
  const [lowNote, setLowNote] = useState<NoteName>(defaultRange.low)
  const [highNote, setHighNote] = useState<NoteName>(defaultRange.high)
  const [score, setScore] = useState(0)
  const [currentNote, setCurrentNote] = useState<NoteName>(() =>
    generateRandomNote(defaultRange.low, defaultRange.high),
  )
  const [configuringNote, setConfiguringNote] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const notes = notationData[notationSystem].notes
  const [hotkeys, setHotkeys] = useState<HotkeyMap>(() => readHotkeys(notes))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    saveTheme(theme)
  }, [theme])

  useEffect(() => {
    saveNotationSystem(notationSystem)
  }, [notationSystem])

  useEffect(() => {
    saveHotkeys(hotkeys)
  }, [hotkeys])

  useEffect(() => {
    if (!configuringNote) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setConfiguringNote(null)
        setMessage(null)
        return
      }

      event.preventDefault()
      const key = event.key.toLowerCase()

      if (!isValidHotkey(key)) {
        setMessage(t('invalidKey'))
        return
      }

      const existingNote = Object.entries(hotkeys).find(
        ([note, mappedKey]) => mappedKey === key && note !== configuringNote,
      )?.[0]

      setHotkeys((current) => {
        const next = { ...current }
        if (existingNote) next[existingNote] = null
        next[configuringNote] = key
        return next
      })

      setMessage(
        existingNote
          ? t('keyInUse', { key, note: existingNote })
          : null,
      )
      setConfiguringNote(null)
    }

    document.addEventListener('keydown', handleKeyDown, { capture: true })
    return () =>
      document.removeEventListener('keydown', handleKeyDown, { capture: true })
  }, [configuringNote, hotkeys])

  const correctAnswer = useMemo(() => {
    const pitchIndex = PITCHES.indexOf(pitchFromNote(currentNote))
    return notes[pitchIndex]
  }, [currentNote, notes])

  const nextQuestion = useCallback(() => {
    setCurrentNote(generateRandomNote(lowNote, highNote))
  }, [highNote, lowNote])

  const checkAnswer = useCallback(
    (selectedNote: string) => {
      if (configuringNote) return

      if (selectedNote === correctAnswer) {
        setScore((current) => current + 1)
        nextQuestion()
      } else {
        setScore(0)
      }
    },
    [configuringNote, correctAnswer, nextQuestion],
  )

  const activeHotkeys = useMemo(
    () =>
      Object.values(hotkeys)
        .filter((key): key is string => Boolean(key))
        .join(','),
    [hotkeys],
  )

  useHotkeys(
    activeHotkeys,
    (event) => {
      if (configuringNote) return
      const pressedKey = event.key.toLowerCase()
      const note = Object.entries(hotkeys).find(
        ([, mappedKey]) => mappedKey === pressedKey,
      )?.[0]

      if (note) checkAnswer(note)
    },
    { enabled: !configuringNote, enableOnFormTags: false },
    [checkAnswer, configuringNote, hotkeys],
  )

  const handleMoveLow = (direction: 'up' | 'down') => {
    const nextLow = moveNote(lowNote, direction)
    if (canMoveLowBoundary(nextLow, highNote)) {
      setLowNote(nextLow)
      setCurrentNote(generateRandomNote(nextLow, highNote))
    }
  }

  const handleMoveHigh = (direction: 'up' | 'down') => {
    const nextHigh = moveNote(highNote, direction)
    if (canMoveHighBoundary(lowNote, nextHigh)) {
      setHighNote(nextHigh)
      setCurrentNote(generateRandomNote(lowNote, nextHigh))
    }
  }

  const handleNotationSystemChange = (nextNotationSystem: NotationSystem) => {
    const nextNotes = notationData[nextNotationSystem].notes
    setHotkeys((current) => {
      const next = readHotkeys(nextNotes)
      for (const note of nextNotes) next[note] = current[note] ?? next[note]
      return next
    })
    setNotationSystem(nextNotationSystem)
    setScore(0)
  }

  const handleClefChange = (nextClef: Clef) => {
    const nextRange = getDefaultRangeForClef(nextClef)

    setClef(nextClef)
    setLowNote(nextRange.low)
    setHighNote(nextRange.high)
    setCurrentNote(generateRandomNote(nextRange.low, nextRange.high))
    setScore(0)
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">VexFlow 5 + React</p>
          <h1>{t('appTitle')}</h1>
          <p>{t('subtitle')}</p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="icon-action"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? t('lightTheme') : t('darkTheme')}
            title={theme === 'dark' ? t('lightTheme') : t('darkTheme')}
          >
            {theme === 'dark' ? (
              <SunIcon className="top-icon" />
            ) : (
              <MoonIcon className="top-icon" />
            )}
          </button>
          <a
            className="icon-action"
            href="https://github.com/henrique-coder/sight-reader"
            target="_blank"
            rel="noreferrer"
            aria-label={t('github')}
            title={t('github')}
          >
            <GitHubIcon className="top-icon fill-icon" />
          </a>
        </div>
      </header>

      <ScoreCard score={score} currentNote={currentNote} />

      <section className="trainer-layout">
        <div className="practice-panel">
          <MusicStaff
            clef={clef}
            note={currentNote}
            label="Practice stave"
            theme={theme}
          />
          <AnswerGrid
            notes={notes}
            hotkeys={hotkeys}
            disabled={!!configuringNote}
            onAnswer={checkAnswer}
          />
        </div>

        <div className="side-panel">
          <RangeControls
            low={lowNote}
            high={highNote}
            disabled={!!configuringNote}
            onMoveLow={handleMoveLow}
            onMoveHigh={handleMoveHigh}
          />
          <MusicStaff
            clef={clef}
            low={lowNote}
            high={highNote}
            label="Range stave"
            theme={theme}
            compact
          />
        </div>
      </section>

      <section className="settings-section">
        <button
          type="button"
          className="primary-action"
          disabled={!!configuringNote && !settingsOpen}
          onClick={() => setSettingsOpen((open) => !open)}
        >
          {settingsOpen ? t('closeSettings') : t('settings')}
        </button>
        {settingsOpen && (
          <SettingsPanel
            notationSystem={notationSystem}
            clef={clef}
            notes={notes}
            hotkeys={hotkeys}
            configuringNote={configuringNote}
            message={message}
            onNotationSystemChange={handleNotationSystemChange}
            onClefChange={handleClefChange}
            onConfigure={(note) => {
              setMessage(null)
              setConfiguringNote(note)
            }}
            onClear={(note) =>
              setHotkeys((current) => ({ ...current, [note]: null }))
            }
            onCancel={() => {
              setConfiguringNote(null)
              setMessage(null)
            }}
          />
        )}
      </section>
    </main>
  )
}

export default App
