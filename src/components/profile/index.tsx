import React from 'react'
import Image from 'next/image'
import styles from '@/components/profile/profile.module.scss'

const PROFILE_PLACEHOLDER_URL =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80'

const Profile = () => {
  return (
    <aside className={styles.card} aria-label="Profile summary">
      <div className={styles.topBar}>
        <span className={styles.userId}>LENNY.PETERS</span>
        <span className={styles.dot} aria-hidden="true" />
      </div>

      <div className={styles.photo}>
        <Image
          src={PROFILE_PLACEHOLDER_URL}
          alt="Lenny Peters"
          fill
          sizes="(max-width: 800px) 100vw, 50vw"
          className={styles.photoImg}
          priority
        />
        <div className={styles.photoScanline} aria-hidden="true" />
      </div>
    </aside>
  )
}

export default Profile
