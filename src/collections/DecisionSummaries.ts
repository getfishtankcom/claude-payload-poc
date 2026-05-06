/**
 * Decision Summaries collection — outcomes of board meetings, distinct from
 * the meeting events themselves. Translation-only chrome via
 * `withTranslationOnly`.
 */
import type { CollectionConfig } from 'payload'

import { withTranslationOnly } from './_lib/with-translation-only'

export const DecisionSummaries: CollectionConfig = withTranslationOnly(
  {
    slug: 'decision-summaries',
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'date', 'board'],
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
        admin: { position: 'sidebar' },
      },
      { name: 'date', type: 'date', required: true, label: 'Decision Date' },
      { name: 'body', type: 'richText', localized: true, label: 'Decision Summary' },
      {
        name: 'board',
        type: 'relationship',
        relationTo: 'boards',
        required: true,
        label: 'Board',
      },
    ],
  },
  { boardFiltered: true },
)
