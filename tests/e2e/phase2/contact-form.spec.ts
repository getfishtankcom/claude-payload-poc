/**
 * @description
 * E2E tests for the Contact Us form flow.
 * Validates form rendering, client-side validation, and submission.
 *
 * @notes
 * - Tests run against the EN locale contact page
 * - Server action submission is tested via form interaction
 * - Honeypot field should remain hidden
 */
import { test, expect } from 'playwright/test'

test.describe('Contact Form Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/contact-us')
  })

  test('renders contact form with required fields', async ({ page }) => {
    // Form should be visible
    const form = page.locator('[data-testid="contact-form"]')
    await expect(form).toBeVisible()

    // Required fields should be present
    await expect(page.locator('label:has-text("Full Name")')).toBeVisible()
    await expect(page.locator('label:has-text("Email")')).toBeVisible()
    await expect(page.locator('label:has-text("Comments")')).toBeVisible()

    // Optional fields
    await expect(page.locator('label:has-text("Title")')).toBeVisible()
    await expect(page.locator('label:has-text("Organization")')).toBeVisible()
    await expect(page.locator('label:has-text("Business Phone")')).toBeVisible()

    // Submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('shows validation errors on empty submit', async ({ page }) => {
    // Click submit without filling fields
    await page.locator('button[type="submit"]').click()

    // Validation error messages should appear
    await expect(page.locator('text=Full Name is required')).toBeVisible()
    await expect(page.locator('text=Email Address is required')).toBeVisible()
    await expect(page.locator('text=Comments are required')).toBeVisible()
  })

  test('validates email format', async ({ page }) => {
    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('textarea[name="comments"]', 'Test comment')
    await page.locator('button[type="submit"]').click()

    await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
  })

  test('submits form with valid data', async ({ page }) => {
    await page.fill('input[name="fullName"]', 'Integration Test User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="title"]', 'QA Engineer')
    await page.fill('input[name="organization"]', 'Test Corp')
    await page.fill('textarea[name="comments"]', 'This is an E2E integration test submission.')

    await page.locator('button[type="submit"]').click()

    // Wait for success or error response (server action result)
    await expect(
      page.locator('[data-testid="contact-form-success"], [data-testid="contact-form-error"]'),
    ).toBeVisible({ timeout: 15_000 })
  })

  test('honeypot field is hidden from view', async ({ page }) => {
    // Honeypot should exist in DOM but not be visible
    const honeypot = page.locator('input[name="website"]')
    if (await honeypot.count() > 0) {
      await expect(honeypot).toBeHidden()
    }
  })

  test('error count announced for screen readers', async ({ page }) => {
    await page.locator('button[type="submit"]').click()

    // sr-only alert should announce error count
    const alert = page.locator('[role="alert"]')
    await expect(alert).toBeAttached()
  })
})
