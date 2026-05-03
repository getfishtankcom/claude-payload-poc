/**
 * Storybook stories for FrTranslationWarning.
 *
 * The icon reads the document's title + title_fr from useDocumentInfo.
 * Stories use PayloadMockProvider to feed different combinations.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { FrTranslationWarning } from './FrTranslationWarning'
import { PayloadMockProvider } from '../../../.storybook/mocks/payloadcms-ui'

const meta = {
  title: 'Admin/FrTranslationWarning',
  component: FrTranslationWarning,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FrTranslationWarning>

export default meta
type Story = StoryObj<typeof meta>

const wrap = (docInfo: Record<string, unknown>) => {
  return (Story: React.ComponentType) => (
    <PayloadMockProvider value={{ documentInfo: { id: '1', collectionSlug: 'pages', ...docInfo } }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Sample doc title</span>
        <Story />
      </div>
    </PayloadMockProvider>
  )
}

export const MissingFr: Story = {
  decorators: [wrap({ title: 'About Us', title_fr: undefined })],
}

export const FrEqualsEn: Story = {
  decorators: [wrap({ title: 'About Us', title_fr: 'About Us' })],
}

export const TranslatedFr: Story = {
  decorators: [wrap({ title: 'About Us', title_fr: 'À propos' })],
}
