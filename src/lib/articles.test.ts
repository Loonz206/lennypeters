import fs from 'node:fs'
import matter from 'gray-matter'

jest.mock('fs')
jest.mock('gray-matter')

jest.mock('unified', () => ({
  unified: () => ({
    use: jest.fn().mockReturnThis(),
    process: jest.fn().mockResolvedValue({ toString: () => '<p>html</p>' }),
  }),
}))
jest.mock('remark-parse', () => ({ default: jest.fn() }))
jest.mock('remark-rehype', () => ({ default: jest.fn() }))
jest.mock('rehype-stringify', () => ({ default: jest.fn() }))
jest.mock('rehype-pretty-code', () => ({ default: jest.fn() }))
jest.mock('rehype-slug', () => ({ default: jest.fn() }))

import { getAllArticleMetas, getArticleBySlug, getFeaturedArticles } from '@/lib/articles'

const mockFs = jest.mocked(fs)
const mockMatter = jest.mocked(matter)

const FAKE_FILES = ['article-a.md', 'article-b.md', 'article-c.md']

const FAKE_METAS = {
  'article-a.md': { title: 'Article A', date: '2024-03-01', excerpt: 'Excerpt A', tags: ['React'] },
  'article-b.md': {
    title: 'Article B',
    date: '2024-01-01',
    excerpt: 'Excerpt B',
    tags: ['TypeScript'],
  },
  'article-c.md': { title: 'Article C', date: '2023-06-01', excerpt: 'Excerpt C', tags: undefined },
}

function setupMocks() {
  mockFs.readdirSync.mockReturnValue(FAKE_FILES as unknown as ReturnType<typeof fs.readdirSync>)
  mockFs.readFileSync.mockImplementation((filePath: fs.PathOrFileDescriptor) => {
    const filename = String(filePath).split('/').pop()!
    const meta = FAKE_METAS[filename as keyof typeof FAKE_METAS]
    return `---\ntitle: ${meta?.title ?? ''}\n---\nbody content`
  })
  mockFs.existsSync.mockImplementation((filePath: fs.PathLike) => {
    const filename = String(filePath).split('/').pop()!
    return FAKE_FILES.includes(filename)
  })
  mockMatter.mockImplementation((input: string | Buffer | { content: string | Buffer }) => {
    const content = typeof input === 'object' && !Buffer.isBuffer(input) ? input.content : input
    const str = String(content)
    const titleMatch = /title: (.+)/.exec(str)
    const filename = FAKE_FILES.find(
      f => FAKE_METAS[f as keyof typeof FAKE_METAS].title === titleMatch?.[1]
    )
    const meta = filename
      ? FAKE_METAS[filename as keyof typeof FAKE_METAS]
      : FAKE_METAS['article-a.md']
    return { data: meta, content: 'body content' } as unknown as ReturnType<typeof matter>
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  setupMocks()
})

describe('getAllArticleMetas', () => {
  it('returns articles sorted newest-first by date', () => {
    const metas = getAllArticleMetas()
    expect(metas[0].date).toBe('2024-03-01')
    expect(metas[1].date).toBe('2024-01-01')
    expect(metas[2].date).toBe('2023-06-01')
  })

  it('returns correct slugs derived from filenames', () => {
    const slugs = getAllArticleMetas().map(m => m.slug)
    expect(slugs).toContain('article-a')
    expect(slugs).toContain('article-b')
    expect(slugs).toContain('article-c')
  })

  it('defaults tags to [] when frontmatter has no tags', () => {
    const metas = getAllArticleMetas()
    const articleC = metas.find(m => m.slug === 'article-c')
    expect(articleC?.tags).toEqual([])
  })

  it('returns empty array when no .md files exist', () => {
    mockFs.readdirSync.mockReturnValue([] as unknown as ReturnType<typeof fs.readdirSync>)
    expect(getAllArticleMetas()).toEqual([])
  })

  it('skips malformed files when metadata parsing fails', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    mockMatter.mockImplementationOnce(() => {
      throw new Error('malformed frontmatter')
    })

    const metas = getAllArticleMetas()

    expect(metas).toHaveLength(2)
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })
})

