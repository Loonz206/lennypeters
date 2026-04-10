import path from 'node:path'
import type { NextConfig } from 'next'
import { resolveBasePath } from '@/lib/site-config'

const basePath = resolveBasePath({
  configuredBasePath: process.env.NEXT_PUBLIC_BASE_PATH,
  customDomain: process.env.GITHUB_PAGES_CUSTOM_DOMAIN,
  githubActions: process.env.GITHUB_ACTIONS,
  githubRepository: process.env.GITHUB_REPOSITORY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
})

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
