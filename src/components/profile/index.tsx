import React from 'react';
import styles from '@/components/profile/profile.module.scss';

interface ProfileProps {
  name: string;
}

const Profile = ({ name }: ProfileProps) => {
  return (
    <div className={styles.profile}>
      <h1>{name}</h1>
    </div>
  );
};

export default Profile;
