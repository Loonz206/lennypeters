import React from 'react'
import { render, screen } from '@testing-library/react'
import ArticlePage, { generateStaticParams, generateMetadata } from '../page'
import { notFound } from 'next/navigation'
import { getAllArticleMetas, getArticleBySlug } from '@/lib/articles'
import type { ArticleMeta, Article } from '@/lib/articles'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

jest.mock('../../../../lib/articles', () => ({
  getAllArticleMetas: jest.fn(),
  getArticleBySlug: jest.fn(),
}))

jest.mock('../../../../components/breadcrumbs', () => ({
  __esModule: true,
  default: ({ items }: { items: { label: string; href?: string }[] }) => (
    <nav aria-label="Breadcrumb">
      {items.map(item => (
        <span key={item.label}>{item.label}</span>
      ))}
    </nav>
  ),
}))

const mockNotFound = notFound as jest.MockedFunction<typeof notFound>
const mockGetArticleBySlug = getArticleBySlug as jest.MockedFunction<typeof getArticleBySlug>
const mockGetAllArticleMetas = getAllArticleMetas as jest.MockedFunction<typeof getAllArticleMetas>

const mockArticle: Article = {
  meta: {
    slug: 'test-article',
    title: 'Test Article',
    date: '2024-06-15',
    excerpt: 'A test excerpt',
    tags: ['React', 'TypeScript'],
  },
  contentHtml: '<p>Article content here</p>',
}

async function renderPage(slug = 'test-article') {
  const jsx = await ArticlePage({ params: Promise.resolve({ slug }) })
  render(jsx)
}

describe('ArticlePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetArticleBySlug.mockResolvedValue(mockArticle)
    mockGetAllArticleMetas.mockReturnValue([])
  })

  it('renders the article title as an h1', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { name: 'Test Article', level: 1 })).toBeInTheDocument()
  })

  it('renders the article excerpt', async () => {
    await renderPage()
    expect(screen.getByText('A test excerpt')).toBeInTheDocument()
  })

  it('renders the formatted date in en-GB format', async () => {
    await renderPage()
    expect(screen.getByText(/June 2024/)).toBeInTheDocument()
  })

  it('renders all tags', async () => {
    await renderPage()
    const tagsList = screen.getByRole('list', { name: 'Tags' })
    expect(tagsList).toHaveTextContent('React')
    expect(tagsList).toHaveTextContent('TypeScript')
  })

  it('renders the HTML content via dangerouslySetInnerHTML', async () => {
    await renderPage()
    expect(screen.getByText('Article content here')).toBeInTheDocument()
  })

  it('renders Breadcrumbs with "Articles" and the article title', async () => {
    await renderPage()
    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(breadcrumb).toHaveTextContent('Articles')
    expect(breadcrumb).toHaveTextContent('Test Article')
  })

  it('calls notFound() when getArticleBySlug returns null', async () => {
    mockGetArticleBySlug.mockResolvedValue(null)
    await expect(
      ArticlePage({ params: Promise.resolve({ slug: 'missing-article' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND')
    expect(mockNotFound).toHaveBeenCalled()
  })

  describe('generateStaticParams', () => {
    it('returns slugs derived from getAllArticleMetas', async () => {
      const metas: ArticleMeta[] = [
        { slug: 'post-one', title: 'Post One', date: '2024-01-01', excerpt: '', tags: [] },
        { slug: 'post-two', title: 'Post Two', date: '2024-02-01', excerpt: '', tags: [] },
      ]
      mockGetAllArticleMetas.mockReturnValue(metas)
      const result = await generateStaticParams()
      expect(result).toEqual([{ slug: 'post-one' }, { slug: 'post-two' }])
    })
  })

  describe('generateMetadata', () => {
    it('returns correct title and description for a valid slug', async () => {
      mockGetArticleBySlug.mockResolvedValue(mockArticle)
      const meta = await generateMetadata({ params: Promise.resolve({ slug: 'test-article' }) })
      expect(meta.title).toBe('Test Article — Lenny Peters')
      expect(meta.description).toBe('A test excerpt')
    })

    it('returns an empty object when the slug is not found', async () => {
      mockGetArticleBySlug.mockResolvedValue(null)
      const meta = await generateMetadata({ params: Promise.resolve({ slug: 'missing' }) })
      expect(meta).toEqual({})
    })
  })
})
