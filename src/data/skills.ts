export interface SkillGroup {
  label: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages',
    skills: ['Responsive Web Development', 'HTML 5', 'CSS3', 'JavaScript'],
  },
  {
    label: 'Frameworks & Libraries',
    skills: ['React', 'NextJS', 'VueJS', 'AngularJS'],
  },
  {
    label: 'Tooling',
    skills: ['Playwright/Cypress', 'Photoshop/Figma', 'Adobe Target', 'CICD', 'AWS'],
  },
  {
    label: 'Practices',
    skills: ['UI/UX Design', 'Graphic Design', 'a11y', 'Data Driven KPIs', 'AI'],
  },
]
