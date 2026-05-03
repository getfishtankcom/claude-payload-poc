/**
 * Pin the dual-source workflow-comment handling in `validateWorkflowTransition`.
 *
 * Issue #85 (QA-015) traced the Workbox Reject 400 to the hook only reading
 * `context.workflowComment` — REST clients can't deliver that, so the hook
 * always saw an empty comment and threw "A comment is required when rejecting
 * content". The hook now reads from either `data.workflowComment` (REST path)
 * or `context.workflowComment` (Local API path), strips the body field after
 * use, and uses whichever is non-empty for both the validation gate and the
 * history-entry comment.
 *
 * These tests assert the contract directly against the hook function; no
 * Payload runtime is mounted, so we cast minimally and exercise only the
 * branches the hook touches.
 */

import { describe, expect, it } from 'vitest'

import { validateWorkflowTransition } from './workflow-hooks'

type HookArgs = Parameters<typeof validateWorkflowTransition>[0]

function callHook(overrides: Partial<HookArgs> & {
  data: Record<string, unknown>
  originalDoc?: Record<string, unknown>
}): Record<string, unknown> {
  const args = {
    operation: 'update',
    req: { user: { id: 1, role: 'editor' } },
    context: {},
    originalDoc: overrides.originalDoc ?? { workflowState: 'in_review' },
    ...overrides,
  } as unknown as HookArgs
  // The hook is sync in our codepath even though the Payload type is `Promise<...> | ...`.
  return validateWorkflowTransition(args) as Record<string, unknown>
}

describe('validateWorkflowTransition — comment source', () => {
  it('accepts a Reject when the comment arrives via data.workflowComment (REST path)', () => {
    const result = callHook({
      data: {
        workflowState: 'needs_revision',
        workflowComment: 'Please add citations',
      },
    })
    expect(result).toBeDefined()
    expect(result.workflowState).toBe('needs_revision')
    // Body field must not leak through to the actual write — it isn't a
    // real collection column.
    expect(result).not.toHaveProperty('workflowComment')
  })

  it('still accepts a Reject when the comment arrives via context (Local API path)', () => {
    const result = callHook({
      data: { workflowState: 'needs_revision' },
      context: { workflowComment: 'Local API path' },
    } as Partial<HookArgs> & { data: Record<string, unknown> })
    expect(result.workflowState).toBe('needs_revision')
  })

  it('still rejects a Reject when no comment is present in either source', () => {
    expect(() =>
      callHook({ data: { workflowState: 'needs_revision' } }),
    ).toThrow(/comment is required/i)
  })

  it('rejects a Reject when the body comment is whitespace only', () => {
    expect(() =>
      callHook({
        data: { workflowState: 'needs_revision', workflowComment: '   ' },
      }),
    ).toThrow(/comment is required/i)
  })

  it('does not require a comment for an Approve', () => {
    const result = callHook({ data: { workflowState: 'approved' } })
    expect(result.workflowState).toBe('approved')
  })

  it('strips workflowComment from the data even on Approve so it does not try to persist', () => {
    const result = callHook({
      data: { workflowState: 'approved', workflowComment: 'leftover' },
    })
    expect(result).not.toHaveProperty('workflowComment')
  })

  it('threads the body comment into the history entry it appends', () => {
    const result = callHook({
      data: {
        workflowState: 'needs_revision',
        workflowComment: 'Needs more sources',
      },
    })
    const history = result.workflowHistory as Array<{
      from?: string
      to?: string
      comment?: string | null
    }>
    expect(Array.isArray(history)).toBe(true)
    const last = history[history.length - 1]
    expect(last.from).toBe('in_review')
    expect(last.to).toBe('needs_revision')
    expect(last.comment).toBe('Needs more sources')
  })

  it('prefers the body comment over the context comment when both are set', () => {
    const result = callHook({
      data: {
        workflowState: 'needs_revision',
        workflowComment: 'from body',
      },
      context: { workflowComment: 'from context' },
    } as Partial<HookArgs> & { data: Record<string, unknown> })
    const history = result.workflowHistory as Array<{ comment?: string | null }>
    expect(history[history.length - 1].comment).toBe('from body')
  })
})
