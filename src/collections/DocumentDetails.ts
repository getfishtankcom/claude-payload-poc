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
 * - Workflow: 5-state with workflowState, workflowHistory, publishOn/unpublishOn
 * - RBAC: role-based access control (author/editor/admin)
 *
 * @dependencies
 * - Standards collection (relationship)
 * - Boards collection (relationship)
 * - Contacts collection (relationship, hasMany for staff contacts)
 * - workflow fields from @/fields/workflow
 * - access/roles for RBAC
 * - admin/hooks/workflow-hooks for transition validation
 *
 * @notes
 * - This is the full page content; documents-for-comment has the listing data
 * - Comment questions are numbered and displayed as an ordered list
 * - howToReply group contains all the "How to Reply" sidebar/section content
 * - Epic 22: workflow, RBAC added
 */
import type { CollectionConfig } from 'payload'

import { workflowFields } from '@/fields/workflow'
import { contentRead, contentCreate, contentUpdate, contentDelete } from '@/access/roles'
import { validateWorkflowTransition, createLogWorkflowTransition } from '@/admin/hooks/workflow-hooks'

export const DocumentDetails: CollectionConfig = {
  slug: 'document-details',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'workflowState', 'board', 'replyDeadline'],
    components: {
      edit: {
        beforeDocumentControls: [
          '/admin/components/WorkflowActionBarField',
          '/admin/components/TranslateButton',
        ],
      },
    },
  },
  access: {
    read: contentRead,
    create: contentCreate,
    update: contentUpdate,
    delete: contentDelete,
  },
  hooks: {
    beforeChange: [validateWorkflowTransition],
    afterChange: [createLogWorkflowTransition('document-details')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Title',
    },
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
      admin: {
        description: 'Key points summary displayed at the top of the detail page',
      },
    },
    {
      name: 'bodyContent',
      type: 'richText',
      localized: true,
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
          localized: true,
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
          localized: true,
          label: 'Heading',
          defaultValue: 'How to Reply',
        },
        {
          name: 'body',
          type: 'richText',
          localized: true,
          label: 'Body',
        },
        {
          name: 'ctaLabel',
          type: 'text',
          localized: true,
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
          localized: true,
          label: 'Contact Name',
        },
        {
          name: 'contactTitle',
          type: 'text',
          localized: true,
          label: 'Contact Title',
        },
        {
          name: 'contactAddress',
          type: 'richText',
          localized: true,
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
          localized: true,
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
    // --- Workflow fields (Epic 22) ---
    ...workflowFields,
  ],
}
