export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  buttonLabel: string
  href: string
  image?: string
}

export const projects: Project[] = [
  {
    id: 'PRJ_001',
    title: 'videos-hooks',
    description:
      'A modern React course project that demonstrates advanced React concepts using custom hooks, context, and functional components. This app allows users to search for YouTube videos and view details, leveraging the YouTube Data API v3.',
    tags: ['react', 'hooks', 'state', 'api'],
    buttonLabel: 'View Project',
    href: 'https://github.com/Loonz206/videos-hooks',
  },
  {
    id: 'PRJ_002',
    title: 'lennypeters',
    description:
      'Personal profilo site build on Github Pages using NextJS leveraging AI, Blogging via Issues',
    tags: ['nextjs', 'static hosting', 'blogging', 'ai'],
    buttonLabel: 'View Project',
    href: 'https://github.com/Loonz206/lennypeters',
  },
]
