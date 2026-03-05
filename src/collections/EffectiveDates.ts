/**
 * @description
 * Effective Dates collection for FRAS Canada's standards effective date tables.
 * Complex nested structure: sections → rows, plus footnotes.
 *
 * Key features:
 * - Relationship to standards collection for filtering
 * - Sections array with header labels and nested rows
 * - Rows contain rich text application field and pronouncement string
 * - Footnotes array with marker/text pairs for superscript references
 *
 * @dependencies
 * - Standards collection (relationship)
 *
 * @notes
 * - IFRS effective dates table has ~13 sections with many rows
 * - Purple header rows in the frontend use section headerLabel + headerDate
 * - Footnote markers (e.g., "1", "2", "*") appear as superscripts in application text
 */
import type { CollectionConfig } from 'payload'

export const EffectiveDates: CollectionConfig = {
  slug: 'effective-dates',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'standard'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Title',
      admin: {
        description: 'Display title (e.g., "IFRS Effective Dates")',
      },
    },
    {
      name: 'standard',
      type: 'relationship',
      relationTo: 'standards',
      required: true,
      label: 'Standard',
    },
    {
      name: 'introText',
      type: 'richText',
      localized: true,
      label: 'Introductory Text',
      admin: {
        description: 'Text displayed above the effective dates table (may contain links)',
      },
    },
    {
      name: 'sections',
      type: 'array',
      required: true,
      label: 'Sections',
      admin: {
        description: 'Purple-header grouped sections of the effective dates table',
      },
      fields: [
        {
          name: 'headerLabel',
          type: 'text',
          required: true,
          localized: true,
          label: 'Header Label',
          admin: {
            description: 'Section heading (e.g., "New Standards")',
          },
        },
        {
          name: 'headerDate',
          type: 'date',
          label: 'Header Date',
          admin: {
            description: 'Optional date displayed alongside section header',
          },
        },
        {
          name: 'sortOrder',
          type: 'number',
          label: 'Sort Order',
          defaultValue: 0,
        },
        {
          name: 'rows',
          type: 'array',
          required: true,
          label: 'Rows',
          fields: [
            {
              name: 'application',
              type: 'richText',
              required: true,
              localized: true,
              label: 'Application',
              admin: {
                description: 'Application text — may include italic standard names, bullet lists, footnote refs',
              },
            },
            {
              name: 'pronouncement',
              type: 'text',
              localized: true,
              label: 'Pronouncement',
            },
            {
              name: 'footnoteRef',
              type: 'text',
              label: 'Footnote Reference',
              admin: {
                description: 'Footnote marker(s) to display as superscript (e.g., "1", "2,3")',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'footnotes',
      type: 'array',
      label: 'Footnotes',
      fields: [
        {
          name: 'marker',
          type: 'text',
          required: true,
          label: 'Marker',
          admin: {
            description: 'Footnote symbol or number (e.g., "1", "*")',
          },
        },
        {
          name: 'text',
          type: 'richText',
          required: true,
          localized: true,
          label: 'Footnote Text',
        },
      ],
    },
  ],
}
