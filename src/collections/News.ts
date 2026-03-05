/**
 * @description
 * News collection for FRAS Canada news articles, announcements, and press releases.
 * Supports featured images via the media collection and board association.
 *
 * Key features:
 * - Category enum for content classification
 * - Featured image upload via media collection
 * - Rich text body content
 * - Board relationship for filtering by organization
 *
 * @dependencies
 * - Media collection (upload for featured_image)
 * - Boards collection (relationship)
 *
 * @notes
 * - News stories currently have NO images in Sitecore content (fields exist but unpopulated)
 * - frasIdNumber is the Sitecore FRAS ID for migration/workflow reference
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
        { label: 'News', value: 'News' },
        { label: 'Announcement', value: 'Announcement' },
        { label: 'Press Release', value: 'Press Release' },
        { label: 'Update', value: 'Update' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Body',
    },
    {
      name: 'featured_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
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
