/**
 * Committees collection — board advisory committees with embedded member
 * lists and meeting-report uploads. Workflow chrome via `withWorkflow`.
 *
 * @notes
 * - AcSB has 13 committees, other boards have 3+ each
 * - Members array is embedded (not relationships) — committee members
 *   aren't board-members
 * - meetingReports populated from Sitecore dump (IDG Extracts, PSADG)
 */
import type { CollectionConfig } from 'payload'

import { withWorkflow } from './_lib/with-workflow'

export const Committees: CollectionConfig = withWorkflow(
  {
    slug: 'committees',
    admin: {
      useAsTitle: 'name',
      defaultColumns: ['name', 'board', 'workflowState', 'status', 'sortOrder'],
    },
    fields: [
      { name: 'name', type: 'text', required: true, localized: true, label: 'Committee Name' },
      {
        name: 'slug',
        type: 'text',
        localized: true,
        required: true,
        unique: true,
        label: 'Slug',
        admin: {
          position: 'sidebar',
          description: 'URL-safe identifier — auto-generate from name',
        },
      },
      { name: 'description', type: 'richText', localized: true, label: 'Description' },
      {
        name: 'sortOrder',
        type: 'number',
        label: 'Sort Order',
        defaultValue: 0,
        admin: { position: 'sidebar' },
      },
      {
        name: 'detailPageUrl',
        type: 'text',
        label: 'Detail Page URL',
        admin: { description: 'Optional link to a dedicated committee detail page' },
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        label: 'Status',
        defaultValue: 'active',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Archived', value: 'archived' },
        ],
      },
      {
        name: 'members',
        type: 'array',
        label: 'Members',
        admin: { description: 'Committee members (embedded, not linked to board-members)' },
        fields: [
          { name: 'name', type: 'text', required: true, localized: true, label: 'Name' },
          {
            name: 'role',
            type: 'text',
            localized: true,
            label: 'Role',
            admin: { description: 'Role within the committee (e.g., "Chair", "Member")' },
          },
          { name: 'organization', type: 'text', localized: true, label: 'Organization' },
        ],
      },
      {
        name: 'meetingReports',
        type: 'array',
        label: 'Meeting Reports',
        admin: { description: 'Downloadable committee meeting report PDFs' },
        fields: [
          { name: 'title', type: 'text', required: true, localized: true, label: 'Report Title' },
          { name: 'date', type: 'date', label: 'Report Date' },
          { name: 'file', type: 'upload', relationTo: 'media', label: 'PDF File' },
        ],
      },
      {
        name: 'board',
        type: 'relationship',
        relationTo: 'boards',
        required: true,
        label: 'Board',
      },
    ],
  },
  { boardFiltered: true },
)
