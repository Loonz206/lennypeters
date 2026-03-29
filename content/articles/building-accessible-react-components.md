---
title: "Building Accessible React Components"
date: "2025-11-14"
excerpt: "Accessibility is not an afterthought — it is a fundamental part of good engineering. This article walks through practical patterns for writing React components that work for everyone."
tags: ["React", "Accessibility", "TypeScript"]
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
