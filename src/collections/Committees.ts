/**
 * @description
 * Committees collection for RAS Canada's board advisory committees.
 * Each committee belongs to a board and has an embedded list of members.
 *
 * Key features:
 * - Auto-generated slug from name
 * - Embedded members array (not a relationship — committee members aren't board-members)
 * - Meeting reports array for downloadable PDFs (180+ in Sitecore)
 * - Status enum for lifecycle management
 * - Workflow: 5-state with workflowState, workflowHistory, publishOn/unpublishOn
 * - RBAC: role-based access control (author/editor/admin)
 *
 * @dependencies
 * - Boards collection (relationship)
 * - workflow fields from @/fields/workflow
 * - access/roles for RBAC
 * - admin/hooks/workflow-hooks for transition validation
 *
 * @notes
 * - AcSB has 13 committees, other boards have 3+ each
 * - Members array uses embedded fields (name, role, organization) not relationships
 * - meetingReports from Sitecore dump (IDG Extracts, PSADG reports)
 * - Epic 22: workflow, RBAC added
 */
import type { CollectionConfig } from 'payload'

import { workflowFields } from '@/fields/workflow'
import { contentRead, contentCreate, contentUpdate, contentDelete } from '@/access/roles'
import { validateWorkflowTransition, createLogWorkflowTransition } from '@/admin/hooks/workflow-hooks'

export const Committees: CollectionConfig = {
  slug: 'committees',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'board', 'workflowState', 'status', 'sortOrder'],
    components: {
      beforeListTable: ['/admin/components/BoardFilterBar'],
      edit: {
        beforeDocumentControls: ['/admin/components/TranslateButton'],
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
    afterChange: [createLogWorkflowTransition('committees')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Committee Name',
    },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
        description: 'URL-safe identifier — auto-generate from name',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: 'Description',
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'detailPageUrl',
      type: 'text',
      label: 'Detail Page URL',
      admin: {
        description: 'Optional link to a dedicated committee detail page',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'members',
      type: 'array',
      label: 'Members',
      admin: {
        description: 'Committee members (embedded, not linked to board-members)',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
          label: 'Name',
        },
        {
          name: 'role',
          type: 'text',
          localized: true,
          label: 'Role',
          admin: {
            description: 'Role within the committee (e.g., "Chair", "Member")',
          },
        },
        {
          name: 'organization',
          type: 'text',
          localized: true,
          label: 'Organization',
        },
      ],
    },
    {
      name: 'meetingReports',
      type: 'array',
      label: 'Meeting Reports',
      admin: {
        description: 'Downloadable committee meeting report PDFs',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: 'Report Title',
        },
        {
          name: 'date',
          type: 'date',
          label: 'Report Date',
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          label: 'PDF File',
        },
      ],
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
