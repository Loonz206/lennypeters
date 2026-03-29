import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { articles, getArticleBySlug } from '@/data/articles';
import styles from './article.module.scss';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Lenny Peters`,
    description: article.excerpt,
  };
}

const ArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className={styles.article}>
      <header className={styles.header}>
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
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.excerpt}>{article.excerpt}</p>
      </header>
      <div className={styles.body}>
        {article.body.split('\n\n').map((block, i) => {
          if (block.startsWith('## ')) {
            return <h2 key={i} className={styles.h2}>{block.replace(/^## /, '')}</h2>;
          }
          if (block.startsWith('```')) {
            const lines = block.split('\n');
            const code = lines.slice(1, -1).join('\n');
            return (
              <pre key={i} className={styles.pre}>
                <code>{code}</code>
              </pre>
            );
          }
          return <p key={i}>{block}</p>;
        })}
      </div>
    </article>
  );
};

export default ArticlePage;
