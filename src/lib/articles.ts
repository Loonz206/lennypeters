import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export interface Article {
  meta: ArticleMeta;
  contentHtml: string;
}

const articlesDirectory = path.join(process.cwd(), 'content', 'articles');

async function renderMarkdown(content: string): Promise<string> {
  const { unified } = await import('unified');
  const remarkParse = (await import('remark-parse')).default;
  const remarkRehype = (await import('remark-rehype')).default;
  const rehypeStringify = (await import('rehype-stringify')).default;
  const rehypePrettyCode = (await import('rehype-pretty-code')).default;
  const rehypeSlug = (await import('rehype-slug')).default;

  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, { theme: 'github-dark' })
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content);

  return String(result);
}

function getArticleFiles(): string[] {
  return fs
    .readdirSync(articlesDirectory)
    .filter((file) => file.endsWith('.md'))
    .sort();
}

function parseArticleMeta(filename: string): ArticleMeta {
  const slug = filename.replace(/\.md$/, '');
  const fullPath = path.join(articlesDirectory, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    tags: data.tags ?? [],
  };
}

export function getAllArticleMetas(): ArticleMeta[] {
  return getArticleFiles()
    .map(parseArticleMeta)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const filename = `${slug}.md`;
  const fullPath = path.join(articlesDirectory, filename);

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const contentHtml = await renderMarkdown(content);

  return {
    meta: {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      tags: data.tags ?? [],
    },
    contentHtml,
  };
}

export function getFeaturedArticles(count = 3): ArticleMeta[] {
  return getAllArticleMetas().slice(0, count);
}
