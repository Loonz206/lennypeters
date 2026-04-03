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

  it('renders exactly 2 ProjectCard mocks', () => {
    expect(screen.getAllByTestId('project-card')).toHaveLength(2)
  })

  it('renders the count display as "[02_TOTAL_ENTRIES]"', () => {
    expect(screen.getByText('[02_TOTAL_ENTRIES]')).toBeInTheDocument()
  })

  it('renders both project titles', () => {
    expect(screen.getByText('Telemetry UI Framework')).toBeInTheDocument()
    expect(screen.getByText('AI Pipeline Orchestrator')).toBeInTheDocument()
  })
})
