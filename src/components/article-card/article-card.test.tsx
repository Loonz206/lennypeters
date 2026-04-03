import React from 'react'
import { render, screen } from '@testing-library/react'
import ArticleCard from './index'
import type { ArticleMeta } from '@/lib/articles'

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

const baseArticle: ArticleMeta = {
  slug: 'hello-world',
  title: 'Hello World',
  date: '2024-06-15',
  excerpt: 'An intro post',
  tags: ['React', 'TypeScript'],
  image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
  imageAlt: 'Code editor open on a monitor in a developer workspace',
}

describe('ArticleCard', () => {
  it('renders article title as a link to /articles/hello-world', () => {
    render(<ArticleCard article={baseArticle} />)
    const link = screen.getByRole('link', { name: 'Hello World' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/articles/hello-world')
  })

  it('"Read Article" link has aria-label="Read Hello World" and href /articles/hello-world', () => {
    render(<ArticleCard article={baseArticle} />)
    const readLink = screen.getByRole('link', { name: 'Read Hello World' })
    expect(readLink).toBeInTheDocument()
    expect(readLink).toHaveAttribute('href', '/articles/hello-world')
  })

  it('displays slug as HELLO_WORLD (hyphens → underscores, uppercase)', () => {
    render(<ArticleCard article={baseArticle} />)
    expect(screen.getByText('HELLO_WORLD')).toBeInTheDocument()
  })

  it('formats date to en-GB (e.g. 15 June 2024)', () => {
    render(<ArticleCard article={baseArticle} />)
    expect(screen.getByText(/June 2024/)).toBeInTheDocument()
  })

  it('renders both tags in the tags list', () => {
    render(<ArticleCard article={baseArticle} />)
    const tagsList = screen.getByRole('list', { name: 'Tags' })
    expect(tagsList).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders no list items when tags array is empty', () => {
    render(<ArticleCard article={{ ...baseArticle, tags: [] }} />)
    const items = screen.queryAllByRole('listitem')
    expect(items).toHaveLength(0)
  })

  it('renders excerpt text', () => {
    render(<ArticleCard article={baseArticle} />)
    expect(screen.getByText('An intro post')).toBeInTheDocument()
  })

  it('renders article image with alt text', () => {
    render(<ArticleCard article={baseArticle} />)
    expect(
      screen.getByRole('img', { name: 'Code editor open on a monitor in a developer workspace' })
    ).toBeInTheDocument()
  })
})
