/**
 * Workflow transitions for the Page Builder action bar.
 *
 * Issue #96 (QA-026): the Submit for Review and Publish buttons in
 * `FRASActionBar` were stub `console.log` handlers, so authors saw a 404
 * (the network panel showed nothing useful at all — the "404" they saw
 * came from React refresh probing for the unrelated importMap, not the
 * stub). This helper does the actual workflow PATCH against the `pages`
 * collection and returns a discriminated union so the caller can render a
 * banner on either outcome.
 *
 * The contract intentionally mirrors `src/admin/lib/workflow-transition.ts`
 * (PR #141 / issue #85) so the two can collapse into a single helper once
 * #141 lands. Until then, keeping a Page-Builder-specific helper avoids
 * cross-PR coupling and keeps the test surface tight.
 */

export type PageWorkflowAction = 'in_review' | 'published'

export type PageTransitionResult =
  | { ok: true }
  | { ok: false; status: number | null; error: string }

export function buildPageTransitionUrl(pageId: string | number): string {
  return `/api/pages/${pageId}`
}

export function buildPageTransitionBody(
  newState: PageWorkflowAction,
): Record<string, unknown> {
  return { workflowState: newState }
}

async function readErrorMessage(res: Response): Promise<string> {
  const cloned = res.clone()
  try {
    const data = (await res.json()) as {
      errors?: Array<{ message?: string }>
      message?: string
    }
    const fromArray = data.errors?.[0]?.message
    if (typeof fromArray === 'string' && fromArray.length > 0) return fromArray
    if (typeof data.message === 'string' && data.message.length > 0) return data.message
  } catch {
    // fall through
  }
  try {
    const text = await cloned.text()
    if (text.trim().length > 0) {
      const stripped = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
      if (stripped.length > 0) return stripped.slice(0, 200)
    }
  } catch {
    // fall through
  }
  return `Transition failed (status ${res.status})`
}

/**
 * Issues a single PATCH against `/api/pages/{id}` to move the page into
 * `in_review` (Submit for Review) or `published` (Publish). Never throws
 * on HTTP errors — returns a discriminated union so the caller can render
 * a success banner or an error toast without try/catch.
 */
export async function transitionPage(
  pageId: string | number,
  newState: PageWorkflowAction,
  fetchImpl: typeof fetch = fetch,
): Promise<PageTransitionResult> {
  const url = buildPageTransitionUrl(pageId)
  const body = buildPageTransitionBody(newState)

  let res: Response
  try {
    res = await fetchImpl(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network request failed'
    return { ok: false, status: null, error: msg }
  }

  if (res.ok) return { ok: true }

  const error = await readErrorMessage(res)
  return { ok: false, status: res.status, error }
}
