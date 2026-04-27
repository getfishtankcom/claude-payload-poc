/**
 * Small orange-flag indicator in collection list views for items missing
 * a French translation. Click navigates to the FR edit view.
 */
'use client'

import React from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export const FrTranslationWarning: React.FC = () => {
  const { id, collectionSlug, docPermissions: _perm, ...rest } = useDocumentInfo() as unknown as {
    id?: string | number
    collectionSlug?: string
    docPermissions?: unknown
    title?: string
    [k: string]: unknown
  }
  const docTitleFr = (rest as Record<string, unknown>).title_fr as string | undefined
  const titleEn = rest.title as string | undefined
  // Heuristic: render the flag when the FR title is missing OR equal to the EN title
  // (placeholder copy that hasn't actually been translated).
  const missing = !docTitleFr || (titleEn && docTitleFr === titleEn)
  if (!id || !collectionSlug || !missing) return null

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
