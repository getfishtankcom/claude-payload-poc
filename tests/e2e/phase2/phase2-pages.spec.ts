/**
 * @description
 * Smoke tests for all Phase 2 page types.
 * Verifies each page loads with 200 status and renders key elements.
 *
 * @notes
 * - Tests cover members, committees, standards, effective-dates,
 *   job-opportunities, meetings-and-events, resources, news-listings
 * - Uses data-testid attributes added during Phase 2 implementation
 */
import { test, expect } from 'playwright/test'

test.describe('Phase 2 Page Smoke Tests', () => {
  test('members page renders with content', async ({ page }) => {
    const response = await page.goto('/en/acsb/about/members')
    expect(response?.status()).toBe(200)
    await expect(page.locator('[data-testid="page-members"]')).toBeVisible()
    await expect(page.locator('h1')).toContainText('Members')
  })

  test('committees page renders with content', async ({ page }) => {
    const response = await page.goto('/en/acsb/committees')
    expect(response?.status()).toBe(200)
    await expect(page.locator('[data-testid="page-committees"]')).toBeVisible()
    await expect(page.locator('h1')).toContainText('Committees')
  })

  test('standards overview page renders', async ({ page }) => {
    const response = await page.goto('/en/standards/ifrs')
    expect(response?.status()).toBe(200)
    await expect(page.locator('[data-testid="page-standards-overview"]')).toBeVisible()
  })

  test('effective dates page renders', async ({ page }) => {
    const response = await page.goto('/en/standards/ifrs/effective-dates')
    expect(response?.status()).toBe(200)
    await expect(page.locator('[data-testid="page-effective-dates"]')).toBeVisible()
  })

  test('job opportunities page renders', async ({ page }) => {
    const response = await page.goto('/en/job-opportunities')
    expect(response?.status()).toBe(200)
    await expect(page.locator('[data-testid="page-job-opportunities"]')).toBeVisible()
  })

  test('board meetings-and-events page renders', async ({ page }) => {
    const response = await page.goto('/en/acsb/meetings-and-events')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('board resources page renders', async ({ page }) => {
    const response = await page.goto('/en/acsb/resources')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('board news-listings page renders', async ({ page }) => {
    const response = await page.goto('/en/acsb/news-listings')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('board documents page renders', async ({ page }) => {
    const response = await page.goto('/en/acsb/documents')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('contact-us page renders', async ({ page }) => {
    const response = await page.goto('/en/contact-us')
    expect(response?.status()).toBe(200)
    await expect(page.locator('[data-testid="contact-form"]')).toBeVisible()
  })

  test('search page renders', async ({ page }) => {
    const response = await page.goto('/en/search')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
  })
})

test.describe('Phase 2 SEO Metadata', () => {
  test('members page has title metadata', async ({ page }) => {
    await page.goto('/en/acsb/about/members')
    const title = await page.title()
    expect(title).toContain('Members')
    expect(title).toContain('FRAS')
  })

  test('committees page has title metadata', async ({ page }) => {
    await page.goto('/en/acsb/committees')
    const title = await page.title()
    expect(title).toContain('Committees')
    expect(title).toContain('FRAS')
  })

  test('standards page has title metadata', async ({ page }) => {
    await page.goto('/en/standards/ifrs')
    const title = await page.title()
    expect(title).toContain('FRAS')
  })

  test('job opportunities page has title metadata', async ({ page }) => {
    await page.goto('/en/job-opportunities')
    const title = await page.title()
    expect(title).toContain('Job Opportunities')
  })
})
