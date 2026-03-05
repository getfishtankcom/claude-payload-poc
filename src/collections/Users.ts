/**
 * @description
 * Users collection for Payload CMS authentication.
 * Supports email/password login with 3 role levels:
 * - admin: Full access to all collections and admin panel settings
 * - editor: Can create, edit, approve, publish, and delete drafts
 * - author: Can create and edit own drafts, submit for review
 *
 * @dependencies
 * - access/roles: Role-based access control functions
 *
 * @notes
 * - This is the auth collection referenced in payload.config.ts
 * - Role field is required with default 'author'
 * - Only admins can create/delete users or change roles
 * - Users can update their own profile (name, email, password)
 */
import type { CollectionConfig } from 'payload'

import { usersCreate, usersRead, usersUpdate, usersDelete, adminOnlyField } from '@/access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role'],
  },
  access: {
    create: usersCreate,
    read: usersRead,
    update: usersUpdate,
    delete: usersDelete,
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
      access: {
        update: adminOnlyField,
      },
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
