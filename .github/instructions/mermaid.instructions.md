---
description: "Use when creating or editing Mermaid diagrams; requires syntax docs lookup, validation, then preview."
---

# Mermaid Instruction

## Standard Workflow

1. Fetch diagram syntax guidance with `get_syntax_docs`.
2. Create or edit the Mermaid code.
3. Validate with `mermaid-diagram-validator`.
4. Preview with `mermaid-diagram-preview`.

## Rules

- Never present unvalidated Mermaid.
- Keep diagram source in `.mmd` or existing diagram markdown blocks.
- If validation fails, fix syntax before previewing.
