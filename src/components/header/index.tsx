"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './header.module.scss';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/articles', label: 'Articles' },
];

const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  // Close drawer on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Trap focus inside drawer
  useEffect(() => {
    if (!isOpen) return;

    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusableSelectors =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelectors));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Move focus into drawer
    getFocusable()[0]?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  return (
    <>
      <header role="banner">
        <div className="navbar wrapper">
          <h2>
            <Link href="/">Lenny Peters</Link>
          </h2>

          {/* Desktop nav */}
          <nav aria-label="Main navigation">
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
            className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setIsOpen(o => !o)}
            aria-expanded={isOpen}
            aria-controls="mobile-drawer"
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className={styles.drawerHeader}>
          <Link href="/" className={styles.drawerBrand} onClick={close}>
            Lenny Peters
          </Link>
          <button
            className={styles.closeBtn}
            onClick={close}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        <nav className={styles.drawerNav} aria-label="Mobile navigation links">
          <ul className={styles.drawerNavList}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href} className={styles.drawerNavItem}>
                <Link
                  href={href}
                  className={`${styles.drawerNavLink} ${pathname === href ? styles.drawerNavLinkActive : ''}`}
                  onClick={close}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;
