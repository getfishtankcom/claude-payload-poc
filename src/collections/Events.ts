/**
 * @description
 * Events collection for FRAS Canada meetings, webinars, deadlines, and decision summaries.
 * Uses canonical name "events" (NOT "meetings" from Phase 2 wireframes).
 *
 * Key features:
 * - Type enum: meeting, event, webinar, decision-summary
 * - Status enum: draft, published, archived
 * - Separate publishedDate for when the event was posted vs the event date
 * - Rich text content for full event/meeting details
 * - Excerpt for listing card display
 * - Query support: upcoming (date >= today, sort asc) and past (date < today, sort desc)
 *
 * @dependencies
 * - Boards collection (relationship)
 *
 * @notes
 * - Start Time display is webinar-only (conditional on frontend, not stored separately)
 * - publishedDate is for sort flexibility, distinct from the event date
 * - Phase 2 additions: expanded type enum (decision-summary), status field, content, excerpt
 */
import type { CollectionConfig } from 'payload'

import { syncToMeilisearch } from '@/search/meilisearch-sync'

const { afterChange, afterDelete } = syncToMeilisearch({ indexName: 'events' })

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'type', 'status', 'board'],
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
      label: 'Event Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
        description: 'URL-safe identifier — auto-generate from title',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Event Date',
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Published Date',
      admin: {
        description: 'When this event was posted — distinct from event date for sort flexibility',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Event Type',
      options: [
        { label: 'Meeting', value: 'meeting' },
        { label: 'Event', value: 'event' },
        { label: 'Webinar', value: 'webinar' },
        { label: 'Decision Summary', value: 'decision-summary' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
      admin: {
        description: 'Brief summary for listing cards',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      admin: {
        description: 'Full event/meeting details',
      },
    },
    {
      name: 'registration_url',
      type: 'text',
      label: 'Registration URL',
      admin: {
        description: 'External registration link (primarily for webinars)',
      },
    },
    {
      name: 'board',
      type: 'relationship',
      relationTo: 'boards',
      label: 'Board',
    },
  ],
}
