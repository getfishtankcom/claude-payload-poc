'use client'

/**
 * @description
 * <EditFormProvider> — the deep module owning every Layer 1 field's
 * shared concerns: dirty state, validation aggregation, debounced
 * autosave, undo/redo, and the submit lifecycle state machine.
 *
 * Field primitives don't manage their own value/dirty/error — they
 * register against this provider and read/write through it. That keeps
 * undo/redo, autosave, and submit consistent across every field type.
 *
 * @notes
 * - Pure client module; no server-only imports. Provider lives at the
 *   top of an edit view, child fields call `useEditFormField(name)`.
 * - Optimistic submit: state flips to 'submitting' immediately,
 *   resolves to 'success' or rolls back errors to 'error' if the
 *   onSubmit promise rejects.
 * - Validators are pure functions: `(value) => string | null`. They
 *   run on every change so error state stays in sync.
 */

import * as React from 'react'

export type FieldValidator = (value: unknown) => string | null

export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

export type EditFormState = {
  /** Snapshot of the values when the form was opened or last saved. */
  initialValues: Readonly<Record<string, unknown>>
  /** Current values keyed by field name. */
  values: Readonly<Record<string, unknown>>
  /** Validation errors keyed by field name (null/undefined = valid). */
  errors: Readonly<Record<string, string | null>>
  /** Whether ANY field has diverged from `initialValues`. */
  isDirty: boolean
  /** Per-field dirty flags. */
  dirty: Readonly<Record<string, boolean>>
  /** Whether ALL registered fields are valid. */
  isValid: boolean
  /** Submit lifecycle state. */
  submitStatus: SubmitStatus
  /** Last submit error message, if any. */
  submitError: string | null
  /** Whether undo is available. */
  canUndo: boolean
  /** Whether redo is available. */
  canRedo: boolean
}

export type EditFormActions = {
  setFieldValue: (name: string, value: unknown) => void
  setFieldError: (name: string, error: string | null) => void
  registerField: (name: string, validator?: FieldValidator) => () => void
  undo: () => void
  redo: () => void
  reset: () => void
  submit: () => Promise<void>
}

export type EditFormContext = EditFormState & EditFormActions

const Context = React.createContext<EditFormContext | null>(null)

export type EditFormProviderProps = {
  initialValues: Record<string, unknown>
  /**
   * Called when `submit()` runs OR after `autosaveDebounceMs` of inactivity
   * if `autosave` is true. Should persist `values` and resolve on success.
   */
  onSubmit: (values: Record<string, unknown>) => Promise<void>
  /** Enable debounced autosave on every value change. */
  autosave?: boolean
  /** Debounce window in ms. Default 800. */
  autosaveDebounceMs?: number
  /** Maximum undo history size. Default 50. */
  maxHistory?: number
  children: React.ReactNode
}

type HistoryEntry = {
  values: Record<string, unknown>
  errors: Record<string, string | null>
}

const computeIsDirty = (
  values: Record<string, unknown>,
  initialValues: Record<string, unknown>,
): boolean => {
  for (const key of Object.keys(values)) {
    if (!Object.is(values[key], initialValues[key])) return true
  }
  for (const key of Object.keys(initialValues)) {
    if (!(key in values)) return true
  }
  return false
}

const computeFieldDirty = (
  values: Record<string, unknown>,
  initialValues: Record<string, unknown>,
): Record<string, boolean> => {
  const out: Record<string, boolean> = {}
  for (const key of Object.keys(values)) {
    out[key] = !Object.is(values[key], initialValues[key])
  }
  return out
}

const computeIsValid = (errors: Record<string, string | null>): boolean =>
  Object.values(errors).every((e) => !e)

