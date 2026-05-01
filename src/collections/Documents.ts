/**
 * @description
 * Documents collection for RAS Canada's published documents.
 * Covers exposure drafts, implementation guides, research reports, and more.
 * Files are uploaded via the media collection.
 *
 * Key features:
 * - Type enum for document classification
 * - File upload via media collection
 * - Relationships to boards, standards, and projects
 * - Workflow: 5-state with workflowState, workflowHistory, publishOn/unpublishOn
 * - RBAC: role-based access control (author/editor/admin)
 *
 * @dependencies
 * - Media collection (upload for file)
 * - Boards collection (relationship)
 * - Standards collection (relationship)
 * - Projects collection (relationship)
 * - workflow fields from @/fields/workflow
 * - access/roles for RBAC
 * - admin/hooks/workflow-hooks for transition validation
 *
 * @notes
 * - This is NOT the canonical "resources" collection (Phase 2) — that has broader scope
 * - PDFs dominate the document library (from Sitecore dump analysis)
 * - Epic 22: workflow, RBAC added
 */
import type { CollectionConfig } from 'payload'

import { syncToMeilisearch } from '@/search/meilisearch-sync'
import { extractDocumentText } from '@/search/document-extraction'
import { workflowFields } from '@/fields/workflow'
import { contentRead, contentCreate, contentUpdate, contentDelete } from '@/access/roles'
import { validateWorkflowTransition, createLogWorkflowTransition } from '@/admin/hooks/workflow-hooks'

const { afterChange: meilisearchAfterChange, afterDelete } = syncToMeilisearch({ indexName: 'documents' })

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'workflowState', 'board'],
    components: {
      beforeListTable: ['/admin/components/BoardFilterBar'],
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
    afterChange: [createLogWorkflowTransition('documents'), meilisearchAfterChange, extractDocumentText],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Document Title',
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
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Document Type',
      options: [
        { label: 'Exposure Draft', value: 'Exposure Draft' },
        { label: 'Implementation Guide', value: 'Implementation Guide' },
        { label: 'Background Paper', value: 'Background Paper' },
        { label: 'Research Report', value: 'Research Report' },
        { label: 'Guidance', value: 'Guidance' },
        { label: 'Standard', value: 'Standard' },
      ],
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'File',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Description',
    },
    {
      name: 'board',
      type: 'relationship',
      relationTo: 'boards',
      label: 'Board',
    },
    {
      name: 'standard',
      type: 'relationship',
      relationTo: 'standards',
      label: 'Standard',
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Related Project',
    },
    // --- Workflow fields (Epic 22) ---
    ...workflowFields,
  ],
}
