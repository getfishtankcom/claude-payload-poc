/**
 * Notifications collection — workflow + system messages addressed to a user.
 *
 * Created by the workflow afterChange hook on transitions; surfaced via
 * the NotificationBell in the admin header.
 */
import type { CollectionConfig, FieldAccess } from 'payload'

/**
 * Field-level access guard — only admins may write the field. Recipients
 * still need broader update access on the `read` field, hence we apply
 * this only to the message/link/type/recipient fields.
 */
const adminOnlyField: FieldAccess = ({ req: { user } }) => {
  return (user as { role?: string } | null)?.role === 'admin'
}

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['recipient', 'type', 'message', 'read', 'createdAt'],
    group: 'System',
    description: 'In-app notifications for editors and authors.',
  },
  access: {
    // A user can only read / update their own notifications. Admins see all.
    read: ({ req: { user } }) => {
      if (!user) return false
      const role = (user as { role?: string }).role
      if (role === 'admin') return true
      return { recipient: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      const role = (user as { role?: string }).role
      if (role === 'admin') return true
      return { recipient: { equals: user.id } }
    },
    create: () => true,
    delete: ({ req: { user } }) => {
      const role = (user as { role?: string } | null)?.role
      return role === 'admin'
    },
  },
  fields: [
    {
      name: 'recipient',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: { update: adminOnlyField },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'system',
      options: [
        { label: 'Workflow Transition', value: 'workflow_transition' },
        { label: 'Lock Alert', value: 'lock_alert' },
        { label: 'System', value: 'system' },
        { label: 'Mention', value: 'mention' },
      ],
      access: { update: adminOnlyField },
    },
    {
      name: 'message',
      type: 'text',
      required: true,
      access: { update: adminOnlyField },
    },
    {
      name: 'link',
      type: 'text',
      access: { update: adminOnlyField },
    },
    // `read` intentionally has NO field-level update guard — recipients need
    // to be able to mark their own notifications as read.
    { name: 'read', type: 'checkbox', defaultValue: false, index: true },
  ],
}
