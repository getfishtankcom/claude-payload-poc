/**
 * Board Members collection — appointed members of each board/council with
 * photos, roles, terms, and bio-page links. Workflow chrome injected via
 * `withWorkflow`.
 *
 * @notes
 * - Separate from `contacts` (contacts = staff, board-members = appointed)
 * - `roleLabel` allows custom display text ("Ex-officio Member")
 * - `sortOrder` controls display order within role groups
 * - `translatable: false` — translation handled out of band per existing
 *   admin convention
 */
import type { CollectionConfig } from 'payload'

import { withWorkflow } from './_lib/with-workflow'

export const BoardMembers: CollectionConfig = withWorkflow(
  {
    slug: 'board-members',
    admin: {
      useAsTitle: 'name',
      defaultColumns: ['name', 'role', 'workflowState', 'board', 'termExpires'],
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        localized: true,
        label: 'Full Name',
      },
      {
        name: 'credentials',
        type: 'text',
        localized: true,
        label: 'Credentials',
        admin: { description: 'Professional designations (e.g., "CPA, CA, MBA")' },
      },
      {
        name: 'photo',
        type: 'upload',
        relationTo: 'media',
        label: 'Photo',
        admin: { description: 'Portrait photo — displayed at 205x205px on member cards' },
      },
      {
        name: 'role',
        type: 'select',
        required: true,
        label: 'Role',
        options: [
          { label: 'Chair', value: 'chair' },
          { label: 'Vice-Chair', value: 'vice-chair' },
          { label: 'Voting Member', value: 'voting-member' },
          { label: 'Non-Voting', value: 'non-voting' },
        ],
      },
      {
        name: 'roleLabel',
        type: 'text',
        localized: true,
        label: 'Role Label',
        admin: {
          description:
            'Custom display label (e.g., "Ex-officio Member"). Falls back to role enum if empty.',
        },
      },
      { name: 'appointedDate', type: 'date', label: 'Appointed Date' },
      { name: 'termExpires', type: 'date', label: 'Term Expires' },
      {
        name: 'bioPage',
        type: 'relationship',
        relationTo: 'pages',
        label: 'Bio Page',
        admin: { description: 'Link to the member bio content page' },
      },
      {
        name: 'sortOrder',
        type: 'number',
        label: 'Sort Order',
        defaultValue: 0,
        admin: {
          description: 'Controls display order within role groups (lower = first)',
          position: 'sidebar',
        },
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
  { boardFiltered: true, translatable: false },
)
