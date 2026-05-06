/**
 * News collection for RAS Canada news articles, announcements, and press
 * releases. Workflow chrome (workflow fields, RBAC, search sync, board
 * filter, translate button) comes from `withWorkflow` — see
 * `_lib/with-workflow.ts` for the seam.
 *
 * @notes
 * - News stories currently have NO images in Sitecore content (fields exist
 *   but unpopulated)
 * - frasIdNumber is the Sitecore FRAS ID for migration/workflow reference
 * - Phase 2 additions: externalUrl, isVolunteerOpportunity, expanded
 *   category enum
 */
import type { CollectionConfig } from 'payload'

import { withWorkflow } from './_lib/with-workflow'

export const News: CollectionConfig = withWorkflow(
  {
    slug: 'news',
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'date', 'category', 'workflowState', 'board'],
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
        admin: { position: 'sidebar' },
      },
      {
        name: 'date',
        type: 'date',
        required: true,
        label: 'Publish Date',
      },
      {
        name: 'category',
        type: 'select',
        label: 'Category',
        options: [
          { label: 'Document for Comment', value: 'Document for Comment' },
          { label: 'International Activity', value: 'International Activity' },
          { label: 'Meeting Summary', value: 'Meeting Summary' },
          { label: 'News', value: 'News' },
          { label: 'Resource', value: 'Resource' },
        ],
      },
      {
        name: 'excerpt',
        type: 'textarea',
        localized: true,
        label: 'Excerpt',
      },
      {
        name: 'body',
        type: 'richText',
        localized: true,
        label: 'Body',
      },
      {
        name: 'featured_image',
        type: 'upload',
        relationTo: 'media',
        label: 'Featured Image',
      },
      {
        name: 'externalUrl',
        type: 'text',
        label: 'External URL',
        admin: { description: 'Link to external content — displays with external link icon' },
      },
      {
        name: 'isVolunteerOpportunity',
        type: 'checkbox',
        label: 'Volunteer Opportunity',
        defaultValue: false,
        admin: {
          description: 'Flag this item for volunteer opportunity listings',
          position: 'sidebar',
        },
      },
      {
        name: 'frasIdNumber',
        type: 'text',
        label: 'FRAS ID Number',
        admin: {
          position: 'sidebar',
          description: 'Sitecore FRAS ID for migration/workflow reference',
        },
      },
      {
        name: 'board',
        type: 'relationship',
        relationTo: 'boards',
        label: 'Board',
      },
    ],
  },
  {
    searchable: true,
    boardFiltered: true,
    extraEditChrome: [
      '/admin/components/FrTranslationWarning',
      '/admin/components/VersionDiffButton',
    ],
  },
)
