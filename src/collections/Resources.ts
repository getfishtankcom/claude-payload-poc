/**
 * Resources collection — articles, guidance, webinars, and other published
 * resources (canonical name; replaces "documents" from Phase 1). Workflow
 * chrome via `withWorkflow`.
 *
 * @notes
 * - `category` classifies content; `resourceType` drives display treatment
 *   (PDF icon, video embed, external link icon)
 */
import type { CollectionConfig } from 'payload'

import { withWorkflow } from './_lib/with-workflow'

export const Resources: CollectionConfig = withWorkflow(
  {
    slug: 'resources',
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'category', 'workflowState', 'resourceType', 'board', 'date'],
    },
    fields: [
      { name: 'title', type: 'text', required: true, localized: true, label: 'Title' },
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
      { name: 'date', type: 'date', label: 'Date', admin: { position: 'sidebar' } },
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
      { name: 'excerpt', type: 'textarea', localized: true, label: 'Excerpt' },
      {
        name: 'content',
        type: 'richText',
        localized: true,
        label: 'Content',
        admin: { description: 'Full content for webpage-type resources' },
      },
      {
        name: 'externalUrl',
        type: 'text',
        label: 'External URL',
        admin: { description: 'Link to external resource (for External Link resource type)' },
      },
      {
        name: 'file',
        type: 'upload',
        relationTo: 'media',
        label: 'File',
        admin: { description: 'Uploaded file (PDF, audio, etc.)' },
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
        admin: { position: 'sidebar' },
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
        admin: { description: 'Optional — link to a specific standard' },
      },
    ],
  },
  { boardFiltered: true },
)
