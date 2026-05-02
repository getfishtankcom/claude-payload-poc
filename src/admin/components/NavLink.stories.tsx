/**
 * @description
 * Storybook stories for the NavLink admin sidebar component.
 * Shows navigation links with icons and optional badge counts.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { NavLink } from './NavLink'

const meta = {
  title: 'Admin/NavLink',
  component: NavLink,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light' },
  },
} satisfies Meta<typeof NavLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: '/admin',
    label: 'Dashboard',
    icon: 'home',
  },
}

export const WithBadge: Story = {
  args: {
    href: '/admin/workbox',
    label: 'Workbox',
    icon: 'inbox',
    badge: 5,
  },
}

export const HighBadge: Story = {
  args: {
    href: '/admin/workbox',
    label: 'Workbox',
    icon: 'inbox',
    badge: 150,
  },
}

export const NoIcon: Story = {
  args: {
    href: '/admin/settings',
    label: 'Settings',
  },
}

export const AllIcons: Story = {
  args: { href: '#', label: 'All Icons' },
  render: () => (
    <div style={{ width: '240px', display: 'flex', flexDirection: 'column' }}>
      <NavLink href="#" label="Home" icon="home" />
      <NavLink href="#" label="Content Tree" icon="folder" />
      <NavLink href="#" label="Workbox" icon="inbox" badge={3} />
      <NavLink href="#" label="Boards" icon="grid" />
      <NavLink href="#" label="Projects" icon="briefcase" />
      <NavLink href="#" label="Consultations" icon="clipboard" />
      <NavLink href="#" label="News" icon="newspaper" />
      <NavLink href="#" label="Events" icon="calendar" />
      <NavLink href="#" label="Documents" icon="file" />
      <NavLink href="#" label="Contacts" icon="users" />
      <NavLink href="#" label="Members" icon="user" />
      <NavLink href="#" label="Media Library" icon="image" />
      <NavLink href="#" label="Search" icon="search" />
      <NavLink href="#" label="Users" icon="shield" />
      <NavLink href="#" label="Settings" icon="settings" />
    </div>
  ),
}

export const Mobile: Story = {
  args: {
    href: '/admin',
    label: 'Dashboard',
    icon: 'home',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
