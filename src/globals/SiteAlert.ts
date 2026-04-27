/**
 * Site Alert global — controls the dismissable banner at the top of every page.
 *
 * Editors flip `show` on, fill in `message` and optional `link`, pick a severity,
 * and the SiteAlert component renders a full-width banner until dismissed
 * (per-user via localStorage).
 */
import type { GlobalConfig } from 'payload'

export const SiteAlert: GlobalConfig = {
  slug: 'site-alert',
  label: 'Site Alert',
  admin: {
    group: 'Site Settings',
    description: 'Site-wide alert banner shown above the header.',
  },
  fields: [
    {
      name: 'show',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show alert bar',
    },
    {
      name: 'message',
      type: 'text',
      required: true,
      label: 'Alert message text',
      localized: true,
    },
    {
      name: 'link',
      type: 'group',
      fields: [
        { name: 'url', type: 'text' },
        { name: 'label', type: 'text', defaultValue: 'Learn more', localized: true },
      ],
    },
    {
      name: 'severity',
      type: 'select',
      defaultValue: 'info',
      label: 'Severity',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
  ],
}
