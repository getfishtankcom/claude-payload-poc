/**
 * @description
 * Stories for HeroSection — homepage hero with gradient, heading, subtitle, search bar.
 * Demonstrates default state, custom content, and mobile viewport.
 *
 * @dependencies
 * - HeroSection: Component under test
 * - @storybook/react: Meta/StoryObj types
 */
import type { Meta, StoryObj } from '@storybook/react'
import { HeroSection } from './HeroSection'

const meta = {
  title: 'Homepage/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeroSection>

export default meta
type Story = StoryObj<typeof meta>

/** Default hero with standard heading and subtitle */
export const Default: Story = {}

/** Custom content — demonstrates editable CMS fields */
export const CustomContent: Story = {
  args: {
    heading: 'Welcome to RAS Canada',
    subtitle: 'Regulatory and Accounting Standards for Canadian professionals.',
  },
}

/** Mobile viewport (390px) — verifies responsive stacking */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}

/** Long text edge case — tests layout with verbose content */
export const LongText: Story = {
  args: {
    heading: 'Canada\'s Official Hub for Financial Reporting Standards, Auditing Standards, Sustainability Standards, and Public Sector Accounting Standards',
    subtitle: 'FRAS provides comprehensive resources, guidance documents, exposure drafts, consultation papers, and educational materials to help professionals navigate the complex landscape of Canadian accounting, auditing, sustainability, and public sector standards. Join thousands of finance professionals who rely on FRAS Canada for authoritative standards information.',
  },
}
