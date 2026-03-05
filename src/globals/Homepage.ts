/**
 * @description
 * Homepage global for FRAS Canada homepage content configuration.
 * Manages hero section, CTA block, newsletter text, and browse-by-standard links.
 *
 * Key features:
 * - Hero heading and subtitle for the main banner
 * - CTA block with heading, body, button label/URL
 * - Newsletter promotional text
 * - Browse by Standard section with categorized link groups
 *
 * @notes
 * - Hero search is project-only (scoped, not sitewide)
 * - Browse by Standard maps to the 4 standard categories
 */
import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: {
    group: 'Page Settings',
  },
  fields: [
    {
      name: 'hero_heading',
      type: 'text',
      required: true,
      label: 'Hero Heading',
    },
    {
      name: 'hero_subtitle',
      type: 'textarea',
      label: 'Hero Subtitle',
    },
    {
      name: 'cta_heading',
      type: 'text',
      label: 'CTA Heading',
    },
    {
      name: 'cta_body',
      type: 'textarea',
      label: 'CTA Body',
    },
    {
      name: 'cta_button_label',
      type: 'text',
      label: 'CTA Button Label',
    },
    {
      name: 'cta_button_url',
      type: 'text',
      label: 'CTA Button URL',
    },
    {
      name: 'newsletter_text',
      type: 'textarea',
      label: 'Newsletter Text',
    },
    {
      name: 'browse_by_standard',
      type: 'array',
      label: 'Browse by Standard',
      admin: {
        description: 'Standard categories with sub-links for the homepage browse section',
      },
      fields: [
        {
          name: 'category',
          type: 'text',
          required: true,
          label: 'Category Name',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Standard Links',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Label',
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
}
