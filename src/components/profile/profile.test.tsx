import React from 'react'
import { render, screen } from '@testing-library/react'
import Profile from '@/components/profile'

describe('Profile', () => {
  const previousBasePath = process.env.NEXT_PUBLIC_BASE_PATH

  afterEach(() => {
    if (previousBasePath === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_PATH
      return
    }

    process.env.NEXT_PUBLIC_BASE_PATH = previousBasePath
  })

  it('renders the local profile image', () => {
    render(<Profile />)
    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src')
    expect(decodeURIComponent(image.getAttribute('src') ?? '')).toContain('/lenny.jpeg')
  })

  it('prefixes the image src with NEXT_PUBLIC_BASE_PATH when set', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/lennypeters'
    render(<Profile />)

    const image = screen.getByRole('img', { name: 'Lenny Peters' })
    expect(decodeURIComponent(image.getAttribute('src') ?? '')).toContain('/lennypeters/lenny.jpeg')
  })

  it('image has alt="Lenny Peters"', () => {
    render(<Profile />)
    expect(screen.getByRole('img', { name: 'Lenny Peters' })).toBeInTheDocument()
  })

  it('image is rendered by the Profile component', () => {
    render(<Profile />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('aside has aria-label="Profile summary"', () => {
    render(<Profile />)
    expect(screen.getByRole('complementary', { name: 'Profile summary' })).toBeInTheDocument()
  })
})
