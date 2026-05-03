/**
 * Locks in explicit singular/plural labels on the Dictionary collection so
 * the admin list-view H1 and breadcrumb stay consistent. Regression guard for
 * issue #93 (QA-023): without explicit labels, Payload's auto-pluralizer
 * turned the slug "dictionary" into "Dictionaries" for the H1 while the
 * breadcrumb resolved to "Dictionary".
 */

import { describe, expect, it } from 'vitest'

import { Dictionary } from './Dictionary'

describe('Dictionary collection labels', () => {
  it('keeps the slug singular for relationship/API stability', () => {
    expect(Dictionary.slug).toBe('dictionary')
  })

  it('defines an explicit singular label', () => {
    expect(Dictionary.labels?.singular).toBe('Dictionary entry')
  })

  it('defines an explicit plural label that does not collide with the singular', () => {
    expect(Dictionary.labels?.plural).toBe('Dictionary entries')
    expect(Dictionary.labels?.plural).not.toBe(Dictionary.labels?.singular)
  })

  it('does not let Payload auto-pluralize the slug into "Dictionaries"', () => {
    expect(Dictionary.labels?.plural).not.toBe('Dictionaries')
    expect(Dictionary.labels?.singular).not.toBe('Dictionary')
  })
})
