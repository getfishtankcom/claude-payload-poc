/**
 * Redirects collection.
 *
 * Editors maintain 301 / 302 redirect rules here. The Next.js middleware
 * loads them with a 5-minute in-memory TTL and rewrites incoming
 * pathnames before any route matching runs.
 */
import type { CollectionConfig } from 'payload'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'type', 'active'],
    group: 'Tools',
    description: 'Old → new URL redirects. Imported from the legacy site.',
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Old path, e.g. /en/old-page (no host).' },
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      admin: { description: 'New path or absolute URL.' },
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: '301',
      options: [
        { label: '301 (Permanent)', value: '301' },
        { label: '302 (Temporary)', value: '302' },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'note',
      type: 'text',
      admin: { description: 'Internal note for editors. Not user-visible.' },
    },
  ],
}
