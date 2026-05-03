/**
 * Locks in the contract for Workbox's workflow PATCH so the bugs from
 * issue #85 (QA-015) cannot regress:
 *
 * - PATCH `/api/{collection}/{id}` (not `/api/{collection}/{id}/transitions`
 *   or anything custom — Payload's update-by-id route is the only thing
 *   that exists).
 * - The body sends `workflowState` plus an optional top-level
 *   `workflowComment` — never wrapped in `_context`. The hook reads from
 *   `data`, not from a body-supplied context object.
 * - 400 responses with JSON, with text, and with no parseable body all
 *   surface a non-empty error string so the toast never silently swallows
 *   a real failure.
 * - Network failures (no Response at all) report a non-null error and a
 *   `null` status so callers can distinguish them from HTTP errors.
 */

import { describe, expect, it, vi } from 'vitest'

import {
  buildTransitionBody,
  buildTransitionUrl,
  transitionWorkflowState,
} from './workflow-transition'

describe('buildTransitionUrl', () => {
  it('targets Payload\'s update-by-id route, not a custom transition route', () => {
    expect(buildTransitionUrl('news', 60)).toBe('/api/news/60')
    expect(buildTransitionUrl('pages', 'abc')).toBe('/api/pages/abc')
  })

  it('does not append a /transition or /workflow segment', () => {
    const url = buildTransitionUrl('projects', 1)
    expect(url).not.toContain('/transition')
    expect(url).not.toContain('/workflow')
    expect(url).not.toContain('/versions')
  })
})

describe('buildTransitionBody', () => {
  it('sends only workflowState when no comment is supplied', () => {
    expect(buildTransitionBody('approved')).toEqual({ workflowState: 'approved' })
  })

  it('sends workflowComment as a TOP-LEVEL field, not under _context', () => {
    const body = buildTransitionBody('needs_revision', 'Please add a citation.')
    expect(body).toEqual({
      workflowState: 'needs_revision',
      workflowComment: 'Please add a citation.',
    })
    // Regression guard: the previous implementation nested the comment
    // under `_context`, where the Payload hook never saw it — the
    // beforeChange hook reads from `data`, not from request-body context.
    expect(body).not.toHaveProperty('_context')
  })

  it('drops empty / whitespace-only comments rather than sending an empty field', () => {
    expect(buildTransitionBody('approved', '')).toEqual({ workflowState: 'approved' })
    expect(buildTransitionBody('approved', '   ')).toEqual({ workflowState: 'approved' })
  })
})

describe('transitionWorkflowState', () => {
  function fakeFetch(response: Response | (() => Promise<Response>)) {
    return vi.fn(async () =>
      typeof response === 'function' ? response() : response,
    ) as unknown as typeof fetch
  }

  it('returns ok:true on a 200 PATCH', async () => {
    const f = fakeFetch(new Response(JSON.stringify({ id: 1 }), { status: 200 }))
    const result = await transitionWorkflowState(
      { collection: 'news', docId: 1, newState: 'approved' },
      f,
    )
    expect(result).toEqual({ ok: true })
  })

  it('sends a PATCH with JSON content-type and the right URL + body', async () => {
    const f = fakeFetch(new Response(null, { status: 200 }))
    await transitionWorkflowState(
      { collection: 'news', docId: 60, newState: 'approved' },
      f,
    )
    expect(f).toHaveBeenCalledTimes(1)
    const [url, init] = (f as unknown as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('/api/news/60')
    expect(init.method).toBe('PATCH')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ workflowState: 'approved' })
  })

  it('extracts the first error.message from a JSON 400 response', async () => {
    const body = JSON.stringify({
      errors: [{ message: 'A comment is required when rejecting content' }],
    })
    const f = fakeFetch(new Response(body, { status: 400, headers: { 'content-type': 'application/json' } }))
    const result = await transitionWorkflowState(
      { collection: 'news', docId: 1, newState: 'needs_revision' },
      f,
    )
    expect(result).toEqual({
      ok: false,
      status: 400,
      error: 'A comment is required when rejecting content',
    })
  })

  it('falls back to plain-text bodies when the 400 is not JSON', async () => {
    const f = fakeFetch(new Response('Bad Request: invalid transition', { status: 400 }))
    const result = await transitionWorkflowState(
      { collection: 'news', docId: 1, newState: 'approved' },
      f,
    )
    expect(result).toMatchObject({
      ok: false,
      status: 400,
    })
    if (!result.ok) {
      expect(result.error).toContain('Bad Request')
    }
  })

  it('strips HTML from a Next.js error page so the toast stays readable', async () => {
    const html =
      '<!DOCTYPE html><html><body><h1>500 — Server Error</h1><script>...</script></body></html>'
    const f = fakeFetch(new Response(html, { status: 500, headers: { 'content-type': 'text/html' } }))
    const result = await transitionWorkflowState(
      { collection: 'news', docId: 1, newState: 'approved' },
      f,
    )
    if (!result.ok) {
      expect(result.error).not.toContain('<')
      expect(result.error).not.toContain('>')
      expect(result.error.length).toBeLessThanOrEqual(200)
    }
  })

  it('returns a status-only fallback message when the body is empty', async () => {
    const f = fakeFetch(new Response('', { status: 401 }))
    const result = await transitionWorkflowState(
      { collection: 'news', docId: 1, newState: 'approved' },
      f,
    )
    expect(result).toEqual({
      ok: false,
      status: 401,
      error: 'Transition failed (status 401)',
    })
  })

  it('reports network failures with a non-null error and a null status', async () => {
    const f = vi.fn(async () => {
      throw new TypeError('Failed to fetch')
    }) as unknown as typeof fetch
    const result = await transitionWorkflowState(
      { collection: 'news', docId: 1, newState: 'approved' },
      f,
    )
    expect(result).toEqual({
      ok: false,
      status: null,
      error: 'Failed to fetch',
    })
  })
})
