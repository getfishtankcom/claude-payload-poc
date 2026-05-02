/**
 * @description
 * Storybook stories for ActiveProjectsTable component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { ActiveProjectsTable } from './ActiveProjectsTable'

const meta = {
  title: 'Standards/ActiveProjectsTable',
  component: ActiveProjectsTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ActiveProjectsTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    projects: [
      {
        name: 'IFRS 18 Presentation and Disclosure in Financial Statements',
        href: '/active-projects/acsb/ifrs-18',
        description: 'Replacing IAS 1 with a new standard on presentation and disclosure requirements for financial statements.',
      },
      {
        name: 'Amendments to IFRS 9 — Financial Instruments',
        href: '/active-projects/acsb/ifrs-9-amendments',
        description: 'Proposed amendments addressing classification and measurement of financial assets with ESG features.',
      },
      {
        name: 'Annual Improvements to IFRS Accounting Standards — Volume 12',
        href: '/active-projects/acsb/annual-improvements-12',
        description: 'Narrow-scope amendments and editorial corrections across multiple standards.',
      },
    ],
  },
}

export const SingleProject: Story = {
  args: {
    projects: [
      {
        name: 'Revenue Recognition for NFPOs',
        href: '/active-projects/acsb/revenue-nfpo',
        description: 'This project proposes amendments to the revenue recognition standard for not-for-profit organizations.',
      },
    ],
  },
}

export const Empty: Story = {
  args: {
    projects: [],
  },
}

export const Mobile: Story = {
  args: {
    projects: [
      {
        name: 'IFRS 18 Presentation and Disclosure in Financial Statements',
        href: '/active-projects/acsb/ifrs-18',
        description: 'Replacing IAS 1 with a new standard on presentation and disclosure requirements.',
      },
      {
        name: 'Amendments to IFRS 9',
        href: '/active-projects/acsb/ifrs-9-amendments',
        description: 'Proposed amendments addressing classification and measurement.',
      },
    ],
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
