import React from 'react';
import { skillGroups } from '@/data/skills';
import styles from './expertise-list.module.scss';

const ExpertiseList = () => {
  const allSkills = skillGroups
    .filter(g => ['Languages', 'Frameworks & Libraries'].includes(g.label))
    .flatMap(g => g.skills)
    .slice(0, 8);

  return (
    <section className={styles.section} aria-labelledby="expertise-heading">
      <h2 id="expertise-heading" className={styles.sectionTitle}>expertise</h2>
      <ul className={styles.list}>
        {allSkills.map(skill => (
          <li key={skill} className={styles.item}>
            <span className={styles.chevron} aria-hidden="true">&gt;</span>
            <span className={styles.label}>{skill.toLowerCase()}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ExpertiseList;
