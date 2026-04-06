import { test, expect } from '@playwright/test'

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
