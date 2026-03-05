/**
 * @description
 * Consultations collection (canonical name: document-for-comment in Phase 2).
 * Tracks exposure drafts, surveys, and re-exposure drafts with comment periods.
 * Includes countdown timer support via deadline_date and comment period fields.
 *
 * Key features:
 * - Comment period start/end dates for open/closed status logic
 * - Action documents array for downloadable consultation materials
 * - Relationships to boards, standards, and projects
 * - Virtual days_remaining computed from deadline_date (frontend utility)
 *
 * @dependencies
 * - Boards collection (relationship)
 * - Standards collection (relationship)
 * - Projects collection (relationship)
 *
 * @notes
 * - days_remaining is NOT a stored field — computed at query time or on frontend
 * - commentPeriodEnd determines open/closed status for the countdown timer
 * - frasIdNumber is the Sitecore FRAS ID for migration/workflow reference
 */
import type { CollectionConfig } from 'payload'

import { syncToMeilisearch } from '@/search/meilisearch-sync'

const { afterChange, afterDelete } = syncToMeilisearch({ indexName: 'consultations' })

export const Consultations: CollectionConfig = {
  slug: 'consultations',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'deadline_date', 'board'],
  },
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Consultation Title',
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
      label: 'Consultation Type',
      options: [
        { label: 'Exposure Draft', value: 'Exposure Draft' },
        { label: 'Survey', value: 'Survey' },
        { label: 'Re-exposure Draft', value: 'Re-exposure Draft' },
      ],
    },
    {
      name: 'deadline_date',
      type: 'date',
      required: true,
      label: 'Deadline Date',
      admin: {
        description: 'Primary deadline for the consultation',
      },
    },
    {
      name: 'commentPeriodStart',
      type: 'date',
      label: 'Comment Period Start',
      admin: {
        description: 'Start of the public comment window',
      },
    },
    {
      name: 'commentPeriodEnd',
      type: 'date',
      label: 'Comment Period End',
      admin: {
        description: 'End of comment period — used for countdown timer and open/closed status',
      },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: 'Description',
    },
    {
      name: 'action_documents',
      type: 'array',
      label: 'Action Documents',
      admin: {
        description: 'Downloadable documents related to this consultation',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: 'Label',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
        {
          name: 'type',
          type: 'select',
          label: 'Document Type',
          options: [
            { label: 'PDF', value: 'pdf' },
            { label: 'Word', value: 'word' },
            { label: 'Link', value: 'link' },
          ],
        },
      ],
    },
    {
      name: 'frasIdNumber',
      type: 'text',
      label: 'FRAS ID Number',
      admin: {
        position: 'sidebar',
        description: 'Sitecore FRAS ID for migration/workflow reference',
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
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Related Project',
    },
  ],
}
