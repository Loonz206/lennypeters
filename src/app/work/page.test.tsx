import React from 'react'
import { render, screen } from '@testing-library/react'
import WorkPage, { metadata } from './page'

describe('Work page', () => {
  it('renders the "Projects" heading', () => {
    render(<WorkPage />)
    expect(screen.getByRole('heading', { name: 'Projects', level: 1 })).toBeInTheDocument()
  })

  it('renders all project titles as h2 headings', () => {
    render(<WorkPage />)
    expect(screen.getByRole('heading', { name: 'videos-hooks', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'lennypeters', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'the-next-ferry', level: 2 })).toBeInTheDocument()
  })

  it('renders all project IDs', () => {
    render(<WorkPage />)
    expect(screen.getByText('PRJ_001')).toBeInTheDocument()
    expect(screen.getByText('PRJ_002')).toBeInTheDocument()
    expect(screen.getByText('PRJ_003')).toBeInTheDocument()
  })

  it('renders zero-padded index labels _01, _02, and _03', () => {
    render(<WorkPage />)
    expect(screen.getByText('_01')).toBeInTheDocument()
    expect(screen.getByText('_02')).toBeInTheDocument()
    expect(screen.getByText('_03')).toBeInTheDocument()
  })

  it('renders the tags for the first project', () => {
    render(<WorkPage />)
    const tagsList = screen.getAllByRole('list', { name: 'Technologies' })
    const firstProjectTags = tagsList[0]
    expect(firstProjectTags).toHaveTextContent('REACT')
    expect(firstProjectTags).toHaveTextContent('HOOKS')
    expect(firstProjectTags).toHaveTextContent('STATE')
    expect(firstProjectTags).toHaveTextContent('API')
  })

  it('renders project titles as links to project repositories', () => {
    render(<WorkPage />)
    const firstProjectLink = screen.getByRole('link', { name: 'videos-hooks' })
    const secondProjectLink = screen.getByRole('link', { name: 'lennypeters' })
    const thirdProjectLink = screen.getByRole('link', { name: 'the-next-ferry' })

    expect(firstProjectLink).toHaveAttribute('href', 'https://github.com/Loonz206/videos-hooks')
    expect(secondProjectLink).toHaveAttribute('href', 'https://github.com/Loonz206/lennypeters')
    expect(thirdProjectLink).toHaveAttribute('href', 'https://github.com/Loonz206/the-next-ferry')
    expect(firstProjectLink).toHaveAttribute('target', '_blank')
    expect(firstProjectLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('exports correct metadata title', () => {
    expect(metadata.title).toBe('Work — Lenny Peters')
  })

  it('exports metadata description containing "Lenny Peters"', () => {
    expect(metadata.description).toContain('Lenny Peters')
  })
})
