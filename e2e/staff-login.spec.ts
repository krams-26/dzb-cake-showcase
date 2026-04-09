import { test, expect } from '@playwright/test'

const email = process.env.E2E_STAFF_EMAIL
const password = process.env.E2E_STAFF_PASSWORD

test('connexion personnel puis tableau de bord', async ({ page }) => {
  test.skip(!email || !password, 'Définir E2E_STAFF_EMAIL et E2E_STAFF_PASSWORD')

  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.getByLabel(/e-mail|email/i).fill(email!)
  await page.getByLabel(/mot de passe|password/i).fill(password!)
  await page.getByRole('button', { name: /connecter|sign in|injira/i }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 30_000 })
  await expect(page.getByText(/revenu|revenue|dashboard|tableau/i).first()).toBeVisible({ timeout: 15_000 })
})
