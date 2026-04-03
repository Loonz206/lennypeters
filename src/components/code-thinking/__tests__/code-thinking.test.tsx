import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ArticleMeta } from '@/lib/articles'
import CodeThinking from '../index'

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

const makeArticles = (n: number): ArticleMeta[] =>
  Array.from({ length: n }, (_, i) => ({
    slug: `article-${i}`,
    title: `Article ${i}`,
    date: `2024-01-0${(i % 9) + 1}`,
    excerpt: `Excerpt ${i}`,
    tags: ['Tag'],
  }))

describe('CodeThinking', () => {
  it('renders all 3 article titles with no pagination when given 3 articles', () => {
    render(<CodeThinking articles={makeArticles(3)} />)

    expect(screen.getByText('Article 0')).toBeInTheDocument()
    expect(screen.getByText('Article 1')).toBeInTheDocument()
    expect(screen.getByText('Article 2')).toBeInTheDocument()

    expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument()
  })

  it('renders all 4 article titles with no pagination when given 4 articles', () => {
    render(<CodeThinking articles={makeArticles(4)} />)

    for (let i = 0; i < 4; i++) {
      expect(screen.getByText(`Article ${i}`)).toBeInTheDocument()
    }

    expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument()
  })

  it('renders first 4 articles and shows pagination when given 5 articles', () => {
    render(<CodeThinking articles={makeArticles(5)} />)

    for (let i = 0; i < 4; i++) {
      expect(screen.getByText(`Article ${i}`)).toBeInTheDocument()
    }
    expect(screen.queryByText('Article 4')).not.toBeInTheDocument()

    expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).toBeInTheDocument()
  })

  it('disables the Prev button on the first page', () => {
    render(<CodeThinking articles={makeArticles(5)} />)

    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('disables the Next button on the last page after navigating to it', async () => {
    const user = userEvent.setup()
    render(<CodeThinking articles={makeArticles(5)} />)

    await user.click(screen.getByLabelText('Next page'))

    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })

  it('shows articles 5–8 after clicking Next with 8 articles', async () => {
    const user = userEvent.setup()
    render(<CodeThinking articles={makeArticles(8)} />)

    await user.click(screen.getByLabelText('Next page'))

    for (let i = 4; i < 8; i++) {
      expect(screen.getByText(`Article ${i}`)).toBeInTheDocument()
    }
    for (let i = 0; i < 4; i++) {
      expect(screen.queryByText(`Article ${i}`)).not.toBeInTheDocument()
    }
  })

  it('returns to page 0 after clicking Next then Prev', async () => {
    const user = userEvent.setup()
    render(<CodeThinking articles={makeArticles(5)} />)

    await user.click(screen.getByLabelText('Next page'))
    await user.click(screen.getByLabelText('Previous page'))

    expect(screen.getByText('Article 0')).toBeInTheDocument()
    expect(screen.queryByText('Article 4')).not.toBeInTheDocument()
  })

  it('displays the padded total count [05_TOTAL_ENTRIES] for 5 articles', () => {
    render(<CodeThinking articles={makeArticles(5)} />)

    expect(screen.getByText('[05_TOTAL_ENTRIES]')).toBeInTheDocument()
  })
})
