import type { Metadata } from 'next'
import HeroTerminal from '@/components/hero-terminal'
import SelectedWork from '@/components/selected-work'
import ExpertiseList from '@/components/expertise-list'
import CodeThinking from '@/components/code-thinking'
import { getAllArticleMetas } from '@/lib/articles'
import { DEFAULT_OG_IMAGE } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Lenny Peters — Senior Software Engineer II',
  description:
    'Senior Software Engineer II turning complex AI ideas into production-ready systems. React, TypeScript, Next.js.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Lenny Peters — Senior Software Engineer II',
    description:
      'Senior Software Engineer II turning complex AI ideas into production-ready systems. React, TypeScript, Next.js.',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lenny Peters — Senior Software Engineer II',
    description:
      'Senior Software Engineer II turning complex AI ideas into production-ready systems. React, TypeScript, Next.js.',
    images: [DEFAULT_OG_IMAGE],
  },
}

const Home = () => {
  const articles = getAllArticleMetas()

  return (
    <>
      <HeroTerminal />
      <SelectedWork />
      <ExpertiseList />
      <CodeThinking articles={articles} />
    </>
  )
}

export default Home
