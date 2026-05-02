/**
 * @description
 * Workflow transition hooks for content collections.
 * Enforces valid state transitions per PRD Section 7.2 and logs history.
 *
 * Key features:
 * - beforeChange: validates transition rules, enforces role permissions
 * - afterChange: logs transition to workflowHistory array
 * - Rejection requires mandatory comment
 * - createdBy auto-populated on create
 *
 * @dependencies
 * - access/roles: isAdmin, isEditorOrAbove helpers
 *
 * @notes
 * - Context flag `skipWorkflowValidation` prevents recursive hook firing
 * - All transitions logged with user, date, and optional comment
 * - The scheduled publishing cron (task 22.7) uses context flag to bypass role checks
 */
import type {
  CollectionBeforeChangeHook,
  CollectionAfterChangeHook,
  CollectionSlug,
} from 'payload'

import { isAdmin, isEditorOrAbove } from '@/access/roles'
import type { User } from '@/payload-types'

import type { WorkflowState } from '../types/workflow'

/**
 * Valid workflow transitions mapped by from -> to states.
 * Each entry lists which role levels can perform the transition.
 * 'author' means author+editor+admin, 'editor' means editor+admin, 'admin' means admin only.
 */
const VALID_TRANSITIONS: Record<WorkflowState, Partial<Record<WorkflowState, 'author' | 'editor' | 'admin'>>> = {
  draft: {
    in_review: 'author', // Anyone can submit for review
  },
  in_review: {
    approved: 'editor', // Editor+ can approve
    needs_revision: 'editor', // Editor+ can reject (requires comment)
  },
  needs_revision: {
    in_review: 'author', // Author resubmits after addressing feedback
  },
  approved: {
    published: 'editor', // Editor+ can publish
    needs_revision: 'editor', // Editor+ can send back
  },
  published: {
    unpublished: 'editor', // Editor+ can unpublish
    draft: 'admin', // Admin can create new draft from published
  },
  unpublished: {
    draft: 'editor', // Editor+ can re-draft
  },
}

function canPerformTransition(
  requiredRole: 'author' | 'editor' | 'admin',
  user: User,
): boolean {
  switch (requiredRole) {
    case 'author':
      return Boolean(user.role)
    case 'editor':
      return isEditorOrAbove(user)
    case 'admin':
      return isAdmin(user)
    default:
      return false
  }
}

/**
 * beforeChange hook: validates workflow transitions and auto-sets createdBy.
 * Attach to any collection using workflow fields.
 */
export const validateWorkflowTransition: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
  req,
  operation,
  context,
}) => {
  // Auto-set createdBy on create
  if (operation === 'create' && req.user && !data.createdBy) {
    data.createdBy = req.user.id
  }

  // Skip validation if flagged (used by scheduled publishing cron)
  if (context?.skipWorkflowValidation) return data

  const oldState = (originalDoc?.workflowState || 'draft') as WorkflowState
  const newState = data.workflowState as WorkflowState | undefined

  // No state change or no new state specified — allow
  if (!newState || newState === oldState) return data

  // On create, only allow draft
  if (operation === 'create') {
    if (newState !== 'draft') {
      throw new Error('New items must start in draft state')
    }
    return data
  }

  // Validate transition exists
  const allowedTransitions = VALID_TRANSITIONS[oldState]
  const requiredRole = allowedTransitions?.[newState]

  if (!requiredRole) {
    throw new Error(
      `Invalid workflow transition: ${oldState} -> ${newState}`,
    )
  }

  // Check user has permission for this transition
  const user = req.user as User | null
  if (!user) {
    throw new Error('Authentication required for workflow transitions')
  }

  if (!canPerformTransition(requiredRole, user)) {
    throw new Error(
      `Insufficient permissions for transition: ${oldState} -> ${newState}. Required role: ${requiredRole}`,
    )
  }

  // Rejection requires mandatory comment
  if (newState === 'needs_revision') {
    const comment = context?.workflowComment as string | undefined
    if (!comment || comment.trim().length === 0) {
      throw new Error('A comment is required when rejecting content')
    }
  }

  // Append history entry to the same write — eliminates the previous
  // afterChange double-write where every transition cost two PATCHes.
  if (!context?.skipWorkflowLogging) {
    const existingHistory = (originalDoc?.workflowHistory as unknown[]) || []
    const incoming = (data.workflowHistory as unknown[]) || existingHistory
    const historyEntry = {
      from: oldState,
      to: newState,
      user: req.user?.id ?? null,
      date: new Date().toISOString(),
      comment: (context?.workflowComment as string) || null,
    }
    data.workflowHistory = [...incoming, historyEntry]
  }

  return data
}

/**
 * afterChange hook factory — creates Notifications on workflow transitions.
 *
 * History append happens in beforeChange (single PATCH). This factory now
 * handles only the side-effect of creating in-app notifications:
 *   draft → in_review               → notify all editors + admins
 *   in_review → needs_revision      → notify the original author
 *   in_review → approved            → notify the original author
 *   approved → published            → notify the original author
 */
export const createLogWorkflowTransition = (
  collectionSlug: CollectionSlug,
): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, req, context }) => {
    if (context?.skipWorkflowNotifications) return doc
    const oldState = (previousDoc?.workflowState as WorkflowState) || 'draft'
    const newState = doc.workflowState as WorkflowState | undefined
    if (!newState || newState === oldState) return doc

    const baseLink = `/admin/collections/${collectionSlug}/${doc.id}`
    const title = (doc.title as string) || 'Item'
    const transition = `${oldState} → ${newState}`

    type Recipient = string | number
    const recipients: Recipient[] = []

    try {
      if (oldState === 'draft' && newState === 'in_review') {
        // Notify editors + admins.
        const reviewers = await req.payload.find({
          collection: 'users',
          where: { or: [{ role: { equals: 'editor' } }, { role: { equals: 'admin' } }] },
          limit: 100,
          depth: 0,
        })
        for (const u of reviewers.docs) recipients.push(u.id as Recipient)
      } else if (
        (oldState === 'in_review' && (newState === 'needs_revision' || newState === 'approved')) ||
        (oldState === 'approved' && newState === 'published')
      ) {
        const author = (doc.createdBy as { id?: string | number } | string | number | null | undefined)
        const authorId =
          typeof author === 'object' && author && 'id' in author
            ? (author as { id?: Recipient }).id
            : (author as Recipient | null | undefined)
        if (authorId != null) recipients.push(authorId)
      }

      if (recipients.length === 0) return doc

      await Promise.allSettled(
        recipients.map((recipient) =>
          req.payload.create({
            collection: 'notifications',
            data: {
              recipient: typeof recipient === 'string' ? Number(recipient) : recipient,
              type: 'workflow_transition',
              message: `${title}: ${transition}`,
              link: baseLink,
              read: false,
            },
            req,
            context: { skipWorkflowNotifications: true },
          }),
        ),
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      req.payload.logger.error(`Failed to create workflow notifications for ${doc.id}: ${msg}`)
    }

    return doc
  }
}
