/**
 * @description
 * E2E tests for Phase 2 API routes.
 * Tests news, meetings, resources endpoints with valid params, empty results,
 * and edge cases.
 *
 * @notes
 * - Tests use page.request (Playwright APIRequestContext) for direct HTTP calls
 * - Validates response shape: { docs, totalDocs, totalPages, page }
 * - Tests RSS feed XML validity
 */
import { test, expect } from 'playwright/test'

test.describe('News API', () => {
  test('GET /api/news returns paginated results', async ({ request }) => {
    const response = await request.get('/api/news')
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('docs')
    expect(data).toHaveProperty('totalDocs')
    expect(data).toHaveProperty('totalPages')
    expect(Array.isArray(data.docs)).toBeTruthy()
  })

  test('GET /api/news with board filter returns filtered results', async ({ request }) => {
    const response = await request.get('/api/news?board=acsb')
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('docs')
  })

  test('GET /api/news with pagination params', async ({ request }) => {
    const response = await request.get('/api/news?page=1&limit=5')
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.docs.length).toBeLessThanOrEqual(5)
  })

  test('GET /api/news with invalid page returns gracefully', async ({ request }) => {
    const response = await request.get('/api/news?page=99999')
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.docs).toHaveLength(0)
  })
})

test.describe('Meetings API', () => {
  test('GET /api/meetings returns results', async ({ request }) => {
    const response = await request.get('/api/meetings')
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('docs')
    expect(Array.isArray(data.docs)).toBeTruthy()
  })

  test('GET /api/meetings with timeframe=upcoming', async ({ request }) => {
    const response = await request.get('/api/meetings?timeframe=upcoming')
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('docs')
  })

  test('GET /api/meetings with timeframe=past', async ({ request }) => {
    const response = await request.get('/api/meetings?timeframe=past')
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('docs')
  })

  test('GET /api/meetings with board filter', async ({ request }) => {
    const response = await request.get('/api/meetings?board=acsb&timeframe=upcoming')
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('docs')
  })
})

test.describe('Resources API', () => {
  test('GET /api/resources returns results', async ({ request }) => {
    const response = await request.get('/api/resources')
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('docs')
    expect(Array.isArray(data.docs)).toBeTruthy()
  })
})

test.describe('RSS Feed', () => {
  test('GET /api/rss returns valid RSS XML', async ({ request }) => {
    const response = await request.get('/api/rss')
    expect(response.status()).toBe(200)

    const contentType = response.headers()['content-type']
    expect(contentType).toContain('xml')

    const body = await response.text()
    // Valid RSS 2.0 structure
    expect(body).toContain('<?xml')
    expect(body).toContain('<rss')
    expect(body).toContain('<channel>')
    expect(body).toContain('<title>')
    expect(body).toContain('</rss>')
  })

  test('GET /api/rss/acsb returns board-specific feed', async ({ request }) => {
    const response = await request.get('/api/rss/acsb')
    expect(response.status()).toBe(200)

    const body = await response.text()
    expect(body).toContain('<rss')
    expect(body).toContain('AcSB')
  })

  test('GET /api/rss/invalid-board returns feed (possibly empty)', async ({ request }) => {
    const response = await request.get('/api/rss/nonexistent-board')
    // Should still return valid XML, just with no items
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toContain('<rss')
  })
})
