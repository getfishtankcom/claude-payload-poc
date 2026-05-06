/**
 * Consultations collection — exposure drafts, surveys, and re-exposure drafts
 * with comment periods. Workflow + search-sync chrome via `withWorkflow`.
 *
 * @notes
 * - `days_remaining` is computed at query time, not stored
 * - `commentPeriodEnd` drives the countdown timer + open/closed status
 * - frasIdNumber is the Sitecore FRAS ID for migration/workflow reference
 */
import type { CollectionConfig } from 'payload'

import { withWorkflow } from './_lib/with-workflow'

export const Consultations: CollectionConfig = withWorkflow(
  {
    slug: 'consultations',
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'type', 'workflowState', 'deadline_date', 'board'],
    },
    fields: [
      { name: 'title', type: 'text', required: true, localized: true, label: 'Consultation Title' },
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
        admin: { description: 'Primary deadline for the consultation' },
      },
      {
        name: 'commentPeriodStart',
        type: 'date',
        label: 'Comment Period Start',
        admin: { description: 'Start of the public comment window' },
      },
      {
        name: 'commentPeriodEnd',
        type: 'date',
        label: 'Comment Period End',
        admin: {
          description: 'End of comment period — used for countdown timer and open/closed status',
        },
      },
      { name: 'description', type: 'richText', localized: true, label: 'Description' },
      {
        name: 'action_documents',
        type: 'array',
        label: 'Action Documents',
        admin: { description: 'Downloadable documents related to this consultation' },
        fields: [
          { name: 'label', type: 'text', required: true, localized: true, label: 'Label' },
          { name: 'url', type: 'text', required: true, label: 'URL' },
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
      { name: 'standard', type: 'relationship', relationTo: 'standards', label: 'Standard' },
      { name: 'project', type: 'relationship', relationTo: 'projects', label: 'Related Project' },
    ],
  },
  { searchable: true },
)
