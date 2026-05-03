/**
 * @description
 * Board Members collection for RAS Canada's board/council members.
 * Tracks member details including photos, roles, appointment dates, and term info.
 *
 * Key features:
 * - Role enum: chair, vice-chair, voting-member, non-voting
 * - Photo upload at 205x205 for member cards
 * - Relationship to boards collection for board-specific member listings
 * - Sort order for manual ordering within role groups
 * - Workflow: 5-state with workflowState, workflowHistory, publishOn/unpublishOn
 * - RBAC: role-based access control (author/editor/admin)
 *
 * @dependencies
 * - Boards collection (relationship)
 * - Pages collection (relationship for bio page)
 * - Media collection (upload for photo)
 * - workflow fields from @/fields/workflow
 * - access/roles for RBAC
 * - admin/hooks/workflow-hooks for transition validation
 *
 * @notes
 * - Separate from contacts collection (contacts = staff, board-members = appointed members)
 * - roleLabel allows custom display text (e.g., "Ex-officio Member")
 * - sortOrder controls display order within role groups
 * - Epic 22: workflow, RBAC added
 */
import type { CollectionConfig } from 'payload'

import { workflowFields } from '@/fields/workflow'
import { contentRead, contentCreate, contentUpdate, contentDelete } from '@/access/roles'
import { validateWorkflowTransition, createLogWorkflowTransition } from '@/admin/hooks/workflow-hooks'

export const BoardMembers: CollectionConfig = {
  slug: 'board-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'workflowState', 'board', 'termExpires'],
    components: {
      beforeListTable: ['/admin/components/BoardFilterBar'],
      edit: {
        beforeDocumentControls: [
          '/admin/components/WorkflowActionBarField',
        ],
      },
    },
  },
  access: {
    read: contentRead,
    create: contentCreate,
    update: contentUpdate,
    delete: contentDelete,
  },
  hooks: {
    beforeChange: [validateWorkflowTransition],
    afterChange: [createLogWorkflowTransition('board-members')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Full Name',
    },
    {
      name: 'credentials',
      type: 'text',
      localized: true,
      label: 'Credentials',
      admin: {
        description: 'Professional designations (e.g., "CPA, CA, MBA")',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo',
      admin: {
        description: 'Portrait photo — displayed at 205x205px on member cards',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      label: 'Role',
      options: [
        { label: 'Chair', value: 'chair' },
        { label: 'Vice-Chair', value: 'vice-chair' },
        { label: 'Voting Member', value: 'voting-member' },
        { label: 'Non-Voting', value: 'non-voting' },
      ],
    },
    {
      name: 'roleLabel',
      type: 'text',
      localized: true,
      label: 'Role Label',
      admin: {
        description: 'Custom display label (e.g., "Ex-officio Member"). Falls back to role enum if empty.',
      },
    },
    {
      name: 'appointedDate',
      type: 'date',
      label: 'Appointed Date',
    },
    {
      name: 'termExpires',
      type: 'date',
      label: 'Term Expires',
    },
    {
      name: 'bioPage',
      type: 'relationship',
      relationTo: 'pages',
      label: 'Bio Page',
      admin: {
        description: 'Link to the member bio content page',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        description: 'Controls display order within role groups (lower = first)',
        position: 'sidebar',
      },
    },
    {
      name: 'board',
      type: 'relationship',
      relationTo: 'boards',
      required: true,
      label: 'Board',
    },
    // --- Workflow fields (Epic 22) ---
    ...workflowFields,
  ],
}
