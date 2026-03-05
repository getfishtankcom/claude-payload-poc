/**
 * @description
 * Storybook stories for MegaMenu component.
 * Shows About Us (single column), Boards (multi-column),
 * Active Projects (single column) dropdown configurations.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { MegaMenu } from './MegaMenu'

const meta = {
  title: 'Layout/MegaMenu',
  component: MegaMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="min-h-[400px] pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MegaMenu>

export default meta
type Story = StoryObj<typeof meta>

export const AboutUs: Story = {
  args: {
    trigger: 'About Us',
    variant: 'single-column',
    items: [
      { label: 'About FRAS Canada', href: '/about' },
      { label: 'Oversight Council', href: '/about/oversight-council' },
      { label: 'Research Program', href: '/about/research' },
      { label: 'Jobs', href: '/about/jobs' },
    ],
  },
}

export const Boards: Story = {
  args: {
    trigger: 'Boards',
    variant: 'multi-column',
    items: [
      {
        label: 'CSSB',
        href: '/boards/cssb',
        children: [
          { label: 'Overview', href: '/boards/cssb' },
          { label: 'Consultations', href: '/boards/cssb/consultations' },
          { label: 'Projects & Initiatives', href: '/boards/cssb/projects' },
          { label: 'Resources', href: '/boards/cssb/resources' },
          { label: 'Meetings & Decisions', href: '/boards/cssb/meetings' },
          { label: 'Committees', href: '/boards/cssb/committees' },
          { label: 'Volunteer', href: '/boards/cssb/volunteer' },
        ],
      },
      {
        label: 'AcSB',
        href: '/boards/acsb',
        children: [
          { label: 'Overview', href: '/boards/acsb' },
          { label: 'Consultations', href: '/boards/acsb/consultations' },
          { label: 'Projects & Initiatives', href: '/boards/acsb/projects' },
          { label: 'Resources', href: '/boards/acsb/resources' },
          { label: 'Meetings & Decisions', href: '/boards/acsb/meetings' },
          { label: 'Committees', href: '/boards/acsb/committees' },
          { label: 'Volunteer', href: '/boards/acsb/volunteer' },
        ],
      },
      {
        label: 'PSAB',
        href: '/boards/psab',
        children: [
          { label: 'Overview', href: '/boards/psab' },
          { label: 'Consultations', href: '/boards/psab/consultations' },
          { label: 'Projects & Initiatives', href: '/boards/psab/projects' },
          { label: 'Resources', href: '/boards/psab/resources' },
          { label: 'Meetings & Decisions', href: '/boards/psab/meetings' },
          { label: 'Committees', href: '/boards/psab/committees' },
          { label: 'Volunteer', href: '/boards/psab/volunteer' },
        ],
      },
      {
        label: 'AASB',
        href: '/boards/aasb',
        children: [
          { label: 'Overview', href: '/boards/aasb' },
          { label: 'Consultations', href: '/boards/aasb/consultations' },
          { label: 'Projects & Initiatives', href: '/boards/aasb/projects' },
          { label: 'Resources', href: '/boards/aasb/resources' },
          { label: 'Meetings & Decisions', href: '/boards/aasb/meetings' },
          { label: 'Committees', href: '/boards/aasb/committees' },
          { label: 'Volunteer', href: '/boards/aasb/volunteer' },
        ],
      },
    ],
  },
}

export const ActiveProjects: Story = {
  args: {
    trigger: 'Active Projects',
    variant: 'single-column',
    items: [
      { label: 'Canadian Sustainability Standards Board', href: '/boards/cssb/projects' },
      { label: 'Accounting Standards Board', href: '/boards/acsb/projects' },
      { label: 'Public Sector Accounting Board', href: '/boards/psab/projects' },
      { label: 'Auditing and Assurance Standards Board', href: '/boards/aasb/projects' },
    ],
  },
}

export const Mobile: Story = {
  args: {
    trigger: 'About Us',
    variant: 'single-column',
    items: [
      { label: 'About FRAS Canada', href: '/about' },
      { label: 'Oversight Council', href: '/about/oversight-council' },
    ],
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
