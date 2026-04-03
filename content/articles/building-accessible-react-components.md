---
title: 'Building Accessible React Components'
date: '2025-11-14'
excerpt: 'Accessibility is not an afterthought — it is a fundamental part of good engineering. This article walks through practical patterns for writing React components that work for everyone.'
tags: ['React', 'Accessibility', 'TypeScript']
image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1600&q=80'
imageAlt: 'Developer working at a laptop with assistive devices nearby'
---

Accessibility (a11y) is one of the most impactful things you can invest in as a front-end engineer.
When done well, it benefits users who rely on assistive technology, keyboard-only users, and anyone
operating in a low-bandwidth or noisy environment.

## Semantic HTML first

The single most effective thing you can do is reach for the right HTML element before you reach for ARIA.
A `<button>` element is focusable, activatable via keyboard, and announces its role to screen readers
without any extra attributes.

```tsx
// ✅ Good
<button onClick={handleSave}>Save</button>

// ❌ Avoid
<div onClick={handleSave} role="button" tabIndex={0}>Save</div>
```

## Visible focus indicators

Never suppress focus outlines without providing an equally visible replacement.
Users who navigate via keyboard depend on knowing where focus currently lives.

## Labelling interactive elements

Every interactive control must have an accessible name.
For inputs, use `<label>`. For icon-only buttons, use `aria-label`.

```tsx
<button aria-label="Close modal">
  <CloseIcon aria-hidden="true" />
</button>
```

## Testing your work

Run automated checks with axe-core, but remember that automated tooling catches only ~30% of accessibility issues.
Manual keyboard navigation and a quick screen reader test (VoiceOver on macOS, NVDA on Windows) are essential.

## References

1. [W3C — Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)
2. [W3C WAI — ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
3. [Deque Systems — axe-core (automated accessibility testing engine)](https://github.com/dequelabs/axe-core)
4. [WebAIM — Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
