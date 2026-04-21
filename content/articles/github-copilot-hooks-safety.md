---
title: 'How to Block Dangerous Tool Calls with GitHub Copilot Hooks'
author: 'Lenny Peters'
date: '2026-04-20'
excerpt: 'A simple way to use GitHub Copilot hooks to stop destructive commands and unsafe edits before an overpowered agent can run them.'
tags: ['GitHub Copilot', 'AI Safety', 'DevOps', 'Automation']
image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80'
imageAlt: 'Developer workstation showing code and a security lock overlay'
---

GitHub Copilot hooks are one of the clearest ways to make agentic workflows safer. They let you inspect what an agent is about to do and stop the risky part before it runs.[1]

That matters because the easiest way to create an unsafe agent is to give it broad tool access and no policy guardrails. If the agent can run shell commands, edit files anywhere, and install whatever it wants, you have not built a helpful automation layer. You have built an overpowered operator with no review step.

This article keeps the setup intentionally simple. I will show one bad example, explain why it is risky, and then replace it with a minimal `preToolUse` hook that blocks dangerous commands and unsafe edit targets.

## The unsafe version

Here is the kind of agent setup that looks productive and is actually a policy problem:

```text
You can run shell commands for any task.
You can edit any file in the repository.
Install tools if needed.
Prefer speed over asking for confirmation.
```

Now pair that with a repository that has no `preToolUse` hook configured. The agent may still produce useful work, but it also has no technical boundary stopping it from attempting things like:

- `sudo` or other privilege escalation commands
- `rm -rf /` or similarly destructive deletion patterns
- `curl ... | bash` download-and-execute behavior
- edits to deployment files, CI workflows, or secrets-related paths that should be out of scope

That is what I mean by an agent with too much power. The problem is not that the agent is malicious. The problem is that it is allowed to act before policy is checked.

> If you remember only one thing, make it this: the first useful safety hook is the one that runs before tool execution, not after.

## The one hook to add first

The most important hook type for this problem is `preToolUse`. GitHub's current hook reference describes it as the hook that runs before a tool is used, and it is the hook that can deny execution.[1]

At a high level, the flow is simple:

1. Copilot decides it wants to use a tool such as `bash`, `edit`, or `create`.
2. Your `preToolUse` script receives the tool name and tool arguments.
3. Your script returns nothing to allow the call, or returns a JSON denial object to block it.

There is one detail worth calling out because it affects how you explain policy to your team: GitHub's current reference says `permissionDecision` can be `allow`, `deny`, or `ask`, but only `deny` is currently processed.[1] In practice, that means hooks are best used as a hard-stop mechanism for known-bad patterns.

## A simple safe configuration

Start with one hooks file in `.github/hooks/`. For the Copilot cloud agent, the file must be on the repository's default branch before it will be used. For Copilot CLI, repository-scoped hooks are loaded from the current working directory when you run inside the repo.[2], [3]

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "bash": "./scripts/pre-tool-policy.sh",
        "powershell": "./scripts/pre-tool-policy.ps1",
        "cwd": ".github/hooks",
        "timeoutSec": 15
      }
    ]
  }
}
```

This is enough to start. You do not need six hooks on day one. You need one policy gate in the right place.

## The policy script

The script below does two things:

1. It blocks high-risk shell commands.
2. It limits file writes to a short allowlist of paths.

```bash
#!/bin/bash
set -euo pipefail

INPUT="$(cat)"
TOOL_NAME="$(echo "$INPUT" | jq -r '.toolName // empty')"
TOOL_ARGS_RAW="$(echo "$INPUT" | jq -r '.toolArgs // "{}"')"

deny() {
  local reason="$1"
  jq -nc --arg r "$reason" '{permissionDecision:"deny", permissionDecisionReason:$r}'
  exit 0
}

if ! echo "$TOOL_ARGS_RAW" | jq -e . >/dev/null 2>&1; then
  exit 0
fi

