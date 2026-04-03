export interface ExperienceEntry {
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  highlights: string[]
}

export const experience: ExperienceEntry[] = [
  {
    role: 'Senior Web Engineer',
    company: 'lululemon',
    location: 'Cascadia (Remote)',
    startDate: '2021-01',
    endDate: 'Present',
    description:
      'Building and maintaining customer-facing web products at scale for a global athletic apparel brand. Driving front-end architecture decisions, accessibility standards, and performance improvements across the platform.',
    highlights: [
      'Championing accessibility (a11y) best practices and WCAG compliance across web surfaces',
      'Contributed to module federation architecture enabling micro-frontend delivery',
      'Established design token systems bridging design and engineering workflows',
      'Introduced automated accessibility and performance testing in CI pipelines',
      'Active in GitHub Actions workflows and open-source developer tooling',
    ],
  },
  {
    role: 'Web Engineer',
    company: 'Freelance & Agency Work',
    location: 'Remote',
    startDate: '2018-06',
    endDate: '2020-12',
    description:
      'Built and maintained bespoke web applications for clients across e-commerce, media, and fintech. Collaborated closely with designers to implement pixel-perfect, accessible interfaces.',
    highlights: [
      'Delivered client projects from discovery to production using React and TypeScript',
      'Introduced TypeScript across team codebases, reducing runtime errors significantly',
      'Built reusable component libraries shared across multiple projects',
      'Improved Lighthouse scores and Core Web Vitals across client portfolio',
    ],
  },
  {
    role: 'Front-End Developer',
    company: 'Early Career',
    location: 'Remote',
    startDate: '2016-01',
    endDate: '2018-05',
    description:
      'Started career building marketing sites and internal tools. Rapidly progressed from HTML/CSS to React-based applications and GraphQL APIs.',
    highlights: [
      'Built responsive marketing sites and JAMStack applications',
      'Learned React and shipped first production SPA within months of starting',
      'Explored GraphQL and Express through personal and open-source projects',
    ],
  },
]

export function formatDateRange(start: string, end: string): string {
  const fmt = (d: string) => {
    const [year, month] = d.split('-')
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    })
  }
  return `${fmt(start)} – ${end === 'Present' ? 'Present' : fmt(end)}`
}
