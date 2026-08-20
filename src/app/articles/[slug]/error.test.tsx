import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ArticleError from './error'
import { notFound } from 'next/navigation'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

const mockNotFound = notFound as jest.MockedFunction<typeof notFound>

describe('ArticleError', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls notFound() when the error is a missing-param error', () => {
    const error = new Error('generateStaticParams failed: params is missing param "slug"')

    expect(() => render(<ArticleError error={error} reset={jest.fn()} />)).toThrow('NEXT_NOT_FOUND')
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('renders the generic error heading and message for other errors', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    render(<ArticleError error={new Error('boom')} reset={jest.fn()} />)

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument()
    expect(screen.getByText('boom')).toBeInTheDocument()

    consoleErrorSpy.mockRestore()
  })

  it('calls reset() when the "Try again" button is clicked', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const reset = jest.fn()

    render(<ArticleError error={new Error('boom')} reset={reset} />)
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(reset).toHaveBeenCalledTimes(1)

    consoleErrorSpy.mockRestore()
  })
})
