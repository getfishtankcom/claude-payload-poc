/**
 * @description
 * Search Config global for RAS Canada search page configuration.
 * Manages popular search tags and default filter settings.
 *
 * Key features:
 * - Popular tags displayed as quick-search chips on the search page
 * - Default filters as JSON for Meilisearch integration
 *
 * @notes
 * - Search integration with Meilisearch is built in Epic 5
 * - Popular tags map to pre-configured search queries
 */
import type { GlobalConfig } from 'payload'

export const SearchConfig: GlobalConfig = {
  slug: 'search-config',
  label: 'Search Config',
  admin: {
    group: 'Site Settings',
  },
  fields: [
    {
      name: 'popular_tags',
      type: 'array',
      label: 'Popular Tags',
      admin: {
        description: 'Quick-search tags displayed on the search results page',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Tag Label',
          localized: true,
        },
        {
          name: 'query',
          type: 'text',
          required: true,
          label: 'Search Query',
        },
      ],
    },
    {
      name: 'default_filters',
      type: 'json',
      label: 'Default Filters',
      admin: {
        description: 'Default Meilisearch filter configuration (JSON)',
      },
    },
  ],
}
