import React from 'react';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/project-card';
import styles from './selected-work.module.scss';

const SelectedWork = () => {
  return (
    <section className={styles.section} aria-labelledby="work-heading">
      <div className={styles.sectionHeader}>
        <h2 id="work-heading" className={styles.sectionTitle}>SELECTED_WORK</h2>
        <span className={styles.line} aria-hidden="true" />
        <span className={styles.count}>[{String(projects.length).padStart(2, '0')}_TOTAL_ENTRIES]</span>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default SelectedWork;
