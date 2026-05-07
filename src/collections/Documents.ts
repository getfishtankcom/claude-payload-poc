/**
 * Documents collection — published exposure drafts, implementation guides,
 * research reports, and other uploaded documents. Workflow + search-sync +
 * board-filter chrome via `withWorkflow`. The `extractDocumentText` hook
 * is wired through `extraHooks.afterChange` for full-text indexing.
 *
 * @notes
 * - Distinct from `resources` (Phase 2 broader scope)
 */
import type { CollectionConfig } from 'payload'

import { extractDocumentText } from '@/search/document-extraction'
import { withWorkflow } from './_lib/with-workflow'

export const Documents: CollectionConfig = withWorkflow(
  {
    slug: 'documents',
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'type', 'workflowState', 'board'],
    },
    fields: [
      { name: 'title', type: 'text', required: true, localized: true, label: 'Document Title' },
      {
        name: 'slug',
        type: 'text',
        localized: true,
        required: true,
        unique: true,
        label: 'Slug',
        admin: { position: 'sidebar' },
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
      { name: 'file', type: 'upload', relationTo: 'media', label: 'File' },
      { name: 'description', type: 'textarea', localized: true, label: 'Description' },
      { name: 'board', type: 'relationship', relationTo: 'boards', label: 'Board' },
      { name: 'standard', type: 'relationship', relationTo: 'standards', label: 'Standard' },
      {
        name: 'project',
        type: 'relationship',
        relationTo: 'projects',
        label: 'Related Project',
      },
    ],
  },
  {
    searchable: true,
    boardFiltered: true,
    extraHooks: { afterChange: [extractDocumentText] },
  },
)
