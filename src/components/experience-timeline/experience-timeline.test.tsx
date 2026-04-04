import React from 'react'
import { render, screen } from '@testing-library/react'
import ExperienceTimeline from './index'
import { experience } from '@/data/experience'

describe('ExperienceTimeline', () => {
  it('renders the "Experience" heading', () => {
    render(<ExperienceTimeline />)
    expect(screen.getByRole('heading', { name: 'Experience', level: 2 })).toBeInTheDocument()
  })

  it('renders all 3 roles as headings', () => {
    render(<ExperienceTimeline />)
    expect(
      screen.getByRole('heading', { name: 'Senior Software Engineer 2', level: 3 })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Front-End UI Developer', level: 3 })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Web Designer', level: 3 })).toBeInTheDocument()
  })

  it('the "Present" entry shows "Present" in the date range text', () => {
    render(<ExperienceTimeline />)
    // The first entry has endDate: 'Present'
    const dateText = screen.getAllByText(/Present/)
    expect(dateText.length).toBeGreaterThan(0)
  })

  it('renders all company names', () => {
    render(<ExperienceTimeline />)
    expect(screen.getByText(/lululemon/)).toBeInTheDocument()
    expect(screen.getByText(/Holland America Line/)).toBeInTheDocument()
    expect(screen.getByText(/Seamonster Studios/)).toBeInTheDocument()
  })

  it("first entry's highlights list is non-empty", () => {
    render(<ExperienceTimeline />)
    const firstEntryHighlight = experience[0].highlights[0]
    expect(screen.getByText(firstEntryHighlight)).toBeInTheDocument()
  })

  it('ordered list has aria-label="Work history"', () => {
    render(<ExperienceTimeline />)
    expect(screen.getByRole('list', { name: 'Work history' })).toBeInTheDocument()
  })
})
