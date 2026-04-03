import React from 'react'
import { experience, formatDateRange } from '@/data/experience'
import styles from './experience-timeline.module.scss'

const ExperienceTimeline = () => {
  return (
    <section className={styles.section} aria-labelledby="experience-heading">
      <h2 id="experience-heading" className={styles.sectionTitle}>
        Experience
      </h2>
      <ol className={styles.timeline} aria-label="Work history">
        {experience.map(entry => (
          <li key={`${entry.company}-${entry.role}-${entry.startDate}`} className={styles.entry}>
            <div className={styles.marker} aria-hidden="true" />
            <div className={styles.content}>
              <div className={styles.header}>
                <div>
                  <h3 className={styles.role}>{entry.role}</h3>
                  <p className={styles.company}>
                    {entry.company} &mdash; {entry.location}
                  </p>
                </div>
                <p className={styles.dates}>{formatDateRange(entry.startDate, entry.endDate)}</p>
              </div>
              <p className={styles.description}>{entry.description}</p>
              <ul className={styles.highlights}>
                {entry.highlights.map(highlight => (
                  <li key={highlight} className={styles.highlight}>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default ExperienceTimeline
