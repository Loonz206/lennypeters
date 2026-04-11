import React from 'react'
import { render, screen } from '@testing-library/react'
import ProjectCard from './index'
import type { Project } from '@/data/projects'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

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

const projectWithoutImage: Project = {
  id: 'PRJ_001',
  title: 'Test Project',
  description: 'A test project',
  tags: ['React', 'TypeScript'],
  buttonLabel: 'View Project',
  href: '/project',
}

const projectWithImage: Project = {
  ...projectWithoutImage,
  image: '/test-image.jpg',
}

describe('ProjectCard', () => {
  it('renders project title, description, and id', () => {
    render(<ProjectCard project={projectWithoutImage} />)
    expect(screen.getByRole('heading', { name: 'Test Project', level: 3 })).toBeInTheDocument()
    expect(screen.getByText('A test project')).toBeInTheDocument()
    expect(screen.getByText('PRJ_001')).toBeInTheDocument()
  })

  it('renders all tags in the Technologies list', () => {
    render(<ProjectCard project={projectWithoutImage} />)
    const techList = screen.getByRole('list', { name: 'Technologies' })
    expect(techList).toBeInTheDocument()
    expect(screen.getByText('REACT')).toBeInTheDocument()
    expect(screen.getByText('TYPESCRIPT')).toBeInTheDocument()
  })

  it('link has correct href and button label text', () => {
    render(<ProjectCard project={projectWithoutImage} />)
    const link = screen.getByRole('link', { name: 'View Project' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/project')
  })

  it('renders image role with correct src when image is provided', () => {
    render(<ProjectCard project={projectWithImage} />)
    const img = screen.getByRole('img', { name: 'Test Project' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('data-src', '/test-image.jpg')
  })

  it('does not render an image role when image is absent', () => {
    render(<ProjectCard project={projectWithoutImage} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders title as an h3 heading', () => {
    render(<ProjectCard project={projectWithoutImage} />)
    expect(screen.getByRole('heading', { name: 'Test Project', level: 3 })).toBeInTheDocument()
  })

  it('does not render title as a link', () => {
    render(<ProjectCard project={projectWithoutImage} />)
    expect(screen.queryByRole('link', { name: 'Test Project' })).not.toBeInTheDocument()
  })
})
