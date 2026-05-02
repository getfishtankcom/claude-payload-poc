/**
 * @description
 * Vitest coverage for <EditFormProvider> — the largest testable surface
 * in the v2 admin shell per the PRD. Each test asserts external
 * behavior (rendered output / observable callback effects) rather than
 * implementation internals.
 */

import * as React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  EditFormProvider,
  useEditForm,
  useEditFormField,
  type FieldValidator,
} from './EditFormProvider'

afterEach(() => {
  // Defensive: any test using fake timers should restore real ones,
  // but fake timers leaking into the next test breaks waitFor.
  vi.useRealTimers()
})

const FieldHarness: React.FC<{ name: string; validator?: FieldValidator }> = ({
  name,
  validator,
}) => {
  const { value, error, dirty, setValue } = useEditFormField(name, validator)
  return (
    <div>
      <input
        data-testid={`field-${name}`}
        value={String(value ?? '')}
        onChange={(e) => setValue(e.target.value)}
      />
      <span data-testid={`error-${name}`}>{error ?? ''}</span>
      <span data-testid={`dirty-${name}`}>{dirty ? 'dirty' : 'clean'}</span>
    </div>
  )
}

const FormStateProbe: React.FC = () => {
  const { isDirty, isValid, submitStatus, canUndo, canRedo } = useEditForm()
  return (
    <div>
      <span data-testid="probe-dirty">{isDirty ? 'dirty' : 'clean'}</span>
      <span data-testid="probe-valid">{isValid ? 'valid' : 'invalid'}</span>
      <span data-testid="probe-status">{submitStatus}</span>
      <span data-testid="probe-undo">{canUndo ? 'can-undo' : 'no-undo'}</span>
      <span data-testid="probe-redo">{canRedo ? 'can-redo' : 'no-redo'}</span>
    </div>
  )
}

describe('<EditFormProvider> dirty tracking', () => {
  it('starts clean', () => {
    render(
      <EditFormProvider initialValues={{ title: '' }} onSubmit={async () => {}}>
        <FieldHarness name="title" />
        <FormStateProbe />
      </EditFormProvider>,
    )
    expect(screen.getByTestId('probe-dirty').textContent).toBe('clean')
    expect(screen.getByTestId('dirty-title').textContent).toBe('clean')
  })

  it('flips to dirty when a field changes', () => {
    render(
      <EditFormProvider initialValues={{ title: '' }} onSubmit={async () => {}}>
        <FieldHarness name="title" />
        <FormStateProbe />
      </EditFormProvider>,
    )
    fireEvent.change(screen.getByTestId('field-title'), { target: { value: 'hi' } })
    expect(screen.getByTestId('probe-dirty').textContent).toBe('dirty')
    expect(screen.getByTestId('dirty-title').textContent).toBe('dirty')
  })

  it('returns to clean when reverted to initial', () => {
    render(
      <EditFormProvider initialValues={{ title: 'a' }} onSubmit={async () => {}}>
        <FieldHarness name="title" />
        <FormStateProbe />
      </EditFormProvider>,
    )
    fireEvent.change(screen.getByTestId('field-title'), { target: { value: 'b' } })
    expect(screen.getByTestId('probe-dirty').textContent).toBe('dirty')
    fireEvent.change(screen.getByTestId('field-title'), { target: { value: 'a' } })
    expect(screen.getByTestId('probe-dirty').textContent).toBe('clean')
  })
})

describe('<EditFormProvider> validation aggregation', () => {
  it('invalid when any field has an error', () => {
    const required: FieldValidator = (v) => (v ? null : 'required')
    render(
      <EditFormProvider initialValues={{ a: '', b: 'ok' }} onSubmit={async () => {}}>
        <FieldHarness name="a" validator={required} />
        <FieldHarness name="b" validator={required} />
        <FormStateProbe />
      </EditFormProvider>,
    )
    expect(screen.getByTestId('probe-valid').textContent).toBe('invalid')
    expect(screen.getByTestId('error-a').textContent).toBe('required')
    fireEvent.change(screen.getByTestId('field-a'), { target: { value: 'now-set' } })
    expect(screen.getByTestId('probe-valid').textContent).toBe('valid')
  })
})

