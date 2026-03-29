"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";

interface NavLinkProps {
  readonly href: string;
  readonly children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href;

  return (
    <Link href={href} className={isActive ? "active-link" : ""}>{children}</Link>
  )
}

const Header = () => {
  return (
    <header role="banner">
      <div className="navbar wrapper">
      <h2>
        <Link href="/">Lenny Peters</Link>
      </h2>
      <nav>
        <ul>
          <li><NavLink href="/">Home</NavLink></li>
          <li><NavLink href="/about">About</NavLink></li>
          <li><NavLink href="/articles">Articles</NavLink></li>
        </ul>
      </nav>
      </div>
    </header>
  )
}

export default Header;
