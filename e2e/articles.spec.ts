import { test, expect } from '@playwright/test'

test('articles index renders Writing heading', async ({ page }) => {
  await page.goto('/articles')

  await expect(page).toHaveURL(/\/articles\/?$/)
  await expect(page.getByRole('heading', { name: 'Writing' })).toBeVisible()
})

test('articles index links to an article detail page', async ({ page }) => {
  await page.goto('/articles')

  const firstReadArticleLink = page.getByRole('link', { name: /^Read / }).first()
  await expect(firstReadArticleLink).toBeVisible()
  await firstReadArticleLink.click()

  await expect(page).toHaveURL(/\/articles\//)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