case "$TOOL_NAME" in
  bash)
    COMMAND="$(echo "$TOOL_ARGS_RAW" | jq -r '.command // empty')"

    if echo "$COMMAND" | grep -qE '\b(sudo|su|runas)\b'; then
      deny "Privilege escalation requires manual approval."
    fi

    if echo "$COMMAND" | grep -qE 'rm\s+-rf\s*/(\s|$)|rm\s+.*-rf\s*/(\s|$)'; then
      deny "Destructive commands targeting the filesystem root are blocked."
    fi

    if echo "$COMMAND" | grep -qE '\b(mkfs|dd|format)\b'; then
      deny "System-destructive commands are blocked."
    fi

    if echo "$COMMAND" | grep -qE 'curl.*\|\s*(bash|sh)|wget.*\|\s*(bash|sh)|iex\s*\(irm'; then
      deny "Download-and-execute commands require manual review."
    fi
    ;;

  edit|create)
    PATH_ARG="$(echo "$TOOL_ARGS_RAW" | jq -r '.path // empty')"

    if [[ ! "$PATH_ARG" =~ ^(src/|content/articles/|e2e/|tests?/|__tests__/).* ]]; then
      deny "Edits are limited to approved project directories."
    fi
    ;;
esac

exit 0
```

This is deliberately narrow. It does not try to solve every risk. It blocks the commands that are obviously dangerous and it reduces where the agent can write.

That is already a major improvement over the unsafe setup.

## What changes for the overpowered agent

Go back to the bad example.

Without hooks, the agent can attempt a prompt like this:

```text
Clean up the machine, reinstall dependencies, and update deployment config if needed.
```

That can lead to tool calls you do not want auto-executed, such as:

```bash
sudo rm -rf /
```

or an edit attempt against a sensitive file such as:

```text
.github/workflows/deploy.yml
```

With the `preToolUse` policy in place, both actions are evaluated before execution. The shell command is denied because it matches the privilege-escalation and destructive-command rules. The file change is denied because the path falls outside the approved directories.

That is the real value of hooks. They move policy enforcement from “I hope the agent behaves” to “the agent cannot cross this boundary automatically.”

## Keep the rollout simple

GitHub's CLI tutorial recommends starting from an organizational policy, deciding what to log, and rolling out hooks gradually.[3] That is the right approach.

My recommendation is even simpler:

1. Start with one repo.
2. Add one `preToolUse` hook.
3. Block only a few high-risk command families.
4. Restrict writes to a small set of approved directories.
5. Expand only after you have seen normal usage patterns.

If you start with a giant deny list, you will spend your first week fighting false positives instead of reducing risk.

## What hooks do not solve

Hooks are powerful, but they are not the whole security model.

First, hooks are local policy logic. They help you stop dangerous tool calls, but they do not replace broader network and environment controls.

Second, GitHub's current MCP allowlist enforcement has documented limitations. The current reference states that enforcement is based on server name or ID matching and can be bypassed by editing configuration files, and strict enforcement that prevents non-registry servers is not yet available.[4] GitHub explicitly notes that, for the highest level of security, you can disable MCP servers until stricter enforcement is available.[4]

Third, the recommended allowlist and firewall controls for Copilot cloud agent exist for a reason. They define what the environment can reach even before your local hook policy runs.[5]

The practical model is defense in depth:

- hooks to block unsafe tool usage
- allowlists and firewall policy to constrain network reach
- narrow agent instructions so the model is not encouraged to overreach in the first place

## A baseline policy that is easy to live with

If you want a reasonable default, this is the version I would ship first:

1. Deny privilege escalation, destructive filesystem commands, and download-and-execute patterns.
2. Limit `edit` and `create` operations to known-safe project directories.
3. Keep hook scripts short, fast, and deterministic.
4. Log metadata carefully and redact anything that could contain secrets.[1], [3]
5. Treat hooks as one control layer, not your whole governance story.

That is enough to stop the most obvious failures from an overpowered agent without making normal development miserable.

## Conclusion

The easiest Copilot safety mistake is not a bad model answer. It is a good model answer paired with too much execution freedom.

Hooks give you a practical way to correct that. Add `preToolUse`, block the commands you already know are unacceptable, restrict where the agent can write, and keep the first version small enough that people will actually adopt it.

If your current agent setup depends on trust alone, this is where I would start.

## References

1. [GitHub Docs — Hooks configuration](https://docs.github.com/en/copilot/reference/hooks-configuration)
2. [GitHub Docs — Using hooks with GitHub Copilot agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-hooks)
3. [GitHub Docs — Using hooks with Copilot CLI for predictable, policy-compliant execution](https://docs.github.com/en/copilot/tutorials/copilot-cli-hooks)
4. [GitHub Docs — MCP allowlist enforcement](https://docs.github.com/en/copilot/reference/mcp-allowlist-enforcement)
5. [GitHub Docs — Copilot allowlist reference](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference)
