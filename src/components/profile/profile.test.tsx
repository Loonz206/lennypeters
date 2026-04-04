import React from 'react'
import { render, screen } from '@testing-library/react'
import Profile from '@/components/profile'

describe('Profile', () => {
  beforeEach(() => {
    render(<Profile />)
  })

  it('renders an image from Unsplash', () => {
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src')
    expect(decodeURIComponent(image.getAttribute('src') ?? '')).toContain(
      'https://images.unsplash.com/'
    )
  })

  it('image has alt="Lenny Peters"', () => {
    expect(screen.getByRole('img', { name: 'Lenny Peters' })).toBeInTheDocument()
  })

  it('image is rendered by the Profile component', () => {
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('aside has aria-label="Profile summary"', () => {
    expect(screen.getByRole('complementary', { name: 'Profile summary' })).toBeInTheDocument()
  })
})
