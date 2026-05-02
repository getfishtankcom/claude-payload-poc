'use client'

/**
 * @description
 * <UploadField> — opens the existing MediaPickerModal to pick a media
 * item, displays the thumbnail + alt-text inline, and offers
 * "Replace" / "Remove" actions. Stored value is the media item's id
 * (or null when none selected).
 *
 * @notes
 * - The Layer 1 primitive owns the inline UI; the modal itself is
 *   the existing v1 admin component (lazy-loaded to avoid pulling its
 *   full data layer when the field isn't opened).
 * - Lazy-loading also keeps the test bundle clean — tests assert the
 *   inline UI without rendering the modal.
 */

import * as React from 'react'

import { useEditFormField, type FieldValidator } from '../forms/EditFormProvider'
import { FieldShell } from './FieldShell'
import type { FieldCommonProps } from './field-types'

export type UploadFieldProps = FieldCommonProps & {
  /** Mime type prefix passed to the picker (e.g. `image/`). */
  mimeTypeFilter?: string
  /** Resolves a stored id to a {url, alt} pair so the thumbnail renders. */
  resolveItem?: (id: string) => Promise<{ url: string; alt: string } | null>
}

const required: FieldValidator = (v) => (v ? null : 'Required')

const MediaPickerModalLazy = React.lazy(() =>
  import('../MediaPickerModal').then((m) => ({ default: m.MediaPickerModal })),
)

export const UploadField: React.FC<UploadFieldProps> = ({
  name,
  label,
  description,
  required: isRequired,
  lock = 'unlocked',
  readOnly,
  mimeTypeFilter,
  resolveItem,
}) => {
  const { value, error, dirty, setValue } = useEditFormField(
    name,
    isRequired ? required : undefined,
  )
  const isReadOnly = readOnly || lock === 'locked-by-other'
  const [open, setOpen] = React.useState(false)
  const [resolved, setResolved] = React.useState<{ url: string; alt: string } | null>(null)

  React.useEffect(() => {
    if (!resolveItem || !value) {
      setResolved(null)
      return
    }
    let cancelled = false
    resolveItem(String(value)).then((r) => {
      if (!cancelled) setResolved(r)
    })
    return () => {
      cancelled = true
    }
  }, [value, resolveItem])

  return (
    <FieldShell
      name={name}
      label={label}
      description={description}
      required={isRequired}
      lock={lock}
      error={error}
      dirty={dirty}
    >
      <div
        data-testid={`upload-${name}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 8,
          border: `1px solid ${error ? 'var(--workflow-revision)' : 'var(--border-default)'}`,
          borderRadius: 4,
          background: isReadOnly ? 'var(--surface-sunken)' : 'var(--surface-page)',
        }}
      >
        {value ? (
          resolved ? (
            <img
              src={resolved.url}
              alt={resolved.alt}
              width={56}
              height={56}
              style={{ objectFit: 'cover', borderRadius: 4 }}
            />
          ) : (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 4,
                background: 'var(--surface-sunken)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                color: 'var(--text-muted)',
              }}
            >
              loading…
            </div>
          )
        ) : (
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 4,
              background: 'var(--surface-sunken)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              color: 'var(--text-muted)',
            }}
          >
            (empty)
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          {value ? (
            <>
              <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                {resolved?.alt ?? `Item ${String(value)}`}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>id: {String(value)}</div>
            </>
          ) : (
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>No file selected</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            disabled={isReadOnly}
            data-testid={`upload-${name}-pick`}
            onClick={() => setOpen(true)}
            style={{
              padding: '6px 10px',
              border: '1px solid var(--border-strong)',
              borderRadius: 4,
              background: 'var(--surface-page)',
              fontSize: 12,
              fontFamily: 'inherit',
              cursor: isReadOnly ? 'not-allowed' : 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            {value ? 'Replace' : 'Choose…'}
          </button>
          {!!value && (
            <button
              type="button"
              disabled={isReadOnly}
              data-testid={`upload-${name}-remove`}
              onClick={() => setValue(null)}
              style={{
                padding: '6px 10px',
                border: '1px solid var(--workflow-revision)',
                borderRadius: 4,
                background: 'transparent',
                color: 'var(--workflow-revision)',
                fontSize: 12,
                fontFamily: 'inherit',
                cursor: isReadOnly ? 'not-allowed' : 'pointer',
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {open && (
        <React.Suspense fallback={null}>
          <MediaPickerModalLazy
            isOpen={open}
            mimeTypeFilter={mimeTypeFilter}
            onClose={() => setOpen(false)}
            onSelect={(item) => {
              setValue(item.id)
              setResolved({ url: item.url, alt: item.alt })
              setOpen(false)
            }}
          />
        </React.Suspense>
      )}
    </FieldShell>
  )
}

export default UploadField
