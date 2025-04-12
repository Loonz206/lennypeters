import React from 'react';

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main id="content">
      {children}
    </main>
  )
};

export default Main;