describe('getArticleBySlug', () => {
  it('returns an Article with meta and contentHtml for a valid slug', async () => {
    const article = await getArticleBySlug('article-a')
    expect(article).not.toBeNull()
    expect(article?.meta.slug).toBe('article-a')
    expect(article?.meta.title).toBe('Article A')
    expect(article?.contentHtml).toBeTruthy()
  })

  it('returns null for a slug that does not exist', async () => {
    mockFs.existsSync.mockReturnValue(false)
    const article = await getArticleBySlug('missing-slug')
    expect(article).toBeNull()
  })

  it('defaults tags to [] when frontmatter has no tags', async () => {
    const article = await getArticleBySlug('article-c')
    expect(article?.meta.tags).toEqual([])
  })

  it('returns null when article parsing fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    mockMatter.mockImplementationOnce(() => {
      throw new Error('invalid markdown frontmatter')
    })

    const article = await getArticleBySlug('article-a')

    expect(article).toBeNull()
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })

  it('applies fallbacks and image optimization for non-string frontmatter', async () => {
    mockMatter.mockReturnValueOnce({
      data: {
        title: 42,
        date: 123,
        excerpt: false,
        tags: [1, 'two'],
        image: 'https://example.com/photo.png',
        imageAlt: 'Custom alt',
      },
      content: 'body content',
    })

    const article = await getArticleBySlug('article-a')

    expect(article?.meta.title).toBe('article-a')
    expect(article?.meta.date).toBe('')
    expect(article?.meta.excerpt).toBe('')
    expect(article?.meta.tags).toEqual(['two'])
    expect(article?.meta.image).toBe('https://example.com/photo.png')
    expect(article?.meta.imageAlt).toBe('Custom alt')
  })
})

describe('image and alt resolution', () => {
  it('optimizes an unsplash image with w=1600 to w=1188', () => {
    mockMatter.mockReturnValueOnce({
      data: {
        title: 'Article A',
        date: '2024-03-01',
        excerpt: 'Excerpt A',
        tags: [],
        image: 'https://images.unsplash.com/photo-1500000000?auto=format&fit=crop&w=1600&q=80',
      },
      content: 'body',
    })

    const meta = getAllArticleMetas().find(m => m.slug === 'article-a')

    expect(meta?.image).toBe(
      'https://images.unsplash.com/photo-1500000000?auto=format&fit=crop&w=1188&q=80'
    )
  })

  it('optimizes an unsplash image with a large width to w=1188', () => {
    mockMatter.mockReturnValueOnce({
      data: {
        title: 'Article A',
        date: '2024-03-01',
        excerpt: 'Excerpt A',
        tags: [],
        image: 'https://images.unsplash.com/photo-1500000000?auto=format&fit=crop&w=4000&q=80',
      },
      content: 'body',
    })

    const meta = getAllArticleMetas().find(m => m.slug === 'article-a')

    expect(meta?.image).toBe(
      'https://images.unsplash.com/photo-1500000000?auto=format&fit=crop&w=1188&q=80'
    )
  })

  it('leaves non-unsplash image URLs unchanged', () => {
    mockMatter.mockReturnValueOnce({
      data: {
        title: 'Article A',
        date: '2024-03-01',
        excerpt: 'Excerpt A',
        tags: [],
        image: 'https://example.com/photo.png',
      },
      content: 'body',
    })

    const meta = getAllArticleMetas().find(m => m.slug === 'article-a')

    expect(meta?.image).toBe('https://example.com/photo.png')
  })

  it('uses the frontmatter imageAlt when provided', () => {
    mockMatter.mockReturnValueOnce({
      data: {
        title: 'Article A',
        date: '2024-03-01',
        excerpt: 'Excerpt A',
        tags: [],
        imageAlt: 'A hand-drawn wireframe on paper',
      },
      content: 'body',
    })

    const meta = getAllArticleMetas().find(m => m.slug === 'article-a')

    expect(meta?.imageAlt).toBe('A hand-drawn wireframe on paper')
  })
})

describe('frontmatter fallbacks', () => {
  it('falls back to the slug and defaults for non-string frontmatter', () => {
    mockMatter.mockReturnValueOnce({
      data: { title: 42, date: 123, excerpt: false, tags: [1, 'two'] },
      content: 'body',
    })

    const meta = getAllArticleMetas().find(m => m.slug === 'article-a')

    expect(meta?.title).toBe('article-a')
    expect(meta?.date).toBe('')
    expect(meta?.excerpt).toBe('')
    expect(meta?.tags).toEqual(['two'])
  })
})

describe('getFeaturedArticles', () => {
  it('returns the first 3 articles by default', () => {
    expect(getFeaturedArticles()).toHaveLength(3)
  })

  it('returns the first N articles when count is provided', () => {
    expect(getFeaturedArticles(2)).toHaveLength(2)
    expect(getFeaturedArticles(1)).toHaveLength(1)
  })

  it('returns all articles when count exceeds total', () => {
    expect(getFeaturedArticles(10)).toHaveLength(3)
  })

  it('returns articles sorted newest-first', () => {
    const featured = getFeaturedArticles(2)
    expect(featured[0].date > featured[1].date).toBe(true)
  })
})
