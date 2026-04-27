/**
 * Notifications collection — workflow + system messages addressed to a user.
 *
 * Created by the workflow afterChange hook on transitions; surfaced via
 * the NotificationBell in the admin header.
 */
import type { CollectionConfig } from 'payload'

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
    },
    { name: 'message', type: 'text', required: true },
    { name: 'link', type: 'text' },
    { name: 'read', type: 'checkbox', defaultValue: false, index: true },
  ],
}
