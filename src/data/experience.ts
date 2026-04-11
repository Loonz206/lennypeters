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
    role: 'Senior Software Engineer 2',
    company: 'lululemon',
    location: 'Hybrid',
    startDate: '2018-01',
    endDate: 'Present',
    description:
      'Currently serving as Tech Lead supporting the Membership Program. Previously supported Analytics, Personalization, and International teams across the platform.',
    highlights: [
      'Tech Lead for Membership Program, driving front-end architecture and delivery',
      'Supported Analytics and Personalization teams with data-driven UI initiatives',
      'Contributed to International (INTL) team expanding global platform reach',
      'Championing accessibility (a11y) best practices and WCAG compliance across web surfaces',
      'Leveraging automation and reusable design patterns to improve team velocity',
    ],
  },
  {
    role: 'Front-End UI Developer',
    company: 'Holland America Line',
    location: 'On-site',
    startDate: '2014-06',
    endDate: '2017-11',
    description:
      'Supporting ecommerce flow for guests with ship excursions for multiple cruise companies, leveraging automation and reusable design patterns using AngularJS.',
    highlights: [
      'Built and maintained ecommerce guest booking flows for multiple cruise lines',
      'Developed reusable AngularJS component patterns accelerating feature delivery',
      'Implemented automation across front-end workflows to improve reliability',
      'Collaborated closely with UX and backend teams to deliver cohesive user experiences',
    ],
  },
  {
    role: 'Web Designer',
    company: 'Seamonster Studios',
    location: 'On-site',
    startDate: '2013-11',
    endDate: '2014-05',
    description:
      'Created designs for small and medium-sized businesses spanning ecommerce to marketing websites, serving clients from theme parks to branded coffee companies.',
    highlights: [
      'Designed and implemented responsive web templates using Responsive Web Design best practices',
      'Delivered projects for diverse clients including theme parks and branded coffee companies',
      'Incorporated stakeholder insight across discovery, design, and delivery phases',
      'Handled everything from ecommerce storefronts to marketing landing pages',
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
