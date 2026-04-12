import type { Metadata } from 'next'
import SkillsGrid from '@/components/skills-grid'
import Certifications from '@/components/certifications'
import ExperienceTimeline from '@/components/experience-timeline'
import ContactSection from '@/components/contact-section'
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — Lenny Peters',
    description:
      'Senior Web Engineer at lululemon with 8+ years of experience building fast, accessible web products. Based in Cascadia.',
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
            As a seasoned senior software engineer, I have a proven track record of developing
            engaging, user-centric, and responsive websites and applications. My ability to adapt to
            various team dynamics, along with my broad skillset, ranging from coding to designing
            graphical elements, allows me to make meaningful contributions to any project. I am
            dedicated to promoting accessibility, utilizing automation, and upholding the principle
            of equal access to the internet. My ultimate goal is to craft impactful and memorable
            experiences for users on the web.
          </p>
          <p>
            With over 15 years of experience, my journey spans the age of responsive design and
            ecommerce implementation through to emerging technologies like module federation and
            Next.js. I have seen the web evolve and have continuously adapted, bringing that breadth
            of perspective to every project I contribute to.
          </p>
        </div>
      </section>

      <SkillsGrid />

      <Certifications />

      <ExperienceTimeline />

      <ContactSection />
    </div>
  )
}

export default AboutPage
