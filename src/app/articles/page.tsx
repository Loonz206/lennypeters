import type { Metadata } from 'next'
import ArticleCard from '@/components/article-card'
import { getAllArticleMetas } from '@/lib/articles'
import { DEFAULT_OG_IMAGE } from '@/lib/seo'
import styles from './articles.module.scss'

export const metadata: Metadata = {
  title: 'Articles — Lenny Peters',
  description:
    'Writing on React, TypeScript, CSS architecture, accessibility, and modern web engineering.',
  alternates: {
    canonical: '/articles/',
  },
  openGraph: {
    type: 'website',
    url: '/articles/',
    title: 'Articles — Lenny Peters',
    description:
      'Writing on React, TypeScript, CSS architecture, accessibility, and modern web engineering.',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles — Lenny Peters',
    description:
      'Writing on React, TypeScript, CSS architecture, accessibility, and modern web engineering.',
    images: [DEFAULT_OG_IMAGE],
  },
}

const ArticlesPage = () => {
  const articles = getAllArticleMetas()

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <p className={styles.label}>ARTICLES</p>
        <h1 className={styles.title}>Writing</h1>
        <p className={styles.sub}>
          Thoughts on React, TypeScript, CSS, accessibility, and the craft of web engineering.
        </p>
      </div>
      <div className={styles.grid}>
        {articles.map(article => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  )
}

export default ArticlesPage
