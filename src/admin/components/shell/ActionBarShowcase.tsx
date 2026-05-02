'use client'

/**
 * @description
 * Visual showcase of <ActionBar> across the five workflow states +
 * the empty-verbs edge case. Each card represents a Storybook story
 * to be created when Storybook lands in the v2 admin shell.
 */

import * as React from 'react'

import { ActionBar, type ActionVerb, type WorkflowState } from './ActionBar'

const STANDARD_VERBS: ActionVerb[] = [
  {
    id: 'save-draft',
    label: 'Save Draft',
    variant: 'secondary',
    visibleIn: ['draft', 'needs-revision'],
  },
  {
    id: 'submit',
    label: 'Submit for Review',
    variant: 'primary',
    visibleIn: ['draft', 'needs-revision'],
  },
  {
    id: 'reject',
    label: 'Request Revisions',
    variant: 'destructive',
    visibleIn: ['in-review'],
  },
  {
    id: 'approve',
    label: 'Approve',
    variant: 'primary',
    visibleIn: ['in-review'],
  },
  {
    id: 'publish',
    label: 'Publish',
    variant: 'primary',
    visibleIn: ['approved'],
  },
  {
    id: 'schedule',
    label: 'Schedule…',
    variant: 'secondary',
    visibleIn: ['approved'],
  },
  {
    id: 'unpublish',
    label: 'Unpublish',
    variant: 'destructive',
    visibleIn: ['published'],
  },
  { id: 'preview', label: 'Preview' },
]

const STATES: { state: WorkflowState; label: string }[] = [
  { state: 'draft', label: 'Draft' },
  { state: 'in-review', label: 'In review' },
  { state: 'needs-revision', label: 'Needs revision' },
  { state: 'approved', label: 'Approved' },
  { state: 'published', label: 'Published' },
]

export const ActionBarShowcase: React.FC = () => (
  <div
    style={{
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      backgroundColor: 'var(--surface-page)',
      color: 'var(--text-primary)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}
  >
    <h1 style={{ margin: 0, fontSize: 20 }}>ActionBar — verb visibility by workflow state</h1>

    {STATES.map(({ state, label }) => (
      <section
        key={state}
        style={{
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          background: 'var(--surface-elevated)',
        }}
      >
        <header
          style={{
            padding: '6px 12px',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          {label}
        </header>
        <ActionBar
          workflowState={state}
          verbs={STANDARD_VERBS}
          status={`Workflow state: ${state}`}
        />
      </section>
    ))}

    <section
      style={{
        border: '1px solid var(--border-default)',
        borderRadius: 8,
        background: 'var(--surface-elevated)',
      }}
    >
      <header
        style={{
          padding: '6px 12px',
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-secondary)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        Empty (no verbs apply)
      </header>
      <ActionBar workflowState="published" verbs={[]} />
    </section>
  </div>
)

export default ActionBarShowcase
