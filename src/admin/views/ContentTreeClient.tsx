/**
 * @description
 * Client-side Content Tree view for FRAS Canada CMS admin (Epic 23).
 * Sitecore-style unified content tree with expand/collapse, item selection,
 * lazy-loading, type-specific icons, and gutter indicators.
 *
 * Key features:
 * - Left panel: hierarchical tree with expand/collapse
 * - Right panel: iframe or link to Payload's edit view for selected item
 * - Tree state (expanded nodes) persisted in localStorage
 * - Lazy-loads children on first expand
 * - Type-specific icons (page, folder, news, project, event, document, media, settings)
 * - Gutter indicators: workflow state dot, lock icon, missing FR warning
 *
 * @dependencies
 * - @heroicons/react: Type-specific and gutter icons
 * - @payloadcms/ui: useAuth for role context
 * - /api/tree: Tree data API
 * - /api/tree/search: Deep search API
 *
 * @notes
 * - Registered via ContentTree.tsx server wrapper at /admin/tree
 * - Uses recursive TreeItem components for rendering
 * - localStorage key: 'fras-content-tree-expanded'
 * - data-testid="page-content-tree" on container
 */
'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import { TreeContextMenu } from '../components/TreeContextMenu'
import { TreeDndWrapper, DraggableTreeItem } from '../components/TreeDndWrapper'

import type { UserWithRole } from '../types/workflow'
import type { TreeNode } from '../types/tree'

// --------------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------------

const STORAGE_KEY = 'fras-content-tree-expanded'
// Lazy-load threshold is 0 — always lazy-load children on expand

// Workflow state colors (PRD Section 4.2)
const WORKFLOW_COLORS: Record<string, string> = {
  draft: '#9CA3AF',        // gray
  in_review: '#3B82F6',   // blue
  needs_revision: '#EAB308', // yellow
  approved: '#22C55E',    // green
  published: '#8B5CF6',   // purple
  unpublished: '#6B7280', // dim gray
}

// --------------------------------------------------------------------------
// Icons (inline SVG for tree — avoids bundle issues with Heroicons in admin)
// --------------------------------------------------------------------------

/** Type-specific icon for tree items */
function ContentTypeIcon({ type }: { type: string }) {
  const size = 16
  const color = 'var(--theme-elevation-500)'

  switch (type) {
    case 'folder':
      return (
        <svg data-testid="tree-item-icon" width={size} height={size} viewBox="0 0 20 20" fill={color}>
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      )
    case 'news':
      return (
        <svg data-testid="tree-item-icon" width={size} height={size} viewBox="0 0 20 20" fill={color}>
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
          <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
        </svg>
      )
    case 'project':
      return (
        <svg data-testid="tree-item-icon" width={size} height={size} viewBox="0 0 20 20" fill={color}>
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      )
    case 'event':
      return (
        <svg data-testid="tree-item-icon" width={size} height={size} viewBox="0 0 20 20" fill={color}>
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      )
    case 'document':
      return (
        <svg data-testid="tree-item-icon" width={size} height={size} viewBox="0 0 20 20" fill={color}>
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        </svg>
      )
    case 'media':
      return (
        <svg data-testid="tree-item-icon" width={size} height={size} viewBox="0 0 20 20" fill={color}>
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      )
    case 'settings':
      return (
        <svg data-testid="tree-item-icon" width={size} height={size} viewBox="0 0 20 20" fill={color}>
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    default: // 'page'
      return (
        <svg data-testid="tree-item-icon" width={size} height={size} viewBox="0 0 20 20" fill={color}>
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      )
  }
}

/** Gutter indicators: workflow dot, lock, language warning */
function GutterIndicators({ node }: { node: TreeNode }) {
  const workflowColor = WORKFLOW_COLORS[node.workflowState] || WORKFLOW_COLORS.draft

  return (
    <span
      data-testid="tree-gutter"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', marginRight: '4px', minWidth: '24px' }}
    >
      {/* Workflow state dot */}
      <span
        title={`Status: ${node.workflowState.replace('_', ' ')}`}
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: workflowColor,
          flexShrink: 0,
        }}
      />
      {/* Lock icon (if locked) */}
      {node.lockedBy && (
        <span title="Locked" style={{ display: 'inline-flex', flexShrink: 0 }}>
          <svg width={12} height={12} viewBox="0 0 20 20" fill="#EF4444">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </span>
      )}
    </span>
  )
}

