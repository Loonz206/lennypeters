export interface SkillGroup {
  label: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages',
    skills: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3'],
  },
  {
    label: 'Frameworks & Libraries',
    skills: ['React', 'Next.js', 'Vue.js', 'AngularJS', 'Node.js'],
  },
  {
    label: 'Tooling',
    skills: ['Agentic Software Engineer', 'Playwright/Cypress', 'Photoshop/Figma', 'CI/CD', 'AWS'],
  },
  {
    label: 'Practices',
    skills: ['UI/UX Design', 'Graphic Design', 'A11y', 'Data-Driven KPIs', 'Responsive Web Design'],
  },
]
