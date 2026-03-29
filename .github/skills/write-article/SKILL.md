---
name: write-article
description: >
  Researches a topic across multiple sources and writes a complete technical article
  as a markdown file in content/articles/. Uses the internet-research skill for
  live documentation, then drafts in a Senior Engineer voice with citations.
  Invoke inline with /write-article in any prompt.
---

# Write Article Skill

Use this skill to generate a fully-formed technical article from a topic description. The output is a publish-ready `.md` file in `content/articles/` with YAML frontmatter matching the `ArticleMeta` schema in `src/lib/articles.ts`.

## When to use this skill

- The user asks you to write, draft, or generate a technical article.
- A GitHub Issue with an `article` label triggers automated article creation.
- The user provides a topic and asks for a blog post.

## Article Schema

Every article file must live at `content/articles/{slug}.md` and include this frontmatter:

```yaml
---
title: "Article Title Here"
date: "YYYY-MM-DD"
excerpt: "A one- or two-sentence summary for card previews."
tags: ["Tag1", "Tag2", "Tag3"]
---
```

- **slug**: derived from the filename (kebab-case, no `.md` extension)
- **title**: sentence-case, descriptive, 6–12 words
- **date**: ISO date string, use today's date
- **excerpt**: 1–2 sentences, under 200 characters
- **tags**: 2–5 technology/topic tags

## Workflow

### 1. Parse the topic

Extract from the user prompt or issue body:
- **Topic**: the core subject
- **Angle** (optional): specific perspective or subtopic
- **Target audience** (default: Senior engineers)
- **Tags** (optional): technology tags to apply

### 2. Research

Use the `/internet-research` skill to gather current, accurate information:

1. Identify 3–4 authoritative sources for the topic:
   - Official documentation (via Context7 `resolve-library-id` → `get-library-docs`)
   - Engineering blogs from reputable companies
   - Conference talks or RFCs
   - Relevant GitHub repos or discussions

2. For each source, note:
   - Key facts, API signatures, or patterns
   - Version-specific behaviour
   - Common pitfalls or misconceptions

3. Compile a source list for the References section.

### 3. Outline

Generate a structured outline before writing:

```
## Introduction
- Hook + context
- What the reader will learn

## Section 1: [Core Concept]
- Explanation
- Code example

## Section 2: [Practical Application]
- Real-world scenario
- Complete code example

## Section 3: [Advanced Patterns / Gotchas]
- Edge cases
- Performance considerations
- Common mistakes

## Conclusion
- Key takeaways
- When to apply this knowledge

## References
- Numbered source list
```

### 4. Draft

Write the article following these rules:

**Voice & Tone:**
- Senior Engineer perspective: confident, opinionated but fair, practical over theoretical
- First person singular: "I've found...", "In my experience...", "Here's what I recommend..."
- Direct and concise — no filler, no hedging without reason
- Assume the reader is a competent developer, not a beginner

**Content Rules:**
- Every code example must be complete and runnable — never use pseudo-code or `// ...` elisions
- Code blocks must specify the language: ` ```tsx `, ` ```scss `, ` ```bash `, etc.
- Every major claim or recommendation cites a source: `[1]`, `[2]`, etc.
- Include at least one "real-world" example showing the pattern in context
- Address at least one common pitfall or misconception
- Keep total length between 800–1500 words (excluding code blocks)

**Markdown Rules:**
- Use `##` for main sections, `###` for subsections — never `#` (the title comes from frontmatter)
- Use fenced code blocks with language identifiers
- Use `>` blockquotes for callouts or important notes
- Use numbered lists (`1.`) for sequential steps, bullet lists (`-`) for unordered items
- Use `**bold**` sparingly for emphasis, `*italic*` for terms being defined

### 5. Write the file

Save to `content/articles/{slug}.md` where `{slug}` is derived from the title:
- Lowercase
- Replace spaces with hyphens
- Remove special characters
- Keep it under 60 characters

### 6. Validate

After creating the file, verify:
- [ ] Frontmatter has all required fields: `title`, `date`, `excerpt`, `tags`
- [ ] `date` is a valid ISO date string
- [ ] `tags` is an array of strings
- [ ] `excerpt` is under 200 characters
- [ ] All code blocks have language identifiers
- [ ] All citation markers `[N]` have corresponding entries in References
- [ ] The file is valid markdown (no broken syntax)

## Example Output

```markdown
---
title: "React Server Components Streaming Patterns"
date: "2025-07-10"
excerpt: "Practical streaming patterns for React Server Components that improve perceived performance without sacrificing DX."
tags: ["React", "Server Components", "Performance", "Next.js"]
---

## Introduction

React Server Components changed how I think about data fetching...

## Streaming with Suspense Boundaries

The key insight is...

```tsx
export default async function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Suspense fallback={<MetricsSkeleton />}>
        <Metrics />
      </Suspense>
    </main>
  );
}
```

...

## References

1. [React Server Components RFC](https://github.com/reactjs/rfcs/pull/188)
2. [Next.js Streaming Documentation](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
```
