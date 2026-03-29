export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | 'Present';
  description: string;
  highlights: string[];
}

export const experience: ExperienceEntry[] = [
  {
    role: 'Senior Web Engineer',
    company: 'Acme Corporation',
    location: 'London, UK',
    startDate: '2022-03',
    endDate: 'Present',
    description:
      'Leading front-end architecture for a suite of customer-facing products serving 2M+ monthly users. Driving adoption of React Server Components and improving Core Web Vitals scores across the platform.',
    highlights: [
      'Migrated legacy CRA app to Next.js 15, reducing LCP by 40%',
      'Established component library and design token system',
      'Introduced automated accessibility testing in CI pipeline',
      'Mentored 3 junior engineers through structured code reviews',
    ],
  },
  {
    role: 'Web Engineer',
    company: 'Bright Agency',
    location: 'Manchester, UK',
    startDate: '2019-06',
    endDate: '2022-02',
    description:
      'Built and maintained bespoke web applications for clients across e-commerce, media, and fintech. Collaborated closely with designers to implement pixel-perfect, accessible interfaces.',
    highlights: [
      'Delivered 12 client projects from discovery to production',
      'Introduced TypeScript across the team, reducing runtime errors by ~60%',
      'Built reusable component library used across 8 projects',
      'Improved average Lighthouse score from 62 to 91 across client portfolio',
    ],
  },
  {
    role: 'Junior Front-End Developer',
    company: 'Digital Spark',
    location: 'Leeds, UK',
    startDate: '2017-09',
    endDate: '2019-05',
    description:
      'Started career building marketing sites and internal tools. Rapidly progressed from pure HTML/CSS work to React-based applications.',
    highlights: [
      'Built responsive marketing sites for 20+ clients',
      'Learned React and shipped first production SPA within 6 months',
      'Contributed to internal CMS tooling project',
    ],
  },
];

export function formatDateRange(start: string, end: string | 'Present'): string {
  const fmt = (d: string) => {
    const [year, month] = d.split('-');
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    });
  };
  return `${fmt(start)} – ${end === 'Present' ? 'Present' : fmt(end)}`;
}
