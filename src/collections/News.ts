/**
 * @description
 * News collection for FRAS Canada news articles, announcements, and press releases.
 * Supports featured images via the media collection and board association.
 *
 * Key features:
 * - Category enum for content classification (expanded for Phase 2)
 * - Featured image upload via media collection
 * - Rich text body content
 * - Board relationship for filtering by organization
 * - External URL for link-out news items
 * - Volunteer opportunity flag for volunteer listing pages
 *
 * @dependencies
 * - Media collection (upload for featured_image)
 * - Boards collection (relationship)
 *
 * @notes
 * - News stories currently have NO images in Sitecore content (fields exist but unpopulated)
 * - frasIdNumber is the Sitecore FRAS ID for migration/workflow reference
 * - Phase 2 additions: externalUrl, isVolunteerOpportunity, expanded category enum
 */
import type { CollectionConfig } from 'payload'

import { syncToMeilisearch } from '@/search/meilisearch-sync'

const { afterChange, afterDelete } = syncToMeilisearch({ indexName: 'news' })

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'category', 'board'],
  },
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
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
      admin: {
        description: 'Link to external content — displays with external link icon',
      },
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
}
