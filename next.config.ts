import path from 'node:path'
import type { NextConfig } from 'next'
import { version as appVersion } from './package.json'

function normalizeBasePath(value: string | undefined): string {
  if (!value) return ''
  const trimmed = value.trim()
  if (!trimmed || trimmed === '/') return ''
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH)

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    // Single source of truth for the site version is package.json.
    // Bumping it (pnpm version patch|minor|major) auto-updates the UI on next build.
    NEXT_PUBLIC_APP_VERSION: appVersion,
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
    includePaths: [path.join(import.meta.dirname, 'styles')],
  },
}

export default nextConfig
