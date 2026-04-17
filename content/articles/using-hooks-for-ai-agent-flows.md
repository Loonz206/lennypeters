---
title: 'Using Hooks for AI Agent Flows'
date: '2026-04-16'
excerpt: 'How to use agent lifecycle hooks — from GitHub Copilot preToolUse to the OpenAI Agents SDK and the Anthropic Claude API — to intercept, validate, and block potentially harmful tool invocations.'
tags: ['AI', 'Agents', 'Security', 'GitHub Copilot']
image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80'
imageAlt: 'Glowing network of interconnected nodes representing AI agent communication'
---

## Introduction

When I first started building AI agent systems, I treated tool calls like function calls: trust the model, let it run, and handle errors after the fact. That approach falls apart quickly once an agent has access to anything consequential — a database, a deployment pipeline, or an external API with billing implications.

Hooks are the mechanism that changes that calculus. They give you an explicit interception point before and after every tool invocation, so you can enforce policy, log intent, and block harmful actions without restructuring the entire agent. In this article I'll walk through the hook lifecycle in three places engineers encounter it most often: GitHub Copilot's native agent hooks, the OpenAI Agents SDK, and the Anthropic Claude API.[1][2][3]

This is aimed at engineers who have already built a basic agent and want to move from "it works in demos" to "it works safely in production."

## The tool call lifecycle

The same logical sequence applies regardless of which agent runtime you're using.

```
User message
  → LLM reasons and emits a tool_call
  → Runtime deserializes arguments
  → [pre-tool hook fires — inspect, modify, or deny]
  → Tool function executes
  → [post-tool hook fires — sanitize output, emit metrics]
  → Result injected back into conversation
  → LLM produces next response
```

The pre-tool hook is where you enforce policy. The post-tool hook is where you audit results and catch credential leaks before they re-enter the model's context. The implementations differ across runtimes, but the lifecycle is identical.

## GitHub Copilot agent hooks

GitHub Copilot's cloud agent and CLI expose hooks through a declarative JSON configuration file stored in your repository at `.github/hooks/*.json`.[1] The hooks file must be present on the default branch to be picked up by the cloud agent.

### Available hook types

| Hook                  | When it fires                                 |
| --------------------- | --------------------------------------------- |
| `sessionStart`        | Agent session begins or resumes               |
| `sessionEnd`          | Agent session completes or is terminated      |
| `userPromptSubmitted` | User submits a prompt                         |
| `preToolUse`          | Before the agent executes any tool            |
| `postToolUse`         | After a tool completes (success or failure)   |
| `agentStop`           | Main agent finishes responding                |
| `subagentStop`        | A subagent completes before returning results |
| `errorOccurred`       | Any error occurs during execution             |

`preToolUse` is the most powerful — it is the only hook that can **approve or deny** a tool execution by returning a `permissionDecision` in its output.[1]

### Wiring up the configuration

Create `.github/hooks/security.json` in your repository:

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [
      {
        "type": "command",
        "bash": "echo \"Session started: $(date)\" >> logs/session.log",
        "powershell": "Add-Content -Path logs/session.log -Value \"Session started: $(Get-Date)\"",
        "cwd": ".",
        "timeoutSec": 10
      }
    ],
    "preToolUse": [
      {
        "type": "command",
        "bash": "./scripts/security-check.sh",
        "powershell": "./scripts/security-check.ps1",
        "cwd": "scripts",
        "timeoutSec": 15
      }
    ],
    "postToolUse": [
      {
        "type": "command",
        "bash": "cat >> logs/tool-results.jsonl",
        "powershell": "$input | Add-Content -Path logs/tool-results.jsonl"
      }
    ]
  }
}
```

### Implementing a preToolUse security guard

Each hook script receives a JSON payload via stdin and can output a JSON decision. For `preToolUse` the input contains the tool name and its arguments:

```json
{
  "timestamp": 1704614600000,
  "cwd": "/path/to/project",
  "toolName": "bash",
  "toolArgs": "{\"command\":\"rm -rf dist\",\"description\":\"Clean build directory\"}"
}
```

To block dangerous commands, output `{"permissionDecision":"deny","permissionDecisionReason":"..."}`:

```bash
#!/bin/bash
# scripts/security-check.sh

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
TOOL_ARGS=$(echo "$INPUT" | jq -r '.toolArgs')

# Log every tool use for audit
echo "$(date): Tool=$TOOL_NAME Args=$TOOL_ARGS" >> logs/tool-usage.log

# Block dangerous shell patterns
if echo "$TOOL_ARGS" | grep -qE "rm -rf /|DROP TABLE|format c:"; then
  jq -n '{permissionDecision:"deny",permissionDecisionReason:"Dangerous command detected by security policy"}'
  exit 0
fi

# Restrict edits to src/ and tests/ only
if [ "$TOOL_NAME" = "edit" ] || [ "$TOOL_NAME" = "create" ]; then
  PATH_ARG=$(echo "$TOOL_ARGS" | jq -r '.path // empty')
  if [ -n "$PATH_ARG" ] && [[ ! "$PATH_ARG" =~ ^(src/|tests/) ]]; then
    jq -n --arg path "$PATH_ARG" \
      '{permissionDecision:"deny",permissionDecisionReason:("File path not in allowed directories: " + $path)}'
    exit 0
  fi
