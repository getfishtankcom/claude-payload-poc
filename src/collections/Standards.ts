/**
 * Standards collection — the 11 standards sections grouped by category
 * (Sustainability, Accounting, Public Sector, Assurance). Translation-only
 * chrome via `withTranslationOnly`.
 *
 * @notes
 * - 11 standards sections total (not 12)
 * - Parts are primarily used by Accounting category standards
 */
import type { CollectionConfig } from 'payload'

import { withTranslationOnly } from './_lib/with-translation-only'

export const Standards: CollectionConfig = withTranslationOnly({
  slug: 'standards',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'board'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true, label: 'Standard Name' },
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
      name: 'category',
      type: 'select',
      required: true,
      label: 'Category',
      options: [
        { label: 'Sustainability', value: 'Sustainability' },
        { label: 'Accounting', value: 'Accounting' },
        { label: 'Public Sector', value: 'Public Sector' },
        { label: 'Assurance', value: 'Assurance' },
      ],
    },
    {
      name: 'parts',
      type: 'array',
      label: 'Parts',
      admin: { description: 'Sub-parts for multi-part standards (e.g., Accounting standards)' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, label: 'Part Label' },
        { name: 'slug', type: 'text', required: true, label: 'Part Slug' },
      ],
    },
    {
      name: 'board',
      type: 'relationship',
      relationTo: 'boards',
      required: true,
      label: 'Board',
    },
  ],
})
