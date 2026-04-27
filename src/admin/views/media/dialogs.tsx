/**
 * Media-library dialog components — extracted from MediaLibraryClient.
 *
 * - BulkMoveDialog: pick a destination folder for the currently selected items.
 * - BulkDeleteDialog: confirm deletion of the currently selected items.
 */
'use client'

import React from 'react'
import type { FolderNode } from './types'
import { flattenFolders } from './helpers'

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.5)',
  zIndex: 1000,
}

const cardStyle: React.CSSProperties = {
  background: 'var(--theme-elevation-0)',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
}

const folderRowStyle: React.CSSProperties = {
  padding: '6px 8px',
  cursor: 'pointer',
  borderRadius: '4px',
  fontSize: '13px',
}

export function BulkMoveDialog({
  folders,
  onMove,
  onCancel,
}: {
  folders: FolderNode[]
  onMove: (folderId: string | number | null) => void
  onCancel: () => void
}) {
  return (
    <div style={overlayStyle}>
      <div style={{ ...cardStyle, width: '320px', maxHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Move to Folder</div>
        <div style={{ flex: 1, overflow: 'auto', marginBottom: '16px' }}>
          <div
            onClick={() => onMove(null)}
            style={folderRowStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--theme-elevation-50)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            (No folder)
          </div>
          {flattenFolders(folders).map((f) => (
            <div
              key={String(f.id)}
              onClick={() => onMove(f.id)}
              style={{ ...folderRowStyle, paddingLeft: `${f.depth * 16 + 8}px` }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--theme-elevation-50)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              📁 {f.name}
            </div>
          ))}
        </div>
        <button
          onClick={onCancel}
          style={{
            padding: '6px 16px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '6px',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export function BulkDeleteDialog({
  count,
  onConfirm,
  onCancel,
}: {
  count: number
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div style={overlayStyle}>
      <div style={{ ...cardStyle, maxWidth: '400px' }}>
        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
          Delete {count} Item{count !== 1 ? 's' : ''}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--theme-elevation-600)', marginBottom: '16px' }}>
          Are you sure you want to delete {count} selected media item{count !== 1 ? 's' : ''}? This action cannot be undone.
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '6px 16px',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '6px',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '6px 16px',
              border: 'none',
              borderRadius: '6px',
              background: 'var(--theme-error-500)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
