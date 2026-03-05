/**
 * @description
 * E2E tests for bilingual navigation (EN ↔ FR).
 * Verifies language switcher preserves page path and loads correct locale.
 *
 * @notes
 * - Tests use the language-switcher data-testid
 * - Verifies URL locale prefix changes
 * - Checks that translated page content loads
 */
import { test, expect } from 'playwright/test'

test.describe('Bilingual Navigation', () => {
  test('EN homepage has language switcher to FR', async ({ page }) => {
    await page.goto('/en')
    const switcher = page.locator('[data-testid="language-switcher"]')
    await expect(switcher).toBeVisible()
    await expect(switcher).toContainText('Francais')
  })

  test('switching from EN to FR changes URL locale prefix', async ({ page }) => {
    await page.goto('/en/contact-us')
    const switcher = page.locator('[data-testid="language-switcher"]')
    await switcher.click()

    // Should navigate to FR version of the same page
    await page.waitForURL(/\/fr\//)
    expect(page.url()).toContain('/fr/')
  })

  test('FR page has switcher back to EN', async ({ page }) => {
    await page.goto('/fr')
    const switcher = page.locator('[data-testid="language-switcher"]')
    await expect(switcher).toBeVisible()
    await expect(switcher).toContainText('English')
  })

  test('language switch preserves page path for board pages', async ({ page }) => {
    await page.goto('/en/boards/acsb')

    const switcher = page.locator('[data-testid="language-switcher"]')
    if (await switcher.isVisible()) {
      await switcher.click()
      await page.waitForURL(/\/fr\//)
      // Path after locale should be preserved
      expect(page.url()).toMatch(/\/fr\/.*acsb/)
    }
  })

  test('both locales return 200 for static pages', async ({ page }) => {
    const pages = ['/contact-us', '/job-opportunities', '/active-projects']
    for (const path of pages) {
      const enResponse = await page.goto(`/en${path}`)
      expect(enResponse?.status()).toBe(200)

      const frResponse = await page.goto(`/fr${path}`)
      expect(frResponse?.status()).toBe(200)
    }
  })
})
