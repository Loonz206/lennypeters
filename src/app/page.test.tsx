import React from 'react'
import { render, screen } from '@testing-library/react'
import Home, { metadata } from './page'
import { getAllArticleMetas } from '@/lib/articles'

jest.mock('../lib/articles', () => ({
  getAllArticleMetas: jest.fn().mockReturnValue([]),
}))

jest.mock('../components/hero-terminal', () => ({
  __esModule: true,
  default: () => <div data-testid="hero-terminal" />,
}))

jest.mock('../components/selected-work', () => ({
  __esModule: true,
  default: () => <div data-testid="selected-work" />,
}))

jest.mock('../components/expertise-list', () => ({
  __esModule: true,
  default: () => <div data-testid="expertise-list" />,
}))

jest.mock('../components/code-thinking', () => ({
  __esModule: true,
  default: ({ articles }: { articles: unknown[] }) => (
    <div data-testid="code-thinking" data-count={articles.length} />
  ),
}))

const mockGetAllArticleMetas = getAllArticleMetas as jest.MockedFunction<typeof getAllArticleMetas>

describe('Home page', () => {
  beforeEach(() => {
    mockGetAllArticleMetas.mockReturnValue([])
  })

  it('renders HeroTerminal', () => {
    render(<Home />)
    expect(screen.getByTestId('hero-terminal')).toBeInTheDocument()
  })

  it('renders SelectedWork', () => {
    render(<Home />)
    expect(screen.getByTestId('selected-work')).toBeInTheDocument()
  })

  it('renders ExpertiseList', () => {
    render(<Home />)
    expect(screen.getByTestId('expertise-list')).toBeInTheDocument()
  })

  it('renders CodeThinking', () => {
    render(<Home />)
    expect(screen.getByTestId('code-thinking')).toBeInTheDocument()
  })

  it('exports correct metadata title', () => {
    expect(metadata.title).toBe('Lenny Peters — Senior Software Engineer')
  })

  it('exports correct metadata description', () => {
    expect(metadata.description).toBe(
      'Senior Software Engineer turning complex AI ideas into production-ready systems. React, TypeScript, Next.js.'
    )
  })

  it('calls getAllArticleMetas on render', () => {
    render(<Home />)
    expect(mockGetAllArticleMetas).toHaveBeenCalled()
  })

  it('passes articles returned by getAllArticleMetas to CodeThinking', () => {
    const fakeArticles = [
      { slug: 'a', title: 'Article A', date: '2024-01-01', excerpt: '', tags: [] },
      { slug: 'b', title: 'Article B', date: '2024-01-02', excerpt: '', tags: [] },
    ]
    mockGetAllArticleMetas.mockReturnValue(fakeArticles)
    render(<Home />)
    expect(screen.getByTestId('code-thinking')).toHaveAttribute('data-count', '2')
  })
})
