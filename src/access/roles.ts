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
import type { User } from '@/payload-types'

// --- Role Helpers ---

type Role = 'admin' | 'editor' | 'author'

function getUserRole(user: User | null | undefined): Role | undefined {
  if (!user) return undefined
  return (user as User & { role?: Role }).role
}

function getUserId(user: User | null | undefined): number | undefined {
  if (!user) return undefined
  return user.id
}

export const isAdmin = (user: User | null | undefined): boolean => {
  return getUserRole(user) === 'admin'
}

export const isEditorOrAbove = (user: User | null | undefined): boolean => {
  const role = getUserRole(user)
  return role === 'admin' || role === 'editor'
}

export const isAuthorOrAbove = (user: User | null | undefined): boolean => {
  const role = getUserRole(user)
  return role === 'admin' || role === 'editor' || role === 'author'
}

// --- Collection-Level Access ---

/** Admin-only access (manage users, system settings) */
export const adminOnly: Access = ({ req: { user } }) => {
  return isAdmin(user as User)
}

/** Editor or Admin access (approve, publish, schedule, delete drafts) */
export const editorOrAbove: Access = ({ req: { user } }) => {
  return isEditorOrAbove(user as User)
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
  if (isEditorOrAbove(user as User)) return true
  // Authors can edit own items that are draft or needs_revision
  const where: Where = {
    and: [
      { createdBy: { equals: getUserId(user as User) } },
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
  if (isAdmin(user as User)) return true
  if (getUserRole(user as User) === 'editor') {
    const where: Where = { workflowState: { equals: 'draft' } }
    return where
  }
  // Authors: own drafts only
  const where: Where = {
    and: [
      { createdBy: { equals: getUserId(user as User) } },
      { workflowState: { equals: 'draft' } },
    ],
  }
  return where
}

// --- Field-Level Access ---

/** Only admins can read/update this field */
export const adminOnlyField: FieldAccess = ({ req: { user } }) => {
  return isAdmin(user as User)
}

/** Editors and admins can update this field */
export const editorOrAboveField: FieldAccess = ({ req: { user } }) => {
  return isEditorOrAbove(user as User)
}

// --- Users Collection Access ---

/** Users collection: only admins can create/delete users */
export const usersCreate: Access = ({ req: { user } }) => {
  return isAdmin(user as User)
}

/** Users collection: users can read their own profile, admins can read all */
export const usersRead: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user as User)) return true
  return { id: { equals: getUserId(user as User) } }
}

/** Users collection: users can update own profile, admins can update all */
export const usersUpdate: Access = ({ req: { user }, id }) => {
  if (!user) return false
  if (isAdmin(user as User)) return true
  return getUserId(user as User) === id
}

/** Users collection: only admins can delete users */
export const usersDelete: Access = ({ req: { user } }) => {
  return isAdmin(user as User)
}
