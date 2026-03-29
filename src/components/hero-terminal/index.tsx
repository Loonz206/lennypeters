import React from 'react';
import Link from 'next/link';
import styles from './hero-terminal.module.scss';

const HeroTerminal = () => {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.topMeta}>
        <span className={styles.metaLabel}>status</span>
        <span className={styles.metaSep}>{'//'}</span>
        <span className={styles.metaValue}>senior software engineer</span>
      </div>

      <div className={styles.main}>
        <div className={styles.titleBlock}>
          <p className={styles.aiLabel}>AI Generated Text Goes Here</p>
          <h1 className={styles.name}>LENNY<span className={styles.dot}>.</span>PETERS</h1>
        </div>

        <div className={styles.sidebar}>
          <p className={styles.coord}>
            <span className={styles.coordKey}>COORD_X</span>
            <span className={styles.coordSep}>:</span>
            <span className={styles.coordVal}>42.99</span>
          </p>
          <p className={styles.seq}>SEQ_01</p>
        </div>
      </div>

      <p className={styles.tagline}>
        Senior Software Engineer turning complex AI ideas into production-ready systems.
      </p>

      <div className={styles.actions}>
        <Link href="/articles" className={styles.btnPrimary}>Articles</Link>
        <Link href="/about" className={styles.btnSecondary}>about</Link>
      </div>

      <div className={styles.bottomMeta}>
        <span className={styles.version}>
          <span className={styles.vKey}>V_CORE</span>
          <span className={styles.vSep}>:</span>
          <span className={styles.vVal}>v4.2.1</span>
        </span>
        <span className={styles.statusBadge}>
          <span className={styles.statusDot} aria-hidden="true" />
          STATUS: STABLE
        </span>
      </div>
    </section>
  );
};

export default HeroTerminal;
