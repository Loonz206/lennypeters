import React from 'react';
import Link from 'next/link';
import { projects } from '@/data/projects';
import styles from './selected-work.module.scss';

const SelectedWork = () => {
  return (
    <section className={styles.section} aria-labelledby="work-heading">
      <div className={styles.sectionHeader}>
        <h2 id="work-heading" className={styles.sectionTitle}>SELECTED_WORK</h2>
        <span className={styles.count}>[{String(projects.length).padStart(2, '0')}_TOTAL_ENTRIES]</span>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <article key={project.id} className={styles.card}>
            <p className={styles.projectId}>{project.id}</p>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.description}>{project.description}</p>
            <ul className={styles.tags} aria-label="Technologies">
              {project.tags.map(tag => (
                <li key={tag} className={styles.tag}>{tag}</li>
              ))}
            </ul>
            <Link href={project.href} className={styles.btn}>
              {project.buttonLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SelectedWork;
