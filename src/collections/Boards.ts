/**
 * Boards collection — RAS Canada's organizational structure: AcSB, PSAB,
 * AASB, CSSB, RASOC. Translation-only chrome via `withTranslationOnly`.
 *
 * @notes
 * - RASOC is an oversight council, not a standards board (see CLAUDE.md
 *   "RASOC Rules")
 * - Abbreviation stores short codes ("AcSB", "CSSB"); slug drives URL
 */
import type { CollectionConfig } from 'payload'

import { withTranslationOnly } from './_lib/with-translation-only'

export const Boards: CollectionConfig = withTranslationOnly({
  slug: 'boards',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'abbreviation', 'slug'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true, label: 'Board Name' },
    {
      name: 'abbreviation',
      type: 'text',
      required: true,
      label: 'Abbreviation',
      admin: { description: 'Short code (e.g., "AcSB", "CSSB", "RASOC")' },
    },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      required: true,
      unique: true,
      label: 'Slug',
      admin: { position: 'sidebar' },
    },
    { name: 'description', type: 'textarea', localized: true, label: 'Description' },
    {
      name: 'tabs',
      type: 'array',
      label: 'Tabs',
      admin: { description: 'Content tabs displayed on the board detail page' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, label: 'Tab Label' },
        { name: 'slug', type: 'text', required: true, label: 'Tab Slug' },
        { name: 'content', type: 'richText', localized: true, label: 'Tab Content' },
      ],
    },
    {
      name: 'quick_actions',
      type: 'array',
      label: 'Quick Actions',
      admin: { description: 'Sidebar action links on the board detail page' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, label: 'Label' },
        { name: 'url', type: 'text', required: true, label: 'URL' },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon',
          admin: { description: 'Icon identifier (e.g., Heroicon name)' },
        },
      ],
    },
    {
      name: 'resources',
      type: 'array',
      label: 'Resources',
      admin: { description: 'Downloadable resources shown on the board detail page' },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Title' },
        { name: 'file_url', type: 'text', required: true, label: 'File URL' },
        {
          name: 'type',
          type: 'select',
          label: 'File Type',
          options: [
            { label: 'PDF', value: 'pdf' },
            { label: 'Word', value: 'word' },
            { label: 'Link', value: 'link' },
            { label: 'Video', value: 'video' },
          ],
        },
      ],
    },
  ],
})
