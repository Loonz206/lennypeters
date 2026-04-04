'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Profile from '@/components/profile'
import styles from './hero-terminal.module.scss'

const LINES = [
  { prompt: '$', text: 'whoami' },
  { prompt: '>', text: 'lenny.peters // senior software engineer II' },
  { prompt: '$', text: 'cat values.txt' },
  { prompt: '>', text: 'teaching & guiding' },
  { prompt: '>', text: 'supporting engineers' },
  { prompt: '$', text: 'node mission.js' },
  { prompt: '>', text: 'adventure into the new world leveraging AI' },
  { prompt: '>', text: 'to transform into production-ready systems' },
]

const CHAR_DELAY = 45
const LINE_DELAY = 520

const HeroTerminal = () => {
  const [completedLines, setCompletedLines] = useState<typeof LINES>([])
  const [currentLineIdx, setCurrentLineIdx] = useState(0)
  const [currentText, setCurrentText] = useState('')

  useEffect(() => {
    if (currentLineIdx >= LINES.length) return

    const line = LINES[currentLineIdx]

    if (currentText.length < line.text.length) {
      const timer = setTimeout(() => {
        setCurrentText(line.text.slice(0, currentText.length + 1))
      }, CHAR_DELAY)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setCompletedLines(prev => [...prev, line])
      setCurrentLineIdx(prev => prev + 1)
      setCurrentText('')
    }, LINE_DELAY)
    return () => clearTimeout(timer)
  }, [currentText, currentLineIdx])

  const currentLine = LINES[currentLineIdx]

  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.topMeta}>
        <span className={styles.metaLabel}>status</span>
        <span className={styles.metaSep}>{'//'}</span>
        <span className={styles.metaValue}>senior software engineer II</span>
      </div>

      <div className={styles.main}>
        <div className={styles.titleBlock}>
          <div className={styles.terminal}>
            <div className={styles.terminalBar}>
              <span className={`${styles.terminalDot} ${styles.dotRed}`} aria-hidden="true" />
              <span className={`${styles.terminalDot} ${styles.dotYellow}`} aria-hidden="true" />
              <span className={`${styles.terminalDot} ${styles.dotGreen}`} aria-hidden="true" />
              <span className={styles.terminalTitle}>~/portfolio</span>
            </div>

            <div className={styles.terminalBody} aria-live="polite" aria-label="Terminal output">
              {completedLines.map((line, i) => (
                <div key={`${line.prompt}-${line.text}-${i}`} className={styles.terminalLine}>
                  <span className={line.prompt === '$' ? styles.promptCmd : styles.promptOut}>
                    {line.prompt}
                  </span>
                  <span className={line.prompt === '$' ? styles.command : styles.output}>
                    {line.text}
                  </span>
                </div>
              ))}

              {currentLine && (
                <div className={styles.terminalLine}>
                  <span
                    className={currentLine.prompt === '$' ? styles.promptCmd : styles.promptOut}
                  >
                    {currentLine.prompt}
                  </span>
                  <span className={currentLine.prompt === '$' ? styles.command : styles.output}>
                    {currentText}
                  </span>
                  <span className={styles.cursor} aria-hidden="true" />
                </div>
              )}

              {currentLineIdx >= LINES.length && (
                <div className={styles.terminalLine}>
                  <span className={styles.promptCmd}>$</span>
                  <span className={styles.cursor} aria-hidden="true" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <Profile />
        </div>
      </div>

      <p className={styles.tagline}>
        Senior Software Engineer II helping teams leverage AI to transform ideas into
        production-ready systems.
      </p>

      <div className={styles.actions}>
        <Link href="/articles" className={styles.btnPrimary}>
          Articles
        </Link>
        <Link href="/about" className={styles.btnSecondary}>
          about
        </Link>
      </div>

      <div className={styles.bottomMeta}>
        <span className={styles.version}>
          <span className={styles.vKey}>V_CORE</span>
          <span className={styles.vSep}>:</span>
          <span className={styles.vVal}>v4.2.1</span>
        </span>
        <span className={styles.statusBadge}>
          <span className={styles.statusDot} aria-hidden="true"></span> STATUS: STABLE
        </span>
      </div>
    </section>
  )
}

export default HeroTerminal
