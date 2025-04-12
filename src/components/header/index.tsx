import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header role="banner">
      <div className="navbar">
      <h2>
        <Link href="/">BrandName</Link>
      </h2>
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/blog">Blog</Link></li>
        </ul>
      </nav>
      </div>
    </header>
  )
}

export default Header;
