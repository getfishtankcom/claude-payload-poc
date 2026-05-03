/**
 * Regression test for QA-023 (#93).
 *
 * The collection slug is singular ('dictionary'). Without explicit
 * `labels`, Payload pluralises the slug for the list-view H1 ("Dictionaries")
 * while the breadcrumb keeps the slug-derived "Dictionary" — the two then
 * disagree. Pinning both forms here so a future cleanup can't drop the
 * labels block and quietly reintroduce the mismatch.
 */
import { describe, expect, it } from 'vitest'

import { Dictionary } from './Dictionary'

describe('Dictionary collection labels (#93)', () => {
  it('keeps the singular slug', () => {
    expect(Dictionary.slug).toBe('dictionary')
  })

  it('declares explicit labels so the H1 and breadcrumb agree', () => {
    expect(Dictionary.labels).toBeDefined()
    expect(Dictionary.labels?.singular).toBe('Term')
    expect(Dictionary.labels?.plural).toBe('Dictionary')
  })
})
