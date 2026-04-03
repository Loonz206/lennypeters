---
title: 'Server Components and the Future of React'
date: '2025-09-02'
excerpt: 'React Server Components change the mental model of data fetching. Here is what that means for how we structure applications in 2025 and beyond.'
tags: ['React', 'Next.js', 'Performance']
---

React Server Components (RSC) represent the most significant shift in React architecture since hooks.
With Next.js 15 and the App Router, Server Components are now the default — and understanding the model
is essential for writing performant, maintainable applications.

## What makes a Server Component different?

Server Components render exclusively on the server. They can be async, they can query databases directly,
and they ship zero JavaScript to the client by default.

```tsx
// This runs only on the server — no client JS shipped
async function ArticleList() {
  const articles = await db.articles.findMany()
  return (
    <ul>
      {articles.map(a => (
        <li key={a.id}>{a.title}</li>
      ))}
    </ul>
  )
}
```

## When to use "use client"

Reach for Client Components only when you need:

- Browser APIs (`window`, `document`, `localStorage`)
- React hooks (`useState`, `useEffect`, event handlers)
- Third-party libraries that depend on the DOM

Push interactivity to the leaves of the component tree, keeping as much as possible on the server.

## Streaming and Suspense

Combine Server Components with `<Suspense>` boundaries to stream HTML progressively.
This gives users content faster while slow data sources are still resolving.
