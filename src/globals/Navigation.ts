/**
 * @description
 * Navigation global for RAS Canada site-wide navigation configuration.
 * Manages utility bar links, primary nav, and mega-menu structure.
 *
 * Key features:
 * - Utility links (About Us, Boards, Contact, etc.) with dropdown indicators
 * - Primary nav links (Active Projects, Open Consultations, News)
 * - Mega-menu with multi-column layouts for dropdown content
 *
 * @notes
 * - Navigation data is fetched server-side and passed to SiteHeader component
 * - Mega-menu columns support nested link arrays for rich dropdown menus
 */
import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'Site Settings',
  },
  fields: [
    {
      name: 'utility_links',
      type: 'array',
      label: 'Utility Bar Links',
      admin: {
        description: 'Top-row utility links (About Us, Boards, Contact, etc.)',
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
        {
          name: 'has_dropdown',
          type: 'checkbox',
          label: 'Has Dropdown',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'primary_nav',
      type: 'array',
      label: 'Primary Navigation',
      admin: {
        description: 'Main navigation links below the logo bar',
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
        {
          name: 'has_dropdown',
          type: 'checkbox',
          label: 'Has Dropdown',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'mega_menu',
      type: 'array',
      label: 'Mega Menu',
      admin: {
        description: 'Dropdown mega-menu configurations for nav items with dropdowns',
      },
      fields: [
        {
          name: 'trigger_label',
          type: 'text',
          required: true,
          label: 'Trigger Label',
          localized: true,
          admin: {
            description: 'Must match a utility_links or primary_nav label with has_dropdown=true',
          },
        },
        {
          name: 'columns',
          type: 'array',
          label: 'Columns',
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
      ],
    },
  ],
}
