/**
 * @description
 * Storybook stories for the tree gutter icons. Visualizes every workflow state
 * plus the lock and FR-missing glyphs so designers and reviewers can verify
 * that the workflow CSS tokens reach the SVG fills (the QA-003 regression).
 *
 * @notes
 * - Stories render against the global admin tokens via the .storybook preview
 *   imports, so colors should match what /admin/tree shows in the live shell.
 */

import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'

import { FrMissingGutterIcon, Gutter, LockGutterIcon, WorkflowGutterIcon } from './GutterIcons'
import type { WorkflowState } from './types'

const meta = {
  title: 'Admin/Tree/GutterIcons',
  component: Gutter,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Gutter>

export default meta
type Story = StoryObj<typeof meta>

const STATES: WorkflowState[] = ['draft', 'in-review', 'needs-revision', 'approved', 'published']

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
    <code style={{ width: 160, fontSize: 12, color: 'var(--text-muted)' }}>{label}</code>
    {children}
  </div>
)

export const AllWorkflowStates: Story = {
  render: () => (
    <div>
      {STATES.map((state) => (
        <Row key={state} label={state}>
          <WorkflowGutterIcon state={state} />
        </Row>
      ))}
    </div>
  ),
}

export const LockAndFrMissing: Story = {
  render: () => (
    <div>
      <Row label="Locked">
        <LockGutterIcon />
      </Row>
      <Row label="FR missing">
        <FrMissingGutterIcon />
      </Row>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <div>
      <Row label="published">
        <Gutter workflow="published" hasFr />
      </Row>
      <Row label="draft + locked + FR missing">
        <Gutter workflow="draft" locked hasFr={false} />
      </Row>
      <Row label="in-review + FR missing">
        <Gutter workflow="in-review" hasFr={false} />
      </Row>
      <Row label="needs-revision + locked">
        <Gutter workflow="needs-revision" locked hasFr />
      </Row>
    </div>
  ),
}
