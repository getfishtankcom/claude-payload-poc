/**
 * @description
 * Job Postings collection for FRAS Canada career opportunities.
 * Supports draft/published/closed lifecycle with external application URLs.
 *
 * Key features:
 * - Status enum for lifecycle management (draft → published → closed)
 * - Posted and closing dates for display
 * - External URL for application systems
 * - Rich text description for full job details
 *
 * @dependencies
 * - None
 *
 * @notes
 * - Job postings are typically few in number
 * - Template 17 displays these with an empty state fallback
 * - externalUrl links to external job application portals
 */
import type { CollectionConfig } from 'payload'

export const JobPostings: CollectionConfig = {
  slug: 'job-postings',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'status', 'closingDate'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Job Title',
    },
    {
      name: 'department',
      type: 'text',
      localized: true,
      label: 'Department',
    },
    {
      name: 'location',
      type: 'text',
      localized: true,
      label: 'Location',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      label: 'Full Description',
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      label: 'Summary',
      admin: {
        description: 'Brief summary for listing cards',
      },
    },
    {
      name: 'postedDate',
      type: 'date',
      label: 'Posted Date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'closingDate',
      type: 'date',
      label: 'Closing Date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'External Application URL',
      admin: {
        description: 'Link to external job application portal',
      },
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
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
