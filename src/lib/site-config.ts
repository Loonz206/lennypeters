function normalizeBasePath(value: string | undefined): string {
  if (!value) return ''

  const trimmed = value.trim()

  if (!trimmed || trimmed === '/') return ''

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

function getHostname(url: string | undefined): string {
  if (!url) return ''

  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return ''
  }
}

function usesCustomDomain(siteUrl: string | undefined, customDomain: string | undefined): boolean {
  if (customDomain?.trim()) return true

  const hostname = getHostname(siteUrl?.trim())

  if (!hostname) return false

  return hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.endsWith('.github.io')
}

interface ResolveBasePathOptions {
  readonly configuredBasePath?: string
  readonly customDomain?: string
  readonly githubActions?: string
  readonly githubRepository?: string
  readonly siteUrl?: string
}

export function resolveBasePath({
  configuredBasePath,
  customDomain,
  githubActions,
  githubRepository,
  siteUrl,
}: ResolveBasePathOptions): string {
  const basePath = normalizeBasePath(configuredBasePath)

  if (basePath) return basePath

  if (usesCustomDomain(siteUrl, customDomain)) return ''

  const repoName = githubRepository?.split('/')[1] ?? ''
  const isProjectPagesRepo = repoName.length > 0 && !repoName.endsWith('.github.io')

  if (githubActions === 'true' && isProjectPagesRepo) {
    return `/${repoName}`
  }

  return ''
}
