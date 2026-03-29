export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  buttonLabel: string;
  href: string;
}

export const projects: Project[] = [
  {
    id: 'PRJ_001',
    title: 'Telemetry UI Framework',
    description:
      'A high-velocity UI framework designed for real-time telemetry dashboards and tactical operations centers. Built for sustained 60fps rendering under continuous data load.',
    tags: ['React', 'TypeScript', 'WebSockets', 'Canvas'],
    buttonLabel: 'View Project',
    href: '#',
  },
  {
    id: 'PRJ_002',
    title: 'AI Pipeline Orchestrator',
    description:
      'Distributed orchestration layer for LLM inference pipelines. Handles multi-model routing, latency budgeting, and graceful degradation under capacity constraints.',
    tags: ['Python', 'FastAPI', 'Redis', 'Docker'],
    buttonLabel: 'View Project',
    href: '#',
  },
  {
    id: 'PRJ_003',
    title: 'Design System Core',
    description:
      'Token-driven design system spanning 200+ components across web and native platforms. Automated accessibility auditing baked into the build pipeline.',
    tags: ['Next.js', 'SCSS', 'Storybook', 'Figma'],
    buttonLabel: 'View Project',
    href: '#',
  },
];
