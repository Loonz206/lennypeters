# Lenny Peters — Personal Portfolio

Personal portfolio site for [Lenny Peters](https://lennypeters.com), built with Next.js, React, TypeScript, and custom SCSS.

## Overview

This repository contains the source for a statically exported personal site featuring:

- a home page and supporting content pages
- a work section for selected projects
- long-form articles written in Markdown
- reusable components with colocated tests

## Stack

- Next.js 15 App Router
- React 19
- TypeScript
- SCSS with CSS Modules
- Jest and React Testing Library
- Playwright

## Project Structure

```text
src/
├── app/           # App Router pages
├── components/    # Reusable UI components
├── data/          # Static content and datasets
├── lib/           # Utilities and helpers
└── styles/        # Global SCSS partials
content/
└── articles/      # Markdown articles
```

## Notes

The site is statically exported and deployed through GitHub Actions.
