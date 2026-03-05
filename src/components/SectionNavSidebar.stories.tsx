/**
 * @description
 * Storybook stories for SectionNavSidebar component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { SectionNavSidebar } from './SectionNavSidebar'

const meta = {
  title: 'Content/SectionNavSidebar',
  component: SectionNavSidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof SectionNavSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    sectionLabel: 'About',
    links: [
      { label: 'About', href: '/acsb/about', isActive: false },
      { label: 'Due Process', href: '/acsb/about/due-process', isActive: true },
      { label: 'International Activities', href: '/acsb/about/international', isActive: false },
      { label: 'IRCSS Recommendations', href: '/acsb/about/ircss', isActive: false },
    ],
  },
}

export const MembersActive: Story = {
  args: {
    sectionLabel: 'About',
    links: [
      { label: 'About', href: '/acsb/about', isActive: false },
      { label: 'Due Process', href: '/acsb/about/due-process', isActive: false },
      { label: 'International Activities', href: '/acsb/about/international', isActive: false },
      { label: 'Members', href: '/acsb/about/members', isActive: true },
      { label: 'IRCSS Recommendations', href: '/acsb/about/ircss', isActive: false },
    ],
  },
}

export const Mobile: Story = {
  args: {
    sectionLabel: 'About',
    links: [
      { label: 'About', href: '/acsb/about', isActive: false },
      { label: 'Due Process', href: '/acsb/about/due-process', isActive: true },
      { label: 'International Activities', href: '/acsb/about/international', isActive: false },
    ],
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const EmptyLinks: Story = {
  args: {
    sectionLabel: 'About',
    links: [],
  },
}
