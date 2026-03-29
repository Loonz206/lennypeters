import React from 'react';
import styles from '@/components/profile/profile.module.scss';

const Profile = () => {
  return (
    <aside className={styles.card} aria-label="Profile summary">
      <div className={styles.topBar}>
        <span className={styles.userId}>USR_001</span>
        <span className={styles.dot} aria-hidden="true" />
      </div>

      <div className={styles.body}>
        <p className={styles.name}>{`> LENNY PETERS`}</p>
        <p className={styles.role}>SENIOR SOFTWARE ENGINEER</p>

        <dl className={styles.stats}>
          <div className={styles.row}>
            <dt className={styles.key}>LOC</dt>
            <dd className={styles.sep}>{'//'}</dd>
            <dd className={styles.val}>London, UK</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.key}>EXP</dt>
            <dd className={styles.sep}>{'//'}</dd>
            <dd className={styles.val}>8+ Years</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.key}>FOCUS</dt>
            <dd className={styles.sep}>{'//'}</dd>
            <dd className={styles.val}>React · TypeScript · AI</dd>
          </div>
        </dl>

        <div className={styles.links}>
          <a
            href="https://github.com/lennypeters"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            GITHUB
          </a>
          <a
            href="https://linkedin.com/in/lennypeters"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            LINKEDIN
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Profile;
