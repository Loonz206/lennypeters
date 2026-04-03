import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '../index'

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

  it('sets aria-expanded="true" on the hamburger after clicking it', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const hamburger = screen.getByRole('button', { name: 'Open navigation' })
    await user.click(hamburger)

    expect(hamburger).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes the overlay when the dialog close button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const hamburger = screen.getByRole('button', { name: 'Open navigation' })
    await user.click(hamburger)

    const overlay = document.getElementById('mobile-overlay')!
    const closeBtn = overlay.querySelector<HTMLButtonElement>('[aria-label="Close navigation"]')!
    await user.click(closeBtn)

    expect(hamburger).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the overlay when the Escape key is pressed', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const hamburger = screen.getByRole('button', { name: 'Open navigation' })
    await user.click(hamburger)

    await user.keyboard('{Escape}')

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

  it('sets body overflow to "hidden" when the overlay is open', async () => {
    const user = userEvent.setup()
    render(<Header />)

    await user.click(screen.getByRole('button', { name: 'Open navigation' }))

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('clears body overflow to "" after the overlay is closed', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const hamburger = screen.getByRole('button', { name: 'Open navigation' })
    await user.click(hamburger)

    const overlay = document.getElementById('mobile-overlay')!
    const closeBtn = overlay.querySelector<HTMLButtonElement>('[aria-label="Close navigation"]')!
    await user.click(closeBtn)

    expect(document.body.style.overflow).toBe('')
  })
})
