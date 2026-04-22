#!/usr/bin/env node
/**
 * pre-tool-policy.js
 *
 * Pre-tool-use policy enforcement for GitHub Copilot agents.
 * Runs before every agent tool call via the preToolUse hook.
 *
 * Reads a JSON payload from stdin (GitHub's preToolUse input schema).
 * Outputs a JSON deny object and exits 0 to block a call, or exits 0
 * silently to allow it. Never exits non-zero — that would be treated as
 * a hook error rather than a policy decision.
 *
 * Enforced policies (v1):
 *  - bash: privilege escalation, root-destructive commands, download-and-execute,
 *          destructive git operations
 *  - edit / create: deny writes outside approved paths; always deny sensitive
 *          infrastructure files regardless of path
 */

'use strict'

// ---------------------------------------------------------------------------
// Output helpers
// ---------------------------------------------------------------------------

function deny(reason) {
  process.stdout.write(
    JSON.stringify({ permissionDecision: 'deny', permissionDecisionReason: reason }) + '\n'
  )
  process.exit(0)
}

function allow() {
  process.exit(0)
}

// ---------------------------------------------------------------------------
// Shell command policies
// ---------------------------------------------------------------------------

/**
 * Each entry has `test(command)` returning a boolean, plus a `reason` string.
 * Using explicit functions rather than bare RegExp literals so the force-push
 * check can exclude --force-with-lease without negative lookahead.
 */
