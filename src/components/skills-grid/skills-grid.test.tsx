import React from 'react'
import { render, screen } from '@testing-library/react'
import SkillsGrid from '@/components/skills-grid'

describe('SkillsGrid', () => {
  beforeEach(() => {
    render(<SkillsGrid />)
  })

  it('renders the "Skills & Technologies" heading', () => {
    expect(screen.getByRole('heading', { name: 'Skills & Technologies' })).toBeInTheDocument()
  })

  it('renders all 4 group labels', () => {
    expect(screen.getByRole('heading', { name: 'Languages' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Frameworks & Libraries' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tooling' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Practices' })).toBeInTheDocument()
  })

  it('renders a representative skill from each group', () => {
    expect(screen.getByText('Responsive Web Development')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Playwright/Cypress')).toBeInTheDocument()
    expect(screen.getByText('a11y')).toBeInTheDocument()
  })
})
