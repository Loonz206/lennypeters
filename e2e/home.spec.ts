import { test, expect } from '@playwright/test'

test('homepage loads and shows navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Lenny Peters/)
  await expect(page.getByRole('navigation')).toBeVisible()
})

test('homepage shows profile image', async ({ page }) => {
  await page.goto('/')
  const profileImage = page.getByRole('img', { name: 'Lenny Peters' })
  await expect(profileImage).toBeVisible()
  const src = await profileImage.getAttribute('src')
  expect(src).toMatch(/lenny\.jpeg/)
})
