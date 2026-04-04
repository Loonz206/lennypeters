import { test, expect } from '@playwright/test'

test('about page renders profile heading', async ({ page }) => {
  await page.goto('/about')

  await expect(page).toHaveURL(/\/about\/?$/)
  await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible()
})
