import React from 'react'
import { render, screen } from '@testing-library/react'
import AboutPage, { metadata } from '../page'

jest.mock('../../../components/skills-grid', () => ({
  __esModule: true,
  default: () => <div data-testid="skills-grid" />,
}))

jest.mock('../../../components/experience-timeline', () => ({
  __esModule: true,
  default: () => <div data-testid="experience-timeline" />,
}))

jest.mock('../../../components/contact-section', () => ({
  __esModule: true,
  default: () => <div data-testid="contact-section" />,
}))

describe('About page', () => {
  it('renders the "About Me" heading', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { name: 'About Me', level: 1 })).toBeInTheDocument()
  })

  it('renders SkillsGrid', () => {
    render(<AboutPage />)
    expect(screen.getByTestId('skills-grid')).toBeInTheDocument()
  })

  it('renders ExperienceTimeline', () => {
    render(<AboutPage />)
    expect(screen.getByTestId('experience-timeline')).toBeInTheDocument()
  })

  it('renders ContactSection', () => {
    render(<AboutPage />)
    expect(screen.getByTestId('contact-section')).toBeInTheDocument()
  })

  it('exports correct metadata title', () => {
    expect(metadata.title).toBe('About — Lenny Peters')
  })

  it('exports metadata description containing "lululemon"', () => {
    expect(metadata.description).toContain('lululemon')
  })
})
