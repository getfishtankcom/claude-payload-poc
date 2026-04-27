/**
 * Shared admin workflow types and constants.
 *
 * These types and tables are used across every admin surface that
 * touches workflow state — Workbox, Content Tree, Dashboard widgets,
 * WorkflowActionBar, etc. Importing from here is the single source of
 * truth; do not redeclare these shapes locally.
 */

export type WorkflowState =
  | 'draft'
  | 'in_review'
  | 'needs_revision'
  | 'approved'
  | 'published'
  | 'unpublished'

export type UserRole = 'author' | 'editor' | 'admin'

export interface UserWithRole {
  id: string
  email?: string
  name?: string
  firstName?: string
  lastName?: string
  role?: UserRole
  [key: string]: unknown
}

export interface WorkflowHistoryEntry {
  from: WorkflowState | string
  to: WorkflowState | string
  user: string | { firstName?: string; email?: string }
  date: string
  comment?: string
}

export const STATE_LABELS: Record<WorkflowState, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  needs_revision: 'Needs Revision',
  approved: 'Approved',
  published: 'Published',
  unpublished: 'Unpublished',
}

export const STATE_COLORS: Record<WorkflowState, string> = {
  draft: '#6b7280',
  in_review: '#3b82f6',
  needs_revision: '#f59e0b',
  approved: '#22c55e',
  published: '#8b5cf6',
  unpublished: '#ef4444',
}

/**
 * Valid target states per actor role per current state, per
 * PRD-admin-panel.md §7.2 transitions table.
 *
 * `WORKFLOW_TRANSITIONS[role][currentState]` returns the list of
 * states that role may transition the document INTO.
 */
export const WORKFLOW_TRANSITIONS: Record<
  UserRole,
  Record<WorkflowState, WorkflowState[]>
> = {
  author: {
    draft: ['in_review'],
    in_review: [],
    needs_revision: ['in_review'],
    approved: [],
    published: [],
    unpublished: [],
  },
  editor: {
    draft: ['in_review'],
    in_review: ['approved', 'needs_revision'],
    needs_revision: ['in_review'],
    approved: ['published'],
    published: ['unpublished'],
    unpublished: ['draft'],
  },
  admin: {
    draft: ['in_review', 'approved', 'published'],
    in_review: ['approved', 'needs_revision', 'draft'],
    needs_revision: ['in_review', 'draft'],
    approved: ['published', 'needs_revision', 'draft'],
    published: ['unpublished', 'approved'],
    unpublished: ['draft', 'published'],
  },
}
