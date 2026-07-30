import path from 'node:path'
import type { NextConfig } from 'next'

function normalizeBasePath(value: string | undefined): string {
  if (!value) return ''
  const trimmed = value.trim()
  if (!trimmed || trimmed === '/') return ''
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'
const isProjectPagesRepo = repoName.length > 0 && !repoName.endsWith('.github.io')
const configuredBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)
const inferredBasePath = isGithubActions && isProjectPagesRepo ? `/${repoName}` : ''
const basePath = configuredBasePath || inferredBasePath

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
