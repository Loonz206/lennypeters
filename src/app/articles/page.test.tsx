import React from 'react'
import { render, screen } from '@testing-library/react'
import ArticlesPage, { metadata } from './page'
import { getAllArticleMetas } from '@/lib/articles'
import type { ArticleMeta } from '@/lib/articles'

jest.mock('../../lib/articles', () => ({
  getAllArticleMetas: jest.fn(),
}))

jest.mock('../../components/article-card', () => ({
  __esModule: true,
  default: ({ article }: { article: ArticleMeta }) => (
    <div data-testid="article-card">{article.title}</div>
  ),
}))

const mockGetAllArticleMetas = getAllArticleMetas as jest.MockedFunction<typeof getAllArticleMetas>

const sampleArticles: ArticleMeta[] = [
  {
    slug: 'first-post',
    title: 'First Post',
    date: '2024-03-01',
    excerpt: 'Excerpt one',
    tags: ['React'],
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    imageAlt: 'Laptop screen showing code on a dark desk setup',
  },
  {
    slug: 'second-post',
    title: 'Second Post',
    date: '2024-04-01',
    excerpt: 'Excerpt two',
    tags: ['TypeScript'],
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    imageAlt: 'Code editor open on a monitor in a developer workspace',
  },
]

describe('Articles page', () => {
  beforeEach(() => {
    mockGetAllArticleMetas.mockReturnValue([])
  })

  it('renders the "Writing" heading', () => {
    render(<ArticlesPage />)
    expect(screen.getByRole('heading', { name: 'Writing', level: 1 })).toBeInTheDocument()
  })

  it('renders 2 ArticleCard components when there are 2 articles', () => {
    mockGetAllArticleMetas.mockReturnValue(sampleArticles)
    render(<ArticlesPage />)
    const cards = screen.getAllByTestId('article-card')
    expect(cards).toHaveLength(2)
  })

  it('renders article titles when there are 2 articles', () => {
    mockGetAllArticleMetas.mockReturnValue(sampleArticles)
    render(<ArticlesPage />)
    expect(screen.getByText('First Post')).toBeInTheDocument()
    expect(screen.getByText('Second Post')).toBeInTheDocument()
  })

  it('renders no ArticleCard components when there are 0 articles', () => {
    mockGetAllArticleMetas.mockReturnValue([])
    render(<ArticlesPage />)
    expect(screen.queryAllByTestId('article-card')).toHaveLength(0)
  })

  it('exports correct metadata title', () => {
    expect(metadata.title).toBe('Articles — Lenny Peters')
  })

  it('calls getAllArticleMetas on render', () => {
    render(<ArticlesPage />)
    expect(mockGetAllArticleMetas).toHaveBeenCalled()
  })
})
