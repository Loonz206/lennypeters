export interface SkillGroup {
  label: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS / SCSS', 'SQL'],
  },
  {
    label: 'Frameworks & Libraries',
    skills: ['React', 'Next.js', 'Node.js', 'Express', 'React Testing Library'],
  },
  {
    label: 'Tooling',
    skills: ['Git', 'Jest', 'Playwright', 'ESLint', 'Webpack / Vite', 'Docker'],
  },
  {
    label: 'Practices',
    skills: ['Accessibility (WCAG)', 'Performance', 'CI / CD', 'Agile / Scrum', 'Code Review'],
  },
]
