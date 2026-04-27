/**
 * @description
 * Homepage global for RAS Canada homepage content configuration.
 * Uses tabs: Hero tab + Content tab (blocks layout).
 * Migrated from flat fields to hero group + blocks layout architecture.
 *
 * Key features:
 * - Hero group field (highImpact for gradient hero with search bar)
 * - Layout blocks field for page body content (CTA, news grid, browse by standard, etc.)
 * - Newsletter text remains as standalone field (lives in footer global, referenced here)
 *
 * @dependencies
 * - hero field from @/heros/config
 * - blocks array from @/blocks/index
 *
 * @notes
 * - This is a GLOBAL (singleton — only one homepage)
 * - Hero replaces old flat hero_heading + hero_subtitle fields
 * - CTA content migrated to CTABlock in layout
 * - Browse by Standard migrated to BrowseByStandardBlock in layout
 * - Hero search is project-only scope (per component architecture rules)
 */
import type { GlobalConfig } from 'payload'

import { hero } from '@/heros/config'
import { blocks } from '@/blocks'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: {
    group: 'Page Settings',
  },
  fields: [
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
      ],
    },
  ],
}
