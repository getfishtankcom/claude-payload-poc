/**
 * @description
 * Events collection for FRAS Canada meetings, webinars, and deadlines.
 * Uses canonical name "events" (NOT "meetings" from Phase 2 wireframes).
 *
 * Key features:
 * - Type enum distinguishes Webinar, Meeting, and Deadline events
 * - Separate publishedDate for when the event was posted vs the event date
 * - Optional registration URL for webinar signups
 *
 * @dependencies
 * - Boards collection (relationship)
 *
 * @notes
 * - Start Time display is webinar-only (conditional on frontend, not stored separately)
 * - publishedDate is for sort flexibility, distinct from the event date
 */
import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'type', 'board'],
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
        { label: 'Webinar', value: 'Webinar' },
        { label: 'Meeting', value: 'Meeting' },
        { label: 'Deadline', value: 'Deadline' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
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
