/**
 * @description
 * Contacts collection for FRAS Canada staff contact information.
 * Used in project detail sidebars and contact pages.
 *
 * Key features:
 * - Name includes credentials (e.g., "Andrew White, CPA, CA")
 * - Title field for job title (NOT "role" — per canonical naming)
 * - Photo upload via media collection
 * - Email field with email validation
 *
 * @dependencies
 * - Media collection (upload for photo)
 *
 * @notes
 * - Separate from board-members collection (Phase 2) which has term dates and role enum
 * - Use `title` not `role` for job title (CLAUDE.md canonical naming)
 */
import type { CollectionConfig } from 'payload'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'email'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
      admin: {
        description: 'Include credentials (e.g., "Andrew White, CPA, CA")',
      },
    },
    {
      name: 'credentials',
      type: 'text',
      label: 'Credentials',
      admin: {
        description: 'Professional credentials (e.g., "CPA, CA")',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Job Title',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Photo',
    },
  ],
}
