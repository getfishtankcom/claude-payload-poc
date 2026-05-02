'use client'

/**
 * @description
 * Tiny inline glyphs for the tree row gutter — workflow state, lock,
 * and FR-missing. Pure SVG so they inherit color from CSS variables
 * without sprite assets.
 */

import * as React from 'react'

import type { WorkflowState } from './types'

const SIZE = 12

const Dot: React.FC<{ color: string; title: string }> = ({ color, title }) => (
  <svg
    width={SIZE}
    height={SIZE}
    viewBox="0 0 12 12"
    aria-label={title}
    role="img"
    style={{ flexShrink: 0 }}
  >
    <title>{title}</title>
    <circle cx="6" cy="6" r="4" fill={color} />
  </svg>
)

const stateColor: Record<WorkflowState, string> = {
  draft: 'var(--workflow-draft)',
  'in-review': 'var(--workflow-review)',
  'needs-revision': 'var(--workflow-revision)',
  approved: 'var(--workflow-approved)',
  published: 'var(--workflow-published)',
}

const stateLabel: Record<WorkflowState, string> = {
  draft: 'Draft',
  'in-review': 'In review',
  'needs-revision': 'Needs revision',
  approved: 'Approved',
  published: 'Published',
}

export const WorkflowGutterIcon: React.FC<{ state: WorkflowState }> = ({ state }) => (
  <Dot color={stateColor[state]} title={stateLabel[state]} />
)

export const LockGutterIcon: React.FC = () => (
  <svg
    width={SIZE}
    height={SIZE}
    viewBox="0 0 12 12"
    aria-label="Locked"
    role="img"
    style={{ flexShrink: 0, color: 'var(--lock-locked)' }}
  >
    <title>Locked</title>
    <path
      d="M3.5 5V3.5a2.5 2.5 0 0 1 5 0V5h.5a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h.5Zm1 0h3V3.5a1.5 1.5 0 1 0-3 0V5Z"
      fill="currentColor"
    />
  </svg>
)

export const FrMissingGutterIcon: React.FC = () => (
  <span
    aria-label="French translation missing"
    role="img"
    title="French translation missing"
    style={{
      display: 'inline-block',
      fontSize: 9,
      fontWeight: 700,
      lineHeight: '12px',
      width: SIZE,
      height: SIZE,
      textAlign: 'center',
      color: 'var(--lang-missing)',
      border: '1px solid var(--lang-missing)',
      borderRadius: 2,
      flexShrink: 0,
    }}
  >
    FR
  </span>
)

export const Gutter: React.FC<{
  workflow?: WorkflowState
  locked?: boolean
  hasFr?: boolean
}> = ({ workflow, locked, hasFr }) => (
  <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center', flexShrink: 0 }}>
    {workflow ? <WorkflowGutterIcon state={workflow} /> : null}
    {locked ? <LockGutterIcon /> : null}
    {hasFr === false ? <FrMissingGutterIcon /> : null}
  </span>
)
