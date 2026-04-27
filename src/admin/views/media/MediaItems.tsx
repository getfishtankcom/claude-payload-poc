'use client'

import React from 'react'
import type { MediaItem } from './types'
import { FileTypeIcon } from './icons'
import { formatFileSize } from './helpers'

export interface MediaItemRowProps {
  item: MediaItem
  onClick: (item: MediaItem) => void
  isSelected?: boolean
  onSelect?: (id: string | number, checked: boolean) => void
}

/** Thumbnail card variant — used in grid view. */
export function MediaGridItem({ item, onClick, isSelected, onSelect }: MediaItemRowProps) {
  const isImage = item.mimeType?.startsWith('image/')
  const thumbnailUrl = item.sizes?.thumbnail?.url || (isImage ? item.url : null)

  return (
    <div
      data-testid={`media-item-${item.id}`}
      onClick={() => onClick(item)}
      style={{
        border: `2px solid ${isSelected ? 'var(--theme-success-500)' : 'var(--theme-elevation-150)'}`,
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'var(--theme-elevation-0)',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = 'var(--theme-elevation-300)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = 'var(--theme-elevation-150)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div
        style={{
          width: '100%',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--theme-elevation-50)',
          position: 'relative',
        }}
      >
        {onSelect && (
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={(e) => {
              e.stopPropagation()
              onSelect(item.id, e.target.checked)
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              width: '16px',
              height: '16px',
              cursor: 'pointer',
              zIndex: 1,
            }}
          />
        )}

        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={item.alt || item.filename}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            loading="lazy"
          />
        ) : (
          <FileTypeIcon mimeType={item.mimeType || 'application/octet-stream'} />
        )}
      </div>

      <div style={{ padding: '8px', borderTop: '1px solid var(--theme-elevation-100)' }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--theme-elevation-800)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.filename}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--theme-elevation-400)', marginTop: '2px' }}>
          {formatFileSize(item.filesize || 0)}
        </div>
      </div>
    </div>
  )
}

/** Table row variant — used in list view. */
export function MediaListItem({ item, onClick, isSelected, onSelect }: MediaItemRowProps) {
  const isImage = item.mimeType?.startsWith('image/')
  const thumbnailUrl = item.sizes?.thumbnail?.url || (isImage ? item.url : null)

  return (
    <tr
      data-testid={`media-item-${item.id}`}
      onClick={() => onClick(item)}
      style={{
        cursor: 'pointer',
        background: isSelected ? 'var(--theme-elevation-50)' : 'transparent',
        borderBottom: '1px solid var(--theme-elevation-100)',
      }}
    >
      {onSelect && (
        <td style={{ padding: '8px', width: '32px' }}>
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={(e) => {
              e.stopPropagation()
              onSelect(item.id, e.target.checked)
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </td>
      )}
      <td style={{ padding: '8px', width: '48px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--theme-elevation-50)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={item.alt || item.filename}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          ) : (
            <FileTypeIcon mimeType={item.mimeType || 'application/octet-stream'} />
          )}
        </div>
      </td>
      <td style={{ padding: '8px', fontSize: '13px', fontWeight: 500 }}>{item.filename}</td>
      <td style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
        {item.mimeType?.split('/')[1]?.toUpperCase() || 'Unknown'}
      </td>
      <td style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
        {formatFileSize(item.filesize || 0)}
      </td>
      <td style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
        {item.width && item.height ? `${item.width}×${item.height}` : '—'}
      </td>
      <td style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
      </td>
    </tr>
  )
}
