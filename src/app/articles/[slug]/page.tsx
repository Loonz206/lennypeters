import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllArticleMetas, getArticleBySlug } from '@/lib/articles';
import styles from './article.module.scss';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllArticleMetas().map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.meta.title} — Lenny Peters`,
    description: article.meta.excerpt,
  };
}

const ArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.meta.date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <time dateTime={article.meta.date} className={styles.date}>
            {formattedDate}
          </time>
          <ul className={styles.tags} aria-label="Tags">
            {article.meta.tags.map(tag => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <h1 className={styles.title}>{article.meta.title}</h1>
        <p className={styles.excerpt}>{article.meta.excerpt}</p>
      </header>
      <div
        className={styles.body}
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />
    </article>
  );
};

export default ArticlePage;
