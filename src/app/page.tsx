import type { Metadata } from 'next';
import HeroTerminal from '@/components/hero-terminal';
import SelectedWork from '@/components/selected-work';
import ExpertiseList from '@/components/expertise-list';
import CodeThinking from '@/components/code-thinking';

export const metadata: Metadata = {
  title: 'Lenny Peters — Senior Software Engineer',
  description:
    'Senior Software Engineer turning complex AI ideas into production-ready systems. React, TypeScript, Next.js.',
};

const Home = () => {
  return (
    <>
      <HeroTerminal />
      <SelectedWork />
      <ExpertiseList />
      <CodeThinking />
    </>
  );
};

export default Home;
