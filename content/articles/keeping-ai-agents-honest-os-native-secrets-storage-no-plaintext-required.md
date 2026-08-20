---
title: 'Keeping AI Agents Honest: OS-Native Secrets Storage, No Plaintext Required'
date: '2026-08-19'
excerpt: 'A senior-engineer playbook for keeping AI tooling off plaintext secrets by fetching API keys from the OS credential store only when a subprocess actually needs them.'
tags: ['AI', 'Security', 'Secrets Management', 'Developer Tools']
image: 'https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&w=1600&q=80'
imageAlt: 'A silver padlock'
---

AI coding agents are unusually good at touching places secrets should never go.

A human developer might export a token in one shell, use it for ten minutes, and forget about it. An agentic workflow is different. The shell history can be persisted. The terminal transcript can be captured. The agent can summarize its own commands. Wrapper scripts can echo environment state by accident. And unattended loops have more time than humans do to make one bad move with a real credential.

That is why `.env` files, exported shell variables, and hardcoded strings are a worse fit for AI-assisted tooling than they were for older, more manual workflows. The safer pattern is simple:

> Store the secret in the operating system’s native credential store, fetch it immediately before launching the tool that needs it, pass it only to that subprocess, and discard it as soon as the process exits.

The secret still exists in memory for a moment. Nothing about this pattern is magic. But it dramatically shrinks the number of places the secret can leak by accident: no checked-in `.env`, no long-lived exported variable in your shell profile, no plaintext sitting in a repo-local config file, and no reason for the model itself to ever see the value.

## The problem: plaintext secrets and AI workflows

Plaintext secret handling was always risky. AI workflows add a few new failure modes:

1. **Transcript leakage**: agent consoles, CI logs, and tool wrappers often record command lines and stdout
2. **Prompt/context leakage**: once a secret is pasted into the workflow, it can be copied into model context, summaries, or debugging output
3. **Long-lived environments**: autonomous agents may run for hours, which turns a temporary environment variable into a durable attack surface
4. **Accidental commits**: `.env` files and hand-written config are still one `git add .` away from a breach

The goal is not to pretend environment variables are perfect. They are not. The goal is to make them **short-lived and process-local** rather than file-backed and human-visible.

## The pattern in one sentence

Every platform-specific example in this article follows the same structure:

1. Store the secret in the OS credential store once
2. Retrieve it at invocation time
3. Inject it into a child process environment
4. Replace or exit the wrapper so the value dies with the process

That pattern keeps the credential out of the repository, out of the prompt, and usually out of day-to-day terminal ergonomics too.

## macOS: Keychain via `security`

Apple’s `security` tool supports both adding and retrieving generic passwords. The `add-generic-password` help text also documents two details that matter for automation: `-A` allows any application to access the item and is explicitly called out as insecure, while `-T` restricts access to a specific application path.[1]

### Store a secret

```bash
security add-generic-password \
  -a "$USER" \
  -s "ai/openai-api-key" \
  -T "/usr/local/bin/copilot" \
  -U \
  -w
```

Two nuances matter here:

- Put `-w` last so `security` prompts instead of forcing you to place the secret directly on the command line; Apple’s own help text warns that `-p` and `-w` are insecure when used inline.[1]
- Prefer `-T /path/to/binary` over `-A`; you want the narrowest practical access scope.[1]

### Retrieve a secret

```bash
security find-generic-password \
  -a "$USER" \
  -s "ai/openai-api-key" \
  -w
```

### Wrapper pattern

```bash
#!/usr/bin/env bash
set -euo pipefail

api_key="$(security find-generic-password -a "$USER" -s "ai/openai-api-key" -w)"
trap 'unset api_key OPENAI_API_KEY' EXIT

OPENAI_API_KEY="$api_key" exec copilot "$@"
```

This wrapper never writes the secret to disk. It never exports the value into your interactive shell session. And because it uses `exec`, the wrapper process is replaced by the target CLI instead of hanging around longer than necessary.

## Windows: PowerShell SecretManagement + SecretStore

On Windows, the most practical built-in path for shell automation is PowerShell’s SecretManagement abstraction plus the SecretStore vault. SecretManagement gives you a uniform set of cmdlets such as `Register-SecretVault`, `Set-Secret`, and `Get-Secret`, while SecretStore provides a local encrypted vault scoped to the current user.[2][3]

### Install and register the local vault

```powershell
Install-Module Microsoft.PowerShell.SecretManagement -Repository PSGallery
Install-Module Microsoft.PowerShell.SecretStore -Repository PSGallery

Register-SecretVault `
  -Name LocalStore `
  -ModuleName Microsoft.PowerShell.SecretStore `
  -DefaultVault
```

### Store a secret

```powershell
Set-Secret -Name 'OpenAI.ApiKey' -Vault LocalStore -Secret (Read-Host -AsSecureString)
```

### Retrieve a secret

`Get-Secret` returns `SecureString` by default for string secrets, and supports `-AsPlainText` when you explicitly need a string for a subprocess launch.[4]

```powershell
Get-Secret -Name 'OpenAI.ApiKey' -Vault LocalStore -AsPlainText
```

### Wrapper pattern

```powershell
$apiKey = Get-Secret -Name 'OpenAI.ApiKey' -Vault LocalStore -AsPlainText

