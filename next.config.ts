import path from 'node:path'
import type { NextConfig } from 'next'

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

const configuredBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)

let basePath = configuredBasePath

if (!basePath) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const customDomain = process.env.CUSTOM_DOMAIN

  if (!usesCustomDomain(siteUrl, customDomain)) {
    const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
    const isGithubActions = process.env.GITHUB_ACTIONS === 'true'
    const isProjectPagesRepo = repoName.length > 0 && !repoName.endsWith('.github.io')

    if (isGithubActions && isProjectPagesRepo) {
      basePath = `/${repoName}`
    }
  }
}

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

export default nextConfig
