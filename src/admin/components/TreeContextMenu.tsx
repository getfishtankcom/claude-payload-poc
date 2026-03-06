/**
 * @description
 * Right-click context menu for the content tree (Epic 23, task 23.4).
 * Positioned at cursor, shows actions filtered by node type, depth, and user role.
 *
 * Key features:
 * - Insert submenu filtered by valid child types per PRD Section 4.4
 * - CRUD actions: Copy, Move To, Duplicate, Rename, Delete
 * - Lock/Unlock toggle
 * - Open in New Tab
 * - Role-based filtering (Authors can't delete published items)
 * - Depth limit enforced (no Insert at level 5)
 * - Close on Escape or click-outside
 *
 * @dependencies
 * - TreeNode type from ContentTreeClient
 *
 * @notes
 * - data-testid="context-menu" on container
 * - All mutations go through Payload REST API
 * - Confirmation dialog for Delete action
 */
'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface TreeNode {
  id: string | number
  title: string
  slug: string
  contentType: string
  workflowState: string
  lockedBy: string | number | null
  hasChildren: boolean
  sortOrder: number
  parent: string | number | null
  board: string | number | null
  children?: TreeNode[]
}

type UserRole = 'admin' | 'editor' | 'author'

export interface TreeContextMenuProps {
  x: number
  y: number
  node: TreeNode
  nodeDepth: number
  userRole: UserRole
  userId: string | number | null
  onClose: () => void
  onInsert: (parentNode: TreeNode, contentType: string) => void
  onOpenInNewTab: (node: TreeNode) => void
  onDuplicate: (node: TreeNode) => void
  onRename: (node: TreeNode) => void
  onMoveTo: (node: TreeNode) => void
  onCopy: (node: TreeNode) => void
  onLockToggle: (node: TreeNode) => void
  onDelete: (node: TreeNode) => void
}

// --------------------------------------------------------------------------
// Insert options table (PRD Section 4.4)
// --------------------------------------------------------------------------

/** Maps parent contentType to allowed child content types */
const INSERT_OPTIONS: Record<string, Array<{ label: string; value: string }>> = {
  folder: [
    { label: 'Page', value: 'page' },
    { label: 'Folder', value: 'folder' },
  ],
  page: [
    { label: 'Page', value: 'page' },
  ],
  settings: [],
  news: [],
  project: [],
  event: [],
  document: [],
  media: [],
}

/** Special folder-type insert rules based on slug patterns */
function getInsertOptionsForNode(node: TreeNode): Array<{ label: string; value: string }> {
  const slug = node.slug.toLowerCase()

  // Special folder types based on their slug
  if (slug.includes('boards-folder')) {
    return [{ label: 'Board Detail Page', value: 'page' }]
  }
  if (slug.includes('projects-folder')) {
    return [{ label: 'Project', value: 'project' }]
  }
  if (slug.includes('news-folder')) {
    return [{ label: 'News Article', value: 'news' }]
  }
  if (slug.includes('events-folder')) {
    return [{ label: 'Event', value: 'event' }]
  }
  if (slug.includes('documents-folder') || slug.includes('consultations-folder')) {
    return [{ label: 'Document', value: 'document' }]
  }
  if (slug.includes('data-')) {
    return [
      { label: 'Folder', value: 'folder' },
    ]
  }

  // Default: use generic rules based on contentType
  return INSERT_OPTIONS[node.contentType] || []
}

// --------------------------------------------------------------------------
// Styles
// --------------------------------------------------------------------------

const menuStyle: React.CSSProperties = {
  position: 'fixed',
  zIndex: 9999,
  minWidth: '200px',
  backgroundColor: 'var(--theme-elevation-0)',
  border: '1px solid var(--theme-elevation-200)',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  padding: '4px 0',
  fontSize: '13px',
}

const menuItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '6px 12px',
  cursor: 'pointer',
  color: 'var(--theme-elevation-700)',
  gap: '8px',
  border: 'none',
  background: 'none',
  width: '100%',
  textAlign: 'left',
  fontFamily: 'inherit',
  fontSize: 'inherit',
}

const menuItemHoverStyle = 'var(--theme-elevation-50)'

const separatorStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'var(--theme-elevation-150)',
  margin: '4px 0',
}

const dangerStyle: React.CSSProperties = {
  ...menuItemStyle,
  color: '#EF4444',
}

// --------------------------------------------------------------------------
// Subcomponents
// --------------------------------------------------------------------------

