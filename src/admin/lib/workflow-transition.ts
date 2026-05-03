/**
 * Single-item workflow transition over Payload's REST API.
 *
 * Extracted so the transition contract is unit-testable without mounting
 * Workbox. Two design choices captured here against future regression
 * (issue #85 / QA-015):
 *
 * 1. The caller MUST treat success and failure as the only two outcomes —
 *    no in-between optimistic state. Workbox previously removed the row from
 *    the list before this call returned, then "rolled back" inside the
 *    catch; a 400 on Approve still left the row gone from the UI even
 *    though the DB hadn't changed. This helper returns a discriminated
 *    union so the caller can defer all UI mutation until it has the result.
 *
 * 2. A 400 from Payload usually returns JSON with an `errors` array, but
 *    sometimes returns plain text (auth errors, dev-mode HTML pages,
 *    network proxies). We try JSON first, then fall back to text, then to
 *    a generic "Transition failed (status N)" message — so the caller
 *    always has something to put in a toast.
 */

import type { WorkflowState } from '../types/workflow'

export interface TransitionRequest {
  collection: string
  docId: string | number
  newState: WorkflowState
  /** Required when rejecting; ignored otherwise. */
  comment?: string
}

export type TransitionResult =
  | { ok: true }
  | { ok: false; status: number | null; error: string }

/**
 * Builds the URL for a workflow PATCH. Public so tests (and the eventual
 * per-doc edit-bar wiring in #83) can pin the contract.
 */
export function buildTransitionUrl(collection: string, docId: string | number): string {
  return `/api/${collection}/${docId}`
}

/**
 * Builds the JSON body for a workflow PATCH. Comments travel as a top-level
 * `workflowComment` field — the Payload beforeChange hook reads that out of
 * `data` and forwards it through `context` before stripping it. (REST has
 * no clean way to send `context` from the client, so the underscore-prefix
 * pattern wouldn't work either: hooks see `data`, not the raw body.)
 */
export function buildTransitionBody(
  newState: WorkflowState,
  comment?: string,
): Record<string, unknown> {
  const body: Record<string, unknown> = { workflowState: newState }
  if (comment && comment.trim().length > 0) {
    body.workflowComment = comment
  }
  return body
}

/**
 * Best-effort error message extraction. Tries JSON first (Payload's
 * standard `{ errors: [{ message }] }`), then plain text, then a fallback
 * tied to the HTTP status. Always returns a non-empty string.
 */
async function readErrorMessage(res: Response): Promise<string> {
  const cloned = res.clone()
  try {
    const data = (await res.json()) as { errors?: Array<{ message?: string }>; message?: string }
    const fromArray = data.errors?.[0]?.message
    if (typeof fromArray === 'string' && fromArray.length > 0) return fromArray
    if (typeof data.message === 'string' && data.message.length > 0) return data.message
  } catch {
    // fall through to text
  }
  try {
    const text = await cloned.text()
    if (text.trim().length > 0) {
      // Strip HTML tags and whitespace so a Next.js error page doesn't dump
      // 50 KB of markup into a toast.
      const stripped = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
      if (stripped.length > 0) return stripped.slice(0, 200)
    }
  } catch {
    // fall through
  }
  return `Transition failed (status ${res.status})`
}

/**
 * Performs a single workflow PATCH. Returns a discriminated union — the
 * caller decides what to do with the result. Never throws on HTTP errors;
 * only throws on programmer errors (no fetch impl, etc.).
 */
export async function transitionWorkflowState(
  req: TransitionRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<TransitionResult> {
  const url = buildTransitionUrl(req.collection, req.docId)
  const body = buildTransitionBody(req.newState, req.comment)

  let res: Response
  try {
    res = await fetchImpl(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body),
    })
  } catch (err) {
    // Network failure (offline, DNS, CORS preflight). No status to report.
    const msg = err instanceof Error ? err.message : 'Network request failed'
    return { ok: false, status: null, error: msg }
  }

  if (res.ok) return { ok: true }

  const error = await readErrorMessage(res)
  return { ok: false, status: res.status, error }
}
