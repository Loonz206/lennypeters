import { test, expect } from '@playwright/test'

test('homepage loads and shows navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Lenny Peters/)
  await expect(page.getByRole('navigation')).toBeVisible()
})
