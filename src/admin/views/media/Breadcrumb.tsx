'use client'

import React, { useMemo } from 'react'
import type { FolderNode } from './types'

export interface BreadcrumbProps {
  folders: FolderNode[]
  selectedFolderId: string | number | null
  onNavigate: (folderId: string | number | null) => void
}

export function Breadcrumb({ folders, selectedFolderId, onNavigate }: BreadcrumbProps) {
  const path = useMemo(() => {
    if (!selectedFolderId) return []
    const result: FolderNode[] = []
    const findPath = (nodes: FolderNode[], targetId: string | number): boolean => {
      for (const node of nodes) {
        if (String(node.id) === String(targetId)) {
          result.push(node)
          return true
        }
        if (node.children) {
          if (findPath(node.children, targetId)) {
            result.unshift(node)
            return true
          }
        }
      }
      return false
    }
    findPath(folders, selectedFolderId)
    return result
  }, [folders, selectedFolderId])

  return (
    <div
      data-testid="breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '13px',
        color: 'var(--theme-elevation-500)',
        padding: '0 0 8px',
      }}
    >
      <span
        onClick={() => onNavigate(null)}
        style={{
          cursor: 'pointer',
          color: selectedFolderId ? 'var(--theme-elevation-600)' : 'var(--theme-elevation-800)',
          fontWeight: selectedFolderId ? 400 : 600,
        }}
      >
        Media Library
      </span>
      {path.map((folder) => (
        <React.Fragment key={String(folder.id)}>
          <span style={{ color: 'var(--theme-elevation-300)' }}>/</span>
          <span
            onClick={() => onNavigate(folder.id)}
            style={{
              cursor: 'pointer',
              color:
                String(folder.id) === String(selectedFolderId)
                  ? 'var(--theme-elevation-800)'
                  : 'var(--theme-elevation-600)',
              fontWeight: String(folder.id) === String(selectedFolderId) ? 600 : 400,
            }}
          >
            {folder.name}
          </span>
        </React.Fragment>
      ))}
    </div>
  )
}
