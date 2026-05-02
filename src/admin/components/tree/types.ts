/**
 * @description
 * Type definitions for the persistent left tree spine. Kept dependency-free
 * so server components, the state store, the tree view, and the context
 * menu all share the same vocabulary without circular imports.
 */

export type WorkflowState =
  | 'draft'
  | 'in-review'
  | 'needs-revision'
  | 'approved'
  | 'published'

export type TreeNode = {
  id: string
  /** Slug used for the URL (e.g. `acsb`, `news`, `events`). */
  slug: string
  /** Display label. */
  label: string
  /** Collection slug — used by valid-child-type filtering. */
  collection: string
  /** Optional children. Absence indicates a leaf. */
  children?: TreeNode[]
  /** Workflow state for the gutter icon. */
  workflow?: WorkflowState
  /** Whether the item is locked by another user. */
  locked?: boolean
  /** Whether the FR locale exists for this item. */
  hasFr?: boolean
}

/**
 * Map of `parent collection` → set of valid `child collection` slugs.
 * Used by the right-click menu to filter the "Insert" submenu so authors
 * can only create children of permissible types.
 */
export type ValidChildMap = Record<string, readonly string[]>
