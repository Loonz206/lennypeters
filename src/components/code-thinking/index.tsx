"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { articles } from '@/data/articles';
import styles from './code-thinking.module.scss';

const ITEMS_PER_PAGE = 4;

const CodeThinking = () => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const visible = articles.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <section className={styles.section} aria-labelledby="blog-heading">
      <div className={styles.sectionHeader}>
        <h2 id="blog-heading" className={styles.sectionTitle}>&gt; code thinking</h2>
      </div>

      <div className={styles.grid}>
        {visible.map(article => (
          <article key={article.slug} className={styles.card}>
            <div className={styles.topBar}>
              <span className={styles.cardId}>{article.slug.replace(/-/g, '_').toUpperCase()}</span>
              <span className={styles.dot} aria-hidden="true" />
            </div>

            <div className={styles.imagePlaceholder} />

            <div className={styles.body}>
              <h3 className={styles.title}>{article.title}</h3>
              <p className={styles.excerpt}>{article.excerpt}</p>

              <ul className={styles.tags} aria-label="Tags">
                {article.tags.map(tag => (
                  <li key={tag} className={styles.tag}>{tag}</li>
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
  );
};

export default CodeThinking;
