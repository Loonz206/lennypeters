import React from 'react'
import { certifications } from '@/data/certifications'
import styles from './certifications.module.scss'

const Certifications = () => {
  return (
    <section className={styles.section} aria-labelledby="certifications-heading">
      <h2 id="certifications-heading" className={styles.sectionTitle}>
        Certifications
      </h2>
      <p className={styles.intro}>
        Certifications and credential details are maintained on LinkedIn.
      </p>
      <ul className={styles.list}>
        {certifications.map(certification => (
          <li key={certification.title} className={styles.item}>
            <a
              href={certification.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label={`${certification.title} on LinkedIn (opens in new tab)`}
            >
              <span className={styles.title}>{certification.title}</span>
              <span className={styles.meta}>{certification.issuer}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Certifications
