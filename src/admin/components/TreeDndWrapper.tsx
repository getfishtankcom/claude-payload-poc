/**
 * @description
 * Drag-and-drop wrapper for the content tree (Epic 23, task 23.5).
 * Uses @dnd-kit/core for drag-and-drop with tree-specific logic:
 * - Reorder within same parent (updates sortOrder)
 * - Move to different parent (updates parent relationship)
 * - Board auto-update when moving between board subtrees
 * - Depth limit enforcement (max 5 levels)
 * - Confirmation dialog for cross-parent moves
 *
 * @dependencies
 * - @dnd-kit/core: DndContext, DragOverlay
 * - @dnd-kit/sortable: SortableContext for reorder within parent
 *
 * @notes
 * - This provides the DnD context wrapper and individual draggable/droppable items
 * - Tree items use useDraggable + useDroppable for maximum flexibility
 * - Drop validation prevents depth limit violations
 * - Board detection walks up the tree to find board-associated ancestors
 */
'use client'

import React, { useCallback, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

import type { TreeNode } from '../types/tree'

interface MoveResult {
  nodeId: string | number
  newParentId: string | number | null
  newSortOrder: number
  boardId: string | number | null
  oldBoardId: string | number | null
}

export interface TreeDndWrapperProps {
  children: React.ReactNode
  tree: TreeNode[]
  onMoveNode: (result: MoveResult) => Promise<void>
}

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

/** Find a node in the tree by ID */
function findNode(nodes: TreeNode[], id: string | number): TreeNode | null {
  for (const n of nodes) {
    if (String(n.id) === String(id)) return n
    if (n.children) {
      const found = findNode(n.children, id)
      if (found) return found
    }
  }
  return null
}

/** Get depth of a node in the tree */
function getDepth(nodes: TreeNode[], id: string | number, depth = 0): number {
  for (const n of nodes) {
    if (String(n.id) === String(id)) return depth
    if (n.children) {
      const found = getDepth(n.children, id, depth + 1)
      if (found >= 0) return found
    }
  }
  return -1
}

/** Get the max depth of a subtree (how deep the node's children go) */
function getSubtreeDepth(node: TreeNode): number {
  if (!node.children || node.children.length === 0) return 0
  return 1 + Math.max(...node.children.map(getSubtreeDepth))
}

/** Walk ancestors to find the board ID from tree position */
function findBoardFromAncestors(nodes: TreeNode[], targetId: string | number): string | number | null {
  const path: TreeNode[] = []

  function findPath(tree: TreeNode[], id: string | number): boolean {
    for (const n of tree) {
      path.push(n)
      if (String(n.id) === String(id)) return true
      if (n.children && findPath(n.children, id)) return true
      path.pop()
    }
    return false
  }

  findPath(nodes, targetId)

  // Walk from the target back to root, find first node with a board
  for (let i = path.length - 1; i >= 0; i--) {
    if (path[i].board) return path[i].board
  }
  return null
}

// --------------------------------------------------------------------------
// DraggableTreeItem — wraps each tree item row with drag/drop
// --------------------------------------------------------------------------

export function DraggableTreeItem({
  id,
  children,
}: {
  id: string | number
  children: (props: {
    isDragging: boolean
    isOver: boolean
    isValidDrop: boolean
    dragAttributes: Record<string, unknown>
    dragListeners: Record<string, unknown> | undefined
    setDragRef: (node: HTMLElement | null) => void
    setDropRef: (node: HTMLElement | null) => void
  }) => React.ReactNode
}) {
  const {
    attributes: dragAttributes,
    listeners: dragListeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({ id: String(id) })

  const {
    setNodeRef: setDropRef,
    isOver,
  } = useDroppable({ id: String(id) })

  return (
    <>
      {children({
        isDragging,
        isOver,
        isValidDrop: isOver, // Simplified; full validation in DragEnd
        dragAttributes: dragAttributes as unknown as Record<string, unknown>,
        dragListeners: dragListeners as unknown as Record<string, unknown> | undefined,
        setDragRef,
        setDropRef,
      })}
    </>
  )
}

// --------------------------------------------------------------------------
// Main DnD wrapper
// --------------------------------------------------------------------------

export const TreeDndWrapper: React.FC<TreeDndWrapperProps> = ({
  children,
  tree,
  onMoveNode,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState<MoveResult | null>(null)

  // Configure pointer sensor with activation delay to distinguish click vs drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Must drag at least 8px before activating
      },
    }),
  )

  const activeNode = activeId ? findNode(tree, activeId) : null

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    setOverId(event.over ? String(event.over.id) : null)
  }, [])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setOverId(null)

    if (!over || active.id === over.id) return

    const draggedId = String(active.id)
    const targetId = String(over.id)

    const draggedNode = findNode(tree, draggedId)
    const targetNode = findNode(tree, targetId)

    if (!draggedNode || !targetNode) return

    // Depth validation: dragged subtree depth + target depth must be <= 5
    const targetDepth = getDepth(tree, targetId)
    const draggedSubtreeDepth = getSubtreeDepth(draggedNode)
    if (targetDepth + 1 + draggedSubtreeDepth > 5) {
      // Would exceed depth limit — reject
      return
    }

    // Prevent dropping a node into its own descendant
    const isDescendant = (parentId: string | number, childId: string | number): boolean => {
      const parent = findNode(tree, parentId)
      if (!parent?.children) return false
      for (const c of parent.children) {
        if (String(c.id) === String(childId)) return true
        if (isDescendant(c.id, childId)) return true
      }
      return false
    }
    if (isDescendant(draggedId, targetId)) return

    // Determine if this is a same-parent reorder or cross-parent move
    const isSameParent = String(draggedNode.parent) === String(targetNode.parent)
    const newBoardId = findBoardFromAncestors(tree, targetId) || targetNode.board
    const oldBoardId = draggedNode.board

    const moveResult: MoveResult = {
      nodeId: draggedId,
      newParentId: isSameParent ? draggedNode.parent : targetNode.id,
      newSortOrder: isSameParent ? targetNode.sortOrder : 999,
      boardId: newBoardId,
      oldBoardId,
    }

    // Cross-parent moves require confirmation
    if (!isSameParent) {
      setShowConfirm(moveResult)
      return
    }

    // Same-parent reorder — execute immediately
    await onMoveNode(moveResult)
  }, [tree, onMoveNode])

  const handleConfirmMove = useCallback(async () => {
    if (showConfirm) {
      await onMoveNode(showConfirm)
      setShowConfirm(null)
    }
  }, [showConfirm, onMoveNode])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}

      {/* Drag overlay — floating ghost of the dragged item */}
      <DragOverlay>
        {activeNode ? (
          <div style={{
            padding: '4px 12px',
            fontSize: '13px',
            backgroundColor: 'var(--theme-elevation-0)',
            border: '1px solid var(--theme-elevation-300)',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            opacity: 0.9,
            whiteSpace: 'nowrap',
          }}>
            {activeNode.title}
          </div>
        ) : null}
      </DragOverlay>

      {/* Confirmation dialog for cross-parent moves */}
      {showConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            backgroundColor: 'var(--theme-elevation-0)',
            borderRadius: '8px',
            padding: '20px',
            minWidth: '320px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 600 }}>
              Move Item?
            </h3>
            <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--theme-elevation-600)' }}>
              Move &ldquo;{findNode(tree, showConfirm.nodeId)?.title}&rdquo; to &ldquo;{findNode(tree, showConfirm.newParentId || '')?.title || 'Root'}&rdquo;?
            </p>
            {showConfirm.boardId !== showConfirm.oldBoardId && (
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#D97706', fontWeight: 500 }}>
                This will change the board association.
              </p>
            )}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowConfirm(null)}
                style={{
                  padding: '6px 16px',
                  fontSize: '13px',
                  border: '1px solid var(--theme-elevation-200)',
                  borderRadius: '4px',
                  background: 'var(--theme-elevation-0)',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                data-testid="confirm-move"
                onClick={handleConfirmMove}
                style={{
                  padding: '6px 16px',
                  fontSize: '13px',
                  border: 'none',
                  borderRadius: '4px',
                  background: 'var(--theme-elevation-800)',
                  color: 'var(--theme-elevation-0)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Move
              </button>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  )
}

export default TreeDndWrapper
