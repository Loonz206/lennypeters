import { test, expect } from '@playwright/test'

test('unknown route shows 404 page', async ({ page }) => {
  await page.goto('/this-route-does-not-exist')

  await expect(page).toHaveURL('/this-route-does-not-exist/')
  await expect(page.getByRole('heading', { name: '404 error' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Return to Mainframe' })).toBeVisible()
})