try {
  $env:OPENAI_API_KEY = $apiKey
  & copilot @args
}
finally {
  Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue
  $apiKey = $null
}
```

One practical caveat: SecretStore is interactive by default, with password-based unlocking and a session timeout.[3] That is a good default for developer workstations. For unattended jobs, be deliberate: either unlock the store for the current PowerShell session up front, or use a different vault strategy designed for non-interactive environments.

## Linux: Secret Service with `secret-tool`

On Linux desktops, the common native path is the Freedesktop Secret Service API, usually backed by GNOME Keyring or KWallet. The `secret-tool` CLI exposes the essential operations directly: `store`, `lookup`, `clear`, `search`, and `lock`.[5]

### Store a secret

```bash
read -rsp 'OpenAI API key: ' api_key
printf '\n'
printf '%s' "$api_key" | secret-tool store \
  --label='OpenAI API key' \
  service ai/openai-api-key \
  account "$USER"
unset api_key
```

### Retrieve a secret

```bash
secret-tool lookup service ai/openai-api-key account "$USER"
```

### Wrapper pattern

```bash
#!/usr/bin/env bash
set -euo pipefail

api_key="$(secret-tool lookup service ai/openai-api-key account "$USER")"
trap 'unset api_key OPENAI_API_KEY' EXIT

OPENAI_API_KEY="$api_key" exec claude "$@"
```

The operational caveat on Linux is session state. Secret Service backends usually require an unlocked user session or keyring. That is fine for a developer workstation and less fine for a headless server unless you deliberately provision the keyring environment.

## Cross-platform abstraction: Python `keyring`

If your agent tooling is Python-based, `keyring` is the cleanest cross-platform abstraction. The library automatically picks an appropriate backend for the current environment—macOS Keychain, Freedesktop Secret Service, KWallet, or Windows Credential Locker among the recommended backends—and exposes a single API surface for read/write operations.[6]

### Basic usage

```python
import getpass
import keyring

keyring.set_password(
  'ai/openai-api-key',
  getpass.getuser(),
  getpass.getpass('OpenAI API key: '),
)
api_key = keyring.get_password('ai/openai-api-key', getpass.getuser())
```

### Just-in-time subprocess injection

```python
import getpass
import os
import subprocess

import keyring

service = 'ai/openai-api-key'
username = getpass.getuser()
api_key = keyring.get_password(service, username)

if not api_key:
  raise RuntimeError(f'Missing secret for {service}/{username}')

child_env = {**os.environ, 'OPENAI_API_KEY': api_key}
subprocess.run(['copilot', 'chat'], env=child_env, check=True)
api_key = None
```

This is a strong fit for Python-heavy agent runners because you keep one code path and let the backend adapt per platform.

Also note the trade-off called out by the project itself: the security model is inherited from the underlying OS backend. On macOS in particular, the `keyring` maintainers warn that any Python process using the same executable may be able to access previously stored secrets unless you tighten Keychain access control manually.[7]

## What “just-in-time” actually buys you

Just-in-time injection does **not** make secrets invisible to the target process. If the tool itself prints the key, logs its environment, or is actively malicious, you still have a problem.

What it does buy you is a major reduction in **accidental** exposure:

- no plaintext `.env` checked into the repo
- no shell profile exporting secrets for every future terminal
- no need to paste tokens into prompts or config files
- no long-lived parent-shell environment variables hanging around after the tool exits

That is the right mental model: **reduce persistence, reduce blast radius, reduce copy count**.

## Defense in depth: catch mistakes anyway

Even if you get storage right, you still want a backstop for the inevitable mistake. Gitleaks is useful here because it scans repositories, directories, or stdin for credentials and integrates cleanly with `pre-commit`.[8]

```yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.24.2
    hooks:
      - id: gitleaks
```

Then install the hook:

```bash
pre-commit install
```

This does not replace OS-native secret storage. It complements it. Think of it as your “I still screwed up once” control.

## My recommended policy for AI tooling

For senior teams rolling out agentic tooling, I would formalize a short policy:

1. **No repo-local plaintext secrets** for AI tools
2. **No persistent shell exports** in dotfiles for production-grade tokens
3. **All workstation secrets live in the OS credential store**
4. **Every agent wrapper fetches at invocation time**
5. **Every repo gets secret scanning in pre-commit and CI**

That policy is boring, which is exactly why it works.

## Conclusion

The most dangerous secret is not always the one an attacker steals. It is often the one your own tooling copies three extra times because the easiest setup path involved `.env`, `export`, and “I’ll clean it up later.”

AI coding agents amplify convenience decisions into system behavior. If you give them plaintext secrets, they will interact with those secrets across logs, wrappers, subprocesses, and unattended loops. If you force a just-in-time fetch from the OS credential store, you keep the exposure window small and the persistence near zero.

That is not perfect security. It is disciplined engineering. And for AI tooling, disciplined engineering is the difference between “credential available when needed” and “credential scattered everywhere.”

## References

1. [Apple Security Tool source (`add-generic-password`, `find-generic-password`, and `-T` access controls)](https://github.com/apple-oss-distributions/Security/blob/main/SecurityTool/macOS/security.c)
2. [PowerShell SecretManagement README](https://github.com/PowerShell/SecretManagement/blob/main/README.md)
3. [PowerShell SecretStore README](https://github.com/PowerShell/SecretStore/blob/main/README.md)
4. [MicrosoftDocs: `Get-Secret` cmdlet](https://github.com/MicrosoftDocs/PowerShell-Docs-Modules/blob/main/reference/ps-modules/Microsoft.PowerShell.SecretManagement/Get-Secret.md)
5. [GNOME libsecret `secret-tool` source](https://github.com/GNOME/libsecret/blob/main/tool/secret-tool.c)
6. [Python `keyring` README](https://github.com/jaraco/keyring/blob/main/README.rst)
7. [Python `keyring` security considerations](https://github.com/jaraco/keyring/blob/main/README.rst#security-considerations)
8. [Gitleaks README](https://github.com/gitleaks/gitleaks)
