/**
 * @description
 * Browse by Standard block schema — displays categorized standard links.
 * Replaces the hardcoded BrowseByStandard homepage component with CMS data.
 *
 * Key features:
 * - Heading text field
 * - Categories array with category name + links sub-array
 * - Each link has label + URL
 *
 * @dependencies
 * - None (schema only)
 *
 * @notes
 * - Categories map to the 4 standard groups: Sustainability, Accounting, Public Sector, Assurance
 * - Links can point to standards pages or board pages
 * - interfaceName: BrowseByStandardBlock for generated TypeScript types
 * - This block replaces the hardcoded BrowseByStandard component from Epic 4
 */
import type { Block } from 'payload'

export const BrowseByStandardBlock: Block = {
  slug: 'browseByStandard',
  interfaceName: 'BrowseByStandardBlock',
  labels: {
    singular: 'Browse by Standard',
    plural: 'Browse by Standard Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      label: 'Heading',
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Standard Categories',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
          required: true,
          label: 'Category Name',
        },
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              required: true,
              label: 'Label',
            },
            {
              name: 'url',
              type: 'text',
              localized: true,
              required: true,
              label: 'URL',
            },
          ],
        },
      ],
    },
  ],
}
