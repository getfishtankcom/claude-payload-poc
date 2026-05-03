/**
 * Small orange-flag indicator in the doc edit view chrome for items that
 * are missing a French translation. Click navigates to the FR edit view.
 *
 * Issue #84 (QA-014): the previous implementation read a `title_fr` field
 * off `useDocumentInfo()` to decide visibility — but Payload stores
 * localized fields PER LOCALE, not as `<field>_fr` siblings, so that
 * heuristic only worked against mocks. In production the warning either
 * always showed or never did, depending on the doc shape, and clicking
 * "Translate to FR" never made it disappear.
 *
 * New approach: fetch the FR-locale version of the doc directly (`?locale=fr`)
 * and compare its `title` against the active-locale title from the form
 * context. If FR `title` is missing or equals the EN `title` (placeholder
 * copy), render the warning. Re-fetch on a `fras:translation-completed`
 * window event that `TranslateButton` fires after a successful run, so the
 * flag clears as soon as the translate lands without needing a page reload.
 */
'use client'

import React, { useEffect, useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'
import { onFrTranslationCompleted } from '../lib/fr-translation-events'

type FetchedDoc = { title?: string } | null

export const FrTranslationWarning: React.FC = () => {
  const docInfo = useDocumentInfo() as unknown as {
    id?: string | number
    collectionSlug?: string
    title?: string
    [k: string]: unknown
  }
  const { id, collectionSlug } = docInfo
  const titleEn = typeof docInfo.title === 'string' ? docInfo.title : undefined
  const [frDoc, setFrDoc] = useState<FetchedDoc>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!id || !collectionSlug) return
    const ac = new AbortController()

    const fetchFr = async () => {
      try {
        const res = await fetch(
          `/api/${collectionSlug}/${id}?locale=fr&depth=0`,
          { credentials: 'same-origin', signal: ac.signal },
        )
        if (!res.ok) {
          setLoaded(true)
          return
        }
        const data = (await res.json()) as { title?: string }
        setFrDoc({ title: typeof data.title === 'string' ? data.title : undefined })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setLoaded(true)
      } finally {
        setLoaded(true)
      }
    }

    fetchFr()
    // Re-run when a translate finishes for THIS doc.
    const unsubscribe = onFrTranslationCompleted((detail) => {
      if (
        String(detail.docId) === String(id) &&
        detail.collectionSlug === collectionSlug
      ) {
        fetchFr()
      }
    })

    return () => {
      ac.abort()
      unsubscribe()
    }
  }, [id, collectionSlug])

  if (!id || !collectionSlug) return null

  // Don't decide until the FR fetch has settled — avoids a flash of the
  // warning during initial mount.
  if (!loaded) return null

  const titleFr = frDoc?.title
  const missing = !titleFr || (!!titleEn && titleFr === titleEn)
  if (!missing) return null

  return (
    <a
      href={`/admin/collections/${collectionSlug}/${id}?locale=fr`}
      title="Missing French translation — click to translate"
      aria-label="Missing French translation"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        marginLeft: '6px',
        color: '#F97316',
      }}
    >
      <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 21V3h11l-1 4 1 4H6v10H4z" />
      </svg>
    </a>
  )
}

export default FrTranslationWarning
