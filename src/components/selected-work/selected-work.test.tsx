import React from 'react'
import { render, screen } from '@testing-library/react'
import SelectedWork from '@/components/selected-work'

jest.mock('../project-card', () => ({
  __esModule: true,
  default: ({ project }: { project: { title: string } }) => (
    <div data-testid="project-card">{project.title}</div>
  ),
}))

describe('SelectedWork', () => {
  beforeEach(() => {
    render(<SelectedWork />)
  })

  it('renders the "SELECTED_WORK" heading', () => {
    expect(screen.getByRole('heading', { name: 'SELECTED_WORK' })).toBeInTheDocument()
  })

  it('renders exactly 3 ProjectCard mocks', () => {
    expect(screen.getAllByTestId('project-card')).toHaveLength(3)
  })

  it('renders the count display as "[03_TOTAL_ENTRIES]"', () => {
    expect(screen.getByText('[03_TOTAL_ENTRIES]')).toBeInTheDocument()
  })

  it('renders all project titles', () => {
    expect(screen.getByText('videos-hooks')).toBeInTheDocument()
    expect(screen.getByText('lennypeters')).toBeInTheDocument()
    expect(screen.getByText('the-next-ferry')).toBeInTheDocument()
  })
})
