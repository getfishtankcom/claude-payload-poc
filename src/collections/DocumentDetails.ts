/**
 * Document Details collection — full page content for exposure drafts and
 * consultation papers (highlights, body, comment questions, how-to-reply,
 * support materials). Listing data lives in `documents-for-comment`.
 *
 * Workflow chrome via `withWorkflow`.
 */
import type { CollectionConfig } from 'payload'

import { withWorkflow } from './_lib/with-workflow'

export const DocumentDetails: CollectionConfig = withWorkflow({
  slug: 'document-details',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'workflowState', 'board', 'replyDeadline'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: 'Title' },
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
    {
      name: 'highlights',
      type: 'richText',
      localized: true,
      label: 'Highlights',
      admin: { description: 'Key points summary displayed at the top of the detail page' },
    },
    {
      name: 'bodyContent',
      type: 'richText',
      localized: true,
      label: 'Body Content',
      admin: { description: 'Main body content of the document detail page' },
    },
    {
      name: 'commentQuestions',
      type: 'array',
      label: 'Comment Questions',
      admin: { description: 'Numbered questions for public comment' },
      fields: [
        { name: 'questionNumber', type: 'number', required: true, label: 'Question Number' },
        {
          name: 'questionText',
          type: 'richText',
          required: true,
          localized: true,
          label: 'Question Text',
        },
      ],
    },
    {
      name: 'replyDeadline',
      type: 'date',
      label: 'Reply Deadline',
      admin: { position: 'sidebar' },
    },
    {
      name: 'howToReply',
      type: 'group',
      label: 'How to Reply',
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
          label: 'Heading',
          defaultValue: 'How to Reply',
        },
        { name: 'body', type: 'richText', localized: true, label: 'Body' },
        { name: 'ctaLabel', type: 'text', localized: true, label: 'CTA Button Label' },
        { name: 'ctaHref', type: 'text', label: 'CTA Button URL' },
        { name: 'contactName', type: 'text', localized: true, label: 'Contact Name' },
        { name: 'contactTitle', type: 'text', localized: true, label: 'Contact Title' },
        { name: 'contactAddress', type: 'richText', localized: true, label: 'Contact Address' },
        { name: 'contactEmail', type: 'email', label: 'Contact Email' },
      ],
    },
    {
      name: 'supportMaterials',
      type: 'array',
      label: 'Support Materials',
      admin: { description: 'Downloadable supporting documents and resources' },
      fields: [
        { name: 'label', type: 'text', required: true, localized: true, label: 'Label' },
        { name: 'url', type: 'text', required: true, label: 'URL' },
        {
          name: 'fileType',
          type: 'select',
          label: 'File Type',
          options: [
            { label: 'PDF', value: 'pdf' },
            { label: 'Word', value: 'word' },
            { label: 'Excel', value: 'excel' },
            { label: 'Link', value: 'link' },
          ],
        },
      ],
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
    {
      name: 'staffContacts',
      type: 'relationship',
      relationTo: 'contacts',
      hasMany: true,
      label: 'Staff Contacts',
    },
  ],
})
