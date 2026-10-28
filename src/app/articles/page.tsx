import type { Metadata } from 'next'
import { getAllArticleMetas } from '@/lib/articles'
import { BASE_PATH } from '@/lib/seo'
import styles from './articles.module.scss'
import ArticlesList from './articles-list'

export const metadata: Metadata = {
  title: 'Articles — Lenny Peters',
  description:
    'Writing on React, TypeScript, CSS architecture, accessibility, and modern web engineering.',
  alternates: {
    canonical: `${BASE_PATH}/articles/`,
  },
  openGraph: {
    type: 'website',
    url: `${BASE_PATH}/articles/`,
    title: 'Articles — Lenny Peters',
    description:
      'Writing on React, TypeScript, CSS architecture, accessibility, and modern web engineering.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Articles — Lenny Peters',
    description:
      'Writing on React, TypeScript, CSS architecture, accessibility, and modern web engineering.',
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
      <ArticlesList articles={articles} />
    </div>
  )
}

export default ArticlesPage
