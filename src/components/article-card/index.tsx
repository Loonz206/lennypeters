import React from 'react';
import Link from 'next/link';
import type { ArticleMeta } from '@/lib/articles';
import styles from './article-card.module.scss';

interface ArticleCardProps {
  article: ArticleMeta;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const formattedDate = new Date(article.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className={styles.card}>
      <div className={styles.topBar}>
        <span className={styles.slug}>{article.slug.replace(/-/g, '_').toUpperCase()}</span>
        <time dateTime={article.date} className={styles.date}>
          {formattedDate}
        </time>
      </div>
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
        <Link href={`/articles/${article.slug}`} className={styles.btn} aria-label={`Read ${article.title}`}>
          Read Article
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
