/**
 * @description
 * Storybook stories for EffectiveDatesTable component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { EffectiveDatesTable } from './EffectiveDatesTable'

const meta = {
  title: 'Standards/EffectiveDatesTable',
  component: EffectiveDatesTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof EffectiveDatesTable>

export default meta
type Story = StoryObj<typeof meta>

const sampleSections = [
  {
    headerLabel: 'Effective for annual periods beginning on or after January 1, 2027',
    rows: [
      {
        application: '<em>Amendments to Section 3856, Financial Instruments</em><ul><li>New disclosure requirements for expected credit losses</li><li>Revised measurement guidance for financial guarantee contracts</li></ul>',
        pronouncement: 'Prospective',
      },
      {
        application: '<em>Amendments to Section 1591, Subsidiaries</em>',
        pronouncement: 'Retrospective',
      },
    ],
  },
  {
    headerLabel: 'Effective for annual periods beginning on or after January 1, 2026',
    rows: [
      {
        application: '<em>Amendments to IFRS 16, Leases</em><ul><li>Clarification of sale and leaseback transactions</li></ul>',
        pronouncement: 'Modified retrospective',
        footnoteRef: '1',
      },
      {
        application: '<em>IAS 12, Income Taxes</em><ul><li>International Tax Reform — Pillar Two Model Rules (Amendments to IAS 12)</li></ul>',
        pronouncement: 'Retrospective',
      },
    ],
  },
]

const sampleFootnotes = [
  {
    marker: '1',
    text: 'Modified retrospective means entities apply the amendment at the beginning of the annual reporting period in which they first apply the amendment.',
  },
]

export const Default: Story = {
  args: {
    introText: '<p><em>The effective dates of recently issued accounting standards, guidelines, and amendments are listed below. Note that the standards referenced below are included in the <a href="/handbook">CPA Canada Handbook</a> – Accounting on <a href="https://knotia.ca">Knotia.ca</a>.</em></p>',
    sections: sampleSections,
    footnotes: sampleFootnotes,
  },
}

export const WithoutIntro: Story = {
  args: {
    sections: sampleSections,
    footnotes: sampleFootnotes,
  },
}

export const NoFootnotes: Story = {
  args: {
    sections: sampleSections,
  },
}

export const Empty: Story = {
  args: {
    sections: [],
  },
}

export const Mobile: Story = {
  args: {
    introText: '<p><em>The effective dates of recently issued accounting standards are listed below.</em></p>',
    sections: sampleSections,
    footnotes: sampleFootnotes,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
