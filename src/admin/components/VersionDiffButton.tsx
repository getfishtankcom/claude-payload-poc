/**
 * Edit-view trigger for the VersionDiffModal.
 *
 * Reads the current doc id + collection from useDocumentInfo and renders
 * a small "Compare versions" button that opens the modal.
 */
'use client'

import React, { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'
import { VersionDiffModal } from './VersionDiffModal'

export const VersionDiffButton: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const [open, setOpen] = useState(false)

  if (!id || !collectionSlug) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: '4px 10px',
          borderRadius: '3px',
          border: '1px solid var(--theme-elevation-200)',
          fontSize: '12px',
          fontWeight: 500,
          cursor: 'pointer',
          background: 'var(--theme-elevation-0)',
          color: 'var(--theme-elevation-700)',
        }}
      >
        Compare versions
      </button>
      {open && (
        <VersionDiffModal collection={collectionSlug} docId={String(id)} onClose={() => setOpen(false)} />
      )}
    </>
  )
}

export default VersionDiffButton
