import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export interface ArticleMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  image: string
  imageAlt: string
}

export interface Article {
  meta: ArticleMeta
  contentHtml: string
}

const articlesDirectory = path.join(process.cwd(), 'content', 'articles')
const defaultArticleImage =
  'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1600&q=80'

function resolveArticleImage(data: matter.GrayMatterFile<string>['data']): string {
  const image = data.image
  if (typeof image === 'string' && image.trim().length > 0) {
    return image
  }
  return defaultArticleImage
}

function resolveArticleImageAlt(
  data: matter.GrayMatterFile<string>['data'],
  title: string
): string {
  const imageAlt = data.imageAlt
  if (typeof imageAlt === 'string' && imageAlt.trim().length > 0) {
    return imageAlt
  }
  return `${title} placeholder image`
}

async function renderMarkdown(content: string): Promise<string> {
  const { unified } = await import('unified')
  const remarkParse = (await import('remark-parse')).default
  const remarkRehype = (await import('remark-rehype')).default
  const rehypeStringify = (await import('rehype-stringify')).default
  const rehypePrettyCode = (await import('rehype-pretty-code')).default
  const rehypeSlug = (await import('rehype-slug')).default

  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, { theme: 'github-dark' })
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content)

  return String(result)
}

function getArticleFiles(): string[] {
  return fs
    .readdirSync(articlesDirectory)
    .filter(file => file.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b))
}

function parseArticleMeta(filename: string): ArticleMeta {
  const slug = filename.replace(/\.md$/, '')
  const fullPath = path.join(articlesDirectory, filename)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  const title = typeof data.title === 'string' ? data.title : slug
  const date = typeof data.date === 'string' ? data.date : ''
  const excerpt = typeof data.excerpt === 'string' ? data.excerpt : ''
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((tag): tag is string => typeof tag === 'string')
    : []

  return {
    slug,
    title,
    date,
    excerpt,
    tags,
    image: resolveArticleImage(data),
    imageAlt: resolveArticleImageAlt(data, title),
  }
}

export function getAllArticleMetas(): ArticleMeta[] {
  return getArticleFiles()
    .flatMap(filename => {
      try {
        return [parseArticleMeta(filename)]
      } catch (error) {
        console.error(`Failed to parse article metadata for ${filename}`, error)
        return []
      }
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const filename = `${slug}.md`
  const fullPath = path.join(articlesDirectory, filename)

  if (!fs.existsSync(fullPath)) return null

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const contentHtml = await renderMarkdown(content)

    const title = typeof data.title === 'string' ? data.title : slug
    const date = typeof data.date === 'string' ? data.date : ''
    const excerpt = typeof data.excerpt === 'string' ? data.excerpt : ''
    const tags = Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === 'string')
      : []

    return {
      meta: {
        slug,
        title,
        date,
        excerpt,
        tags,
        image: resolveArticleImage(data),
        imageAlt: resolveArticleImageAlt(data, title),
      },
      contentHtml,
    }
  } catch (error) {
    console.error(`Failed to load article ${slug}`, error)
    return null
  }
}

export function getFeaturedArticles(count = 3): ArticleMeta[] {
  return getAllArticleMetas().slice(0, count)
}
