/**
 * @description
 * Stories for the Stack component — vertical flex layout with 4 gap sizes.
 * Demonstrates spacing scale from 8px (sm) to 32px (xl).
 *
 * @dependencies
 * - Stack: Component under test
 * - @storybook/react: Meta/StoryObj types
 */
import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from './Stack'

const meta = {
  title: 'UI/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    children: null,
    gap: 'md',
  },
  argTypes: {
    gap: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'fieldset'],
    },
  },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

/** Helper block for visualizing gaps */
const Block = ({ label }: { label: string }) => (
  <div className="bg-alt border border-gray-200 p-3 rounded-sm text-sm">{label}</div>
)

/** All 4 gap sizes shown side-by-side */
export const AllGaps: Story = {
  render: () => (
    <div className="flex gap-12">
      {(['sm', 'md', 'lg', 'xl'] as const).map((gap) => (
        <div key={gap}>
          <p className="text-sm font-semibold mb-2">gap=&quot;{gap}&quot;</p>
          <Stack gap={gap}>
            <Block label="Item 1" />
            <Block label="Item 2" />
            <Block label="Item 3" />
          </Stack>
        </div>
      ))}
    </div>
  ),
}

/** Small gap (8px) — tight groupings */
export const SmGap: Story = {
  render: () => (
    <Stack gap="sm">
      <Block label="Label" />
      <Block label="Input" />
      <Block label="Helper text" />
    </Stack>
  ),
}

/** Extra-large gap (32px) — major content divisions */
export const XlGap: Story = {
  render: () => (
    <Stack gap="xl">
      <Block label="Hero Section" />
      <Block label="Content Section" />
      <Block label="CTA Section" />
    </Stack>
  ),
}

/** Stack rendered as a section element */
export const AsSection: Story = {
  render: () => (
    <Stack as="section" gap="lg">
      <Block label="Section heading" />
      <Block label="Section content" />
      <Block label="Section footer" />
    </Stack>
  ),
}
