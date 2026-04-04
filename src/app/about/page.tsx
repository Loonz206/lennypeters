import type { Metadata } from 'next'
import SkillsGrid from '@/components/skills-grid'
import ExperienceTimeline from '@/components/experience-timeline'
import ContactSection from '@/components/contact-section'
import { DEFAULT_OG_IMAGE } from '@/lib/seo'
import styles from './about.module.scss'

export const metadata: Metadata = {
  title: 'About — Lenny Peters',
  description:
    'Senior Web Engineer at lululemon with 8+ years of experience building fast, accessible web products. Based in Cascadia.',
  alternates: {
    canonical: '/about/',
  },
  openGraph: {
    type: 'profile',
    url: '/about/',
    title: 'About — Lenny Peters',
    description:
      'Senior Web Engineer at lululemon with 8+ years of experience building fast, accessible web products. Based in Cascadia.',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — Lenny Peters',
    description:
      'Senior Web Engineer at lululemon with 8+ years of experience building fast, accessible web products. Based in Cascadia.',
    images: [DEFAULT_OG_IMAGE],
  },
}

const AboutPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <p className={styles.label}>PROFILE</p>
        <h1 id="about-heading" className={styles.title}>
          About Me
        </h1>
        <p className={styles.sub}>
          Senior Web Engineer at lululemon, building fast and accessible web products from Cascadia.
        </p>
      </div>

      <section className={styles.bio} aria-labelledby="about-heading">
        <div className={styles.bioContent}>
          <p>
            I&rsquo;m a Senior Web Engineer at lululemon with over 8 years of experience designing
            and building production web applications. I specialize in React, TypeScript, and modern
            CSS — with a particular focus on performance, accessibility, and developer experience.
          </p>
          <p>
            Accessibility isn&rsquo;t a checkbox for me — it&rsquo;s a core engineering value.
            I&rsquo;m actively involved in a11y-focused projects and collaboration, and I bring a
            unique perspective as a proficient ASL (American Sign Language) user. Whether
            that&rsquo;s making an interface navigable by keyboard, meeting WCAG standards, or
            advocating for inclusive design from the outset — the details matter.
          </p>
          <p>
            Outside of work I write about web engineering, contribute to open source on GitHub, and
            am currently expanding my knowledge of AWS infrastructure and JAMStack architectures.
            Every person is a contributor to your journey — open minds and be kind.
          </p>
        </div>
      </section>

      <SkillsGrid />

      <ExperienceTimeline />

      <ContactSection />
    </div>
  )
}

export default AboutPage
