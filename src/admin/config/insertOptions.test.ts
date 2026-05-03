/**
 * Unit tests for the insert-options table that drives the Content Tree
 * "Insert >" submenu.
 *
 * Locks in PRD-admin-panel §4.4 — the canonical parent→allowed-children
 * mapping. Folder-slug overrides (e.g. `boards-folder`) must trump the
 * generic contentType lookup. Leaf types must return an empty array
 * rather than fall through to "any allowed".
 */
import { describe, expect, it } from 'vitest'

import {
  CONTENT_TYPE_LABELS,
  INSERT_OPTIONS,
  MAX_TREE_DEPTH,
  getAllowedInserts,
  getInsertOptionsLabelled,
} from './insertOptions'

describe('INSERT_OPTIONS table', () => {
  it('caps tree depth at five levels', () => {
    expect(MAX_TREE_DEPTH).toBe(5)
  })

  it('only allows pages + folders under the root', () => {
    expect(INSERT_OPTIONS.root).toEqual(['page', 'folder'])
  })

  it('marks leaf content types as terminal (empty allowed list)', () => {
    for (const leaf of ['news', 'project', 'event', 'document', 'consultation']) {
      expect(INSERT_OPTIONS[leaf]).toEqual([])
    }
  })
})

describe('getAllowedInserts()', () => {
  it('returns the contentType-keyed list for generic nodes', () => {
    expect(getAllowedInserts({ contentType: 'page' })).toEqual(['page'])
    expect(getAllowedInserts({ contentType: 'board-detail' })).toEqual(['page'])
  })

  it('lets folder-slug overrides win over the generic contentType', () => {
    // Slug match takes precedence even when contentType is the generic 'folder'.
    expect(getAllowedInserts({ contentType: 'folder', slug: 'boards-folder' })).toEqual([
      'board-detail',
    ])
    expect(getAllowedInserts({ contentType: 'folder', slug: 'news-folder' })).toEqual(['news'])
    expect(
      getAllowedInserts({ contentType: 'folder', slug: 'data-folder' }),
    ).toEqual(['contact', 'standard', 'decision-summary'])
  })

  it('returns [] for unknown content types (closed-world default)', () => {
    expect(getAllowedInserts({ contentType: 'definitely-not-real' })).toEqual([])
  })
})

describe('getInsertOptionsLabelled()', () => {
  it('maps slugs to human-readable labels', () => {
    const labelled = getInsertOptionsLabelled({ contentType: 'root' })
    expect(labelled).toEqual([
      { value: 'page', label: 'Page' },
      { value: 'folder', label: 'Folder' },
    ])
  })

  it('falls back to the slug when no label is defined', () => {
    // Confirms the labels-table is exhaustive enough for current INSERT_OPTIONS.
    for (const value of Object.values(INSERT_OPTIONS).flat()) {
      expect(CONTENT_TYPE_LABELS[value]).toBeDefined()
    }
  })
})
