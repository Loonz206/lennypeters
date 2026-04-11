import React from 'react'
import { render, screen } from '@testing-library/react'
import WorkPage, { metadata } from './page'

describe('Work page', () => {
  it('renders the "Projects" heading', () => {
    render(<WorkPage />)
    expect(screen.getByRole('heading', { name: 'Projects', level: 1 })).toBeInTheDocument()
  })

  it('renders both project titles as h2 headings', () => {
    render(<WorkPage />)
    expect(screen.getByRole('heading', { name: 'videos-hooks', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'lennypeters', level: 2 })).toBeInTheDocument()
  })

  it('renders both project IDs', () => {
    render(<WorkPage />)
    expect(screen.getByText('PRJ_001')).toBeInTheDocument()
    expect(screen.getByText('PRJ_002')).toBeInTheDocument()
  })

  it('renders zero-padded index labels _01 and _02', () => {
    render(<WorkPage />)
    expect(screen.getByText('_01')).toBeInTheDocument()
    expect(screen.getByText('_02')).toBeInTheDocument()
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

    expect(firstProjectLink).toHaveAttribute('href', 'https://github.com/Loonz206/videos-hooks')
    expect(secondProjectLink).toHaveAttribute('href', 'https://github.com/Loonz206/lennypeters')
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
