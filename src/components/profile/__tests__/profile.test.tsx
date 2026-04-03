import React from 'react'
import { render, screen } from '@testing-library/react'
import Profile from '@/components/profile'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & {
      fill?: boolean
      priority?: boolean
      sizes?: string
    }
  ) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('Profile', () => {
  beforeEach(() => {
    render(<Profile />)
  })

  it('renders an image with src="/profile.jpg"', () => {
    expect(screen.getByRole('img')).toHaveAttribute('src', '/profile.jpg')
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
