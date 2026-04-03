import React from 'react'
import { render, screen } from '@testing-library/react'
import ExpertiseList from '@/components/expertise-list'

describe('ExpertiseList', () => {
  beforeEach(() => {
    render(<ExpertiseList />)
  })

  it('renders the "Expertise" heading', () => {
    expect(screen.getByRole('heading', { name: 'Expertise' })).toBeInTheDocument()
  })

  it('renders all 4 skills as uppercase text', () => {
    expect(screen.getByText('TYPESCRIPT')).toBeInTheDocument()
    expect(screen.getByText('NEXT.JS')).toBeInTheDocument()
    expect(screen.getByText('REACT')).toBeInTheDocument()
    expect(screen.getByText('PYTHON')).toBeInTheDocument()
  })

  it('renders exactly 4 list items', () => {
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })
})
