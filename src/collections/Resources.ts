/**
 * @description
 * Resources collection for RAS Canada's articles, guidance, webinars, and other resources.
 * Canonical name: "resources" (replaces "documents" from Phase 1 naming).
 *
 * Key features:
 * - Category and resourceType enums for faceted filtering
 * - Supports both file upload and external URL
 * - Rich text content for webpage-type resources
 * - Board and optional standard relationships
 * - Workflow: 5-state with workflowState, workflowHistory, publishOn/unpublishOn
 * - RBAC: role-based access control (author/editor/admin)
 *
 * @dependencies
 * - Boards collection (relationship)
 * - Standards collection (relationship, optional)
 * - Media collection (upload for file)
 * - workflow fields from @/fields/workflow
 * - access/roles for RBAC
 * - admin/hooks/workflow-hooks for transition validation
 *
 * @notes
 * - This is separate from the Phase 1 "documents" collection (which handles exposure drafts etc.)
 * - resourceType determines display treatment (PDF icon, video embed, external link icon)
 * - category is for content classification, resourceType is for format
 * - Epic 22: workflow, RBAC added
 */
import type { CollectionConfig } from 'payload'

import { workflowFields } from '@/fields/workflow'
import { contentRead, contentCreate, contentUpdate, contentDelete } from '@/access/roles'
import { validateWorkflowTransition, createLogWorkflowTransition } from '@/admin/hooks/workflow-hooks'

export const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'workflowState', 'resourceType', 'board', 'date'],
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
    afterChange: [createLogWorkflowTransition('resources')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Title',
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
        description: 'URL-safe identifier — auto-generate from title',
      },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Category',
      options: [
        { label: 'Article', value: 'Article' },
        { label: 'Guidance', value: 'Guidance' },
        { label: 'In Brief', value: 'In Brief' },
        { label: 'Other', value: 'Other' },
        { label: 'Webinar', value: 'Webinar' },
      ],
    },
    {
      name: 'resourceType',
      type: 'select',
      label: 'Resource Type',
      options: [
        { label: 'Audio', value: 'Audio' },
        { label: 'External Link', value: 'External Link' },
        { label: 'PDF', value: 'PDF' },
        { label: 'Video', value: 'Video' },
        { label: 'Webpage', value: 'Webpage' },
        { label: 'Plain Language', value: 'Plain Language' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      label: 'Excerpt',
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      label: 'Content',
      admin: {
        description: 'Full content for webpage-type resources',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'External URL',
      admin: {
        description: 'Link to external resource (for External Link resource type)',
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'File',
      admin: {
        description: 'Uploaded file (PDF, audio, etc.)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
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
    {
      name: 'standard',
      type: 'relationship',
      relationTo: 'standards',
      label: 'Standard',
      admin: {
        description: 'Optional — link to a specific standard',
      },
    },
    // --- Workflow fields (Epic 22) ---
    ...workflowFields,
  ],
}
