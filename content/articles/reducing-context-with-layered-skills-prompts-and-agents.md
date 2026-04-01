---
title: "Reducing Context with Layered Skills, Prompts, and Agents"
date: "2026-03-30"
excerpt: "A practical architecture for shrinking LLM context load by separating stable guidance from task-specific execution through tools, skills, and agents."
tags: ["AI Engineering", "Agents", "Prompt Engineering", "MCP"]
---

## Introduction

Most teams try to fix brittle AI behavior by adding more text to one giant prompt. In my experience, that is the fastest path to high token spend, slower responses, and inconsistent outcomes.

A better pattern is architectural: reduce per-request context by moving stable knowledge into reusable abstractions. If you separate concerns across tools, skills, prompts, instructions, and agents, each layer carries only the information it is best suited to own. The result is lower cognitive load for the model and lower operational load for your system.[1][2][3]

This article is a practical blueprint for doing that in production.

## Why context reduction is a systems problem

Prompt engineering is useful, but it is only one control surface. Anthropic's prompt engineering guidance explicitly starts with clear success criteria and evaluations, because many failures are architectural rather than phrasing-level problems.[3]

OpenAI's prompt caching docs make a related point from a performance angle: cache efficiency depends on stable prompt prefixes and disciplined prompt structure.[2] If every request carries a slightly different monolith prompt, you lose reuse and pay for repeated processing.

MCP goes one level deeper by treating prompt fragments, resources, and tools as separate protocol primitives instead of one free-form blob.[1] That separation is exactly what context reduction needs.

> If your only abstraction is "one giant prompt," you are encoding architecture as prose.

## The abstraction ladder

I recommend an explicit ladder. Each rung should have a single responsibility:

1. `Tool`: a small executable capability (read file, run query, create ticket).
2. `Skill`: a reusable workflow that composes tools and defines quality checks.
3. `Prompt`: task-local framing and output contract.
4. `Instruction`: stable policy and repository or domain conventions.
5. `Agent`: orchestrator that routes work to the right skill set.

GitHub Copilot's custom instruction model maps well to this layering: repository-wide and path-specific instructions can stay stable while prompts remain task-scoped.[4]

This reduces impact in three ways:

1. Smaller request payloads because stable guidance is not repeated in every call.
2. Better caching because prefixes stay consistent across requests.[2]
3. Better failure isolation because behavior bugs are fixed in one layer, not all prompts.

## Real-world pattern: context envelopes

In production, I use a context envelope instead of passing raw chat history everywhere. The envelope is explicit about what an agent gets.

```json
{
  "task": {
    "id": "TASK-842",
    "goal": "Refactor checkout validation to support region-specific tax IDs",
    "acceptance_criteria": [
      "Supports US EIN and CA BN formats",
      "Existing EU VAT behavior unchanged",
      "Unit tests added for all supported regions"
    ]
  },
  "constraints": {
    "max_runtime_minutes": 10,
    "allowed_paths": ["src/checkout/**", "src/lib/tax/**"],
    "forbidden_commands": ["git reset --hard"]
  },
  "references": {
    "instructions": [
      ".github/copilot-instructions.md",
      ".github/instructions/coding.instructions.md"
    ],
    "skills": ["skills/tax-validation/SKILL.md"]
  },
  "tools": ["search", "read_file", "apply_patch", "run_tests"],
  "handoff": {
    "required_output": "patch + test summary + risk notes"
  }
}
```

This is fully runnable as data and easy to validate in CI. More importantly, it prevents accidental context sprawl.

## Implementing layered routing in TypeScript

Below is a complete, runnable example of a minimal router that assigns requests to specialized skills and keeps prompts short.