fi

# Allow everything else — omitting output also allows
```

The `postToolUse` hook receives the tool result as well:

```bash
#!/bin/bash
# Appended to logs/tool-results.jsonl via the hooks.json config above
# Input arrives on stdin; just pipe it through to the log.
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
RESULT_TYPE=$(echo "$INPUT" | jq -r '.toolResult.resultType')

# Alert on tool failures
if [ "$RESULT_TYPE" = "failure" ]; then
  echo "$(date): FAILURE in $TOOL_NAME" >> logs/failures.log
fi
```

A few key points from the GitHub Copilot documentation:[1]

- Hooks run **synchronously** and block agent execution. Keep hook scripts under 5 seconds to avoid degrading the experience.
- The default timeout is 30 seconds; increase `timeoutSec` for slower validation scripts.
- Only `preToolUse` outputs a `permissionDecision`. All other hook outputs are currently ignored.
- Test hooks locally by piping test JSON into the script: `echo '{"toolName":"bash","toolArgs":"{\"command\":\"ls\"}"}' | ./scripts/security-check.sh`

## OpenAI Agents SDK hooks

When building agents with the OpenAI Agents Python SDK, the same lifecycle is available through the `AgentHooks` base class.[2] Subclass it, override the methods you need, and pass an instance to your agent.

```python
# filename: hooks.py

import asyncio
from agents import Agent, AgentHooks, RunContextWrapper, Tool, Runner, function_tool

BLOCKED_PATTERNS = {"rm -rf", "DROP TABLE", "DELETE FROM", "format c:"}


class SafetyHooks(AgentHooks):
    async def before_tool_call(
        self,
        context: RunContextWrapper,
        agent: Agent,
        tool: Tool,
    ) -> None:
        args = context.context.get("tool_args", {})
        for value in args.values():
            if isinstance(value, str):
                for pattern in BLOCKED_PATTERNS:
                    if pattern.lower() in value.lower():
                        raise ValueError(
                            f"Tool call blocked: argument matches disallowed pattern '{pattern}'"
                        )

    async def after_tool_call(
        self,
        context: RunContextWrapper,
        agent: Agent,
        tool: Tool,
        result: object,
    ) -> None:
        if isinstance(result, str) and ("password=" in result or "secret=" in result):
            raise ValueError("Tool result redacted: potential credential leak detected")


@function_tool
def run_shell_command(command: str) -> str:
    """Execute a shell command and return output."""
    return f"[simulated] executed: {command}"


async def main() -> None:
    agent = Agent(
        name="ops-agent",
        instructions="You help engineers run safe shell operations.",
        tools=[run_shell_command],
        hooks=SafetyHooks(),
    )
    result = await Runner.run(agent, "List files in the current directory")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```

One important constraint: hooks fire only for locally-executed Python function tools. Tools hosted on OpenAI's servers — like `WebSearchTool` or `CodeInterpreterTool` — execute remotely and do not trigger client-side hooks.[2]

For production systems, separate the policy definition from the enforcement mechanism so the policy can be tested and loaded from configuration in isolation:

```python
from dataclasses import dataclass, field
from agents import Agent, AgentHooks, RunContextWrapper, Tool, Runner, function_tool


@dataclass
class ToolPolicy:
    allowed_tools: set[str] = field(default_factory=set)
    blocked_arg_patterns: list[str] = field(default_factory=list)
    max_calls_per_run: int = 20
    _call_count: int = field(default=0, init=False, repr=False)

    def check(self, tool_name: str, args: dict) -> None:
        if self.allowed_tools and tool_name not in self.allowed_tools:
            raise PermissionError(f"Tool '{tool_name}' is not on the allowlist")
        self._call_count += 1
        if self._call_count > self.max_calls_per_run:
            raise RuntimeError(f"Tool call budget exceeded ({self.max_calls_per_run} per run)")
        for pattern in self.blocked_arg_patterns:
            for value in args.values():
                if isinstance(value, str) and pattern.lower() in value.lower():
                    raise ValueError(f"Argument blocked by policy pattern: {pattern!r}")


class PolicyEnforcedHooks(AgentHooks):
    def __init__(self, policy: ToolPolicy) -> None:
        self.policy = policy

    async def before_tool_call(
        self, context: RunContextWrapper, agent: Agent, tool: Tool
    ) -> None:
        args = context.context.get("tool_args", {})
        self.policy.check(tool.name, args)

    async def after_tool_call(
        self, context: RunContextWrapper, agent: Agent, tool: Tool, result: object
    ) -> None:
        print(f"[audit] tool={tool.name!r} returned {type(result).__name__}")
```

## Anthropic Claude API hooks

The Anthropic Claude API does not provide a dedicated hooks class, but the tool-use flow gives you natural interception points.[3] When Claude decides to call a tool, the API returns a `tool_use` content block in the response. You control execution — so you implement the guard in your own dispatch layer before invoking the tool function.

```python
import anthropic
import json

client = anthropic.Anthropic()

