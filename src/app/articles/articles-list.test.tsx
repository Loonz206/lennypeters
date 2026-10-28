import { fireEvent, render, screen } from '@testing-library/react'
import type { ArticleMeta } from '@/lib/articles'
import ArticlesList from './articles-list'

jest.mock('../../components/article-card', () => ({
  __esModule: true,
  default: ({ article }: { article: ArticleMeta }) => (
    <div data-testid="article-card">{article.title}</div>
  ),
}))

const makeArticles = (n: number): ArticleMeta[] =>
  Array.from({ length: n }, (_, i) => ({
    slug: `article-${i}`,
    title: `Article ${i}`,
    date: `2024-01-0${(i % 9) + 1}`,
    excerpt: `Excerpt ${i}`,
    tags: ['Tag'],
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4',
    imageAlt: 'Code editor open on a monitor in a developer workspace',
  }))

describe('ArticlesList', () => {
  it('shows no pagination for up to 4 articles', () => {
    render(<ArticlesList articles={makeArticles(4)} />)

    expect(screen.getAllByTestId('article-card')).toHaveLength(4)
    expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument()
  })

  it('paginates when there are more than 4 articles', () => {
    render(<ArticlesList articles={makeArticles(5)} />)

    expect(screen.getAllByTestId('article-card')).toHaveLength(4)
    expect(screen.queryByText('Article 4')).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Next page'))
    expect(screen.getByText('Article 4')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).toBeDisabled()

    fireEvent.click(screen.getByLabelText('Previous page'))
    expect(screen.queryByText('Article 4')).not.toBeInTheDocument()
  })
})
