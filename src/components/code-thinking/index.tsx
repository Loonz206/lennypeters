'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ArticleMeta } from '@/lib/articles'
import styles from './code-thinking.module.scss'

const ITEMS_PER_PAGE = 4

interface CodeThinkingProps {
  articles: ArticleMeta[]
}

const CodeThinking = ({ articles }: CodeThinkingProps) => {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE)
  const visible = articles.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  return (
    <section className={styles.section} aria-labelledby="blog-heading">
      <div className={styles.sectionHeader}>
        <h2 id="blog-heading" className={styles.sectionTitle}>
          ARTICLES
        </h2>
        <span className={styles.line} aria-hidden="true" />
        <span className={styles.count}>
          [{String(articles.length).padStart(2, '0')}_TOTAL_ENTRIES]
        </span>
      </div>

      <div className={styles.grid}>
        {visible.map(article => (
          <article key={article.slug} className={styles.card}>
            <div className={styles.topBar}>
              <span className={styles.cardId}>
                {article.slug.replaceAll('-', '_').toUpperCase()}
              </span>
              <span className={styles.dot} aria-hidden="true" />
            </div>

            <Link href={`/articles/${article.slug}`} className={styles.mediaLink}>
              <div className={styles.media}>
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 800px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </Link>

            <div className={styles.body}>
              <h3 className={styles.title}>
                <Link href={`/articles/${article.slug}`} className={styles.titleLink}>
                  {article.title}
                </Link>
              </h3>
              <p className={styles.excerpt}>{article.excerpt}</p>

              <ul className={styles.tags} aria-label="Tags">
                {article.tags.map(tag => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>

              <Link href={`/articles/${article.slug}`} className={styles.btn}>
                Read Post
              </Link>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
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
            className={styles.pageBtn}
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages - 1}
            aria-label="Next page"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </section>
  )
}

export default CodeThinking