// --------------------------------------------------------------------------
// Chevron icon for expand/collapse
// --------------------------------------------------------------------------

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 20 20"
      fill="var(--theme-elevation-400)"
      style={{
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 150ms ease',
        flexShrink: 0,
      }}
    >
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  )
}

// --------------------------------------------------------------------------
// TreeItem component
// --------------------------------------------------------------------------

interface TreeItemProps {
  node: TreeNode
  depth: number
  expandedIds: Set<string>
  selectedId: string | number | null
  onToggle: (id: string | number) => void
  onSelect: (node: TreeNode) => void
  onContextMenu: (e: React.MouseEvent, node: TreeNode) => void
  lazyChildren: Map<string, TreeNode[]>
  loadingIds: Set<string>
  searchMatchIds?: Set<string>
}

function TreeItem({
  node,
  depth,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
  onContextMenu,
  lazyChildren,
  loadingIds,
  searchMatchIds,
}: TreeItemProps) {
  const nodeIdStr = String(node.id)
  const isExpanded = expandedIds.has(nodeIdStr)
  const isSelected = selectedId === node.id
  const isLoading = loadingIds.has(nodeIdStr)
  const isSearchMatch = searchMatchIds?.has(nodeIdStr) ?? false

  // Children: prefer pre-loaded from full tree fetch, then lazy-loaded
  const children = node.children || lazyChildren.get(nodeIdStr) || []
  const showChildren = isExpanded && children.length > 0

  return (
    <div data-testid={`tree-item-${nodeIdStr}`}>
      <DraggableTreeItem id={node.id}>
        {({ isDragging, isOver, dragListeners, setDragRef, setDropRef }) => (
      <div
        ref={(el) => { setDragRef(el); setDropRef(el) }}
        role="treeitem"
        aria-expanded={node.hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        onClick={() => onSelect(node)}
        onContextMenu={(e) => onContextMenu(e, node)}
        {...(dragListeners || {})}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 8px',
          paddingLeft: `${depth * 20 + 8}px`,
          cursor: isDragging ? 'grabbing' : 'pointer',
          fontSize: '13px',
          lineHeight: '24px',
          borderRadius: '4px',
          backgroundColor: isOver
            ? 'rgba(59, 130, 246, 0.15)'
            : isSelected
              ? 'var(--theme-elevation-150)'
              : isSearchMatch
                ? 'rgba(59, 130, 246, 0.1)'
                : 'transparent',
          color: isSelected ? 'var(--theme-elevation-900)' : 'var(--theme-elevation-700)',
          fontWeight: isSelected ? 600 : 400,
          userSelect: 'none',
          transition: 'background-color 100ms ease',
          opacity: isDragging ? 0.5 : 1,
          outline: isOver ? '2px solid #3B82F6' : 'none',
          outlineOffset: '-2px',
        }}
        onMouseEnter={(e) => {
          if (!isSelected && !isOver) {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--theme-elevation-50)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected && !isOver) {
            (e.currentTarget as HTMLElement).style.backgroundColor = isSearchMatch
              ? 'rgba(59, 130, 246, 0.1)'
              : 'transparent'
          }
        }}
      >
        {/* Expand/collapse chevron */}
        <span
          onClick={(e) => {
            e.stopPropagation()
            if (node.hasChildren) onToggle(node.id)
          }}
          style={{
            width: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {node.hasChildren ? (
            isLoading ? (
              <span style={{ width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{
                  width: 10, height: 10, border: '2px solid var(--theme-elevation-200)',
                  borderTopColor: 'var(--theme-elevation-500)', borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }} />
              </span>
            ) : (
              <ChevronIcon expanded={isExpanded} />
            )
          ) : null}
        </span>

        {/* Gutter indicators */}
        <GutterIndicators node={node} />

        {/* Content type icon */}
        <span style={{ marginRight: '6px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <ContentTypeIcon type={node.contentType} />
        </span>

        {/* Title */}
        <span style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
        }}>
          {node.title}
        </span>
      </div>
        )}
      </DraggableTreeItem>

      {/* Children (recursive) */}
      {showChildren && (
        <div role="group">
          {children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
              onContextMenu={onContextMenu}
              lazyChildren={lazyChildren}
              loadingIds={loadingIds}
              searchMatchIds={searchMatchIds}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
// Main ContentTreeClient component
// --------------------------------------------------------------------------

export const ContentTreeClient: React.FC = () => {
  const { user } = useAuth()
  const typedUser = user as UserWithRole | null
  const userRole = typedUser?.role || 'author'
  const userId = typedUser?.id || null

  // Tree data
  const [tree, setTree] = useState<TreeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Tree interaction state
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)
  const [lazyChildren, setLazyChildren] = useState<Map<string, TreeNode[]>>(new Map())
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMatchIds, setSearchMatchIds] = useState<Set<string>>(new Set())
  const [isSearching, setIsSearching] = useState(false)

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    node: TreeNode
    nodeDepth: number
  } | null>(null)

  const treeContainerRef = useRef<HTMLDivElement>(null)

  // Load expanded state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as string[]
        setExpandedIds(new Set(parsed))
      }
    } catch {
      // Ignore invalid localStorage data
    }
  }, [])

  // Save expanded state to localStorage
  useEffect(() => {
    if (expandedIds.size > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(expandedIds)))
    }
  }, [expandedIds])

  // Fetch full tree on mount
  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await fetch('/api/tree')
        if (!res.ok) throw new Error(`Failed to fetch tree: ${res.status}`)
        const data = await res.json()
        setTree(data.nodes || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tree')
      } finally {
        setLoading(false)
      }
    }
    fetchTree()
  }, [])

  // Toggle expand/collapse with lazy-loading
  const handleToggle = useCallback(async (id: string | number) => {
    const idStr = String(id)

    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(idStr)) {
        next.delete(idStr)
      } else {
        next.add(idStr)
      }
      return next
    })

    // Lazy-load children if not already loaded
    if (!lazyChildren.has(idStr)) {
      // Check if node already has children from full tree fetch
      const findNode = (nodes: TreeNode[]): TreeNode | null => {
        for (const n of nodes) {
          if (String(n.id) === idStr) return n
          if (n.children) {
            const found = findNode(n.children)
            if (found) return found
          }
        }
        return null
      }
      const existingNode = findNode(tree)
      if (existingNode?.children && existingNode.children.length > 0) {
        return // Already have children from full tree fetch
      }

      // Fetch children from API
      setLoadingIds((prev) => new Set(prev).add(idStr))
      try {
        const res = await fetch(`/api/tree?parentId=${id}`)
        if (res.ok) {
          const data = await res.json()
          setLazyChildren((prev) => {
            const next = new Map(prev)
            next.set(idStr, data.nodes || [])
            return next
          })
        }
      } catch {
        // Silently fail — user can retry by collapsing and re-expanding
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev)
          next.delete(idStr)
          return next
        })
      }
    }
  }, [tree, lazyChildren])

  // Select a node
  const handleSelect = useCallback((node: TreeNode) => {
    setSelectedNode(node)
    // Close context menu on select
    setContextMenu(null)
  }, [])

  // Compute depth of a node by walking the parent chain in the tree
  const getNodeDepth = useCallback((nodeId: string | number, nodes: TreeNode[], depth = 0): number => {
    for (const n of nodes) {
      if (n.id === nodeId) return depth
      if (n.children) {
        const found = getNodeDepth(nodeId, n.children, depth + 1)
        if (found >= 0) return found
      }
    }
    return -1
  }, [])

  // Right-click handler
  const handleContextMenu = useCallback((e: React.MouseEvent, node: TreeNode) => {
    e.preventDefault()
    setSelectedNode(node)
    const depth = getNodeDepth(node.id, tree)
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      node,
      nodeDepth: depth >= 0 ? depth : 0,
    })
  }, [tree, getNodeDepth])

  // Context menu action handlers
  const handleInsert = useCallback(async (parentNode: TreeNode, contentType: string) => {
    try {
      await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `New ${contentType}`,
          slug: `new-${contentType}-${Date.now()}`,
          contentType,
          parent: parentNode.id,
          sortOrder: 999,
          workflowState: 'draft',
        }),
      })
      // Refresh tree
      const res = await fetch('/api/tree')
      if (res.ok) {
        const data = await res.json()
        setTree(data.nodes || [])
      }
    } catch {
      // Silently fail — user can retry
    }
  }, [])

  const handleOpenInNewTab = useCallback((node: TreeNode) => {
    window.open(`/admin/collections/pages/${node.id}`, '_blank')
  }, [])

  const handleDuplicate = useCallback(async (node: TreeNode) => {
    try {
      // Fetch the full document, then create a copy
      const res = await fetch(`/api/pages/${node.id}`)
      if (res.ok) {
        const doc = await res.json()
        await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...doc,
            id: undefined,
            title: `${doc.title} (Copy)`,
            slug: `${doc.slug}-copy-${Date.now()}`,
            workflowState: 'draft',
          }),
        })
        // Refresh tree
        const treeRes = await fetch('/api/tree')
        if (treeRes.ok) {
          const data = await treeRes.json()
          setTree(data.nodes || [])
        }
      }
    } catch {
      // Silently fail
    }
  }, [])

  const handleRename = useCallback((node: TreeNode) => {
    const newTitle = prompt('New title:', node.title)
    if (newTitle && newTitle !== node.title) {
      fetch(`/api/pages/${node.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      }).then(async () => {
        const res = await fetch('/api/tree')
        if (res.ok) {
          const data = await res.json()
          setTree(data.nodes || [])
        }
      })
    }
  }, [])

  const handleMoveTo = useCallback((node: TreeNode) => {
    // Move functionality will be enhanced with a tree picker modal in task 23.5
    const newParentId = prompt('Enter parent ID to move to:')
    if (newParentId) {
      fetch(`/api/pages/${node.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent: newParentId }),
      }).then(async () => {
        const res = await fetch('/api/tree')
        if (res.ok) {
          const data = await res.json()
          setTree(data.nodes || [])
        }
      })
    }
  }, [])

  const handleCopy = useCallback((node: TreeNode) => {
    // Store copied node ID in sessionStorage for paste
    sessionStorage.setItem('fras-tree-copied', JSON.stringify({ id: node.id, title: node.title }))
  }, [])

  const handleLockToggle = useCallback(async (node: TreeNode) => {
    try {
      await fetch(`/api/pages/${node.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lockedBy: node.lockedBy ? null : userId,
          lockedAt: node.lockedBy ? null : new Date().toISOString(),
        }),
      })
      const res = await fetch('/api/tree')
      if (res.ok) {
        const data = await res.json()
        setTree(data.nodes || [])
      }
    } catch {
      // Silently fail
    }
  }, [userId])

  const handleDelete = useCallback(async (node: TreeNode) => {
    try {
      await fetch(`/api/pages/${node.id}`, { method: 'DELETE' })
      const res = await fetch('/api/tree')
      if (res.ok) {
        const data = await res.json()
        setTree(data.nodes || [])
      }
      if (selectedNode?.id === node.id) {
        setSelectedNode(null)
      }
    } catch {
      // Silently fail
    }
  }, [selectedNode])

  // DnD move handler — updates parent, sortOrder, and board via API
  const handleMoveNode = useCallback(async (result: {
    nodeId: string | number
    newParentId: string | number | null
    newSortOrder: number
    boardId: string | number | null
  }) => {
    try {
      await fetch(`/api/pages/${result.nodeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent: result.newParentId,
          sortOrder: result.newSortOrder,
          board: result.boardId,
        }),
      })
      // Refresh tree
      const res = await fetch('/api/tree')
      if (res.ok) {
        const data = await res.json()
        setTree(data.nodes || [])
      }
    } catch {
      // Silently fail
    }
  }, [])

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null)
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setContextMenu(null)
    }
    window.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  // Search handler
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchMatchIds(new Set())
      return
    }

    // Client-side filter for visible/expanded items
    const matchIds = new Set<string>()
    const searchInNodes = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        const title = node.title.toLowerCase()
        const slug = node.slug.toLowerCase()
        const q = query.toLowerCase()
        if (title.includes(q) || slug.includes(q)) {
          matchIds.add(String(node.id))
        }
        if (node.children) searchInNodes(node.children)
      }
    }
    searchInNodes(tree)
    setSearchMatchIds(matchIds)

    // Server-side deep search for items not yet loaded
    if (query.length >= 2) {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/tree/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          // Add server results to match set
          const serverMatchIds = new Set(matchIds)
          for (const result of data.results || []) {
            serverMatchIds.add(String(result.id))
          }
          setSearchMatchIds(serverMatchIds)

          // Auto-expand parent nodes to reveal matches
          const expandIds = (data.expandIds || []).map(String)
          if (expandIds.length > 0) {
            setExpandedIds((prev) => {
              const next = new Set(prev)
              for (const eid of expandIds) {
                next.add(eid)
              }
              return next
            })
          }
        }
      } catch {
        // Silently fail — client-side results still shown
      } finally {
        setIsSearching(false)
      }
    }
  }, [tree])

  // Debounced search
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)
  const handleSearchInput = useCallback((value: string) => {
    setSearchQuery(value)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => handleSearch(value), 300)
  }, [handleSearch])

  // Build the edit URL for the selected node
  const editUrl = useMemo(() => {
    if (!selectedNode) return null
    return `/admin/collections/pages/${selectedNode.id}`
  }, [selectedNode])

  if (loading) {
    return (
      <div data-testid="page-content-tree" style={{ padding: '24px', color: 'var(--theme-elevation-500)' }}>
        Loading content tree...
      </div>
    )
  }

  if (error) {
    return (
      <div data-testid="page-content-tree" style={{ padding: '24px', color: '#EF4444' }}>
        Error: {error}
      </div>
    )
  }

  return (
    <div
      data-testid="page-content-tree"
      style={{
        display: 'flex',
        height: 'calc(100vh - 60px)',
        overflow: 'hidden',
      }}
    >
      {/* CSS for spinner animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Left panel: Tree */}
      <div
        ref={treeContainerRef}
        style={{
          width: '360px',
          minWidth: '280px',
          borderRight: '1px solid var(--theme-elevation-150)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Search bar */}
        <div style={{ padding: '12px', borderBottom: '1px solid var(--theme-elevation-100)' }}>
          <div style={{ position: 'relative' }}>
            <input
              data-testid="tree-search"
              type="text"
              placeholder="Search tree..."
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 32px 6px 10px',
                border: '1px solid var(--theme-elevation-200)',
                borderRadius: '4px',
                fontSize: '13px',
                backgroundColor: 'var(--theme-elevation-0)',
                color: 'var(--theme-elevation-800)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSearchMatchIds(new Set())
                }}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  color: 'var(--theme-elevation-400)',
                  fontSize: '14px',
                  lineHeight: 1,
                }}
                title="Clear search"
              >
                ✕
              </button>
            )}
            {isSearching && (
              <span style={{
                position: 'absolute',
                right: searchQuery ? '28px' : '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '11px',
                color: 'var(--theme-elevation-400)',
              }}>
                ...
              </span>
            )}
          </div>
          {searchMatchIds.size > 0 && (
            <div style={{ marginTop: '4px', fontSize: '11px', color: 'var(--theme-elevation-400)' }}>
              {searchMatchIds.size} match{searchMatchIds.size !== 1 ? 'es' : ''} found
            </div>
          )}
        </div>

        {/* Tree items with drag-and-drop */}
        <TreeDndWrapper tree={tree} onMoveNode={handleMoveNode}>
          <div
            role="tree"
            style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}
          >
            {tree.length === 0 ? (
              <div style={{ padding: '16px', color: 'var(--theme-elevation-400)', fontSize: '13px' }}>
                No content tree items. Run the tree seed script to create the initial structure.
              </div>
            ) : (
              tree.map((node) => (
                <TreeItem
                  key={node.id}
                  node={node}
                  depth={0}
                  expandedIds={expandedIds}
                  selectedId={selectedNode?.id ?? null}
                  onToggle={handleToggle}
                  onSelect={handleSelect}
                  onContextMenu={handleContextMenu}
                  lazyChildren={lazyChildren}
                  loadingIds={loadingIds}
                  searchMatchIds={searchMatchIds.size > 0 ? searchMatchIds : undefined}
                />
              ))
            )}
          </div>
        </TreeDndWrapper>
      </div>

      {/* Right panel: Editor or placeholder */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {selectedNode ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Breadcrumb / header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--theme-elevation-100)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
            }}>
              <ContentTypeIcon type={selectedNode.contentType} />
              <span style={{ fontWeight: 600 }}>{selectedNode.title}</span>
              <span style={{ color: 'var(--theme-elevation-400)' }}>/ {selectedNode.slug}</span>
              <a
                href={editUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginLeft: 'auto',
                  padding: '4px 12px',
                  fontSize: '12px',
                  color: 'var(--theme-elevation-0)',
                  backgroundColor: 'var(--theme-elevation-800)',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Open in Editor
              </a>
            </div>

            {/* Embedded edit view via iframe */}
            {editUrl && (
              <iframe
                src={editUrl}
                style={{
                  flex: 1,
                  width: '100%',
                  border: 'none',
                }}
                title={`Edit: ${selectedNode.title}`}
              />
            )}
          </div>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--theme-elevation-400)',
            fontSize: '14px',
          }}>
            Select an item from the tree to edit it
          </div>
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <TreeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          nodeDepth={contextMenu.nodeDepth}
          userRole={userRole as 'admin' | 'editor' | 'author'}
          userId={userId}
          onClose={() => setContextMenu(null)}
          onInsert={handleInsert}
          onOpenInNewTab={handleOpenInNewTab}
          onDuplicate={handleDuplicate}
          onRename={handleRename}
          onMoveTo={handleMoveTo}
          onCopy={handleCopy}
          onLockToggle={handleLockToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default ContentTreeClient
