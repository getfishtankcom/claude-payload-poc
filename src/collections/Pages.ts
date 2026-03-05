/**
 * @description
 * Pages collection for FRAS Canada content pages with page builder architecture.
 * Uses tabs: Hero tab + Content tab (blocks layout) + SEO tab.
 *
 * Key features:
 * - Hero group field (none/highImpact/lowImpact variants)
 * - Layout blocks field for page builder content
 * - Sidebar type selector (staff contact, section nav, or none)
 * - SEO meta group with title, description, and OG image
 * - publishedAt date field in sidebar
 *
 * @dependencies
 * - hero field from @/heros/config
 * - blocks array from @/blocks/index
 * - Media collection (upload for og_image and hero media)
 *
 * @notes
 * - Follows official Payload website template Pages pattern (tabs)
 * - Hero is a group field, NOT a block — lives above the blocks layout
 * - Blocks are registered via imported blocks array
 * - admin.initCollapsed on layout for compact admin UX
 */
import type { CollectionConfig } from 'payload'

import { hero } from '@/heros/config'
import { blocks } from '@/blocks'
import { syncToMeilisearch } from '@/search/meilisearch-sync'

const { afterChange, afterDelete } = syncToMeilisearch({ indexName: 'pages' })

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'sidebar_type', 'publishedAt'],
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
      label: 'Page Title',
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
      name: 'publishedAt',
      type: 'date',
      label: 'Published At',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'sidebar_type',
      type: 'select',
      label: 'Sidebar Type',
      defaultValue: 'none',
      options: [
        { label: 'Staff Contact', value: 'staff_contact' },
        { label: 'Section Navigation', value: 'section_nav' },
        { label: 'None', value: 'none' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        // Hero tab
        {
          label: 'Hero',
          fields: [hero],
        },
        // Content tab — page builder blocks
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks,
              label: 'Layout',
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
        // SEO tab
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'meta_title',
                  type: 'text',
                  label: 'Meta Title',
                },
                {
                  name: 'meta_description',
                  type: 'textarea',
                  label: 'Meta Description',
                },
                {
                  name: 'og_image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Open Graph Image',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
