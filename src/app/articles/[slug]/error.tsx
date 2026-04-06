'use client'

import { useEffect } from 'react'
import { notFound } from 'next/navigation'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ArticleError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to console for debugging in dev
    console.error('Article route error:', error.message)
  }, [error])

  // Check if this is a missing param error from static export (unknown article slug)
  if (error.message?.includes('is missing param')) {
    // Return 404 for unknown article slugs
    notFound()
  }

  // For other errors, show a generic error page with retry
  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui' }}>
      <h1>Something went wrong</h1>
      <p style={{ color: '#666' }}>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        Try again
      </button>
    </div>
  )
}
