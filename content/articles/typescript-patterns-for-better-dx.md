---
title: 'TypeScript Patterns for Better DX'
date: '2025-03-11'
excerpt: 'TypeScript can feel like overhead until it saves you from a production bug. These patterns maximise the benefits while keeping your code readable and concise.'
tags: ['TypeScript', 'Developer Experience']
image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80'
imageAlt: 'Code editor open on a monitor in a developer workspace'
---

TypeScript's value compounds over time. Early in a project it can feel like friction;
six months in, when it catches a breaking API change before it reaches users, it pays for itself.

## Discriminated unions for state

Model loading states explicitly rather than as a bag of optional fields.

```ts
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
```

## Const assertions for immutable data

Mark configuration objects and lookup tables as `as const` to get the narrowest possible types.

```ts
const ROLES = ['admin', 'editor', 'viewer'] as const
type Role = (typeof ROLES)[number] // 'admin' | 'editor' | 'viewer'
```

## Prefer interfaces for public APIs

Use `interface` for props and public contracts — they produce cleaner error messages and
support declaration merging. Use `type` for unions, intersections, and mapped types.

## Template literal types

TypeScript 4.1+ template literal types unlock expressive, type-safe string manipulation.

```ts
type EventName = `on${Capitalize<string>}`
```
