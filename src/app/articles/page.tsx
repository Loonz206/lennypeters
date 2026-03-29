import type { Metadata } from 'next';
import ArticleCard from '@/components/article-card';
import { articles } from '@/data/articles';
import styles from './articles.module.scss';

export const metadata: Metadata = {
  title: 'Articles — Lenny Peters',
  description:
    'Writing on React, TypeScript, CSS architecture, accessibility, and modern web engineering.',
};

const ArticlesPage = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>&gt; Articles</h1>
        <p className={styles.intro}>
          Thoughts on React, TypeScript, CSS, accessibility, and the craft of web engineering.
        </p>
      </header>
      <div className={styles.divider} aria-hidden="true" />
      <div className={styles.grid}>
        {articles.map(article => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;
