/**
 * @description
 * Storybook stories for the WorkflowActionBar admin component.
 * Shows context-sensitive workflow transition buttons per state and role.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { WorkflowActionBar } from './WorkflowActionBar'
import { PayloadMockProvider } from '../../../.storybook/mocks/payloadcms-ui'
import { mockWorkflowHistory } from '@/__mocks__/cms-data'

const meta = {
  title: 'Admin/WorkflowActionBar',
  component: WorkflowActionBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '1', role: 'admin', email: 'admin@frascanada.ca', firstName: 'Admin' } }}>
        <Story />
      </PayloadMockProvider>
    ),
  ],
} satisfies Meta<typeof WorkflowActionBar>

export default meta
type Story = StoryObj<typeof meta>

export const DraftState: Story = {
  args: {
    docId: '123',
    collectionSlug: 'pages',
    workflowState: 'draft',
    workflowHistory: [],
  },
}

export const InReviewAsEditor: Story = {
  args: {
    docId: '123',
    collectionSlug: 'pages',
    workflowState: 'in_review',
    workflowHistory: mockWorkflowHistory().slice(0, 1),
  },
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '2', role: 'editor', email: 'editor@frascanada.ca', firstName: 'Sarah' } }}>
        <Story />
      </PayloadMockProvider>
    ),
  ],
}

export const InReviewAsAuthor: Story = {
  args: {
    docId: '123',
    collectionSlug: 'pages',
    workflowState: 'in_review',
    workflowHistory: mockWorkflowHistory().slice(0, 1),
  },
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '3', role: 'author', email: 'author@frascanada.ca', firstName: 'James' } }}>
        <Story />
      </PayloadMockProvider>
    ),
  ],
}

export const NeedsRevisionWithRejectionBanner: Story = {
  args: {
    docId: '123',
    collectionSlug: 'pages',
    workflowState: 'needs_revision',
    workflowHistory: mockWorkflowHistory(),
  },
}

export const ApprovedState: Story = {
  args: {
    docId: '123',
    collectionSlug: 'pages',
    workflowState: 'approved',
    workflowHistory: [],
  },
}

export const PublishedState: Story = {
  args: {
    docId: '123',
    collectionSlug: 'pages',
    workflowState: 'published',
    workflowHistory: [],
  },
}

export const UnpublishedState: Story = {
  args: {
    docId: '123',
    collectionSlug: 'pages',
    workflowState: 'unpublished',
    workflowHistory: [],
  },
}

export const Mobile: Story = {
  args: {
    docId: '123',
    collectionSlug: 'pages',
    workflowState: 'in_review',
    workflowHistory: mockWorkflowHistory().slice(0, 1),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
