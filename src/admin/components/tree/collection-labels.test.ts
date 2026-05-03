/**
 * @description
 * Unit tests for the slug → display-name resolver used by the tree context
 * menu. Locks in the canonical labels and the override-vs-fallback priority
 * order so future regressions (raw slug bleed into the UI) are caught here
 * before they reach a screenshot.
 */

import { describe, expect, it } from 'vitest'

import {
  COLLECTION_LABELS,
  humanizeSlug,
  labelForCollection,
} from './collection-labels'

describe('humanizeSlug', () => {
  it('capitalizes a single-word slug', () => {
    expect(humanizeSlug('news')).toBe('News')
  })

  it('replaces hyphens with spaces and capitalizes each word', () => {
    expect(humanizeSlug('board-detail')).toBe('Board Detail')
    expect(humanizeSlug('document-for-comment')).toBe('Document For Comment')
  })

  it('treats underscores like hyphens', () => {
    expect(humanizeSlug('legacy_collection_name')).toBe('Legacy Collection Name')
  })

  it('collapses repeated separators', () => {
    expect(humanizeSlug('news--items')).toBe('News Items')
  })

  it('returns an empty string for an empty input', () => {
    expect(humanizeSlug('')).toBe('')
  })
})

describe('labelForCollection', () => {
  it('uses the canonical map for known FRAS collection slugs', () => {
    expect(labelForCollection('news')).toBe('News article')
    expect(labelForCollection('board-detail')).toBe('Board page')
    expect(labelForCollection('document-for-comment')).toBe('Document for Comment')
  })

  it('falls back to the humanized slug for unknown collections', () => {
    expect(labelForCollection('mystery-meat')).toBe('Mystery Meat')
  })

  it('prefers an override entry over the canonical map', () => {
    expect(labelForCollection('news', { news: 'Story' })).toBe('Story')
  })

  it('falls through to the canonical map when the override is absent', () => {
    expect(labelForCollection('boards', { news: 'Story' })).toBe('Board')
  })

  it('does not treat the canonical map as overridable from the outside', () => {
    expect(() => {
      // @ts-expect-error — runtime guard: COLLECTION_LABELS is frozen
      COLLECTION_LABELS.pages = 'Hacked'
    }).toThrow()
  })
})
