---
title: 'Pinning NPM Modules to Reduce Supply Chain Risk'
author: 'Lenny Peters'
date: '2026-10-24'
excerpt: 'A practical guide to pinning dependency versions, enforcing release age, and using Dependabot and Snyk to reduce npm supply-chain risk.'
tags: ['npm', 'Security', 'Supply Chain', 'Dependency Management', 'Node.js']
image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80'
imageAlt: 'Terminal window showing dependency package versions and a security checklist'
---

A dependency is code that runs in your build, test, and production environment, so package management is a security control rather than a maintenance chore.[1]

For most teams, the strongest approach is layered: pin the versions that matter, enforce a release-age policy where the package manager supports it, and add automation that slows risky upgrades until the team has time to review them. This article focuses on the practical workflow for npm, pnpm, and Yarn, with a process you can start using this week.

## Why pinning matters in real projects

A dependency graph is not static. It changes every time a lockfile is refreshed or a library updates a nested package. That creates risk. A freshly published version can be harmless, unstable, or malicious. In the worst case, the package is installed into CI before anybody has time to notice.[2]

That is why strong teams treat dependency rules as a supply-chain control. The key questions are:

- Which direct dependencies should we explicitly pin?
- Which transitive dependencies matter enough to override?
- Which package manager settings should delay new versions long enough for the ecosystem to react?
- Which automation should watch for risky upgrades?

The short answer is that you need all three layers: version pinning, age-based enforcement, and automation. None of them alone is enough.

## Start with explicit pinning

The easiest place to start is `overrides` in npm. This lets you force a known-good version of a dependency anywhere in the dependency tree. It is especially useful when a library you trust pulls in a risky nested package.[3]

```json
{
  "name": "secure-webapp",
  "overrides": {
    "lodash": "4.17.21",
    "vite": "5.4.19",
    "axios": "1.7.7"
  }
}
```

This does not replace a dependency update routine. It gives you a guardrail: if one of your libraries drifts to a problematic nested version, the app still resolves the version you explicitly trust.

If you use Yarn, the equivalent is the `resolutions` field in `package.json`. It is a common way to pin nested dependencies across the graph.[4]

```json
{
  "resolutions": {
    "minimatch": "3.0.5",
    "axios": "1.7.7"
  }
}
```

In pnpm, the stronger default is `minimumReleaseAge`. This blocks installation of package versions that are too new. The idea is simple: do not trust freshly published packages until they have spent time in the wild.[5]

```yaml
# pnpm-workspace.yaml
minimumReleaseAge: 1440
minimumReleaseAgeStrict: true
```

A 24-hour threshold is a good baseline for many teams. If your organization is more cautious, use 72 hours or more. The goal is not to freeze the stack. The goal is to reduce the chance that automation picks up a malicious or unstable package before the ecosystem catches up.

## Enforce a minimum age in npm too

npm also supports a minimum release age policy. This complements `overrides` rather than replacing it. `overrides` answers, "What exact version should I force?" while `minimumReleaseAge` answers, "How old must a version be before I accept it?"[1], [6]

If you want a practical default, add this to `.npmrc`:

```ini
minimum-release-age=1440
```

Or pass it at install time:

```bash
npm install --minimum-release-age=1440
```

This is easy to adopt in CI and gives you a clear security boundary. A very new package is treated as untrusted until it has aged enough to clear the threshold.

> A minimum-age policy is not a substitute for code review or vulnerability scanning. It is a delay window that reduces the chance of adopting a compromised update too quickly.

## A workflow that is realistic for a team

The best package policy is boring and repeatable. A practical workflow looks like this:

1. Commit a lockfile and keep it in review.
2. Use `overrides` or `resolutions` for the few transitive dependencies that matter most.
3. Turn on `minimumReleaseAge` in npm or pnpm.
4. Configure Dependabot with a short cooldown so updates do not land immediately after publication.
5. Run Snyk or another scanner to review vulnerabilities and license risk.
6. Patch critical issues quickly while leaving the rest of the update cycle controlled.

