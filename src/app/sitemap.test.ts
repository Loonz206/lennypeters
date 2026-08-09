import { getAllArticleMetas } from '@/lib/articles'
import { SITE_URL } from '@/lib/seo'
import sitemap from './sitemap'
import type { ArticleMeta } from '@/lib/articles'

jest.mock('../lib/articles', () => ({
  getAllArticleMetas: jest.fn(),
}))

const mockGetAllArticleMetas = getAllArticleMetas as jest.MockedFunction<typeof getAllArticleMetas>

const mockMetas: ArticleMeta[] = [
  {
    slug: 'post-one',
    title: 'Post One',
    date: '2024-01-01',
    excerpt: '',
    tags: [],
    image: '',
    imageAlt: '',
  },
  {
    slug: 'post-two',
    title: 'Post Two',
    date: '2024-02-01',
    excerpt: '',
    tags: [],
    image: '',
    imageAlt: '',
  },
]

describe('sitemap', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetAllArticleMetas.mockReturnValue(mockMetas)
  })

  it('includes the four static routes with the correct metadata', () => {
    const result = sitemap()
    const urls = result.map(route => route.url)

    expect(result).toHaveLength(6)
    expect(urls).toContain(`${SITE_URL}/`)
    expect(urls).toContain(`${SITE_URL}/about/`)
    expect(urls).toContain(`${SITE_URL}/work/`)
    expect(urls).toContain(`${SITE_URL}/articles/`)
  })

  it('marks the homepage as the highest priority with weekly frequency', () => {
    const result = sitemap()
    const home = result.find(route => route.url === `${SITE_URL}/`)

    expect(home?.priority).toBe(1)
    expect(home?.changeFrequency).toBe('weekly')
  })

  it('includes an entry for every article with the article date', () => {
    const result = sitemap()
    const articleRoutes = result.filter(route => route.url.includes('/articles/post-'))

    expect(articleRoutes).toHaveLength(2)
    expect(articleRoutes).toContainEqual(
      expect.objectContaining({
        url: `${SITE_URL}/articles/post-one/`,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    )
    expect(articleRoutes[0].lastModified).toEqual(new Date('2024-01-01'))
  })

  it('appends article routes after the static routes', () => {
    const result = sitemap()

    expect(result[0].url).toBe(`${SITE_URL}/`)
    expect(result[4].url).toBe(`${SITE_URL}/articles/post-one/`)
    expect(result[5].url).toBe(`${SITE_URL}/articles/post-two/`)
  })
})
