import React from 'react';
import Link from 'next/link';
import { Article } from '@/data/articles';
import styles from './article-card.module.scss';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const formattedDate = new Date(article.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className={styles.card}>
      <div className={styles.meta}>
        <time dateTime={article.date} className={styles.date}>
          {formattedDate}
        </time>
        <ul className={styles.tags} aria-label="Tags">
          {article.tags.map(tag => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <h2 className={styles.title}>
        <Link href={`/articles/${article.slug}`} className={styles.titleLink}>
          {article.title}
        </Link>
      </h2>
      <p className={styles.excerpt}>{article.excerpt}</p>
      <Link href={`/articles/${article.slug}`} className={styles.readMore} aria-label={`Read ${article.title}`}>
        Read article &rarr;
      </Link>
    </article>
  );
};

export default ArticleCard;