BLOCKED_PATTERNS = {"rm -rf", "DROP TABLE", "/etc/passwd"}
ALLOWED_TOOLS = {"read_file", "write_file"}

tools = [
    {
        "name": "read_file",
        "description": "Read a file from disk and return its contents.",
        "input_schema": {
            "type": "object",
            "properties": {"path": {"type": "string", "description": "Path to the file"}},
            "required": ["path"],
        },
    },
    {
        "name": "write_file",
        "description": "Write content to a file on disk.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "content": {"type": "string"},
            },
            "required": ["path", "content"],
        },
    },
]


def pre_tool_check(tool_name: str, tool_input: dict) -> None:
    """Raise if the tool call violates policy — mirrors preToolUse / before_tool_call."""
    if tool_name not in ALLOWED_TOOLS:
        raise PermissionError(f"Tool '{tool_name}' is not on the allowlist")
    for value in tool_input.values():
        if isinstance(value, str):
            for pattern in BLOCKED_PATTERNS:
                if pattern.lower() in value.lower():
                    raise ValueError(f"Tool call blocked: argument matches pattern '{pattern}'")


def dispatch_tool(tool_name: str, tool_input: dict) -> str:
    """Execute the tool and return a result string."""
    if tool_name == "read_file":
        return f"[simulated] contents of {tool_input['path']}"
    if tool_name == "write_file":
        return f"[simulated] wrote {len(tool_input['content'])} bytes to {tool_input['path']}"
    raise ValueError(f"Unknown tool: {tool_name}")


def post_tool_check(tool_name: str, result: str) -> str:
    """Sanitize or redact the result before returning it to the model — mirrors postToolUse."""
    if "password=" in result or "secret=" in result:
        raise ValueError("Tool result redacted: potential credential leak detected")
    print(f"[audit] tool={tool_name!r} returned {len(result)} chars")
    return result


def run_agent(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            tools=tools,
            messages=messages,
        )

        if response.stop_reason == "end_turn":
            return next(
                block.text for block in response.content if hasattr(block, "text")
            )

        # Process tool_use blocks — this is where hooks fire
        tool_results = []
        for block in response.content:
            if block.type != "tool_use":
                continue

            try:
                pre_tool_check(block.name, block.input)          # preToolUse equivalent
                raw_result = dispatch_tool(block.name, block.input)
                result_content = post_tool_check(block.name, raw_result)  # postToolUse equivalent
                tool_results.append(
                    {"type": "tool_result", "tool_use_id": block.id, "content": result_content}
                )
            except (PermissionError, ValueError) as exc:
                # Return the policy violation to the model as an error result
                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": f"[blocked] {exc}",
                        "is_error": True,
                    }
                )

        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})
```

Because the Claude API is stateless at the HTTP level, the hook layer lives entirely in your orchestration code. That means it is straightforward to unit-test `pre_tool_check` and `post_tool_check` in isolation — no agent runtime required.[3]

## Common pitfalls

**Overly broad keyword matching causes false positives.** A blocklist containing `"delete"` will block legitimate operations like "delete this draft" or "clean up temp files." Use structured argument parsing and match against known dangerous patterns at the semantic level, not raw string content.

**Hooks run synchronously in Copilot agents — keep them fast.** The GitHub Copilot documentation recommends keeping hook execution under 5 seconds. External policy service calls inside a hook add a network round-trip to every tool invocation; use local caches or background queues for expensive checks.[1]

**Hooks are a secondary defense, not a permission system.** The most effective guard is scoping which tools the agent can see at all. A `preToolUse` hook that blocks `bash` is useful, but the primary defense is not exposing `bash` unless the use case requires it.[1][2]

**Return policy violations as errors, not silent swallows.** In the Claude pattern above, blocked calls return an `is_error: true` tool result so the model knows the call was rejected. In the Copilot pattern, the `permissionDecisionReason` is surfaced to the user. Always emit a structured log event before blocking so your monitoring system can surface patterns over time.

## Conclusion

Hooks give you a principled place to enforce policy, build audit trails, and protect downstream systems from agent mistakes or adversarial inputs. The implementations look different across runtimes, but the pattern is universal:

- **GitHub Copilot agents**: declarative `hooks.json` in `.github/hooks/`; `preToolUse` can deny calls and return a reason.[1]
- **OpenAI Agents SDK**: subclass `AgentHooks` and override `before_tool_call` / `after_tool_call`; raise to abort.[2]
- **Anthropic Claude API**: implement `pre_tool_check` and `post_tool_check` in your own dispatch loop around the `tool_use` content blocks.[3]

Treat the pre-tool hook as an enforcement boundary. Back it with an explicit, testable policy object. Keep your primary defense at the tool registration layer. Instrument every block event so patterns surface over time.

## References

1. [GitHub Copilot — About hooks](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-hooks) · [Using hooks with GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-hooks) · [Hooks configuration reference](https://docs.github.com/en/copilot/reference/hooks-configuration)
2. [OpenAI Agents Python SDK — Agent lifecycle hooks](https://openai.github.io/openai-agents-python/ref/lifecycle/)
3. [Anthropic — Tool use with Claude](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)
