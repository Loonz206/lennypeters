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

  it('renders all 5 skills as uppercase text', () => {
    expect(screen.getByText('NEXT.JS')).toBeInTheDocument()
    expect(screen.getByText('REACT')).toBeInTheDocument()
    expect(screen.getByText('TYPESCRIPT')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('PLAYWRIGHT')).toBeInTheDocument()
  })

  it('renders exactly 5 list items', () => {
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })
})
