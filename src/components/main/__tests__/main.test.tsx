import React from 'react'
import { render, screen } from '@testing-library/react'
import Main from '@/components/main'

describe('Main', () => {
  it('renders children inside a <main> element', () => {
    render(
      <Main>
        <p>Test child</p>
      </Main>
    )
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('Test child')).toBeInTheDocument()
  })

  it('the main element has id="content"', () => {
    render(
      <Main>
        <span />
      </Main>
    )
    expect(screen.getByRole('main')).toHaveAttribute('id', 'content')
  })

  it('the main element has className="wrapper"', () => {
    render(
      <Main>
        <span />
      </Main>
    )
    expect(screen.getByRole('main')).toHaveClass('wrapper')
  })
})
