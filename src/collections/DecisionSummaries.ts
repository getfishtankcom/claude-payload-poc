/**
 * @description
 * Decision Summaries collection for RAS Canada board meeting decisions.
 * Each summary captures key decisions from a board meeting with rich text body.
 *
 * Key features:
 * - Date-stamped decision records
 * - Rich text body for detailed decision content
 * - Required board relationship
 *
 * @dependencies
 * - Boards collection (relationship)
 *
 * @notes
 * - Decision summaries are distinct from meeting events — they capture outcomes, not scheduling
 */
import type { CollectionConfig } from 'payload'

export const DecisionSummaries: CollectionConfig = {
  slug: 'decision-summaries',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'board'],
    components: {
      beforeListTable: ['/admin/components/BoardFilterBar'],
    },
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
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Decision Date',
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: 'Decision Summary',
    },
    {
      name: 'board',
      type: 'relationship',
      relationTo: 'boards',
      required: true,
      label: 'Board',
    },
  ],
}
