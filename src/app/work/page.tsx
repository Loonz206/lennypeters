import type { Metadata } from 'next'
import { projects } from '@/data/projects'
import { DEFAULT_OG_IMAGE } from '@/lib/seo'
import styles from './work.module.scss'

export const metadata: Metadata = {
  title: 'Work — Lenny Peters',
  description: 'Selected projects and case studies from Lenny Peters.',
  alternates: {
    canonical: '/work/',
  },
  openGraph: {
    type: 'website',
    url: '/work/',
    title: 'Work — Lenny Peters',
    description: 'Selected projects and case studies from Lenny Peters.',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work — Lenny Peters',
    description: 'Selected projects and case studies from Lenny Peters.',
    images: [DEFAULT_OG_IMAGE],
  },
}

const WorkPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <p className={styles.label}>SELECTED_WORK</p>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.sub}>
          A selection of systems and products built across AI infrastructure, tooling, and front-end
          engineering.
        </p>
      </div>

      <div className={styles.list}>
        {projects.map((project, index) => (
          <article key={project.id} className={styles.entry}>
            <div className={styles.entryMeta}>
              <span className={styles.projectId}>{project.id}</span>
              <span className={styles.index}>_{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className={styles.entryContent}>
              <h2 className={styles.entryTitle}>{project.title}</h2>
              <p className={styles.entryDesc}>{project.description}</p>
              <ul className={styles.tags} aria-label="Technologies">
                {project.tags.map(tag => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default WorkPage
