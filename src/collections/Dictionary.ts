/**
 * Dictionary / glossary collection — bilingual term + definition pairs
 * surfaced via the GlossaryTooltip component on the public site.
 */
import type { CollectionConfig } from 'payload'

export const Dictionary: CollectionConfig = {
  slug: 'dictionary',
  admin: {
    useAsTitle: 'term',
    defaultColumns: ['term', 'category', 'status'],
    group: 'Content',
    description: 'EN/FR terms and definitions used in glossaries and tooltips.',
  },
  fields: [
    { name: 'term', type: 'text', required: true, index: true },
    { name: 'termFr', type: 'text' },
    { name: 'definition', type: 'richText' },
    { name: 'definitionFr', type: 'richText' },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'Accounting', value: 'accounting' },
        { label: 'Auditing', value: 'auditing' },
        { label: 'Sustainability', value: 'sustainability' },
        { label: 'General', value: 'general' },
      ],
    },
    {
      name: 'relatedTerms',
      type: 'relationship',
      relationTo: 'dictionary',
      hasMany: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}
