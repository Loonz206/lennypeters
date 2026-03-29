import React from 'react';
import Link from 'next/link';
import { articles } from '@/data/articles';
import styles from './code-thinking.module.scss';

const CodeThinking = () => {
  const preview = articles.slice(0, 3);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${year}.${month}.${day}`;
  };

  return (
    <section className={styles.section} aria-labelledby="blog-heading">
      <div className={styles.sectionHeader}>
        <h2 id="blog-heading" className={styles.sectionTitle}>&gt; code thinking</h2>
        <p className={styles.intro}>
          Technical documentation, thoughts on system architecture, and late-night logs from the build terminal.
        </p>
      </div>

      <div className={styles.posts}>
        {preview.map(article => (
          <article key={article.slug} className={styles.post}>
            <p className={styles.date}>
              <span className={styles.dateCaret} aria-hidden="true">&gt;</span>
              <time dateTime={article.date}>{formatDate(article.date)}</time>
            </p>
            <h3 className={styles.title}>
              <Link href={`/articles/${article.slug}`} className={styles.titleLink}>
                {article.title}
              </Link>
            </h3>
            <p className={styles.excerpt}>{article.excerpt}</p>
            <ul className={styles.tags} aria-label="Tags">
              {article.tags.map(tag => (
                <li key={tag} className={styles.tag}>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className={styles.footer}>
        <p className={styles.scroll}>SCROLL_FOR_DATA</p>
        <Link href="/articles" className={styles.more}>more posts &rarr;</Link>
      </div>
    </section>
  );
};

export default CodeThinking;
