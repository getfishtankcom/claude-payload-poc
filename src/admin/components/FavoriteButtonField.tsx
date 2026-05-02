/**
 * Payload edit-view wrapper for FavoriteButton.
 *
 * Reads the current doc id / collection slug / title from
 * `useDocumentInfo` so the FavoriteButton can pin the doc without
 * each collection having to wire it up by hand.
 */
'use client'

import React from 'react'
import { useDocumentInfo } from '@payloadcms/ui'
import { FavoriteButton } from './FavoriteButton'

export const FavoriteButtonField: React.FC = () => {
  const { id, collectionSlug, title } = useDocumentInfo()
  if (!id || !collectionSlug) return null
  const docId = String(id)
  return (
    <FavoriteButton
      id={docId}
      title={title || `${collectionSlug} ${docId}`}
      collection={collectionSlug}
      path={`/admin/collections/${collectionSlug}/${docId}`}
    />
  )
}

export default FavoriteButtonField
