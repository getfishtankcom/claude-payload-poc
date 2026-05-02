/**
 * Shared admin tree node types.
 *
 * Used across ContentTree, TreeContextMenu, TreeDndWrapper, and any
 * tree-driven feature in the admin shell.
 */

import type { WorkflowState } from './workflow'

export interface TreeNode {
  id: string | number
  title: string
  slug: string
  contentType: string
  workflowState: WorkflowState | string
  lockedBy: string | number | null
  hasChildren: boolean
  sortOrder: number
  parent: string | number | null
  board: string | number | null
  hasTranslation?: boolean
  children?: TreeNode[]
}

export interface FolderNode {
  id: string | number
  name: string
  parent?: string | number | null
  sortOrder: number
  hasChildren: boolean
  childCount?: number
}
