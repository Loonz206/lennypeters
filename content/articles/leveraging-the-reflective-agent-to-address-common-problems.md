---
title: 'Leveraging the Reflective Agent to Address Common Problems'
date: '2026-04-03'
excerpt: 'How a persistent memory file and a 3-strike rule system stops AI agents from repeating the same mistakes across every task in your pipeline.'
tags: ['AI', 'Learnings', 'Memory', 'Agents']
image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1600&q=80'
imageAlt: 'Abstract neural network visualization with glowing nodes and connecting lines'
---

## Introduction

Every team that runs AI agents at scale hits the same wall. An agent fails on a lint rule, you fix the prompt, it works. Two weeks later a different agent fails on the same lint rule, you fix the prompt again. A month after that, it happens a third time. You have spent engineering time re-solving the same problem three times, and the system has learned nothing.

This is not a prompt quality problem. It is a memory architecture problem.

The solution I have landed on is a persistent feedback loop: a shared learnings file that every agent reads before starting a task, a structured failure log, and a Reflective Agent that closes the loop by extracting actionable rules from repeated failures.[1] The mechanism is simple, but the effect compounds. After a few weeks, agents stop re-learning things the system already knows.

This article walks through the full architecture and shows a concrete worked example of a failure becoming a rule.

## Why agents repeat mistakes

Most agents are stateless by default. Each task starts from scratch: a system prompt, a user prompt, and whatever context you pass explicitly. Nothing carries forward from the previous run.[2]

That is fine for isolated, one-shot tasks. It is a serious problem for continuous pipelines where the same agent roles execute dozens of times per week. Without persistent memory, there is no accumulation of knowledge and no way to prevent regression.

Research on LLM self-refinement confirms the intuition: models improve when they have access to structured feedback from prior attempts, but that improvement evaporates if the feedback is not persisted across sessions.[3]

> The problem is not that agents make mistakes. The problem is that they make the same mistakes repeatedly because nothing writes the lesson down.

## The memory layer: AGENT_LEARNINGS.md

The solution is a single canonical file that every agent treats as a required pre-read. In this repository it lives at `.github/AGENT_LEARNINGS.md` and has three sections:

- **Active Rules** — generalized, actionable rules extracted from repeated failures
- **Failure Log** — individual failure occurrences tracked by category and count
- **Resolved Rules** — retired rules auto-purged after 30 days

The file is not a debug log or a changelog. It is a machine-readable policy document. The schema is deliberately minimal so agents can scan it quickly and apply only the rules relevant to their current task category.

```markdown
## Active Rules

| ID   | Category              | Rule                                                                 | Source Failures | Added      |
| ---- | --------------------- | -------------------------------------------------------------------- | --------------- | ---------- |
| L001 | test:next-image-props | Always pass `width` and `height` as numbers to next/image, never as  | F003, F007,     | 2026-03-15 |
|      |                       | strings or booleans; the `fill` prop is mutually exclusive with both | F011            |            |

## Failure Log

| ID   | Category              | Error Signature                                | Count | Last Seen  | Status          |
| ---- | --------------------- | ---------------------------------------------- | ----- | ---------- | --------------- |
| F003 | test:next-image-props | Received true for a non-boolean attribute fill | 1     | 2026-02-28 | → Resolved L001 |
| F007 | test:next-image-props | Received true for a non-boolean attribute fill | 2     | 2026-03-08 | → Resolved L001 |
| F011 | test:next-image-props | Received true for a non-boolean attribute fill | 3     | 2026-03-15 | → Resolved L001 |
```

Categories use dot-notation at mid-level specificity: `lint:unused-vars`, `test:async-act`, `e2e:port-not-ready`, `mcp:context7-unavailable`, `pipeline:phase-skip`. The specificity level matters — too broad and rules are meaningless, too narrow and they never recur.

## The 3-strike rule

The threshold for rule extraction is three occurrences of the same failure category. This is intentional.

One failure is noise. Two failures is a pattern worth watching. Three failures is a systematic problem that warrants a generalized rule. Extracting rules too early produces over-fitted guidance that clutters the Active Rules table. Waiting too long means agents keep failing.[1]

When a failure category hits three strikes, the Reflective Agent:

1. Derives a generalized, actionable rule from the pattern — one sentence, applicable before a task starts
2. Assigns the next available `L00N` ID
3. Appends the rule to Active Rules
4. Updates the source failure rows to `→ Resolved: L00N`
5. Moves the resolved rows into the Resolved Rules table

The rule must be a _pre-condition_ — something an agent can check or apply before it touches any code — not a post-hoc observation.

## Worked example: test:next-image-props

Here is what this looks like end to end.

**Strike 1** — `2026-02-28`. The feature agent generates a React component with a Next.js `<Image>` element and passes `fill={true}` alongside explicit `width` and `height` props. Jest fails.

```text
Error: Received `true` for a non-boolean attribute `fill`.
If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `fill` instead.
```

The Reflective Agent logs the failure:

```markdown
| F003 | test:next-image-props | Received true for a non-boolean attribute fill | 1 | 2026-02-28 | open |
```

**Strike 2** — `2026-03-08`. A different task, same error. A different agent generates a hero banner component. Same mistake: `fill` used as a boolean prop alongside `width`.

```markdown
| F007 | test:next-image-props | Received true for a non-boolean attribute fill | 2 | 2026-03-08 | open |
```

**Strike 3** — `2026-03-15`. A third agent generates a product thumbnail. Same error signature again.

```markdown
| F011 | test:next-image-props | Received true for a non-boolean attribute fill | 3 | 2026-03-15 | open |
```

Count is now 3 and status is `open`. The Reflective Agent extracts the rule:

```markdown
## Active Rules

| ID   | Category              | Rule                                                                                                    | Source Failures  | Added      |
| ---- | --------------------- | ------------------------------------------------------------------------------------------------------- | ---------------- | ---------- |
| L001 | test:next-image-props | When using next/image, use either `fill` alone or `width`+`height` together — never both simultaneously | F003, F007, F011 | 2026-03-15 |
```

**The next task** — a new agent needs to create an image carousel component. Before it writes any code, it reads `AGENT_LEARNINGS.md`, filters Active Rules for `test:*`, and finds L001. It applies the rule directly:

```tsx
// filename: components/carousel/CarouselSlide.tsx
// L001 applied: fill prop used without width/height

import Image from 'next/image'

type CarouselSlideProps = {
  src: string
  alt: string
}

export function CarouselSlide({ src, alt }: CarouselSlideProps) {
  return (
    <div className="relative w-full h-64">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  )
}
```

No failure. No retry. No re-learning. The rule bought back the three cycles of wasted effort that generated it.

## Applying Active Rules before every task

The discipline is simple: **every agent reads `AGENT_LEARNINGS.md` before starting work and filters Active Rules by its task category.**

If an agent is about to write tests, it checks for `test:*` rules. If it is running MCP tool calls, it checks `mcp:*` rules. If it is working across a multi-phase pipeline, it checks `pipeline:*` rules.

This is not optional context. It is the first tool call in every agent definition. The benefit is asymmetric: reading the file is cheap, but skipping it risks re-triggering a pattern the system already paid to learn.

## Running the Reflective Agent: inline vs standalone

The Reflective Agent runs in two modes.

**Inline via `/reflect`** — appended at the end of any pipeline phase. Use this when a phase encountered failures and you want to log them immediately without switching to a separate agent invocation. The skill reads the current session's failure signals, updates the Failure Log, and reports any rule extractions in a `### Reflect Summary` block.

**Standalone via `/agent reflective`** — a full five-phase run. Use this after a complete pipeline, after a batch of tasks, or when you want to perform housekeeping on the learnings file explicitly. The standalone agent surfaces Active Rules relevant to the session before evaluating, which means it can detect regressions — failures that break a rule that was already extracted.

Regression detection is worth calling out specifically. If `L001` is in Active Rules and the `test:next-image-props` error appears again, the Reflective Agent flags it as a regression rather than a new first-strike. That is a stronger signal: it means either the rule is ambiguous or something upstream changed.[4]

## Housekeeping: why auto-purging stale rules matters

The Resolved Rules table would grow forever without pruning. More importantly, stale rules can create noise — agents scanning the Active Rules table should find only guidance that is still relevant to the current codebase.

The Reflective Agent purges rows from Resolved Rules where `Resolved Date` is more than 30 days before today. This is a hard delete, not an archive. The reasoning is that if a rule has been resolved and no regression has been detected in 30 days, the pattern is either gone or subsumed into better practices. Keeping it around adds cognitive load without benefit.[1]

The Active Rules table is not auto-purged on a schedule. Rules there stay until they are superseded or explicitly retired. The expectation is that if a rule is still relevant, agents are still applying it and it is still preventing failures.

## Conclusion

The Reflective Agent is not the interesting part of this architecture. The interesting part is that failure becomes a first-class input to the system instead of something you manually diagnose in a CI log and then forget.

Three repeated failures become a rule. Every future agent applies that rule before it starts. The system gets incrementally harder to break in the same way twice.

I have found that this pattern makes agent pipelines meaningfully more robust after the first few weeks of operation. The initial investment is low — a single markdown file and a structured feedback loop. The payoff is that agents stop burning retry budget on mistakes the team already paid to understand.[2][3]

If your current pipeline has agents that fail on the same categories repeatedly, this is the first thing I would add.

## References

1. [Anthropic Engineering — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
2. [OpenAI Platform Docs — Memory](https://platform.openai.com/docs/guides/memory)
3. [Shinn, N. et al. — Reflexion: Language Agents with Verbal Reinforcement Learning (arXiv 2303.11366)](https://arxiv.org/abs/2303.11366)
4. [GitHub Docs — Writing Workflows with GitHub Actions](https://docs.github.com/en/actions/writing-workflows)
