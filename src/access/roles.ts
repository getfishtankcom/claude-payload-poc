/**
 * @description
 * Role-based access control utilities for FRAS Canada CMS.
 * Implements 3-role RBAC: author, editor, admin per PRD Section 2.2.
 *
 * Key features:
 * - isAdmin/isEditor/isAuthor role checks
 * - Content access factories: createContentAccess for read/create/update/delete
 * - Workflow-aware access: authors can only edit own drafts, editors can approve/publish
 *
 * @dependencies
 * - payload: Access type from Payload CMS
 *
 * @notes
 * - Users collection has `role` field (select: admin/editor/author)
 * - Single role per user (not multi-select)
 * - Access functions return boolean or Payload Where query for row-level filtering
 */
import type { Access, FieldAccess, Where } from 'payload'

// --- Role Helpers ---

type UserWithRole = {
  id: string
  role?: 'admin' | 'editor' | 'author'
  [key: string]: unknown
}

export const isAdmin = (user: UserWithRole | null | undefined): boolean => {
  return user?.role === 'admin'
}

export const isEditorOrAbove = (user: UserWithRole | null | undefined): boolean => {
  return user?.role === 'admin' || user?.role === 'editor'
}

export const isAuthorOrAbove = (user: UserWithRole | null | undefined): boolean => {
  return user?.role === 'admin' || user?.role === 'editor' || user?.role === 'author'
}

// --- Collection-Level Access ---

/** Admin-only access (manage users, system settings) */
export const adminOnly: Access = ({ req: { user } }) => {
  return isAdmin(user as UserWithRole)
}

/** Editor or Admin access (approve, publish, schedule, delete drafts) */
export const editorOrAbove: Access = ({ req: { user } }) => {
  return isEditorOrAbove(user as UserWithRole)
}

/**
 * Content read access: all authenticated users see everything,
 * public sees only published items (via workflowState).
 */
export const contentRead: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    workflowState: { equals: 'published' },
  }
}

/**
 * Content create access: any authenticated user can create content.
 */
export const contentCreate: Access = ({ req: { user } }) => {
  return Boolean(user)
}

/**
 * Content update access:
 * - Admins/Editors can update anything
 * - Authors can only update their own drafts
 */
export const contentUpdate: Access = ({ req: { user } }) => {
  if (!user) return false
  const u = user as UserWithRole
  if (isEditorOrAbove(u)) return true
  // Authors can edit own items that are draft or needs_revision
  const where: Where = {
    and: [
      { createdBy: { equals: u.id } },
      { workflowState: { in: ['draft', 'needs_revision'] } },
    ],
  }
  return where
}

/**
 * Content delete access:
 * - Admins can delete anything
 * - Editors can delete draft items
 * - Authors can delete only their own drafts
 */
export const contentDelete: Access = ({ req: { user } }) => {
  if (!user) return false
  const u = user as UserWithRole
  if (isAdmin(u)) return true
  if (u.role === 'editor') {
    const where: Where = { workflowState: { equals: 'draft' } }
    return where
  }
  // Authors: own drafts only
  const where: Where = {
    and: [
      { createdBy: { equals: u.id } },
      { workflowState: { equals: 'draft' } },
    ],
  }
  return where
}

// --- Field-Level Access ---

/** Only admins can read/update this field */
export const adminOnlyField: FieldAccess = ({ req: { user } }) => {
  return isAdmin(user as UserWithRole)
}

/** Editors and admins can update this field */
export const editorOrAboveField: FieldAccess = ({ req: { user } }) => {
  return isEditorOrAbove(user as UserWithRole)
}

// --- Users Collection Access ---

/** Users collection: only admins can create/delete users */
export const usersCreate: Access = ({ req: { user } }) => {
  return isAdmin(user as UserWithRole)
}

/** Users collection: users can read their own profile, admins can read all */
export const usersRead: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user as UserWithRole)) return true
  return { id: { equals: (user as UserWithRole).id } }
}

/** Users collection: users can update own profile, admins can update all */
export const usersUpdate: Access = ({ req: { user }, id }) => {
  if (!user) return false
  if (isAdmin(user as UserWithRole)) return true
  return (user as UserWithRole).id === id
}

/** Users collection: only admins can delete users */
export const usersDelete: Access = ({ req: { user } }) => {
  return isAdmin(user as UserWithRole)
}
