'use client'

/**
 * @description
 * Mock field consumer that exercises every <EditFormProvider> surface
 * so reviewers can poke at dirty/validation/undo/submit/autosave
 * behavior without any real backend. The same harness is reused by
 * Storybook stories when the corresponding stories file lands.
 */

import * as React from 'react'

import {
  EditFormProvider,
  useEditForm,
  useEditFormField,
} from './EditFormProvider'

const MockTextField: React.FC<{ name: string; label: string; required?: boolean }> = ({
  name,
  label,
  required,
}) => {
  const validator = required
    ? (value: unknown) => (typeof value === 'string' && value.length > 0 ? null : 'Required')
    : undefined
  const { value, error, dirty, setValue } = useEditFormField(name, validator)

  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        fontSize: 13,
        color: 'var(--text-primary)',
      }}
    >
      <span style={{ fontWeight: 500 }}>
        {label}
        {required ? ' *' : ''}
        {dirty ? (
          <em style={{ marginLeft: 6, color: 'var(--workflow-review)', fontStyle: 'normal' }}>
            (modified)
          </em>
        ) : null}
      </span>
      <input
        type="text"
        value={String(value ?? '')}
        onChange={(e) => setValue(e.target.value)}
        style={{
          height: 32,
          padding: '0 8px',
          border: `1px solid ${error ? 'var(--workflow-revision)' : 'var(--border-default)'}`,
          borderRadius: 4,
          background: 'var(--surface-page)',
          fontSize: 13,
          fontFamily: 'inherit',
        }}
      />
      {error && (
        <span style={{ color: 'var(--workflow-revision)', fontSize: 12 }}>{error}</span>
      )}
    </label>
  )
}

const FormToolbar: React.FC = () => {
  const { isDirty, isValid, submitStatus, submitError, canUndo, canRedo, undo, redo, reset, submit } =
    useEditForm()

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderTop: '1px solid var(--border-default)',
        marginTop: 12,
      }}
    >
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
        {submitStatus === 'submitting'
          ? 'Saving…'
          : submitStatus === 'success'
            ? 'Saved'
            : submitStatus === 'error'
              ? `Error: ${submitError ?? 'unknown'}`
              : isDirty
                ? 'Unsaved changes'
                : 'No changes'}
      </span>
      <div style={{ flex: 1 }} />
      <button type="button" onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button type="button" onClick={redo} disabled={!canRedo}>
        Redo
      </button>
      <button type="button" onClick={reset} disabled={!isDirty}>
        Reset
      </button>
      <button
        type="button"
        onClick={() => void submit()}
        disabled={!isDirty || !isValid || submitStatus === 'submitting'}
      >
        Save Draft
      </button>
    </div>
  )
}

export const EditFormShowcase: React.FC = () => (
  <EditFormProvider
    initialValues={{ title: '', summary: '' }}
    onSubmit={async (values) => {
      // Simulate latency so the lifecycle states are observable.
      await new Promise((r) => setTimeout(r, 600))
      // eslint-disable-next-line no-console
      console.log('[EditFormShowcase] saved', values)
    }}
  >
    <div
      style={{
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 480,
        backgroundColor: 'var(--surface-page)',
      }}
    >
      <h1 style={{ margin: 0, fontSize: 18 }}>Edit form harness</h1>
      <MockTextField name="title" label="Title" required />
      <MockTextField name="summary" label="Summary" />
      <FormToolbar />
    </div>
  </EditFormProvider>
)

export default EditFormShowcase