const SHELL_DENY_RULES = [
  {
    // Privilege escalation
    test: cmd => /\b(sudo|su|runas)\b/.test(cmd),
    reason: 'Privilege escalation requires manual approval.',
  },
  {
    // rm -rf targeting the filesystem root, home dir, or a bare wildcard at root.
    // Intentionally narrow: rm -rf dist/ and rm -rf node_modules/ are allowed.
    test: cmd =>
      /\brm\b/.test(cmd) &&
      /-[rRfF]{1,4}/.test(cmd) &&
      /(^|\s)(\/\s*$|\/\s|~\/?\s*$|~\/?\s|\*\s*$)/.test(cmd),
    reason: 'Destructive rm commands targeting the filesystem root or home directory are blocked.',
  },
  {
    // Low-level disk/storage operations
    test: cmd => /\b(mkfs|diskutil\s+erase|format)\b/i.test(cmd),
    reason: 'System-destructive storage commands are blocked.',
  },
  {
    // dd writing to a raw device
    test: cmd => /\bdd\b/.test(cmd) && /\bof=\/dev\//.test(cmd),
    reason: 'Writing directly to a raw device is blocked.',
  },
  {
    // curl / wget piped straight to a shell
    test: cmd => /(curl|wget)\b[^|]*\|\s*(bash|sh|zsh|fish|dash|ksh)\b/.test(cmd),
    reason: 'Download-and-execute commands require manual review.',
  },
  {
    // PowerShell download-and-execute
    test: cmd => /iex\s*[\(\$].*irm\b/i.test(cmd) || /Invoke-Expression.*DownloadString/i.test(cmd),
    reason: 'Download-and-execute commands require manual review.',
  },
]

/**
 * Destructive git operations the repo instructions already prohibit.
 * Kept separate so they can be reviewed and tuned independently.
 */
const GIT_DENY_RULES = [
  {
    test: cmd => /\bgit\s+reset\s+--hard\b/.test(cmd),
    reason: 'git reset --hard discards all uncommitted changes and requires manual approval.',
  },
  {
    // git checkout -- . or git checkout -- <file> (discard working-tree changes)
    test: cmd => /\bgit\s+checkout\s+--\s+/.test(cmd),
    reason: 'git checkout -- (discard working-tree changes) requires manual approval.',
  },
  {
    // git clean -f, -fd, -fx, -fX — any force-clean variant
    test: cmd => /\bgit\s+clean\b/.test(cmd) && /-\w*f\w*/i.test(cmd),
    reason: 'git clean with force flags requires manual approval.',
  },
  {
    // git push --force but NOT --force-with-lease (safer alternative is allowed)
    test: cmd =>
      /\bgit\s+push\b/.test(cmd) && /--force\b/.test(cmd) && !cmd.includes('--force-with-lease'),
    reason: 'Force push requires manual approval. Use --force-with-lease if absolutely necessary.',
  },
  {
    // git push -f (short flag)
    test: cmd => /\bgit\s+push\b/.test(cmd) && /\s-f(\s|$)/.test(cmd),
    reason: 'Force push (-f) requires manual approval.',
  },
]

// ---------------------------------------------------------------------------
// Write path policies
// ---------------------------------------------------------------------------

/**
 * Paths that are always denied regardless of context.
 * Checked before the allowed-paths list.
 */
const WRITE_DENY_RULES = [
  {
    test: p => /^\.github\/workflows\//.test(p),
    reason: 'Edits to CI/CD workflow files require manual approval.',
  },
  {
    // .env, .env.local, .env.production, my-config.env, etc.
    test: p => /(^|\/)\.env(\.[^/]*)?$/.test(p) || /\.env(\.[^/]*)?$/.test(p),
    reason: 'Edits to env files are blocked — they may contain secrets.',
  },
  {
    test: p => /^certificates\//.test(p),
    reason: 'Edits to certificate files require manual approval.',
  },
  {
    // Certificate / private-key file extensions anywhere in the tree
    test: p => /\.(pem|key|crt|p12|pfx|der|cer)$/.test(p),
    reason: 'Edits to certificate or private-key files require manual approval.',
  },
  {
    test: p => /^\.husky\//.test(p),
    reason: 'Edits to git hook scripts require manual approval.',
  },
]

/**
 * Path prefixes that are always allowed.
 */
const ALLOWED_PREFIXES = [
  'src/',
  'content/articles/',
  'e2e/',
  'public/',
  '.github/agents/',
  '.github/instructions/',
  '.github/skills/',
  '.github/prompts/',
  '.github/hooks/',
  '.github/ISSUE_TEMPLATE/',
]

/**
 * Individual paths that are always allowed.
 */
const ALLOWED_EXACT = new Set([
  '.github/FLOW.md',
  '.github/copilot-instructions.md',
  '.github/AGENT_LEARNINGS.md',
])

/**
 * Returns { deny: false } to allow, or { deny: true, reason } to block.
 */
function checkWritePath(rawPath) {
  // Normalise: strip leading ./ or /; convert backslashes for Windows paths
  const p = rawPath.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\//, '')

  // 1. Explicit deny list (highest priority — always checked first)
  for (const rule of WRITE_DENY_RULES) {
    if (rule.test(p)) return { deny: true, reason: rule.reason }
  }

  // 2. Explicitly allowed prefixes
  for (const prefix of ALLOWED_PREFIXES) {
    if (p.startsWith(prefix)) return { deny: false }
  }

  // 3. Explicitly allowed exact paths
  if (ALLOWED_EXACT.has(p)) return { deny: false }

  // 4. Root-level files (no directory separator).
  //    Config files like package.json, jest.config.js, tsconfig.json, etc.
  //    The deny list above already blocks .env and similar at root.
  if (!p.includes('/')) return { deny: false }

  // 5. Test/spec files anywhere in the tree
  if (/\.(test|spec)\.(ts|tsx|js|jsx)$/.test(p)) return { deny: false }

  // 6. Not in any approved location — deny with a helpful message
  return {
    deny: true,
    reason:
      `Edits to '${p}' are outside approved paths. ` +
      'Approved: src/, content/articles/, e2e/, public/, ' +
      '.github/ (agents, instructions, skills, prompts, hooks), ' +
      'and root-level config files.',
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  let raw = ''

  process.stdin.setEncoding('utf8')
  process.stdin.on('data', chunk => {
    raw += chunk
  })

  process.stdin.on('end', () => {
    // --- Parse input ---
    let input
    try {
      input = JSON.parse(raw.trim())
    } catch {
      // Malformed hook payload — fail open so the agent is not permanently
      // blocked by a hook configuration problem.
      allow()
      return
    }

    const toolName = (input.toolName || '').toLowerCase()

    let toolArgs = {}
    try {
      toolArgs =
        typeof input.toolArgs === 'string' ? JSON.parse(input.toolArgs) : input.toolArgs || {}
    } catch {
      // Unparseable args — fail open
      allow()
      return
    }

    // --- bash: check for dangerous shell and git commands ---
    if (toolName === 'bash') {
      const command = String(toolArgs.command || toolArgs.cmd || '')

      for (const rule of SHELL_DENY_RULES) {
        if (rule.test(command)) {
          deny(rule.reason)
          return
        }
      }

      for (const rule of GIT_DENY_RULES) {
        if (rule.test(command)) {
          deny(rule.reason)
          return
        }
      }
    }

    // --- edit / create: check write path policy ---
    if (toolName === 'edit' || toolName === 'create') {
      const filePath = String(toolArgs.path || toolArgs.file_path || toolArgs.filePath || '')

      if (filePath) {
        const result = checkWritePath(filePath)
        if (result.deny) {
          deny(result.reason)
          return
        }
      }
    }

    // --- Allow everything else ---
    allow()
  })
}

main()
