/**
 * @description
 * Document Details collection for full exposure draft/consultation paper detail pages.
 * Contains the rich content, comment questions, reply instructions, and support materials.
 *
 * Key features:
 * - Highlights rich text for key points summary
 * - Comment questions array with numbered questions
 * - howToReply group with contact info and CTA
 * - Support materials array for downloadable files
 *
 * @dependencies
 * - Standards collection (relationship)
 * - Boards collection (relationship)
 * - Contacts collection (relationship, hasMany for staff contacts)
 *
 * @notes
 * - This is the full page content; documents-for-comment has the listing data
 * - Comment questions are numbered and displayed as an ordered list
 * - howToReply group contains all the "How to Reply" sidebar/section content
 */
import type { CollectionConfig } from 'payload'

export const DocumentDetails: CollectionConfig = {
  slug: 'document-details',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'board', 'replyDeadline'],
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
      name: 'highlights',
      type: 'richText',
      label: 'Highlights',
      admin: {
        description: 'Key points summary displayed at the top of the detail page',
      },
    },
    {
      name: 'bodyContent',
      type: 'richText',
      label: 'Body Content',
      admin: {
        description: 'Main body content of the document detail page',
      },
    },
    {
      name: 'commentQuestions',
      type: 'array',
      label: 'Comment Questions',
      admin: {
        description: 'Numbered questions for public comment',
      },
      fields: [
        {
          name: 'questionNumber',
          type: 'number',
          required: true,
          label: 'Question Number',
        },
        {
          name: 'questionText',
          type: 'richText',
          required: true,
          label: 'Question Text',
        },
      ],
    },
    {
      name: 'replyDeadline',
      type: 'date',
      label: 'Reply Deadline',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'howToReply',
      type: 'group',
      label: 'How to Reply',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          defaultValue: 'How to Reply',
        },
        {
          name: 'body',
          type: 'richText',
          label: 'Body',
        },
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'CTA Button Label',
        },
        {
          name: 'ctaHref',
          type: 'text',
          label: 'CTA Button URL',
        },
        {
          name: 'contactName',
          type: 'text',
          label: 'Contact Name',
        },
        {
          name: 'contactTitle',
          type: 'text',
          label: 'Contact Title',
        },
        {
          name: 'contactAddress',
          type: 'richText',
          label: 'Contact Address',
        },
        {
          name: 'contactEmail',
          type: 'email',
          label: 'Contact Email',
        },
      ],
    },
    {
      name: 'supportMaterials',
      type: 'array',
      label: 'Support Materials',
      admin: {
        description: 'Downloadable supporting documents and resources',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
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
}
