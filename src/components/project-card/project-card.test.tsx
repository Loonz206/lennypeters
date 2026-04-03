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
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('link has correct href and button label text', () => {
    render(<ProjectCard project={projectWithoutImage} />)
    const link = screen.getByRole('link', { name: 'View Project' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/project')
  })

  it('renders img element with correct src when image is provided', () => {
    render(<ProjectCard project={projectWithImage} />)
    const img = screen.getByRole('img', { name: 'Test Project' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test-image.jpg')
  })

  it('does not render an img element when image is absent', () => {
    render(<ProjectCard project={projectWithoutImage} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders title as an h3 heading', () => {
    render(<ProjectCard project={projectWithoutImage} />)
    expect(screen.getByRole('heading', { name: 'Test Project', level: 3 })).toBeInTheDocument()
  })
})
