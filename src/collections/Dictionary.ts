/**
 * Dictionary / glossary collection — bilingual term + definition pairs
 * surfaced via the GlossaryTooltip component on the public site.
 */
import type { CollectionConfig } from 'payload'

export const Dictionary: CollectionConfig = {
  slug: 'dictionary',
  // QA-023: the slug is singular ('dictionary') so the breadcrumb renders
  // "Dictionary", but Payload pluralises the slug for `labels.plural` and
  // shows "Dictionaries" in the H1. Declare both forms explicitly so the
  // list-view H1 + breadcrumb agree, and so the singular "Term" label
  // surfaces on the Add button + edit-view breadcrumb (each row is a
  // term/definition pair, not a whole dictionary).
  labels: {
    singular: 'Term',
    plural: 'Dictionary',
  },
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
