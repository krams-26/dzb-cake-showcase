import { test, expect } from '@playwright/test'

test.describe('smoke', () => {
  test('accueil charge le titre DzB', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByText('DzB Cake', { exact: false }).first()).toBeVisible()
  })

  test('page catalogue est accessible', async ({ page }) => {
    await page.goto('/cakes', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/cakes/)
  })

  test('page confirmation commande sans erreur', async ({ page }) => {
    await page.goto('/order/confirmed', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
