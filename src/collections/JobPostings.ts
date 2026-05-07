/**
 * Job Postings collection — career opportunities with draft/published/closed
 * lifecycle and external application URLs. Workflow chrome via `withWorkflow`.
 *
 * @notes
 * - `translatable: false` — translation handled out of band per existing
 *   admin convention
 */
import type { CollectionConfig } from 'payload'

import { withWorkflow } from './_lib/with-workflow'

export const JobPostings: CollectionConfig = withWorkflow(
  {
    slug: 'job-postings',
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'department', 'workflowState', 'status', 'closingDate'],
    },
    fields: [
      { name: 'title', type: 'text', required: true, localized: true, label: 'Job Title' },
      { name: 'department', type: 'text', localized: true, label: 'Department' },
      { name: 'location', type: 'text', localized: true, label: 'Location' },
      { name: 'description', type: 'richText', localized: true, label: 'Full Description' },
      {
        name: 'summary',
        type: 'textarea',
        localized: true,
        label: 'Summary',
        admin: { description: 'Brief summary for listing cards' },
      },
      { name: 'postedDate', type: 'date', label: 'Posted Date', admin: { position: 'sidebar' } },
      { name: 'closingDate', type: 'date', label: 'Closing Date', admin: { position: 'sidebar' } },
      {
        name: 'externalUrl',
        type: 'text',
        label: 'External Application URL',
        admin: { description: 'Link to external job application portal' },
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
        admin: { position: 'sidebar' },
      },
    ],
  },
  { translatable: false },
)