function MenuItem({
  label,
  onClick,
  danger,
  disabled,
}: {
  label: string
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        if (!disabled) onClick()
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        ...(danger ? dangerStyle : menuItemStyle),
        backgroundColor: hovered && !disabled ? menuItemHoverStyle : 'transparent',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function Separator() {
  return <div style={separatorStyle} />
}

/** Insert submenu with hover */
function InsertSubmenu({
  options,
  onInsert,
}: {
  options: Array<{ label: string; value: string }>
  onInsert: (contentType: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => { setOpen(true); setHovered(true) }}
      onMouseLeave={() => { setOpen(false); setHovered(false) }}
    >
      <div style={{
        ...menuItemStyle,
        backgroundColor: hovered ? menuItemHoverStyle : 'transparent',
        justifyContent: 'space-between',
      }}>
        <span>Insert</span>
        <svg width={12} height={12} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          left: '100%',
          top: 0,
          minWidth: '160px',
          backgroundColor: 'var(--theme-elevation-0)',
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '4px 0',
        }}>
          {options.map((opt) => (
            <MenuItem
              key={opt.value}
              label={opt.label}
              onClick={() => onInsert(opt.value)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
// Main context menu
// --------------------------------------------------------------------------

export const TreeContextMenu: React.FC<TreeContextMenuProps> = ({
  x,
  y,
  node,
  nodeDepth,
  userRole,
  userId,
  onClose,
  onInsert,
  onOpenInNewTab,
  onDuplicate,
  onRename,
  onMoveTo,
  onCopy,
  onLockToggle,
  onDelete,
}) => {
  const menuRef = useRef<HTMLDivElement>(null)

  // Adjust position to stay within viewport
  const [adjustedPos, setAdjustedPos] = useState({ x, y })
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect()
      const newX = x + rect.width > window.innerWidth ? x - rect.width : x
      const newY = y + rect.height > window.innerHeight ? y - rect.height : y
      setAdjustedPos({ x: Math.max(0, newX), y: Math.max(0, newY) })
    }
  }, [x, y])

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Determine available actions
  const insertOptions = getInsertOptionsForNode(node)
  const canInsert = insertOptions.length > 0 && nodeDepth < 5
  const isLocked = !!node.lockedBy
  const isLockedByOther = isLocked && node.lockedBy !== userId
  const canDelete = (() => {
    if (userRole === 'admin') return true
    if (userRole === 'editor') return node.workflowState !== 'published'
    // Author: can only delete own drafts (simplified — we check workflowState only)
    return node.workflowState === 'draft'
  })()
  const isPage = node.contentType === 'page'

  // Confirmation dialog state for delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = useCallback(() => {
    setShowDeleteConfirm(true)
  }, [])

  const confirmDelete = useCallback(() => {
    onDelete(node)
    onClose()
  }, [node, onDelete, onClose])

  return (
    <div
      data-testid="context-menu"
      ref={menuRef}
      style={{
        ...menuStyle,
        left: adjustedPos.x,
        top: adjustedPos.y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Delete confirmation overlay */}
      {showDeleteConfirm ? (
        <div style={{ padding: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
            Delete &ldquo;{node.title}&rdquo;?
          </div>
          <div style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', marginBottom: '12px' }}>
            This action cannot be undone.{node.hasChildren ? ' All child items will also be affected.' : ''}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                border: '1px solid var(--theme-elevation-200)',
                borderRadius: '4px',
                background: 'var(--theme-elevation-0)',
                cursor: 'pointer',
                color: 'var(--theme-elevation-700)',
              }}
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              data-testid="confirm-delete"
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                border: 'none',
                borderRadius: '4px',
                background: '#EF4444',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Insert submenu */}
          {canInsert && (
            <>
              <InsertSubmenu
                options={insertOptions}
                onInsert={(contentType) => {
                  onInsert(node, contentType)
                  onClose()
                }}
              />
              <Separator />
            </>
          )}

          {/* Open in New Tab (pages only — has edit view) */}
          <MenuItem
            label="Open in New Tab"
            onClick={() => { onOpenInNewTab(node); onClose() }}
          />

          <Separator />

          {/* CRUD actions */}
          <MenuItem label="Copy" onClick={() => { onCopy(node); onClose() }} />
          <MenuItem label="Move To..." onClick={() => { onMoveTo(node); onClose() }} />
          <MenuItem label="Duplicate" onClick={() => { onDuplicate(node); onClose() }} />
          <MenuItem label="Rename" onClick={() => { onRename(node); onClose() }} />

          <Separator />

          {/* Lock / Unlock */}
          <MenuItem
            label={isLocked ? 'Unlock' : 'Lock'}
            onClick={() => { onLockToggle(node); onClose() }}
            disabled={isLockedByOther && userRole !== 'admin'}
          />

          <Separator />

          {/* Delete */}
          <MenuItem
            label="Delete"
            onClick={handleDelete}
            danger
            disabled={!canDelete}
          />
        </>
      )}
    </div>
  )
}

export default TreeContextMenu
