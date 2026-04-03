import { test, expect } from '@playwright/test'

test('work page renders project heading', async ({ page }) => {
  await page.goto('/work')

  await expect(page).toHaveURL('/work')
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible()
})
