/**
 * Locks in the contract for Page Builder's Submit for Review / Publish
 * buttons against issue #96 (QA-026): the previous handlers were
 * `console.log` stubs labelled `[FRAS] Submit for Review (stub)`. These
 * tests pin the URL/body shape and the discriminated-union return contract
 * so a future refactor can't quietly drop the wiring back to a stub.
 */

import { describe, expect, it, vi } from 'vitest'

import {
  buildPageTransitionBody,
  buildPageTransitionUrl,
  transitionPage,
} from './page-builder-workflow'

describe('buildPageTransitionUrl', () => {
  it('targets Payload\'s update-by-id route on the pages collection', () => {
    expect(buildPageTransitionUrl(42)).toBe('/api/pages/42')
    expect(buildPageTransitionUrl('homepage-id')).toBe('/api/pages/homepage-id')
  })

  it('does NOT append /transition, /workflow, /publish, or /submit segments', () => {
    const url = buildPageTransitionUrl(1)
    expect(url).not.toContain('/transition')
    expect(url).not.toContain('/workflow')
    expect(url).not.toContain('/submit')
    expect(url).not.toContain('/publish')
    expect(url).not.toContain('/builder')
  })
})

describe('buildPageTransitionBody', () => {
  it('sends only workflowState — no autosave / draft flags / status overrides', () => {
    expect(buildPageTransitionBody('in_review')).toEqual({ workflowState: 'in_review' })
    expect(buildPageTransitionBody('published')).toEqual({ workflowState: 'published' })
  })

  it('does not bury the field under _context (the bug pattern from #85)', () => {
    const body = buildPageTransitionBody('in_review')
    expect(body).not.toHaveProperty('_context')
  })
})

describe('transitionPage', () => {
  function fakeFetch(response: Response | (() => Promise<Response>)) {
    return vi.fn(async () =>
      typeof response === 'function' ? response() : response,
    ) as unknown as typeof fetch
  }

  it('returns ok:true on a 200 PATCH', async () => {
    const f = fakeFetch(new Response(JSON.stringify({ id: 1 }), { status: 200 }))
    const result = await transitionPage(1, 'in_review', f)
    expect(result).toEqual({ ok: true })
  })

  it('actually fires a PATCH (not the previous console.log stub)', async () => {
    const f = fakeFetch(new Response(null, { status: 200 }))
    await transitionPage(42, 'in_review', f)
    expect(f).toHaveBeenCalledTimes(1)
    const [url, init] = (f as unknown as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('/api/pages/42')
    expect(init.method).toBe('PATCH')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(init.credentials).toBe('same-origin')
    expect(JSON.parse(init.body)).toEqual({ workflowState: 'in_review' })
  })

  it('extracts the first error.message from a Payload JSON 400', async () => {
    const body = JSON.stringify({
      errors: [{ message: 'Invalid workflow transition: published -> in_review' }],
    })
    const f = fakeFetch(
      new Response(body, { status: 400, headers: { 'content-type': 'application/json' } }),
    )
    const result = await transitionPage(1, 'in_review', f)
    expect(result).toEqual({
      ok: false,
      status: 400,
      error: 'Invalid workflow transition: published -> in_review',
    })
  })

  it('falls back to plain text when the body is not JSON', async () => {
    const f = fakeFetch(new Response('Forbidden — not your page', { status: 403 }))
    const result = await transitionPage(1, 'published', f)
    expect(result).toMatchObject({ ok: false, status: 403 })
    if (!result.ok) expect(result.error).toContain('Forbidden')
  })

  it('strips HTML so a Next.js error page does not flood the banner', async () => {
    const html =
      '<!DOCTYPE html><html><body><h1>500 — Server Error</h1></body></html>'
    const f = fakeFetch(
      new Response(html, { status: 500, headers: { 'content-type': 'text/html' } }),
    )
    const result = await transitionPage(1, 'in_review', f)
    if (!result.ok) {
      expect(result.error).not.toContain('<')
      expect(result.error).not.toContain('>')
      expect(result.error.length).toBeLessThanOrEqual(200)
    }
  })

  it('returns a status fallback when the body is empty (e.g. 401)', async () => {
    const f = fakeFetch(new Response('', { status: 401 }))
    const result = await transitionPage(1, 'in_review', f)
    expect(result).toEqual({
      ok: false,
      status: 401,
      error: 'Transition failed (status 401)',
    })
  })

  it('reports network failures with status:null and a non-empty error', async () => {
    const f = vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    }) as unknown as typeof fetch
    const result = await transitionPage(1, 'in_review', f)
    expect(result).toEqual({ ok: false, status: null, error: 'Failed to fetch' })
  })
})
