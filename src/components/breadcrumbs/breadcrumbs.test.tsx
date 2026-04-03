import React from 'react'
import { render, screen } from '@testing-library/react'
import Breadcrumbs from './index'

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

const withHref = { label: 'Home', href: '/' }
const withoutHref = { label: 'Current Page' }
const articlesItem = { label: 'Articles', href: '/articles' }

describe('Breadcrumbs', () => {
  it('single item with no href renders as aria-current="page" span', () => {
    render(<Breadcrumbs items={[withoutHref]} />)
    const current = screen.getByText('Current Page')
    expect(current.tagName).toBe('SPAN')
    expect(current).toHaveAttribute('aria-current', 'page')
  })

  it('item with href renders as a link with correct href', () => {
    render(<Breadcrumbs items={[withHref]} />)
    const link = screen.getByRole('link', { name: 'Home' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('first item has no separator, second item has // separator', () => {
    render(<Breadcrumbs items={[withHref, withoutHref]} />)
    const separators = screen.getAllByText('//')
    expect(separators).toHaveLength(1)
  })

  it('three items: first two have links, third has aria-current="page" — 2 separators', () => {
    render(<Breadcrumbs items={[withHref, articlesItem, withoutHref]} />)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Articles' })).toBeInTheDocument()
    const current = screen.getByText('Current Page')
    expect(current).toHaveAttribute('aria-current', 'page')
    const separators = screen.getAllByText('//')
    expect(separators).toHaveLength(2)
  })

  it('nav has aria-label="Breadcrumb"', () => {
    render(<Breadcrumbs items={[withHref]} />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('multiple items: each link label renders correctly', () => {
    render(<Breadcrumbs items={[withHref, articlesItem, withoutHref]} />)
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Articles' })).toHaveAttribute('href', '/articles')
    expect(screen.getByText('Current Page')).toBeInTheDocument()
  })
})
