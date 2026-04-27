'use client'

import React from 'react'
import type { FolderNode } from './types'
import { FolderIcon, ChevronIcon } from './icons'

export interface FolderTreeItemProps {
  node: FolderNode
  selectedFolderId: string | number | null
  expandedIds: Set<string>
  onSelect: (folderId: string | number | null) => void
  onToggleExpand: (folderId: string | number) => void
  onContextMenu?: (e: React.MouseEvent, node: FolderNode) => void
  depth: number
}

export function FolderTreeItem({
  node,
  selectedFolderId,
  expandedIds,
  onSelect,
  onToggleExpand,
  onContextMenu,
  depth,
}: FolderTreeItemProps) {
  const isExpanded = expandedIds.has(String(node.id))
  const isSelected = selectedFolderId !== null && String(selectedFolderId) === String(node.id)

  return (
    <div>
      <div
        data-testid={`folder-tree-item-${node.id}`}
        onClick={() => onSelect(node.id)}
        onContextMenu={(e) => {
          e.preventDefault()
          onContextMenu?.(e, node)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          paddingLeft: `${depth * 16 + 8}px`,
          cursor: 'pointer',
          borderRadius: '4px',
          background: isSelected ? 'var(--theme-elevation-100)' : 'transparent',
          fontWeight: isSelected ? 600 : 400,
          fontSize: '13px',
          color: 'var(--theme-elevation-800)',
          transition: 'background 100ms ease',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.background = 'var(--theme-elevation-50)'
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.background = 'transparent'
        }}
      >
        <span
          onClick={(e) => {
            e.stopPropagation()
            if (node.hasChildren) onToggleExpand(node.id)
          }}
          style={{
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            visibility: node.hasChildren ? 'visible' : 'hidden',
          }}
        >
          <ChevronIcon expanded={isExpanded} />
        </span>

        <FolderIcon open={isExpanded} />

        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.name}
        </span>

        {node.mediaCount > 0 && (
          <span
            style={{
              fontSize: '11px',
              color: 'var(--theme-elevation-400)',
              flexShrink: 0,
            }}
          >
            {node.mediaCount}
          </span>
        )}
      </div>

      {isExpanded && node.children && node.children.map((child) => (
        <FolderTreeItem
          key={String(child.id)}
          node={child}
          selectedFolderId={selectedFolderId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggleExpand={onToggleExpand}
          onContextMenu={onContextMenu}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}
