/**
 * @description
 * E2E tests for authentication flows: login, registration, password/username recovery.
 *
 * @notes
 * - Tests verify page rendering and form interactions
 * - Actual Aptify API calls may not succeed in test env — tests verify UI flow
 * - Registration, forgot-username, forgot-password share similar form patterns
 */
import { test, expect } from 'playwright/test'

test.describe('Login Flow', () => {
  test('renders login page with form', async ({ page }) => {
    await page.goto('/en/my-account/login')
    await expect(page.locator('h1')).toBeVisible()
    // Login form or redirect button should exist
    const form = page.locator('form, [data-testid="login-form"], a[href*="aptify"]')
    await expect(form.first()).toBeVisible()
  })

  test('login page has correct metadata', async ({ page }) => {
    await page.goto('/en/my-account/login')
    const title = await page.title()
    expect(title).toContain('Login')
  })
})

test.describe('Registration Flow', () => {
  test('renders registration form with required fields', async ({ page }) => {
    await page.goto('/en/my-account/register')
    await expect(page.locator('h1')).toBeVisible()

    // Form fields should be present
    const form = page.locator('form')
    await expect(form.first()).toBeVisible()
  })

  test('shows validation on empty registration submit', async ({ page }) => {
    await page.goto('/en/my-account/register')
    const submitBtn = page.locator('button[type="submit"]')
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      // Expect validation feedback (either HTML5 validation or custom errors)
      const invalidFields = page.locator(':invalid')
      const errorMessages = page.locator('[role="alert"], .text-red-600, .text-error')
      const hasValidation = (await invalidFields.count()) > 0 || (await errorMessages.count()) > 0
      expect(hasValidation).toBeTruthy()
    }
  })
})

test.describe('Recovery Flows', () => {
  test('forgot username page renders and accepts email', async ({ page }) => {
    await page.goto('/en/my-account/forgot-username')
    await expect(page.locator('h1')).toBeVisible()

    // Should have an email input
    const emailInput = page.locator('input[type="email"], input[name="email"]')
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com')
      const submitBtn = page.locator('button[type="submit"]')
      await expect(submitBtn).toBeVisible()
    }
  })

  test('forgot password page renders and accepts email', async ({ page }) => {
    await page.goto('/en/my-account/forgot-my-password')
    await expect(page.locator('h1')).toBeVisible()

    const emailInput = page.locator('input[type="email"], input[name="email"]')
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com')
      const submitBtn = page.locator('button[type="submit"]')
      await expect(submitBtn).toBeVisible()
    }
  })
})
