import React from 'react'
import styles from './footer.module.scss'

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className={`wrapper ${styles.footer}`}>
      <div className={styles.footerInner}>
        <span className={styles.dataLabel}>SYS.LOG</span>
        <span className={styles.divider} aria-hidden="true">
          {'//'}
        </span>
        <p className={styles.copyright}>&copy; 2016 &ndash; {year} LENNY.PETERS</p>
        <span className={styles.divider} aria-hidden="true">
          {'//'}
        </span>
        <span className={styles.status}>BUILD: STABLE</span>
      </div>
    </footer>
  )
}

export default Footer
