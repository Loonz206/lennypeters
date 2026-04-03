import React from 'react'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/footer'

describe('Footer', () => {
  let getFullYearSpy: jest.SpyInstance

  beforeEach(() => {
    getFullYearSpy = jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2030)
  })

  afterEach(() => {
    getFullYearSpy.mockRestore()
  })

  it('renders the copyright text with the mocked year', () => {
    render(<Footer />)
    expect(screen.getByText('© 2016 – 2030 LENNY.PETERS')).toBeInTheDocument()
  })

  it('renders "SYS.LOG"', () => {
    render(<Footer />)
    expect(screen.getByText('SYS.LOG')).toBeInTheDocument()
  })

  it('renders "BUILD: STABLE"', () => {
    render(<Footer />)
    expect(screen.getByText('BUILD: STABLE')).toBeInTheDocument()
  })
})
