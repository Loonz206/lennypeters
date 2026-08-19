import { test, expect } from '@playwright/test'

const secretsSlug = 'keeping-ai-agents-honest-os-native-secrets-storage-no-plaintext-required'

test('articles index renders Writing heading', async ({ page }) => {
  await page.goto('/articles')

  await expect(page).toHaveURL(/\/articles\/?$/)
  await expect(page.getByRole('heading', { name: 'Writing' })).toBeVisible()
})

test('articles index links to an article detail page', async ({ page }) => {
  await page.goto('/articles')

  const firstReadArticleLink = page.getByRole('link', { name: /^Read\s+/ }).first()
  await expect(firstReadArticleLink).toBeAttached()
  await expect(firstReadArticleLink).toBeVisible()
  await firstReadArticleLink.focus()
  await firstReadArticleLink.press('Enter')

  await expect(page).toHaveURL(/\/articles\/[^/]+\/?$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('unknown article slug returns 404 on direct load', async ({ page }) => {
  const response = await page.goto('/articles/this-article-does-not-exist')

  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
})

test('secrets article appears in the articles index listing', async ({ page }) => {
  await page.goto('/articles')

  const secretsLink = page.getByRole('link', {
    name: /Keeping AI Agents Honest/i,
  })
  await expect(secretsLink.first()).toBeVisible()
})

test('secrets article detail page renders its title and content', async ({ page }) => {
  await page.goto(`/articles/${secretsSlug}`)

  await expect(page).toHaveURL(new RegExp(secretsSlug))
  await expect(
    page.getByRole('heading', { name: /Keeping AI Agents Honest/i, level: 1 })
  ).toBeVisible()
  await expect(page.getByText(/OS-Native Secrets Storage/i).first()).toBeVisible()
})
