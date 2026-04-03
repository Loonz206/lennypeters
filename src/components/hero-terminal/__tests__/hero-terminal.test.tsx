import React from 'react'
import { render, screen, act } from '@testing-library/react'
import HeroTerminal from '../index'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

jest.mock('../../profile', () => ({
  __esModule: true,
  default: () => <div data-testid="profile" />,
}))

// Total LINES = 9. Each line takes (text.length × CHAR_DELAY) + LINE_DELAY ms.
// To advance the full animation we run all pending timers in a loop, flushing
// React state updates between each iteration so newly-scheduled timers are
// captured in the next pass.
const runAllLines = async () => {
  for (let i = 0; i < 200; i++) {
    await act(async () => {
      jest.runAllTimers()
    })
  }
}

describe('HeroTerminal', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the terminal output region with aria-live="polite"', () => {
    render(<HeroTerminal />)

    expect(screen.getByLabelText('Terminal output')).toHaveAttribute('aria-live', 'polite')
  })

  it('initially shows the first line\'s prompt "$" before any typing begins', () => {
    render(<HeroTerminal />)

    // Before any timer fires, currentLineIdx=0, currentLine=LINES[0] which has prompt='$'
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it("renders all 9 lines' text after the animation completes", async () => {
    render(<HeroTerminal />)

    await runAllLines()

    const expectedTexts = [
      'whoami',
      'lenny.peters // senior software engineer',
      'cat values.txt',
      'build with empathy',
      'ship with intention',
      'obsess over craft',
      'node mission.js',
      'turning complex AI ideas',
      'into production-ready systems',
    ]

    for (const text of expectedTexts) {
      expect(screen.getByText(text)).toBeInTheDocument()
    }
  })

  it('shows the idle cursor "$" after the animation completes', async () => {
    render(<HeroTerminal />)

    await runAllLines()

    // LINES[0,2,6] have prompt='$' (3 completed-line dollar signs).
    // When currentLineIdx >= LINES.length the idle cursor adds a 4th '$'.
    const dollarSigns = screen.getAllByText('$')
    expect(dollarSigns).toHaveLength(4)
  })

  it('renders the "Articles" link pointing to "/articles"', () => {
    render(<HeroTerminal />)

    const articlesLink = screen.getByRole('link', { name: 'Articles' })
    expect(articlesLink).toBeInTheDocument()
    expect(articlesLink).toHaveAttribute('href', '/articles')
  })

  it('wraps the hero content in a section with aria-label="Introduction"', () => {
    render(<HeroTerminal />)

    expect(screen.getByRole('region', { name: 'Introduction' })).toBeInTheDocument()
  })
})
