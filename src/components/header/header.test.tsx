import React from 'react'
import { render, screen, within, fireEvent } from '@testing-library/react'
import Header from './index'

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

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    const { fill, priority, ...imageProps } = props
    void fill
    void priority
    return <span role="img" aria-label={alt} data-src={src} {...imageProps} />
  },
}))

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

import { usePathname } from 'next/navigation'
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('Header', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('renders the "Lenny Peters" brand link pointing to "/"', () => {
    render(<Header />)

    const brandLink = screen.getByRole('link', { name: 'Lenny Peters' })
    expect(brandLink).toBeInTheDocument()
    expect(brandLink).toHaveAttribute('href', '/')
  })

  it('renders the logo image inside the brand link', () => {
    render(<Header />)
    const brandLink = screen.getByRole('link', { name: 'Lenny Peters' })
    const logo = brandLink.querySelector('[data-src="/favicon.svg"]')
    expect(logo).toBeInTheDocument()
  })

  it('renders Work, Articles, and About links in the desktop navigation', () => {
    render(<Header />)

    const desktopNav = screen.getByRole('navigation', { name: 'Main navigation' })

    expect(within(desktopNav).getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/work')
    expect(within(desktopNav).getByRole('link', { name: 'Articles' })).toHaveAttribute(
      'href',
      '/articles'
    )
    expect(within(desktopNav).getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    )
  })

  it('renders the hamburger button with aria-expanded="false" initially', () => {
    render(<Header />)

    expect(screen.getByRole('button', { name: 'Open navigation' })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })

  it('sets aria-expanded="true" on the hamburger after clicking it', () => {
    render(<Header />)

    const hamburger = screen.getByRole('button', { name: 'Open navigation' })
    fireEvent.click(hamburger)

    expect(hamburger).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes the overlay when the dialog close button is clicked', () => {
    render(<Header />)

    const hamburger = screen.getByRole('button', { name: 'Open navigation' })
    fireEvent.click(hamburger)

    const overlay = document.getElementById('mobile-overlay')!
    const closeBtn = overlay.querySelector<HTMLButtonElement>('[aria-label="Close navigation"]')!
    fireEvent.click(closeBtn)

    expect(hamburger).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the overlay when the Escape key is pressed', () => {
    render(<Header />)

    const hamburger = screen.getByRole('button', { name: 'Open navigation' })
    fireEvent.click(hamburger)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(hamburger).toHaveAttribute('aria-expanded', 'false')
  })

  it('adds the active-link class to the Work link when pathname is "/work"', () => {
    mockUsePathname.mockReturnValue('/work')
    render(<Header />)

    const desktopNav = screen.getByRole('navigation', { name: 'Main navigation' })
    const workLink = within(desktopNav).getByRole('link', { name: 'Work' })

    expect(workLink).toHaveClass('active-link')
  })

  it('does not add the active-link class to non-active links', () => {
    render(<Header />)

    const desktopNav = screen.getByRole('navigation', { name: 'Main navigation' })

    expect(within(desktopNav).getByRole('link', { name: 'Work' })).not.toHaveClass('active-link')
    expect(within(desktopNav).getByRole('link', { name: 'Articles' })).not.toHaveClass(
      'active-link'
    )
    expect(within(desktopNav).getByRole('link', { name: 'About' })).not.toHaveClass('active-link')
  })

  it('sets body overflow to "hidden" when the overlay is open', () => {
    render(<Header />)

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('clears body overflow to "" after the overlay is closed', () => {
    render(<Header />)

    const hamburger = screen.getByRole('button', { name: 'Open navigation' })
    fireEvent.click(hamburger)

    const overlay = document.getElementById('mobile-overlay')!
    const closeBtn = overlay.querySelector<HTMLButtonElement>('[aria-label="Close navigation"]')!
    fireEvent.click(closeBtn)

    expect(document.body.style.overflow).toBe('')
  })
})

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getOverlayFocusable(): HTMLElement[] {
  const overlay = document.getElementById('mobile-overlay')!
  return Array.from(overlay.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

describe('Header focus trap', () => {
  it('focuses the first focusable element when the overlay opens', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))

    expect(document.activeElement).toBe(getOverlayFocusable()[0])
  })

  it('wraps Tab focus from the last element back to the first', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))

    const focusable = getOverlayFocusable()
    focusable[focusable.length - 1].focus()

    fireEvent.keyDown(document, { key: 'Tab' })

    expect(document.activeElement).toBe(focusable[0])
  })

  it('wraps Shift+Tab focus from the first element back to the last', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))

    const focusable = getOverlayFocusable()
    focusable[0].focus()

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })

    expect(document.activeElement).toBe(focusable[focusable.length - 1])
  })

  it('does not move focus on Shift+Tab from a middle element', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))

    const focusable = getOverlayFocusable()
    focusable[1].focus()

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })

    expect(document.activeElement).toBe(focusable[1])
  })

  it('ignores non-Tab keys', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))

    const focusable = getOverlayFocusable()
    focusable[0].focus()

    fireEvent.keyDown(document, { key: 'ArrowDown' })

    expect(document.activeElement).toBe(focusable[0])
  })

  it('does nothing when Tab is pressed and there are no focusable elements', () => {
    render(<Header />)
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))

    document
      .getElementById('mobile-overlay')!
      .querySelectorAll('a[href], button, [tabindex]')
      .forEach(el => el.remove())

    expect(() => fireEvent.keyDown(document, { key: 'Tab' })).not.toThrow()
  })
})
