import React from 'react'
import { render, screen } from '@testing-library/react'
import ContactSection from '@/components/contact-section'

describe('ContactSection', () => {
  beforeEach(() => {
    render(<ContactSection />)
  })

  it('renders the "Get In Touch" heading', () => {
    expect(screen.getByRole('heading', { name: 'Get In Touch' })).toBeInTheDocument()
  })

  it('email link has the correct href', () => {
    const link = screen.getByRole('link', { name: 'Send email to Lenny Peters' })
    expect(link).toHaveAttribute('href', 'mailto:lenny@lennypeters.com')
  })

  it('GitHub link has correct href, target="_blank", and rel="noopener noreferrer"', () => {
    const link = screen.getByRole('link', { name: 'GitHub profile (opens in new tab)' })
    expect(link).toHaveAttribute('href', 'https://github.com/loonz206')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('LinkedIn link has correct href, target="_blank", and rel="noopener noreferrer"', () => {
    const link = screen.getByRole('link', { name: 'LinkedIn profile (opens in new tab)' })
    expect(link).toHaveAttribute('href', 'https://linkedin.com/in/lennypeters')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
