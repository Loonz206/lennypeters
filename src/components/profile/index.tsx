import React from 'react';
import Image from 'next/image';
import styles from '@/components/profile/profile.module.scss';

const Profile = () => {
  return (
    <aside className={styles.card} aria-label="Profile summary">
      <div className={styles.topBar}>
        <span className={styles.userId}>LENNY.PETERS</span>
        <span className={styles.dot} aria-hidden="true" />
      </div>

      <div className={styles.photo}>
        <Image
          src="/profile.jpg"
          alt="Lenny Peters"
          fill
          sizes="(max-width: 800px) 100vw, 50vw"
          className={styles.photoImg}
          priority
        />
        <div className={styles.photoScanline} aria-hidden="true" />
      </div>
    </aside>
  );
};

export default Profile;
