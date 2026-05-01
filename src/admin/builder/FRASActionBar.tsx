/**
 * @description
 * FRAS workflow action bar — replaces Puck's default toolbar via the
 * `overrides.headerActions` slot per G6 + G10 R1. POC-3 ships a stub:
 * the buttons render and click handlers fire, but the actual workflow
 * transitions wire to Payload's API in Epic 22 (foundation).
 *
 * The point of POC-3 R1 is verifying that Puck's `overrides` API can in
 * fact replace the toolbar without forking Puck. If this component
 * mounts inside <Puck> via overrides, R1 passes.
 */
'use client'

import * as React from 'react'

type Props = {
  saving: boolean
  lastSavedAt: number | null
  readOnly: boolean
  onSubmitForReview: () => void
  onPublish: () => void
  onPreview: () => void
  onLocaleChange: (locale: 'en' | 'fr') => void
  locale: 'en' | 'fr'
  lockedByOther: boolean
  lockedByName?: string
}

export const FRASActionBar = ({
  saving,
  lastSavedAt,
  readOnly,
  onSubmitForReview,
  onPublish,
  onPreview,
  onLocaleChange,
  locale,
  lockedByOther,
  lockedByName,
}: Props) => {
  const savedLabel = saving
    ? 'Saving…'
    : lastSavedAt
      ? `Saved ${Math.max(1, Math.round((Date.now() - lastSavedAt) / 1000))}s ago`
      : 'Not saved'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        background: 'var(--puck-color-white, #fff)',
        borderBottom: '1px solid var(--puck-color-grey-09, #ddd)',
        fontSize: 13,
      }}
    >
      <span
        aria-live="polite"
        style={{ color: 'var(--puck-color-grey-04, #666)', fontSize: 12 }}
      >
        {savedLabel}
      </span>

      <div style={{ flex: 1 }} />

      {lockedByOther ? (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: 4,
            background: '#fff1f0',
            color: '#a8071a',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          🔒 Locked by {lockedByName ?? 'another user'}
        </span>
      ) : (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: 4,
            background: '#f6ffed',
            color: '#237804',
            fontSize: 12,
          }}
        >
          🔓 Editing
        </span>
      )}

      <div style={{ display: 'flex', gap: 2 }}>
        {(['en', 'fr'] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => onLocaleChange(l)}
            style={{
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: 600,
              border: '1px solid var(--puck-color-grey-09, #ddd)',
              borderRadius: 4,
              cursor: 'pointer',
              background:
                locale === l ? 'var(--puck-color-azure-05, #2680eb)' : 'transparent',
              color: locale === l ? 'white' : 'inherit',
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onPreview}
        style={{
          padding: '6px 12px',
          fontSize: 12,
          border: '1px solid var(--puck-color-grey-09, #ddd)',
          borderRadius: 4,
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        Preview
      </button>

      <button
        type="button"
        onClick={onSubmitForReview}
        disabled={readOnly}
        style={{
          padding: '6px 12px',
          fontSize: 12,
          fontWeight: 600,
          border: '1px solid var(--puck-color-grey-09, #ddd)',
          borderRadius: 4,
          background: 'transparent',
          cursor: readOnly ? 'not-allowed' : 'pointer',
          opacity: readOnly ? 0.5 : 1,
        }}
      >
        Submit for Review
      </button>

      <button
        type="button"
        onClick={onPublish}
        disabled={readOnly}
        style={{
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 600,
          border: 'none',
          borderRadius: 4,
          background: '#601F5B',
          color: 'white',
          cursor: readOnly ? 'not-allowed' : 'pointer',
          opacity: readOnly ? 0.5 : 1,
        }}
      >
        Publish
      </button>
    </div>
  )
}
