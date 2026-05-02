/**
 * @description
 * Form Submissions collection for storing contact form and comment submissions.
 * Admin-only collection — no public API endpoint.
 *
 * Key features:
 * - Auto-set submittedAt timestamp
 * - Status tracking (new → read → replied)
 * - Admin list with status filters for workflow management
 *
 * @dependencies
 * - None
 *
 * @notes
 * - This is admin-only — submissions are created via server-side API routes, not direct REST
 * - 3 member-only forms share the same submission structure
 * - Forms are email-forwarded; this collection stores a copy for admin tracking
 */
import type { CollectionConfig } from 'payload'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'status', 'submittedAt'],
  },
  access: {
    // Admin-only: no public read/create
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    {
      name: 'organization',
      type: 'text',
      label: 'Organization',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
    },
    {
      name: 'businessPhone',
      type: 'text',
      label: 'Business Phone',
    },
    {
      name: 'comments',
      type: 'textarea',
      required: true,
      label: 'Comments',
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      label: 'Submitted At',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Read', value: 'read' },
        { label: 'Replied', value: 'replied' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
