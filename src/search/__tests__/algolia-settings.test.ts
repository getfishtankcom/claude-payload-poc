/**
 * @description
 * Pins the Algolia settings-as-code so:
 *
 * 1. Every searchable collection has an entry (no silent gaps).
 * 2. `board-members` and `contacts` STAY out of the list (per PRD —
 *    staff records aren't faceted search surfaces).
 * 3. Each entry has the faceting attributes `<FilterSidebar>` expects,
 *    so the UI checkboxes don't render against an unfacetable index.
 *
 * (#174 / Algolia migration Slice 3.)
 */
import { describe, expect, it } from 'vitest'

import {
  ALGOLIA_EXCLUDED_COLLECTIONS,
  ALGOLIA_INDEX_SETTINGS,
} from '../../../infrastructure/algolia/settings'

const REQUIRED_COLLECTIONS = [
  'news',
  'projects',
  'consultations',
  'documents',
  'events',
  'pages',
  'resources',
] as const

describe('Algolia settings-as-code (#174)', () => {
  it('every required searchable collection has a settings entry', () => {
    const present = ALGOLIA_INDEX_SETTINGS.map((entry) => entry.collection)
    for (const required of REQUIRED_COLLECTIONS) {
      expect(present).toContain(required)
    }
  })

  it.each(ALGOLIA_INDEX_SETTINGS)(
    '`%s` declares searchable + filterable attributes',
    ({ collection, settings }) => {
      expect(collection).toBeTruthy()
      expect(settings.searchableAttributes?.length ?? 0).toBeGreaterThan(0)
      expect(settings.filterableAttributes?.length ?? 0).toBeGreaterThan(0)
    },
  )

  it.each(ALGOLIA_EXCLUDED_COLLECTIONS)(
    '`%s` is intentionally NOT indexed',
    (excluded) => {
      const present = ALGOLIA_INDEX_SETTINGS.map((entry) => entry.collection)
      expect(present).not.toContain(excluded)
    },
  )

  it('every faceting attribute is a non-empty string', () => {
    for (const { collection, settings } of ALGOLIA_INDEX_SETTINGS) {
      for (const attr of settings.filterableAttributes ?? []) {
        expect(attr, `collection=${collection}`).toBeTypeOf('string')
        expect(attr.length, `collection=${collection}`).toBeGreaterThan(0)
      }
    }
  })
})
