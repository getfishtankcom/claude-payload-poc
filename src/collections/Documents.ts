/**
 * @description
 * Documents collection for FRAS Canada's published documents.
 * Covers exposure drafts, implementation guides, research reports, and more.
 * Files are uploaded via the media collection.
 *
 * Key features:
 * - Type enum for document classification
 * - File upload via media collection
 * - Relationships to boards, standards, and projects
 *
 * @dependencies
 * - Media collection (upload for file)
 * - Boards collection (relationship)
 * - Standards collection (relationship)
 * - Projects collection (relationship)
 *
 * @notes
 * - This is NOT the canonical "resources" collection (Phase 2) — that has broader scope
 * - PDFs dominate the document library (from Sitecore dump analysis)
 */
import type { CollectionConfig } from 'payload'

import { syncToMeilisearch } from '@/search/meilisearch-sync'
import { extractDocumentText } from '@/search/document-extraction'

const { afterChange, afterDelete } = syncToMeilisearch({ indexName: 'documents' })

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'board'],
  },
  hooks: {
    afterChange: [afterChange, extractDocumentText],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Document Title',
    },
    {
      name: 'slug',
      type: 'text',
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
  ],
}
