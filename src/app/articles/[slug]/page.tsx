import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { getAllArticleMetas, getArticleBySlug } from '@/lib/articles'
import Breadcrumbs from '@/components/breadcrumbs'
import styles from './article.module.scss'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllArticleMetas().map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return {}

  const canonicalPath = `/articles/${slug}/`

  return {
    title: `${article.meta.title} — Lenny Peters`,
    description: article.meta.excerpt,
    keywords: article.meta.tags,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'article',
      url: canonicalPath,
      title: article.meta.title,
      description: article.meta.excerpt,
      images: [article.meta.image],
      publishedTime: article.meta.date,
      tags: article.meta.tags,
      authors: ['Lenny Peters'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta.title,
      description: article.meta.excerpt,
      images: [article.meta.image],
    },
  }
}

const ArticlePage = async ({ params }: Props) => {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const formattedDate = new Date(article.meta.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className={styles.article}>
      <Breadcrumbs
        items={[{ label: 'Articles', href: '/articles' }, { label: article.meta.title }]}
      />
      <header className={styles.header}>
        <p className={styles.label}>
          <time dateTime={article.meta.date}>{formattedDate}</time>
        </p>
        <h1 className={styles.title}>{article.meta.title}</h1>
        <p className={styles.sub}>{article.meta.excerpt}</p>
        <div className={styles.heroImage}>
          <Image
            src={article.meta.image}
            alt={article.meta.imageAlt}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 720px"
          />
        </div>
        <ul className={styles.tags} aria-label="Tags">
          {article.meta.tags.map(tag => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      </header>
      <div className={styles.body} dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
    </article>
  )
}

export default ArticlePage
