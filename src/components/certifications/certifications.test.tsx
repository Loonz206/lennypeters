import React from 'react'
import { render, screen } from '@testing-library/react'
import Certifications from '@/components/certifications'

describe('Certifications', () => {
  beforeEach(() => {
    render(<Certifications />)
  })

  it('renders the "Certifications" heading', () => {
    expect(screen.getByRole('heading', { name: 'Certifications' })).toBeInTheDocument()
  })

  it('renders LinkedIn certification resources as links', () => {
    expect(
      screen.getByRole('link', { name: 'LinkedIn Profile on LinkedIn (opens in new tab)' })
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/lennypeters/')

    expect(
      screen.getByRole('link', { name: 'Licenses & Certifications on LinkedIn (opens in new tab)' })
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/lennypeters/details/certifications/')

    expect(
      screen.getByRole('link', { name: 'Skills Assessments on LinkedIn (opens in new tab)' })
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/lennypeters/details/skills/')
  })
})
