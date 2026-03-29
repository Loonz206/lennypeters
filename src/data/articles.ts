export interface Article {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  body: string;
}

export const articles: Article[] = [
  {
    slug: 'building-accessible-react-components',
    title: 'Building Accessible React Components',
    date: '2025-11-14',
    excerpt:
      'Accessibility is not an afterthought — it is a fundamental part of good engineering. This article walks through practical patterns for writing React components that work for everyone.',
    tags: ['React', 'Accessibility', 'TypeScript'],
    body: `
Accessibility (a11y) is one of the most impactful things you can invest in as a front-end engineer.
When done well, it benefits users who rely on assistive technology, keyboard-only users, and anyone
operating in a low-bandwidth or noisy environment.

## Semantic HTML first

The single most effective thing you can do is reach for the right HTML element before you reach for ARIA.
A \`<button>\` element is focusable, activatable via keyboard, and announces its role to screen readers
without any extra attributes.

\`\`\`tsx
// ✅ Good
<button onClick={handleSave}>Save</button>

// ❌ Avoid
<div onClick={handleSave} role="button" tabIndex={0}>Save</div>
\`\`\`

## Visible focus indicators

Never suppress focus outlines without providing an equally visible replacement.
Users who navigate via keyboard depend on knowing where focus currently lives.

## Labelling interactive elements

Every interactive control must have an accessible name.
For inputs, use \`<label>\`. For icon-only buttons, use \`aria-label\`.

\`\`\`tsx
<button aria-label="Close modal">
  <CloseIcon aria-hidden="true" />
</button>
\`\`\`

## Testing your work

Run automated checks with axe-core, but remember that automated tooling catches only ~30% of accessibility issues.
Manual keyboard navigation and a quick screen reader test (VoiceOver on macOS, NVDA on Windows) are essential.
    `.trim(),
  },
  {
    slug: 'server-components-and-the-future-of-react',
    title: 'Server Components and the Future of React',
    date: '2025-09-02',
    excerpt:
      'React Server Components change the mental model of data fetching. Here is what that means for how we structure applications in 2025 and beyond.',
    tags: ['React', 'Next.js', 'Performance'],
    body: `
React Server Components (RSC) represent the most significant shift in React architecture since hooks.
With Next.js 15 and the App Router, Server Components are now the default — and understanding the model
is essential for writing performant, maintainable applications.

## What makes a Server Component different?

Server Components render exclusively on the server. They can be async, they can query databases directly,
and they ship zero JavaScript to the client by default.

\`\`\`tsx
// This runs only on the server — no client JS shipped
async function ArticleList() {
  const articles = await db.articles.findMany();
  return (
    <ul>
      {articles.map(a => <li key={a.id}>{a.title}</li>)}
    </ul>
  );
}
\`\`\`

## When to use "use client"

Reach for Client Components only when you need:
- Browser APIs (\`window\`, \`document\`, \`localStorage\`)
- React hooks (\`useState\`, \`useEffect\`, event handlers)
- Third-party libraries that depend on the DOM

Push interactivity to the leaves of the component tree, keeping as much as possible on the server.

## Streaming and Suspense

Combine Server Components with \`<Suspense>\` boundaries to stream HTML progressively.
This gives users content faster while slow data sources are still resolving.
    `.trim(),
  },
  {
    slug: 'css-architecture-at-scale',
    title: 'CSS Architecture at Scale',
    date: '2025-06-20',
    excerpt:
      'As applications grow, CSS becomes a source of bugs and confusion. This article explores SCSS architecture patterns that keep stylesheets manageable at any team size.',
    tags: ['CSS', 'SCSS', 'Architecture'],
    body: `
Good CSS architecture is invisible — stylesheets that are easy to read, predictable to change, and
impossible to accidentally break are the hallmark of a mature codebase.

## Design tokens as variables

Define your full colour palette, spacing scale, and type ramp as SCSS variables in one place.
Every other file references those variables — never hard-coded values.

\`\`\`scss
$primaryColor: #2980b9;
$spacingUnit: 8px;
\`\`\`

## CSS Modules for component isolation

CSS Modules scope class names to their component automatically, eliminating the risk of
accidental global pollution. Pair them with a naming convention like BEM for readable selectors.

\`\`\`scss
// article-card.module.scss
.card { ... }
.card__title { ... }
.card__meta { ... }
\`\`\`

## Global styles for shared utilities

Reserve global stylesheets for:
- CSS reset / normalize
- Typography scale
- Layout utilities (wrapper, grid)
- Design token variables

Everything else belongs in a CSS Module.

## Responsive design with mixins

Centralise media queries in a single responsive mixin.
This prevents magic numbers from spreading across the codebase.
    `.trim(),
  },
  {
    slug: 'typescript-patterns-for-better-dx',
    title: 'TypeScript Patterns for Better DX',
    date: '2025-03-11',
    excerpt:
      'TypeScript can feel like overhead until it saves you from a production bug. These patterns maximise the benefits while keeping your code readable and concise.',
    tags: ['TypeScript', 'Developer Experience'],
    body: `
TypeScript's value compounds over time. Early in a project it can feel like friction;
six months in, when it catches a breaking API change before it reaches users, it pays for itself.

## Discriminated unions for state

Model loading states explicitly rather than as a bag of optional fields.

\`\`\`ts
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
\`\`\`

## Const assertions for immutable data

Mark configuration objects and lookup tables as \`as const\` to get the narrowest possible types.

\`\`\`ts
const ROLES = ['admin', 'editor', 'viewer'] as const;
type Role = typeof ROLES[number]; // 'admin' | 'editor' | 'viewer'
\`\`\`

## Prefer interfaces for public APIs

Use \`interface\` for props and public contracts — they produce cleaner error messages and
support declaration merging. Use \`type\` for unions, intersections, and mapped types.

## Template literal types

TypeScript 4.1+ template literal types unlock expressive, type-safe string manipulation.

\`\`\`ts
type EventName = \`on\${Capitalize<string>}\`;
\`\`\`
    `.trim(),
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}

export function getFeaturedArticles(count = 3): Article[] {
  return articles.slice(0, count);
}
