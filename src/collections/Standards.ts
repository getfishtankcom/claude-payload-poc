/**
 * @description
 * Standards collection for RAS Canada's accounting/reporting standards.
 * Represents the 11 standards sections organized by category.
 * Each standard belongs to a board and may have sub-parts (for Accounting standards).
 *
 * Key features:
 * - Category enum for grouping (Sustainability, Accounting, Public Sector, Assurance)
 * - Parts array for multi-part standards (e.g., "Part I - IFRS Accounting Standards")
 * - Relationship to boards collection
 *
 * @dependencies
 * - Boards collection (relationship)
 *
 * @notes
 * - 11 standards sections total (not 12)
 * - Parts are primarily used by Accounting category standards
 */
import type { CollectionConfig } from 'payload'
import { translationStatusField } from '@/fields/workflow'

export const Standards: CollectionConfig = {
  slug: 'standards',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'board'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Standard Name',
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
      admin: {
        description: 'Sub-parts for multi-part standards (e.g., Accounting standards)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: 'Part Label',
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          label: 'Part Slug',
        },
      ],
    },
    {
      name: 'board',
      type: 'relationship',
      relationTo: 'boards',
      required: true,
      label: 'Board',
    },
    translationStatusField,
  ],
}
