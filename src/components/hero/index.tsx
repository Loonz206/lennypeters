import React from 'react';
import Link from 'next/link';
import styles from './hero.module.scss';

const Hero = () => {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <div className={styles.heroContent}>
        <p className={styles.greeting}>Hi, I&rsquo;m</p>
        <h1 className={styles.name}>Lenny Peters</h1>
        <p className={styles.tagline}>
          Web Engineer crafting fast, accessible, and beautiful web experiences.
        </p>
        <div className={styles.actions}>
          <Link href="/articles" className={styles.btnPrimary}>
            Read Articles
          </Link>
          <Link href="/about" className={styles.btnSecondary}>
            About Me
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
