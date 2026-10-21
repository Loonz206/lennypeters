import { render, screen } from '@testing-library/react'
import AboutPage, { metadata } from './page'

jest.mock('../../components/skills-grid', () => ({
  __esModule: true,
  default: () => <div data-testid="skills-grid" />,
}))

jest.mock('../../components/experience-timeline', () => ({
  __esModule: true,
  default: () => <div data-testid="experience-timeline" />,
}))

jest.mock('../../components/certifications', () => ({
  __esModule: true,
  default: () => <div data-testid="certifications" />,
}))

jest.mock('../../components/contact-section', () => ({
  __esModule: true,
  default: () => <div data-testid="contact-section" />,
}))

describe('About page', () => {
  const previousBasePath = process.env.NEXT_PUBLIC_BASE_PATH

  afterEach(() => {
    if (previousBasePath === undefined) {
      delete process.env.NEXT_PUBLIC_BASE_PATH
      return
    }

    process.env.NEXT_PUBLIC_BASE_PATH = previousBasePath
  })

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

  it('renders Certifications', () => {
    render(<AboutPage />)
    expect(screen.getByTestId('certifications')).toBeInTheDocument()
  })

  it('renders ContactSection', () => {
    render(<AboutPage />)
    expect(screen.getByTestId('contact-section')).toBeInTheDocument()
  })

  it('renders the profile photo beside the intro copy', () => {
    render(<AboutPage />)
    expect(screen.getByRole('img', { name: 'Lenny Peters' })).toBeInTheDocument()
  })

  it('prefixes the profile image src with NEXT_PUBLIC_BASE_PATH when set', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = '/lennypeters'
    render(<AboutPage />)

    const image = screen.getByRole('img', { name: 'Lenny Peters' })
    expect(decodeURIComponent(image.getAttribute('src') ?? '')).toContain('/lennypeters/lenny.jpeg')
  })

  it('exports correct metadata title', () => {
    expect(metadata.title).toBe('About — Lenny Peters')
  })

  it('exports metadata description containing "lululemon"', () => {
    expect(metadata.description).toContain('lululemon')
  })
})
