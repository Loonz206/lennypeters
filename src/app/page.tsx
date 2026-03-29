import type { Metadata } from 'next';
import Hero from '@/components/hero';
import ArticleCard from '@/components/article-card';
import SkillsGrid from '@/components/skills-grid';
import { getFeaturedArticles } from '@/data/articles';

export const metadata: Metadata = {
  title: 'Lenny Peters — Web Engineer',
  description:
    'Web Engineer crafting fast, accessible, and beautiful web experiences. Articles on React, TypeScript, CSS, and modern web development.',
};

const Home = () => {
  const featuredArticles = getFeaturedArticles(3);

  return (
    <>
      <Hero />

      <section aria-labelledby="featured-articles-heading">
        <h2 id="featured-articles-heading">Featured Articles</h2>
        <div>
          {featuredArticles.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <SkillsGrid />
    </>
  );
};

export default Home;
