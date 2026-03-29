import type { Metadata } from 'next';
import ArticleCard from '@/components/article-card';
import { articles } from '@/data/articles';

export const metadata: Metadata = {
  title: 'Articles — Lenny Peters',
  description:
    'Writing on React, TypeScript, CSS architecture, accessibility, and modern web engineering.',
};

const ArticlesPage = () => {
  return (
    <>
      <h1>Articles</h1>
      <p>Thoughts on React, TypeScript, CSS, accessibility, and the craft of web engineering.</p>
      <div>
        {articles.map(article => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </>
  );
};

export default ArticlesPage;
