/**
 * @description
 * News grid block schema — displays a configurable grid of news items.
 * Can auto-populate from the news collection or use manually selected items.
 *
 * Key features:
 * - Heading text field
 * - news_count number field (default 3)
 * - show_view_all boolean toggle
 * - populateBy select: 'collection' (auto) or 'selection' (manual)
 * - Manual selection: relationship to news collection
 *
 * @dependencies
 * - None (schema only — no Lexical editor needed)
 *
 * @notes
 * - When populateBy is 'collection', fetches latest N news items server-side
 * - When populateBy is 'selection', uses manually picked items
 * - The Component.tsx handles the data fetching pattern
 * - interfaceName: NewsGridBlock for generated TypeScript types
 */
import type { Block } from 'payload'

export const NewsGridBlock: Block = {
  slug: 'newsGrid',
  interfaceName: 'NewsGridBlock',
  labels: {
    singular: 'News Grid',
    plural: 'News Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      label: 'Heading',
    },
    {
      name: 'news_count',
      type: 'number',
      defaultValue: 3,
      label: 'Number of Items',
      admin: {
        description: 'How many news items to display (when auto-populating)',
        step: 1,
      },
      min: 1,
      max: 12,
    },
    {
      name: 'show_view_all',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show "View All" Link',
    },
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      label: 'Populate By',
      options: [
        { label: 'Latest from Collection', value: 'collection' },
        { label: 'Manual Selection', value: 'selection' },
      ],
    },
    {
      name: 'selectedNews',
      type: 'relationship',
      relationTo: 'news',
      hasMany: true,
      label: 'Selected News Items',
      admin: {
        condition: (_, siblingData) => siblingData?.populateBy === 'selection',
        description: 'Manually select which news items to display',
      },
    },
  ],
}
