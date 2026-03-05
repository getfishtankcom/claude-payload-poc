/**
 * @description
 * Documents for Comment collection (canonical name replacing "consultations" from Phase 1).
 * Tracks exposure drafts, consultation papers, and similar documents open for public comment.
 *
 * Key features:
 * - Group enum for document type classification
 * - Open/closed status for filtering active comment periods
 * - Comment period date range for countdown timer support
 * - URLs for document, comment submission, and comments PDF
 *
 * @dependencies
 * - Standards collection (relationship)
 * - Boards collection (relationship)
 *
 * @notes
 * - frasIdNumber is used in workflow email subjects (Sitecore migration reference)
 * - commentPeriodStart/End from Sitecore dump analysis
 * - This collection is for listing data; document-details has the full page content
 */
import type { CollectionConfig } from 'payload'

export const DocumentsForComment: CollectionConfig = {
  slug: 'documents-for-comment',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'group', 'status', 'board', 'publishedDate'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
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
      name: 'frasIdNumber',
      type: 'text',
      label: 'FRAS ID Number',
      admin: {
        position: 'sidebar',
        description: 'Sitecore FRAS ID — used in workflow email subjects',
      },
    },
    {
      name: 'group',
      type: 'select',
      required: true,
      label: 'Group',
      options: [
        { label: 'Exposure Draft', value: 'exposure-draft' },
        { label: 'Consultation Paper', value: 'consultation-paper' },
        { label: 'Re-exposure Draft', value: 're-exposure-draft' },
        { label: 'Discussion Paper', value: 'discussion-paper' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'documentUrl',
      type: 'text',
      label: 'Document URL',
      admin: {
        description: 'Link to the downloadable document',
      },
    },
    {
      name: 'commentSubmitUrl',
      type: 'text',
      label: 'Comment Submit URL',
      admin: {
        description: 'Link to the comment submission form/page',
      },
    },
    {
      name: 'commentsPdfUrl',
      type: 'text',
      label: 'Comments PDF URL',
      admin: {
        description: 'Link to the PDF of submitted comments (for closed documents)',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      label: 'Published Date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'commentPeriodStart',
      type: 'date',
      label: 'Comment Period Start',
      admin: {
        description: 'Start of the public comment window',
      },
    },
    {
      name: 'commentPeriodEnd',
      type: 'date',
      label: 'Comment Period End',
      admin: {
        description: 'End of comment period — used for countdown timer and open/closed status',
      },
    },
    {
      name: 'standard',
      type: 'relationship',
      relationTo: 'standards',
      label: 'Standard',
    },
    {
      name: 'board',
      type: 'relationship',
      relationTo: 'boards',
      required: true,
      label: 'Board',
    },
  ],
}