export const EditFormProvider: React.FC<EditFormProviderProps> = ({
  initialValues,
  onSubmit,
  autosave = false,
  autosaveDebounceMs = 800,
  maxHistory = 50,
  children,
}) => {
  const [values, setValues] = React.useState<Record<string, unknown>>(initialValues)
  const [errors, setErrors] = React.useState<Record<string, string | null>>({})
  const [submitStatus, setSubmitStatus] = React.useState<SubmitStatus>('idle')
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [past, setPast] = React.useState<HistoryEntry[]>([])
  const [future, setFuture] = React.useState<HistoryEntry[]>([])
  const [savedInitial, setSavedInitial] = React.useState<Record<string, unknown>>(initialValues)

  const validatorsRef = React.useRef<Record<string, FieldValidator>>({})
  const autosaveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const runValidator = React.useCallback((name: string, value: unknown): string | null => {
    const v = validatorsRef.current[name]
    return v ? v(value) : null
  }, [])

  const registerField = React.useCallback(
    (name: string, validator?: FieldValidator): (() => void) => {
      if (validator) {
        validatorsRef.current[name] = validator
        // Re-validate the current value with the new validator.
        setErrors((prev) => ({ ...prev, [name]: validator(values[name]) }))
      }
      return () => {
        delete validatorsRef.current[name]
        setErrors((prev) => {
          const next = { ...prev }
          delete next[name]
          return next
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [],
  )

  const pushHistory = React.useCallback(
    (entry: HistoryEntry) => {
      setPast((prev) => {
        const next = [...prev, entry]
        return next.length > maxHistory ? next.slice(next.length - maxHistory) : next
      })
      setFuture([])
    },
    [maxHistory],
  )

  const setFieldValue = React.useCallback(
    (name: string, value: unknown) => {
      pushHistory({ values, errors })
      setValues((prev) => ({ ...prev, [name]: value }))
      setErrors((prev) => ({ ...prev, [name]: runValidator(name, value) }))
    },
    [values, errors, pushHistory, runValidator],
  )

  const setFieldError = React.useCallback((name: string, error: string | null) => {
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [])

  const undo = React.useCallback(() => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast
      const previous = prevPast[prevPast.length - 1]
      setFuture((f) => [...f, { values, errors }])
      setValues(previous.values)
      setErrors(previous.errors)
      return prevPast.slice(0, -1)
    })
  }, [values, errors])

  const redo = React.useCallback(() => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture
      const next = prevFuture[prevFuture.length - 1]
      setPast((p) => [...p, { values, errors }])
      setValues(next.values)
      setErrors(next.errors)
      return prevFuture.slice(0, -1)
    })
  }, [values, errors])

  const reset = React.useCallback(() => {
    setValues(savedInitial)
    setErrors({})
    setPast([])
    setFuture([])
    setSubmitStatus('idle')
    setSubmitError(null)
  }, [savedInitial])

  const performSubmit = React.useCallback(
    async (snapshot: Record<string, unknown>) => {
      const errorsBefore = errors
      setSubmitStatus('submitting')
      setSubmitError(null)
      try {
        await onSubmit(snapshot)
        setSavedInitial(snapshot)
        setSubmitStatus('success')
      } catch (err) {
        // Rollback errors so any visual error markers from optimistic
        // submission disappear. Keep `values` — user keeps their edits.
        setErrors(errorsBefore)
        setSubmitStatus('error')
        setSubmitError(err instanceof Error ? err.message : String(err))
      }
    },
    [onSubmit, errors],
  )

  const submit = React.useCallback(() => performSubmit(values), [performSubmit, values])

  // Autosave: debounce a save when values change.
  React.useEffect(() => {
    if (!autosave) return
    if (!computeIsDirty(values, savedInitial)) return
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => {
      void performSubmit(values)
    }, autosaveDebounceMs)
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    }
  }, [values, autosave, autosaveDebounceMs, savedInitial, performSubmit])

  const isDirty = React.useMemo(() => computeIsDirty(values, savedInitial), [values, savedInitial])
  const dirty = React.useMemo(
    () => computeFieldDirty(values, savedInitial),
    [values, savedInitial],
  )
  const isValid = React.useMemo(() => computeIsValid(errors), [errors])

  const ctx = React.useMemo<EditFormContext>(
    () => ({
      initialValues: savedInitial,
      values,
      errors,
      isDirty,
      dirty,
      isValid,
      submitStatus,
      submitError,
      canUndo: past.length > 0,
      canRedo: future.length > 0,
      setFieldValue,
      setFieldError,
      registerField,
      undo,
      redo,
      reset,
      submit,
    }),
    [
      savedInitial,
      values,
      errors,
      isDirty,
      dirty,
      isValid,
      submitStatus,
      submitError,
      past.length,
      future.length,
      setFieldValue,
      setFieldError,
      registerField,
      undo,
      redo,
      reset,
      submit,
    ],
  )

  return <Context.Provider value={ctx}>{children}</Context.Provider>
}

/**
 * Read the form context. Throws when called outside a provider — that's
 * an authoring bug, not a runtime case.
 */
export const useEditForm = (): EditFormContext => {
  const ctx = React.useContext(Context)
  if (!ctx) {
    throw new Error('useEditForm must be called inside <EditFormProvider>')
  }
  return ctx
}

export type EditFormFieldHandle = {
  value: unknown
  error: string | null
  dirty: boolean
  setValue: (value: unknown) => void
}

/**
 * Field-level convenience hook: registers a validator on mount and
 * returns the current value, error, dirty flag, and a setter scoped
 * to this field. Layer 1 field primitives use this as their single
 * source of truth.
 */
export const useEditFormField = (
  name: string,
  validator?: FieldValidator,
): EditFormFieldHandle => {
  const ctx = useEditForm()
  const validatorRef = React.useRef(validator)
  validatorRef.current = validator

  React.useEffect(() => {
    return ctx.registerField(name, validatorRef.current)
    // Re-register only when the field name changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, ctx.registerField])

  return {
    value: ctx.values[name],
    error: ctx.errors[name] ?? null,
    dirty: !!ctx.dirty[name],
    setValue: (value: unknown) => ctx.setFieldValue(name, value),
  }
}
