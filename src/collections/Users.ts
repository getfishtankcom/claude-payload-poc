/**
 * @description
 * Users collection for Payload CMS authentication.
 * Supports email/password login with 3 role levels:
 * - admin: Full access to all collections and admin panel settings
 * - editor: Can create, edit, and publish content
 * - author: Can create and edit drafts, cannot publish
 *
 * @notes
 * - This is the auth collection referenced in payload.config.ts
 * - Role-based access control will be refined in Epic 17 (Auth)
 * - Aptify integration for member auth is separate from CMS users
 */
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'author',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
      ],
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
  ],
}
