/**
 * @description
 * Unit tests for `usersRead` access — guards QA-005 (#75).
 *
 * The Workbox queue, version-history modal, and any other admin view that
 * displays the `createdBy` of an item depends on non-admin users being able
 * to read other users' profiles. If `usersRead` ever filters by `id`, the
 * populated relation collapses to `null` and the UI falls back to
 * "Author: Unknown" for every row.
 */
import { describe, it, expect } from 'vitest'
import { usersRead } from './roles'
import type { Access } from 'payload'

type AccessArgs = Parameters<Access>[0]

function call(user: AccessArgs['req']['user'] | null) {
  // The Access function only inspects req.user — narrowest possible mock.
  const args = { req: { user } } as unknown as AccessArgs
  return usersRead(args)
}

describe('usersRead access (QA-005 guard)', () => {
  it('blocks anonymous requests', () => {
    expect(call(null)).toBe(false)
  })

  it('grants admins read access to every user', () => {
    expect(call({ id: 1, role: 'admin', email: 'a@x' } as never)).toBe(true)
  })

  it('grants editors read access to every user (so Workbox can show authors)', () => {
    // Regression guard: must NOT return a Where filter that scopes by id.
    const result = call({ id: 2, role: 'editor', email: 'e@x' } as never)
    expect(result).toBe(true)
  })

  it('grants authors read access to every user (so they see colleagues in audit trails)', () => {
    const result = call({ id: 3, role: 'author', email: 'au@x' } as never)
    expect(result).toBe(true)
  })

  it('never returns a row-level filter (which would null out populated createdBy)', () => {
    for (const role of ['admin', 'editor', 'author'] as const) {
      const result = call({ id: 99, role, email: 'x@x' } as never)
      expect(typeof result).toBe('boolean')
    }
  })
})
