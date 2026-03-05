/**
 * @description
 * Projects collection for FRAS Canada's active and completed projects.
 * Each project tracks status, timeline stages, badges, and relationships
 * to boards, standards, documents, and contacts.
 *
 * Key features:
 * - Timeline stages array (configurable up to 7 stages, tri-state display)
 * - Badge array for content type indicators
 * - Multiple relationship fields for cross-referencing
 * - current_stage tracks which timeline stage is active
 *
 * @dependencies
 * - Boards collection (relationship)
 * - Standards collection (relationship)
 * - Documents collection (relationship, hasMany)
 * - Contacts collection (relationship, hasMany)
 *
 * @notes
 * - current_stage max is 7 (not 5 — wireframe shows 5 as example only)
 * - frasIdNumber is the Sitecore FRAS ID for migration/workflow reference
 * - type field is used for Active Projects listing filter
 */
import type { CollectionConfig } from 'payload'

import { syncToMeilisearch } from '@/search/meilisearch-sync'

const { afterChange, afterDelete } = syncToMeilisearch({ indexName: 'projects' })

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'board', 'current_stage'],
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
      label: 'Project Title',
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
      name: 'summary',
      type: 'richText',
      label: 'Summary',
    },
    {
      name: 'key_proposals',
      type: 'richText',
      label: 'Key Proposals',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Paused', value: 'Paused' },
      ],
    },
    {
      name: 'badges',
      type: 'array',
      label: 'Badges',
      fields: [
        {
          name: 'badge_type',
          type: 'select',
          label: 'Badge Type',
          options: [
            { label: 'Exposure Draft', value: 'Exposure Draft' },
            { label: 'Public Comment', value: 'Public Comment' },
            { label: 'Survey', value: 'Survey' },
            { label: 'Research', value: 'Research' },
            { label: 'Re-exposure Draft', value: 'Re-exposure Draft' },
          ],
        },
      ],
    },
    {
      name: 'timeline_stages',
      type: 'array',
      label: 'Timeline Stages',
      maxRows: 7,
      admin: {
        description: 'Up to 7 stages. Each stage is tri-state: complete, in-progress, or not-started.',
      },
      fields: [
        {
          name: 'phase_number',
          type: 'number',
          required: true,
          label: 'Phase Number',
        },
        {
          name: 'date',
          type: 'date',
          label: 'Date',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Stage Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'ctas',
          type: 'array',
          label: 'Call-to-Action Links',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Label',
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL',
            },
          ],
        },
      ],
    },
    {
      name: 'current_stage',
      type: 'number',
      label: 'Current Stage',
      min: 1,
      max: 7,
      admin: {
        description: 'Which timeline stage is currently active (1-7)',
      },
    },
    {
      name: 'type',
      type: 'select',
      label: 'Project Type',
      admin: {
        description: 'Used for Active Projects listing filter',
      },
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Completed', value: 'Completed' },
      ],
    },
    {
      name: 'frasIdNumber',
      type: 'text',
      label: 'FRAS ID Number',
      admin: {
        position: 'sidebar',
        description: 'Sitecore FRAS ID for migration reference',
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
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
      label: 'Related Documents',
    },
    {
      name: 'contacts',
      type: 'relationship',
      relationTo: 'contacts',
      hasMany: true,
      label: 'Staff Contacts',
    },
  ],
}
