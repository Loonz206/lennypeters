import React from 'react'
import styles from './contact-section.module.scss'

const ContactSection = () => {
  return (
    <section className={styles.section} aria-labelledby="contact-heading">
      <h2 id="contact-heading" className={styles.sectionTitle}>
        Get In Touch
      </h2>
      <p className={styles.intro}>
        I&rsquo;m always open to interesting conversations, collaborations, and new opportunities.
        The best way to reach me is by email.
      </p>
      <ul className={styles.links}>
        <li>
          <a
            href="mailto:hello@lennypeters.dev"
            className={styles.link}
            aria-label="Send email to Lenny Peters"
          >
            <span className={styles.icon} aria-hidden="true">
              ✉
            </span>{' '}
            hello@lennypeters.dev
          </a>
        </li>
        <li>
          <a
            href="https://github.com/lennypeters"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            aria-label="GitHub profile (opens in new tab)"
          >
            <span className={styles.icon} aria-hidden="true">
              ⌥
            </span>{' '}
            github.com/lennypeters
          </a>
        </li>
        <li>
          <a
            href="https://linkedin.com/in/lennypeters"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            aria-label="LinkedIn profile (opens in new tab)"
          >
            <span className={styles.icon} aria-hidden="true">
              in
            </span>{' '}
            linkedin.com/in/lennypeters
          </a>
        </li>
      </ul>
    </section>
  )
}

export default ContactSection
