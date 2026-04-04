import { defineConfig, devices } from '@playwright/test'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'
const isProjectPagesRepo = repoName.length > 0 && !repoName.endsWith('.github.io')
const ciBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (isGithubActions && isProjectPagesRepo ? `/${repoName}` : '')
const baseURL = `http://localhost:3000${ciBasePath}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.CI
    ? {
        command: 'npx serve@latest out --listen 3000',
        url: 'http://localhost:3000',
        reuseExistingServer: false,
        timeout: 120 * 1000,
      }
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
})
