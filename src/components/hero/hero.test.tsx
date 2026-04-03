import React from 'react'
import { render, screen } from '@testing-library/react'
import Hero from '@/components/hero'

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

describe('Hero', () => {
  beforeEach(() => {
    render(<Hero />)
  })

  it('renders "Lenny Peters" as a heading', () => {
    expect(screen.getByRole('heading', { name: 'Lenny Peters' })).toBeInTheDocument()
  })

  it('"Read Articles" link points to "/articles"', () => {
    expect(screen.getByRole('link', { name: 'Read Articles' })).toHaveAttribute('href', '/articles')
  })

  it('"About Me" link points to "/about"', () => {
    expect(screen.getByRole('link', { name: 'About Me' })).toHaveAttribute('href', '/about')
  })

  it('section has aria-label="Introduction"', () => {
    expect(screen.getByRole('region', { name: 'Introduction' })).toBeInTheDocument()
  })
})
