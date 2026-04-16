---
title: 'Using Hooks for AI Agent Flows'
date: '2026-04-16'
excerpt: 'How to use before_tool_call and after_tool_call hooks to intercept, validate, and block potentially harmful tool invocations in AI agent pipelines.'
tags: ['AI', 'Agents', 'Python', 'Security']
image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80'
imageAlt: 'Glowing network of interconnected nodes representing AI agent communication'
---

## Introduction

When I first started building AI agent systems, I treated tool calls like function calls: trust the model, let it run, and handle errors after the fact. That approach falls apart quickly once an agent has access to anything consequential — a database, a deployment pipeline, or an external API with billing implications.

Hooks are the mechanism that changes that calculus. They give you an explicit interception point before and after every tool invocation, so you can enforce policy, log intent, and block harmful actions without restructuring the entire agent. In this article I'll walk through the hook lifecycle available in the OpenAI Agents SDK, show how to implement guards that prevent harmful calls, and cover patterns I've found reliable in production.[1]

This is aimed at engineers who have already built a basic agent and want to move from "it works in demos" to "it works safely in production."

## The tool call lifecycle

Before writing a single hook, it helps to understand what actually happens when an agent decides to invoke a tool.

```
User message
  → LLM reasons and emits a tool_call
  → SDK deserializes arguments
  → [before_tool_call hook fires]
  → Tool function executes
  → [after_tool_call hook fires]
  → Result injected back into conversation
  → LLM produces next response
```

The hooks sit on either side of execution. `before_tool_call` fires with the full tool reference and the deserialized arguments but before any real work is done — this is where you can inspect, modify, or abort. `after_tool_call` fires with the result (or exception) and is where you can sanitize output, emit metrics, or trigger downstream workflows.[1]

One important constraint from the OpenAI Agents SDK documentation: hooks fire only for locally-executed Python function tools. Tools hosted on OpenAI's servers — like `WebSearchTool` or `CodeInterpreterTool` — execute remotely and do not trigger client-side hooks.[1] Keep that boundary in mind when designing your safety strategy.

## Implementing AgentHooks

The OpenAI Agents SDK exposes hooks through a base class called `AgentHooks`. Subclass it, override the methods you need, and pass an instance to your agent.

```python
# filename: hooks.py
# Run: python hooks.py

import asyncio
from agents import Agent, AgentHooks, RunContextWrapper, Tool, Runner, function_tool

# Illustrative patterns only — see "Common pitfalls" for why keyword matching has limits
SAMPLE_BLOCKED_PATTERNS = {"rm -rf", "DROP TABLE", "DELETE FROM", "shutdown", "format c:"}

class SafetyHooks(AgentHooks):
    async def before_tool_call(
        self,
        context: RunContextWrapper,
        agent: Agent,
        tool: Tool,
    ) -> None:
        print(f"[hook] before_tool_call: agent={agent.name!r} tool={tool.name!r}")

        # context.context is the RunContext wrapped by RunContextWrapper;
        # tool_args is injected by the runner just before the hook fires
        args = context.context.get("tool_args", {})
        for value in args.values():
            if isinstance(value, str):
                for blocked in SAMPLE_BLOCKED_PATTERNS:
                    if blocked.lower() in value.lower():
                        raise ValueError(
                            f"Tool call blocked: argument contains disallowed pattern '{blocked}'"
                        )

    async def after_tool_call(
        self,
        context: RunContextWrapper,
        agent: Agent,
        tool: Tool,
        result: object,
    ) -> None:
        print(f"[hook] after_tool_call: tool={tool.name!r} result_type={type(result).__name__}")
        # Post-process: strip any accidental secrets from results before they re-enter context
        if isinstance(result, str) and ("password=" in result or "secret=" in result):
            raise ValueError("Tool result redacted: potential credential leak detected")


@function_tool
def run_shell_command(command: str) -> str:
    """Execute a shell command and return the output."""
    # In a real system this would call subprocess — blocked here for safety
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

A few things worth noting here:

- Raising an exception inside `before_tool_call` aborts the tool call entirely. The exception propagates up to the runner, which can be caught and turned into a user-facing error.
- The `context` object carries the full `RunContext`, so you have access to conversation history, metadata, and anything your application thread injected.
- Hooks are `async` by default, so you can call external policy services, check a database, or hit an audit log endpoint without blocking.[1]

## A production-grade pattern: the policy hook

A simple keyword blocklist works for demos, but production systems need something more structured. I've converged on treating the `before_tool_call` hook as a policy enforcement point backed by a dedicated policy object.

```python
# filename: policy_hooks.py
# Run: python policy_hooks.py

import asyncio
from dataclasses import dataclass, field
from typing import Callable
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
            raise RuntimeError(
                f"Tool call budget exceeded ({self.max_calls_per_run} calls per run)"
            )

        for pattern in self.blocked_arg_patterns:
            for value in args.values():
                if isinstance(value, str) and pattern.lower() in value.lower():
                    raise ValueError(
                        f"Argument blocked by policy pattern: {pattern!r}"
                    )


