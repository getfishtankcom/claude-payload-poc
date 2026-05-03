/**
 * Pin the FR-translation event channel between TranslateButton and
 * FrTranslationWarning. If the event name drifts or the dispatch shape
 * changes, the warning silently stops listening — exactly the bug from
 * issue #84 (QA-014). These tests catch that.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  FR_TRANSLATION_COMPLETED_EVENT,
  emitFrTranslationCompleted,
  onFrTranslationCompleted,
} from './fr-translation-events'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('FR_TRANSLATION_COMPLETED_EVENT', () => {
  it('uses a stable, namespaced event name', () => {
    // Renaming this would silently decouple the button from the warning.
    expect(FR_TRANSLATION_COMPLETED_EVENT).toBe('fras:translation-completed')
  })
})

describe('emitFrTranslationCompleted / onFrTranslationCompleted', () => {
  it('round-trips a payload through window dispatch', () => {
    const handler = vi.fn()
    const off = onFrTranslationCompleted(handler)

    emitFrTranslationCompleted({ collectionSlug: 'news', docId: 60 })

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith({ collectionSlug: 'news', docId: 60 })
    off()
  })

  it('returns an unsubscribe fn that actually removes the listener', () => {
    const handler = vi.fn()
    const off = onFrTranslationCompleted(handler)
    off()

    emitFrTranslationCompleted({ collectionSlug: 'news', docId: 60 })

    expect(handler).not.toHaveBeenCalled()
  })

  it('preserves docId as-is (string vs number) so callers can compare flexibly', () => {
    const handler = vi.fn()
    const off = onFrTranslationCompleted(handler)

    emitFrTranslationCompleted({ collectionSlug: 'pages', docId: 'abc-123' })

    expect(handler).toHaveBeenCalledWith({ collectionSlug: 'pages', docId: 'abc-123' })
    off()
  })

  it('supports multiple subscribers — dispatch hits all of them', () => {
    const a = vi.fn()
    const b = vi.fn()
    const offA = onFrTranslationCompleted(a)
    const offB = onFrTranslationCompleted(b)

    emitFrTranslationCompleted({ collectionSlug: 'news', docId: 1 })

    expect(a).toHaveBeenCalledTimes(1)
    expect(b).toHaveBeenCalledTimes(1)
    offA()
    offB()
  })
})
