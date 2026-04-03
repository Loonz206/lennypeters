import React from 'react'
import { skillGroups } from '@/data/skills'
import styles from './skills-grid.module.scss'

const SkillsGrid = () => {
  return (
    <section className={styles.section} aria-labelledby="skills-heading">
      <h2 id="skills-heading" className={styles.sectionTitle}>
        Skills &amp; Technologies
      </h2>
      <div className={styles.grid}>
        {skillGroups.map(group => (
          <div key={group.label} className={styles.group}>
            <h3 className={styles.groupLabel}>{group.label}</h3>
            <ul className={styles.skillList}>
              {group.skills.map(skill => (
                <li key={skill} className={styles.skill}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SkillsGrid
