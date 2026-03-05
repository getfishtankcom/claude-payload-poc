/**
 * @description
 * Pages collection for generic FRAS Canada content pages.
 * Supports configurable sidebar types and SEO meta fields.
 *
 * Key features:
 * - Rich text content body
 * - Sidebar type selector (staff contact, section nav, or none)
 * - SEO meta group with title, description, and OG image
 *
 * @dependencies
 * - Media collection (upload for og_image)
 *
 * @notes
 * - This is the catch-all page type for content that doesn't fit specialized collections
 * - sidebar_type drives which sidebar component renders on the frontend
 */
import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'sidebar_type'],
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
      name: 'content',
      type: 'richText',
      label: 'Page Content',
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
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO Meta',
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
}
