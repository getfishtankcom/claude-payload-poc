/**
 * Event channel between `TranslateButton` and `FrTranslationWarning`.
 *
 * Issue #84 (QA-014): the warning checks "is FR missing?" once at mount and
 * never updates. After Translate to FR succeeds, the DB has an FR row but
 * the warning keeps showing — authors think their translate didn't take.
 * Fix: a tiny browser-native CustomEvent that the button fires on success;
 * the warning subscribes and re-fetches the FR doc.
 *
 * No global state library, no React context — just `window.dispatchEvent`
 * + `addEventListener`. The event name is exported so the test can pin it
 * (renaming would silently decouple the button from the warning).
 */

export const FR_TRANSLATION_COMPLETED_EVENT = 'fras:translation-completed'

export interface FrTranslationCompletedDetail {
  collectionSlug: string
  docId: string | number
}

/** Fire-and-forget — no-op outside the browser. */
export function emitFrTranslationCompleted(detail: FrTranslationCompletedDetail): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent<FrTranslationCompletedDetail>(FR_TRANSLATION_COMPLETED_EVENT, { detail }),
  )
}

/**
 * Subscribe to translation-completed events. Returns the unsubscribe fn so
 * the caller can wire it up cleanly inside a `useEffect`.
 */
export function onFrTranslationCompleted(
  handler: (detail: FrTranslationCompletedDetail) => void,
): () => void {
  if (typeof window === 'undefined') return () => {}
  const listener = (e: Event) => {
    const ce = e as CustomEvent<FrTranslationCompletedDetail>
    if (ce.detail) handler(ce.detail)
  }
  window.addEventListener(FR_TRANSLATION_COMPLETED_EVENT, listener)
  return () => window.removeEventListener(FR_TRANSLATION_COMPLETED_EVENT, listener)
}
