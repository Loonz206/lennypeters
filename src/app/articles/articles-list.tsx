'use client'

import { useState } from 'react'
import ArticleCard from '@/components/article-card'
import type { ArticleMeta } from '@/lib/articles'
import styles from './articles.module.scss'

const ITEMS_PER_PAGE = 4

interface ArticlesListProps {
  readonly articles: ArticleMeta[]
}

const ArticlesList = ({ articles }: ArticlesListProps) => {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE)
  const visible = articles.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  return (
    <>
      <div className={styles.grid}>
        {visible.map(article => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => setPage(p => p - 1)}
            disabled={page === 0}
            aria-label="Previous page"
          >
            &larr; Prev
          </button>
          <span className={styles.pageInfo}>
            {String(page + 1).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
          </span>
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages - 1}
            aria-label="Next page"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </>
  )
}

export default ArticlesList
