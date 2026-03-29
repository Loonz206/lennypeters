import type { Metadata } from 'next';
import SkillsGrid from '@/components/skills-grid';
import ExperienceTimeline from '@/components/experience-timeline';
import ContactSection from '@/components/contact-section';
import styles from './about.module.scss';

export const metadata: Metadata = {
  title: 'About — Lenny Peters',
  description:
    'Web Engineer with 8+ years of experience building fast, accessible web products. Based in the UK.',
};

const AboutPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <p className={styles.label}>PROFILE</p>
        <h1 id="about-heading" className={styles.title}>About Me</h1>
        <p className={styles.sub}>
          Web Engineer with 8+ years of experience building fast, accessible web products.
        </p>
      </div>

      <section className={styles.bio} aria-labelledby="about-heading">
        <div className={styles.bioContent}>
          <p>
            I&rsquo;m a Web Engineer with over 8 years of experience designing and building
            production web applications. I specialise in React, TypeScript, and modern CSS —
            with a particular focus on performance, accessibility, and developer experience.
          </p>
          <p>
            I care deeply about the quality of the code I ship and the experience it creates for
            real users. Whether that&rsquo;s shaving milliseconds off a Core Web Vitals score,
            making an interface navigable by keyboard, or writing an API that a fellow engineer
            can understand at a glance — the details matter.
          </p>
          <p>
            Outside of work I write about web engineering, contribute to open source, and spend
            too much time thinking about typography.
          </p>
        </div>
      </section>

      <SkillsGrid />

      <ExperienceTimeline />

      <ContactSection />
    </div>
  );
};

export default AboutPage;