describe('<EditFormProvider> autosave debouncing', () => {
  it('debounces submit until quiet period elapses', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false })
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <EditFormProvider
        initialValues={{ title: '' }}
        onSubmit={onSubmit}
        autosave
        autosaveDebounceMs={500}
      >
        <FieldHarness name="title" />
      </EditFormProvider>,
    )

    fireEvent.change(screen.getByTestId('field-title'), { target: { value: 'a' } })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })
    fireEvent.change(screen.getByTestId('field-title'), { target: { value: 'ab' } })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })
    expect(onSubmit).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({ title: 'ab' })
  })
})

describe('<EditFormProvider> undo / redo', () => {
  const Controls: React.FC = () => {
    const { undo, redo } = useEditForm()
    return (
      <div>
        <button data-testid="btn-undo" onClick={undo} type="button">
          undo
        </button>
        <button data-testid="btn-redo" onClick={redo} type="button">
          redo
        </button>
      </div>
    )
  }

  it('undoes the last value change and exposes redo', () => {
    render(
      <EditFormProvider initialValues={{ title: '' }} onSubmit={async () => {}}>
        <FieldHarness name="title" />
        <FormStateProbe />
        <Controls />
      </EditFormProvider>,
    )
    fireEvent.change(screen.getByTestId('field-title'), { target: { value: 'one' } })
    fireEvent.change(screen.getByTestId('field-title'), { target: { value: 'two' } })
    expect(screen.getByTestId('field-title').getAttribute('value')).toBe('two')

    fireEvent.click(screen.getByTestId('btn-undo'))
    expect(screen.getByTestId('field-title').getAttribute('value')).toBe('one')
    expect(screen.getByTestId('probe-redo').textContent).toBe('can-redo')

    fireEvent.click(screen.getByTestId('btn-redo'))
    expect(screen.getByTestId('field-title').getAttribute('value')).toBe('two')
  })

  it('clears the redo stack when a new change happens after undo', () => {
    render(
      <EditFormProvider initialValues={{ title: '' }} onSubmit={async () => {}}>
        <FieldHarness name="title" />
        <FormStateProbe />
        <Controls />
      </EditFormProvider>,
    )
    fireEvent.change(screen.getByTestId('field-title'), { target: { value: 'a' } })
    fireEvent.click(screen.getByTestId('btn-undo'))
    expect(screen.getByTestId('probe-redo').textContent).toBe('can-redo')
    fireEvent.change(screen.getByTestId('field-title'), { target: { value: 'b' } })
    expect(screen.getByTestId('probe-redo').textContent).toBe('no-redo')
  })
})

describe('<EditFormProvider> submit lifecycle', () => {
  const SubmitButton: React.FC = () => {
    const { submit } = useEditForm()
    return (
      <button type="button" data-testid="btn-submit" onClick={() => void submit()}>
        submit
      </button>
    )
  }

  it('flips through idle → submitting → success', async () => {
    let resolve: (() => void) | null = null
    const onSubmit = vi.fn(
      () => new Promise<void>((r) => (resolve = r)),
    )
    render(
      <EditFormProvider initialValues={{ title: 'a' }} onSubmit={onSubmit}>
        <FieldHarness name="title" />
        <FormStateProbe />
        <SubmitButton />
      </EditFormProvider>,
    )

    expect(screen.getByTestId('probe-status').textContent).toBe('idle')
    fireEvent.click(screen.getByTestId('btn-submit'))
    await waitFor(() =>
      expect(screen.getByTestId('probe-status').textContent).toBe('submitting'),
    )
    act(() => resolve?.())
    await waitFor(() => expect(screen.getByTestId('probe-status').textContent).toBe('success'))
  })

  it('rolls back to error on rejection and preserves field values', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('boom'))
    render(
      <EditFormProvider initialValues={{ title: 'a' }} onSubmit={onSubmit}>
        <FieldHarness name="title" />
        <FormStateProbe />
        <SubmitButton />
      </EditFormProvider>,
    )
    fireEvent.change(screen.getByTestId('field-title'), { target: { value: 'b' } })
    fireEvent.click(screen.getByTestId('btn-submit'))
    await waitFor(() => expect(screen.getByTestId('probe-status').textContent).toBe('error'))
    expect(screen.getByTestId('field-title').getAttribute('value')).toBe('b')
  })
})
