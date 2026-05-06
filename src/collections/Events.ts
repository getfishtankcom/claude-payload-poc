/**
 * Events collection — meetings, webinars, deadlines, decision summaries.
 * Workflow + search-sync + board-filter chrome via `withWorkflow`.
 *
 * @notes
 * - Canonical name "events" (NOT "meetings" from Phase 2 wireframes)
 * - Start Time display is webinar-only (conditional on frontend)
 * - `publishedDate` is distinct from `date` for sort flexibility
 */
import type { CollectionConfig } from 'payload'

import { withWorkflow } from './_lib/with-workflow'

export const Events: CollectionConfig = withWorkflow(
  {
    slug: 'events',
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'date', 'type', 'workflowState', 'status', 'board'],
    },
    fields: [
      { name: 'title', type: 'text', required: true, localized: true, label: 'Event Title' },
      {
        name: 'slug',
        type: 'text',
        localized: true,
        required: true,
        unique: true,
        label: 'Slug',
        admin: {
          position: 'sidebar',
          description: 'URL-safe identifier — auto-generate from title',
        },
      },
      { name: 'date', type: 'date', required: true, label: 'Event Date' },
      {
        name: 'publishedDate',
        type: 'date',
        label: 'Published Date',
        admin: {
          description:
            'When this event was posted — distinct from event date for sort flexibility',
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
        admin: { position: 'sidebar' },
      },
      {
        name: 'excerpt',
        type: 'textarea',
        localized: true,
        label: 'Excerpt',
        admin: { description: 'Brief summary for listing cards' },
      },
      {
        name: 'content',
        type: 'richText',
        localized: true,
        label: 'Content',
        admin: { description: 'Full event/meeting details' },
      },
      {
        name: 'registration_url',
        type: 'text',
        label: 'Registration URL',
        admin: { description: 'External registration link (primarily for webinars)' },
      },
      { name: 'board', type: 'relationship', relationTo: 'boards', label: 'Board' },
    ],
  },
  { searchable: true, boardFiltered: true },
)
