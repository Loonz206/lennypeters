import type { Metadata } from 'next'
import HeroTerminal from '@/components/hero-terminal'
import SelectedWork from '@/components/selected-work'
import ExpertiseList from '@/components/expertise-list'
import CodeThinking from '@/components/code-thinking'
import { getAllArticleMetas } from '@/lib/articles'

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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lenny Peters — Senior Software Engineer II',
    description:
      'Senior Software Engineer II turning complex AI ideas into production-ready systems. React, TypeScript, Next.js.',
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
