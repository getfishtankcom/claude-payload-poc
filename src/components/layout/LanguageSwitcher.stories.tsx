/**
 * @description
 * Storybook stories for the LanguageSwitcher component.
 * Shows compact (utility bar) and inline (mobile menu) variants.
 *
 * @notes
 * - Uses NextIntlClientProvider mock for locale context
 * - Stories show both EN→FR and FR→EN switching states
 */
import type { Meta, StoryObj } from '@storybook/react'
import { NextIntlClientProvider } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'

const meta = {
  title: 'Layout/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={{}}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
} satisfies Meta<typeof LanguageSwitcher>

export default meta
type Story = StoryObj<typeof meta>

/** Default compact variant as shown in utility bar */
export const Default: Story = {}

/** Compact variant with explicit props */
export const Compact: Story = {
  args: {
    variant: 'compact',
  },
}

/** Inline variant as shown in mobile menu */
export const Inline: Story = {
  args: {
    variant: 'inline',
  },
}

/** FR locale context — shows "English" as switch target */
export const FrenchLocale: Story = {
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="fr" messages={{}}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
}

/** Mobile viewport */
export const Mobile: Story = {
  args: {
    variant: 'inline',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
