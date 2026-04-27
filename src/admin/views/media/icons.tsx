import React from 'react'
import { getFileCategory } from './helpers'

/** Folder icon (open or closed). */
export function FolderIcon({ open }: { open?: boolean }) {
  const color = 'var(--theme-elevation-500)'
  if (open) {
    return (
      <svg width={16} height={16} viewBox="0 0 20 20" fill={color}>
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v1H8l-4 8H4a2 2 0 01-2-2V6z" />
        <path d="M6 12a2 2 0 012-2h10l-4 8H4l2-6z" fillOpacity={0.7} />
      </svg>
    )
  }
  return (
    <svg width={16} height={16} viewBox="0 0 20 20" fill={color}>
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  )
}

/** Chevron icon for expand/collapse. */
export function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 20 20"
      fill="var(--theme-elevation-400)"
      style={{
        transition: 'transform 150ms ease',
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
      }}
    >
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

/** File-type icon used as the placeholder thumbnail for non-image media. */
export function FileTypeIcon({ mimeType }: { mimeType: string }) {
  const category = getFileCategory(mimeType)
  const size = 48
  const color = 'var(--theme-elevation-400)'

  switch (category) {
    case 'document':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
          <path d="M7 21h10a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z" />
          <path d="M14 4v5h5" />
          <path d="M9 13h6M9 17h4" />
        </svg>
      )
    case 'video':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M10 9l5 3-5 3V9z" fill={color} />
        </svg>
      )
    case 'audio':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
          <path d="M7 21h10a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z" />
          <path d="M14 4v5h5" />
        </svg>
      )
  }
}