```ts
// filename: router.ts
// Run: npx tsx router.ts

type TaskType = "bugfix" | "feature" | "docs";

type Task = {
  id: string;
  type: TaskType;
  goal: string;
  files: string[];
};

type Skill = {
  name: string;
  appliesTo: (task: Task) => boolean;
  promptTemplate: (task: Task) => string;
};

const skills: Skill[] = [
  {
    name: "linting",
    appliesTo: (task) => task.type === "bugfix" && task.files.some((f) => f.endsWith(".ts") || f.endsWith(".tsx")),
    promptTemplate: (task) => [
      "You are a linting specialist.",
      `Task: ${task.goal}`,
      "Output: minimal code changes and lint error resolution summary."
    ].join("\n")
  },
  {
    name: "write-article",
    appliesTo: (task) => task.type === "docs",
    promptTemplate: (task) => [
      "You are a technical writing specialist.",
      `Task: ${task.goal}`,
      "Output: markdown article with citations and references."
    ].join("\n")
  },
  {
    name: "feature-implementation",
    appliesTo: (task) => task.type === "feature",
    promptTemplate: (task) => [
      "You are a feature implementation specialist.",
      `Task: ${task.goal}`,
      "Output: patch, tests, and migration notes."
    ].join("\n")
  }
];

function routeTask(task: Task): { skill: string; prompt: string } {
  const selected = skills.find((skill) => skill.appliesTo(task));
  if (!selected) {
    throw new Error(`No skill found for task ${task.id}`);
  }
  return {
    skill: selected.name,
    prompt: selected.promptTemplate(task)
  };
}

const task: Task = {
  id: "DOC-119",
  type: "docs",
  goal: "Explain how to reduce LLM context by layering tools, skills, and agents",
  files: ["content/articles/new-article.md"]
};

const routed = routeTask(task);
console.log(JSON.stringify(routed, null, 2));
```

The point is not the router itself. The point is that each skill holds stable logic once, so the prompt for each task stays small and purpose-built.[1][4]

## Common pitfall: over-abstracting too early

The most common mistake I see is creating ten agent roles before proving one reliable workflow. You end up with orchestration overhead, unclear ownership, and debugging sessions that jump across multiple instruction layers.

Here is what I recommend instead:

1. Start with one high-volume workflow and one specialist skill.
2. Add instrumentation: token usage, latency, retry rate, and cache hit signals.[2]
3. Split responsibilities only when failure modes are consistently distinct.
4. Keep instruction precedence documented in one place so conflicts are visible.[4]

Anthropic's framing is useful here: test against explicit success criteria before you optimize prompt style.[3]

## A practical operating model

When teams ask me for a concrete rollout plan, I use this sequence:

1. Define task families: coding, linting, docs, review.
2. For each family, write a `SKILL.md` with inputs, outputs, and quality gates.
3. Move durable conventions into instruction files, not prompts.
4. Keep prompts task-local and short.
5. Expose external actions as typed tools (or MCP tools) rather than prose instructions.[1]
6. Track outcomes weekly and prune layers that do not improve quality.

If you do this well, your system gets cheaper, more predictable, and easier to evolve. New capabilities become additive modules, not another paragraph in an already overloaded prompt.

## Conclusion

Reducing context is not just prompt trimming. It is architecture.

I have found that layered abstractions consistently outperform monolithic prompts because they align with how modern agent systems are built: explicit capabilities, explicit boundaries, and explicit handoffs. MCP formalizes this separation at the protocol level, while prompt engineering and instruction frameworks provide the operational practices on top.[1][3][4]

If your current setup feels fragile, do not start by rewriting sentence wording. Start by deciding what belongs in tools, what belongs in skills, what belongs in instructions, and what should remain in the task prompt. Once those boundaries are clear, quality usually improves faster than teams expect.

## References

1. Model Context Protocol Specification (architecture, primitives, capabilities): https://github.com/modelcontextprotocol/modelcontextprotocol
2. OpenAI Docs - Prompt Caching and Latency Optimization: https://developers.openai.com/api/docs/guides/prompt-caching and https://developers.openai.com/api/docs/guides/latency-optimization
3. Anthropic Docs - Prompt Engineering Overview: https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering/overview
4. GitHub Docs - Repository and path-specific custom instructions for Copilot: https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
