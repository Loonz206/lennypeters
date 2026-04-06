import React from 'react'
import styles from './expertise-list.module.scss'

const FEATURED_SKILLS = ['Next.js', 'React', 'TypeScript', 'AI', 'Playwright']

const ExpertiseList = () => {
  return (
    <section className={styles.section} aria-labelledby="expertise-heading">
      <div className={styles.row}>
        <h2 id="expertise-heading" className={styles.sectionTitle}>
          Expertise
        </h2>
        <ul className={styles.list}>
          {FEATURED_SKILLS.map(skill => (
            <li key={skill} className={styles.item}>
              <span className={styles.chevron} aria-hidden="true">
                &gt;
              </span>
              <span className={styles.label}>{skill.toUpperCase()}</span>
            </li>
          ))}
        </ul>
        <span className={styles.line} aria-hidden="true" />
      </div>
    </section>
  )
}

export default ExpertiseList
