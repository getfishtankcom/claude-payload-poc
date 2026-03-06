/**
 * @description
 * Reusable workflow fields for content collections.
 * Adds workflowState, workflowHistory, publishOn, unpublishOn, and createdBy
 * to any collection that needs the 5-state publishing workflow.
 *
 * Key features:
 * - workflowState: 6-option select (draft, in_review, needs_revision, approved, published, unpublished)
 * - workflowHistory: array tracking all state transitions with user, date, comment
 * - publishOn/unpublishOn: scheduled publishing date fields
 * - createdBy: auto-populated relationship to user who created the document
 *
 * @dependencies
 * - Users collection for createdBy relationship and workflowHistory user
 *
 * @notes
 * - Import and spread these fields into any collection's fields array
 * - The beforeChange hook (in workflow-hooks.ts) enforces valid transitions
 * - createdBy is set automatically via beforeChange hook on create
 */
import type { Field } from 'payload'

export const workflowStateField: Field = {
  name: 'workflowState',
  type: 'select',
  required: true,
  defaultValue: 'draft',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'In Review', value: 'in_review' },
    { label: 'Needs Revision', value: 'needs_revision' },
    { label: 'Approved', value: 'approved' },
    { label: 'Published', value: 'published' },
    { label: 'Unpublished', value: 'unpublished' },
  ],
  admin: {
    position: 'sidebar',
    description: 'Current workflow state',
  },
}

export const workflowHistoryField: Field = {
  name: 'workflowHistory',
  type: 'array',
  label: 'Workflow History',
  admin: {
    readOnly: true,
    description: 'Audit trail of all workflow state transitions',
    condition: (data) => data?.workflowHistory?.length > 0,
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      label: 'From State',
    },
    {
      name: 'to',
      type: 'text',
      label: 'To State',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'User',
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Comment',
    },
  ],
}

export const publishOnField: Field = {
  name: 'publishOn',
  type: 'date',
  label: 'Scheduled Publish',
  admin: {
    position: 'sidebar',
    description: 'Auto-publish at this date/time (requires Approved state)',
    date: {
      pickerAppearance: 'dayAndTime',
    },
  },
}

export const unpublishOnField: Field = {
  name: 'unpublishOn',
  type: 'date',
  label: 'Scheduled Unpublish',
  admin: {
    position: 'sidebar',
    description: 'Auto-unpublish at this date/time',
    date: {
      pickerAppearance: 'dayAndTime',
    },
  },
}

export const createdByField: Field = {
  name: 'createdBy',
  type: 'relationship',
  relationTo: 'users',
  label: 'Created By',
  admin: {
    position: 'sidebar',
    readOnly: true,
    description: 'User who created this item',
  },
}

/** All workflow fields as an array — spread into collection fields */
export const workflowFields: Field[] = [
  workflowStateField,
  workflowHistoryField,
  publishOnField,
  unpublishOnField,
  createdByField,
]
