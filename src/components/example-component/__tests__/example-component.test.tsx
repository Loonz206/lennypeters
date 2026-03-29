import { render, screen } from '@testing-library/react'
import ExampleComponent from '../index'

describe('ExampleComponent', () => {
  it('renders the name prop as a heading', () => {
    render(<ExampleComponent name="Web Engineer" />)
    expect(screen.getByRole('heading', { name: 'Web Engineer' })).toBeInTheDocument()
  })
})
