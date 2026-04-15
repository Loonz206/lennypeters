import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ArticleMeta } from '@/lib/articles'
import styles from './article-card.module.scss'

interface ArticleCardProps {
  article: ArticleMeta
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const formattedDate = new Date(article.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className={styles.card}>
      <div className={styles.topBar}>
        <span className={styles.slug}>{article.slug.replaceAll('-', '_').toUpperCase()}</span>
        <time dateTime={article.date} className={styles.date}>
          {formattedDate}
        </time>
      </div>
      <Link href={`/articles/${article.slug}`} className={styles.mediaLink}>
        <div className={styles.media}>
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="(max-width: 800px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </Link>
      <div className={styles.body}>
        <h2 className={styles.title}>
          <Link href={`/articles/${article.slug}`} className={styles.titleLink}>
            {article.title}
          </Link>
        </h2>
        <p className={styles.excerpt}>{article.excerpt}</p>
        <ul className={styles.tags} aria-label="Tags">
          {article.tags.map(tag => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
        <Link
          href={`/articles/${article.slug}`}
          className={styles.btn}
          aria-label={`Read ${article.title}`}
        >
          Read <span aria-hidden="true">{article.title}</span>
        </Link>
      </div>
    </article>
  )
}

export default ArticleCard