This is how a team prevents dependency updates from becoming noisy, low-quality work.

## Use Dependabot to slow risky updates

GitHub Dependabot supports a cooldown or minimum-age setting for version updates. That is a strong fit for open source projects because it gives maintainers a small delay before a new dependency version turns into a pull request.[7]

```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'daily'
    cooldown:
      default-days: 3
```

This matters because a dependency update can be a security fix, a maintenance bump, or a malicious release. The project should not treat those as equally safe just because they were published recently. A cooldown creates a buffer so the team can evaluate the change before it reaches the branch.

If your organization has a stronger risk posture, a longer delay like seven days is reasonable. The exact number is less important than the fact that the process is intentional.

## Pair this with Snyk, but do not expect a magical minimum-age switch

Snyk is useful for vulnerability and license management, and it is often part of a good dependency security workflow. However, it does not usually provide a direct, out-of-the-box “minimum package age” gate in the same way a package manager or Dependabot cooldown does. Instead, Snyk focuses on finding vulnerable packages, prioritizing risks, and enforcing security policy.[8]

That is still valuable. It means a mature team should use Snyk to catch known issues while also using npm or pnpm `minimumReleaseAge` to delay adoption of brand-new package versions. The controls complement each other.

## A practical starter policy for a real project

A realistic starting point looks like this:

```json
{
  "overrides": {
    "lodash": "4.17.21",
    "axios": "1.7.7"
  }
}
```

```ini
minimum-release-age=1440
```

```yaml
# pnpm-workspace.yaml
minimumReleaseAge: 1440
minimumReleaseAgeStrict: true
```

```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'daily'
    cooldown:
      default-days: 3
```

That setup is not excessive. It gives you a consistent policy: you still upgrade, but you do not immediately trust any freshly published dependency version.

## Example in practice

Imagine a React app using a library that pulls in several nested dependencies. One morning, a new version lands in the registry. Without policy controls, CI can pick it up immediately. With the controls above, the path is different:

- npm or pnpm rejects the version because it is too new
- Dependabot waits until the cooldown window clears
- Snyk identifies any known issues before the team merges the update
- the team reviews the dependency change with more context and less urgency

That is the point. You do not stop upgrades. You create a safer timeline so the dependency ecosystem has time to react before your project adopts the change.

## Conclusion

Pinning and age-based enforcement are practical security steps, not academic ones. In npm, Yarn, and pnpm, you have a straightforward way to push the risk down into policy instead of relying on trust. Combine package-manager rules with GitHub Dependabot cooldowns and a scanner like Snyk, and your project gets a much healthier dependency lifecycle.

The best approach is small and repeatable: start with the few transitive dependencies that matter, enable a minimum age threshold, and configure a short cooldown for automated PRs. That is enough to make dependency updates less brittle without turning the process into a full-time compliance effort.[1], [2], [3], [6], [7]

## References

1. [npm Docs — package.json overrides](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides)
2. [npm Docs — configuring npm minimum release age](https://docs.npmjs.com/cli/v11/using-npm/configuring-npm#minimum-release-age)
3. [pnpm Docs — supply chain security and minimum release age](https://pnpm.io/security/minimum-release-age)
4. [Yarn Docs — selective dependency resolutions](https://yarnpkg.com/configuration/manifest#resolutions)
5. [GitHub Blog — The case for a cooldown: why Dependabot waits before issuing version updates](https://github.blog/security/supply-chain-security/the-case-for-a-cooldown-why-dependabot-now-waits-before-issuing-version-updates/)
6. [Snyk Docs — policies](https://docs.snyk.io/scan-fix-and-prevent/prevent/policies)
7. [GitHub Changelog — Dependabot supports minimum package age](https://github.blog/changelog/2025-07-01-dependabot-supports-configuration-of-a-minimum-package-age/)
8. [Snyk Docs — license and security policy management](https://docs.snyk.io/scan-fix-and-prevent/prevent/policies)
