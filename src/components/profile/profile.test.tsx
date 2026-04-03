import React from 'react'
import { render, screen } from '@testing-library/react'
import Profile from '@/components/profile'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (
    props: React.HTMLAttributes<HTMLElement> & {
      src?: string
      alt?: string
      fill?: boolean
      priority?: boolean
      sizes?: string
    }
  ) => {
    const { fill, priority, src, alt, ...imageProps } = props
    void fill
    void priority
    return <span role="img" aria-label={alt} data-src={src} {...imageProps} />
  },
}))

describe('Profile', () => {
  beforeEach(() => {
    render(<Profile />)
  })

  it('renders an image with src="/profile.jpg"', () => {
    expect(screen.getByRole('img')).toHaveAttribute('data-src', '/profile.jpg')
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
