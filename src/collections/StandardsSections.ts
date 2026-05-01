/**
 * @description
 * Standards Sections collection for RAS Canada's standards overview pages.
 * Each section represents a tabbed standards landing page (IFRS, ASPE, etc.).
 *
 * Key features:
 * - Configurable tabs array (5-6 tabs per standard)
 * - Feature CTA blocks for promotional content
 * - Board logo upload for branding
 * - Relationships to boards and active projects
 *
 * @dependencies
 * - Boards collection (relationship)
 * - Projects collection (relationship, hasMany)
 * - Media collection (upload for boardLogo)
 *
 * @notes
 * - IFRS gets 6 tabs (includes IFRIC Agenda Decisions), others get 5
 * - featureCTAs support light and dark-purple variants
 * - This powers Template 5 (Standards Overview)
 */
import type { CollectionConfig } from 'payload'

export const StandardsSections: CollectionConfig = {
  slug: 'standards-sections',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'boardName', 'board'],
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
      localized: true,
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'boardLogo',
      type: 'upload',
      relationTo: 'media',
      label: 'Board Logo',
      admin: {
        description: 'Board crest/wordmark for the standards hero banner',
      },
    },
    {
      name: 'boardName',
      type: 'text',
      localized: true,
      label: 'Board Name',
      admin: {
        description: 'Full board name displayed below logo in hero banner',
      },
    },
    {
      name: 'tabs',
      type: 'array',
      required: true,
      label: 'Tabs',
      maxRows: 7,
      admin: {
        description: 'Section tabs for the standards overview page (5-6 per standard)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: 'Tab Label',
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          label: 'Tab URL',
        },
        {
          name: 'isActive',
          type: 'checkbox',
          label: 'Is Active',
          defaultValue: false,
          admin: {
            description: 'Whether this tab is currently active (set by frontend)',
          },
        },
      ],
    },
    {
      name: 'featureCTAs',
      type: 'array',
      label: 'Feature CTAs',
      maxRows: 4,
      admin: {
        description: 'Promotional CTA blocks displayed on the standards overview page',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          localized: true,
          label: 'Heading',
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          label: 'Description',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          localized: true,
          label: 'Button Label',
        },
        {
          name: 'buttonHref',
          type: 'text',
          label: 'Button URL',
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Variant',
          defaultValue: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark Purple', value: 'dark-purple' },
          ],
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
    {
      name: 'activeProjects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      label: 'Active Projects',
      admin: {
        description: 'Projects displayed in the Active Projects table on this page',
      },
    },
  ],
}