class PolicyEnforcedHooks(AgentHooks):
    def __init__(self, policy: ToolPolicy) -> None:
        self.policy = policy

    async def before_tool_call(
        self,
        context: RunContextWrapper,
        agent: Agent,
        tool: Tool,
    ) -> None:
        # context.context is the RunContext wrapped by RunContextWrapper
        args = context.context.get("tool_args", {})
        self.policy.check(tool.name, args)
        print(f"[policy] approved tool={tool.name!r} call_count={self.policy._call_count}")

    async def after_tool_call(
        self,
        context: RunContextWrapper,
        agent: Agent,
        tool: Tool,
        result: object,
    ) -> None:
        print(f"[audit] tool={tool.name!r} returned {type(result).__name__}")


@function_tool
def read_file(path: str) -> str:
    """Read a file from disk and return its contents."""
    return f"[simulated] contents of {path}"


@function_tool
def write_file(path: str, content: str) -> str:
    """Write content to a file on disk."""
    return f"[simulated] wrote {len(content)} bytes to {path}"


async def main() -> None:
    policy = ToolPolicy(
        allowed_tools={"read_file", "write_file"},
        blocked_arg_patterns=["../", "/etc/passwd", "/proc/"],
        max_calls_per_run=5,
    )

    agent = Agent(
        name="file-agent",
        instructions="You help read and write files safely.",
        tools=[read_file, write_file],
        hooks=PolicyEnforcedHooks(policy),
    )

    result = await Runner.run(agent, "Read the contents of config.json")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```

This pattern separates the policy definition (`ToolPolicy`) from the enforcement mechanism (`PolicyEnforcedHooks`). The policy object is trivially testable in isolation and can be loaded from configuration at runtime — something you can't easily do when guards are scattered across individual tool definitions.[2]

## Equivalent patterns in other frameworks

If you're not using the OpenAI Agents SDK, the same lifecycle exists under different names.

**LangChain** surfaces hooks through `BaseCallbackHandler`. The `on_tool_start` and `on_tool_end` methods map directly to `before_tool_call` and `after_tool_call`.[2]

```python
from langchain_core.callbacks.base import BaseCallbackHandler

class GuardCallbackHandler(BaseCallbackHandler):
    def on_tool_start(
        self, serialized: dict, input_str: str, **kwargs
    ) -> None:
        if "DROP TABLE" in input_str.upper():
            raise ValueError("Blocked: destructive SQL pattern detected")

    def on_tool_end(self, output: str, **kwargs) -> None:
        print(f"[audit] tool returned {len(output)} chars")
```

**Semantic Kernel** (.NET) uses `IKernelFunctionInvocationFilter` with `OnFunctionInvokingAsync` (before) and `OnFunctionInvokedAsync` (after).[3]

```csharp
using Microsoft.SemanticKernel;

public class SafetyFilter : IKernelFunctionInvocationFilter
{
    public async Task OnFunctionInvokingAsync(
        FunctionInvocationContext context,
        Func<FunctionInvocationContext, Task> next)
    {
        var args = context.Arguments;
        if (args.ContainsKey("command") && ((string)args["command"]).Contains("rm -rf"))
        {
            throw new InvalidOperationException("Blocked: destructive command detected");
        }
        await next(context);
    }

    public async Task OnFunctionInvokedAsync(
        FunctionInvocationContext context,
        Func<FunctionInvocationContext, Task> next)
    {
        await next(context);
        Console.WriteLine($"[audit] {context.Function.Name} completed");
    }
}

// Register:
kernel.FunctionInvocationFilters.Add(new SafetyFilter());
```

The pattern is identical across frameworks — the only differences are naming conventions and whether you compose via inheritance or interface implementation.

## Common pitfalls

**Overly broad keyword matching causes false positives.** A blocklist containing `"delete"` will prevent legitimate operations like "delete this draft" or "clean up temp files." Use structured argument parsing and match against known dangerous patterns at the semantic level, not raw string content.

**Async hooks can introduce latency.** If your `before_tool_call` hook hits an external policy service synchronously, you're adding a network round-trip to every tool invocation. Use connection pooling, local caches with short TTLs, or circuit breakers so policy checks degrade gracefully under load.[2]

**Hooks are not a substitute for proper tool scoping.** The most effective guard is an allowlist of tools the agent can even see. A hook that blocks `run_shell_command` is a secondary defense. The primary defense is not registering `run_shell_command` in the first place unless the use case requires it.[1]

**Swallowing exceptions silently breaks observability.** If a hook raises an exception that the runner catches and ignores, you get silent failures. Always emit a structured log event or metric from your hook before raising, so your monitoring system records the block event.

## Conclusion

Hooks give you a principled place to enforce policy, build audit trails, and protect downstream systems from agent mistakes or adversarial inputs. The key insights I'd carry forward:

- Treat `before_tool_call` as an enforcement boundary, not a logging afterthought.
- Back your hooks with an explicit, testable policy object rather than inline conditionals.
- Keep your primary defense at the tool registration layer — hooks are a safety net, not a permission system.
- Instrument every block event so your monitoring systems can surface patterns over time.

The frameworks differ in naming — `on_tool_start`, `before_tool_call`, `OnFunctionInvokingAsync` — but the lifecycle is universal. Once you internalize the pattern, it transfers directly between them.

## References

1. [OpenAI Agents Python SDK — Agent Lifecycle Hooks](https://github.com/openai/openai-agents-python/blob/main/examples/basic/agent_lifecycle_example.py)
2. [LangChain — Callbacks and Custom Callback Handlers](https://python.langchain.com/docs/concepts/callbacks/)
3. [Microsoft Semantic Kernel — Function Invocation Filters](https://learn.microsoft.com/en-us/semantic-kernel/concepts/enterprise-readiness/filters)
