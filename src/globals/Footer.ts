/**
 * @description
 * Footer global for FRAS Canada site-wide footer configuration.
 * Manages footer columns, board links, quick links, and newsletter section.
 *
 * Key features:
 * - Multi-column link layout
 * - Board-specific links (all 5 boards including RASOC)
 * - Quick links section
 * - Newsletter heading and description for CTA
 *
 * @notes
 * - RASOC appears in footer board links despite not having a Board Detail page
 * - Newsletter submits to HubSpot (integration in Epic 10)
 */
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Site Settings',
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Footer Columns',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Column Heading',
          localized: true,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Label',
              localized: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'URL',
            },
          ],
        },
      ],
    },
    {
      name: 'boards_links',
      type: 'array',
      label: 'Board Links',
      admin: {
        description: 'Links to all 5 boards/councils (including RASOC)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
    {
      name: 'quick_links',
      type: 'array',
      label: 'Quick Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          localized: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
      ],
    },
    {
      name: 'newsletter_heading',
      type: 'text',
      label: 'Newsletter Heading',
      localized: true,
    },
    {
      name: 'newsletter_description',
      type: 'textarea',
      label: 'Newsletter Description',
      localized: true,
    },
  ],
}
