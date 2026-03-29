import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/data/projects';
import styles from './project-card.module.scss';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.topBar}>
        <span className={styles.projectId}>{project.id}</span>
        <span className={styles.dot} aria-hidden="true" />
      </div>

      {project.image && (
        <div className={styles.imageWrapper}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}

      <div className={styles.body}>
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
      </div>
    </article>
  );
};

export default ProjectCard;
