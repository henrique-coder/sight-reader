import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import App from './App'

vi.mock('vexflow', () => {
  class Renderer {
    static Backends = { SVG: 'svg' }
    element: HTMLElement

    constructor(element: HTMLElement) {
      this.element = element
    }

    resize() {
      return undefined
    }

    getContext() {
      return {
        svg: this.element,
      }
    }
  }

  class Stave {
    addClef() {
      return this
    }

    setContext() {
      return this
    }

    draw() {
      return this
    }
  }

  class StaveNote {
    setStyle() {
      return this
    }
  }

  class Voice {
    setStrict() {
      return this
    }

    addTickables() {
      return this
    }

    draw() {
      return undefined
    }
  }

  class Formatter {
    joinVoices() {
      return this
    }

    format() {
      return this
    }
  }

  return { Renderer, Stave, StaveNote, Voice, Formatter }
})

describe('Sight Reader', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })

  test('renders title, score, and note buttons', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Sight Reader' })).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('G/3 - G/6')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^C/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^B/ })).toBeInTheDocument()
  })

  test('changes note naming system and clef in settings', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Settings' }))
    await user.selectOptions(screen.getByLabelText('Note naming system'), 'solfege')

    expect(screen.getByRole('button', { name: /^Dó/ })).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText('Clef'), 'bass')
    expect(screen.getByDisplayValue('Bass')).toBeInTheDocument()
  })

  test('increments score on correct answer and resets on wrong answer', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByTestId('current-note')).toHaveTextContent('G/3')
    await user.click(screen.getByRole('button', { name: /^G/ }))
    expect(screen.getByText('1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^C/ }))
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('saves and clears hotkeys', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Settings' }))
    await user.click(screen.getAllByRole('button', { name: 'Change' })[0])
    await user.keyboard('z')

    await waitFor(() =>
      expect(localStorage.getItem('sight_reader_hotkeys')).toContain('"C":"z"'),
    )

    await user.click(screen.getAllByRole('button', { name: 'Clear' })[0])
    await waitFor(() =>
      expect(localStorage.getItem('sight_reader_hotkeys')).toContain('"C":null'),
    )
  })

  test('toggles and persists theme', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Dark theme' }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(localStorage.getItem('sight_reader_theme')).toBe('dark')
  })
})
