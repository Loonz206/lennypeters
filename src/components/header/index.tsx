'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './header.module.scss'

const NAV_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'About' },
]

const Header = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const overlayRef = useRef<HTMLDialogElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setIsOpen(false), [])

  // Close on route change
  useEffect(() => {
    close()
  }, [pathname, close])

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Trap focus inside overlay + Escape to close
  useEffect(() => {
    if (!isOpen) return

    const overlay = overlayRef.current
    if (!overlay) return

    const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

    const getFocusable = () => Array.from(overlay.querySelectorAll<HTMLElement>(focusableSelectors))

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        hamburgerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return

      const focusable = getFocusable()
      if (!focusable.length) return

      const first = focusable.at(0)
      const last = focusable.at(-1)

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    getFocusable()[0]?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  return (
    <>
      <header role="banner">
        <div className="navbar wrapper">
          <h2>
            <Link href="/" className={styles.brand}>
              Lenny Peters
            </Link>
          </h2>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className={styles.desktopNav}>
            <ul>
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={pathname === href ? 'active-link' : ''}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hamburger (mobile only) */}
          <button
            ref={hamburgerRef}
            className={`${styles.hamburger} ${isOpen ? styles.hamburgerHidden : ''}`}
            onClick={() => setIsOpen(o => !o)}
            aria-expanded={isOpen}
            aria-controls="mobile-overlay"
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <dialog
        id="mobile-overlay"
        ref={overlayRef}
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        aria-label="Mobile navigation"
      >
        {/* Scanline texture layer */}
        <div className={styles.overlayScanlines} aria-hidden="true" />

        {/* Corner HUD decorations */}
        <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />

        {/* Close button */}
        <button className={styles.overlayClose} onClick={close} aria-label="Close navigation">
          <span className={styles.closeX} aria-hidden="true" />
          <span className={styles.closeX} aria-hidden="true" />
        </button>

        {/* Nav links */}
        <nav aria-label="Mobile navigation links">
          <ul className={styles.overlayNavList}>
            {NAV_LINKS.map(({ href, label }, i) => (
              <li
                key={href}
                className={styles.overlayNavItem}
                style={{ '--i': i } as React.CSSProperties}
              >
                <Link
                  href={href}
                  className={`${styles.overlayNavLink} ${pathname === href ? styles.overlayNavLinkActive : ''}`}
                  onClick={close}
                >
                  <span className={styles.linkIndex} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer label */}
        <p className={styles.overlayFooter} aria-hidden="true">
          SYS.NAV // LENNY.PETERS
        </p>
      </dialog>
    </>
  )
}

export default Header
