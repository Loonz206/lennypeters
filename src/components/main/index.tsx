import React from 'react'

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main id="content" className="wrapper">
      {children}
    </main>
  )
}

export default Main
