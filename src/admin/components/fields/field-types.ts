/**
 * @description
 * Shared types for Layer 1 field renderer primitives. Each primitive
 * accepts the same shape so they're substitutable from a config-driven
 * renderer without bespoke prop wrangling per type.
 *
 * @notes
 * - Stay framework-agnostic — no React imports here. Components import
 *   these and add their own value-shape narrowing.
 */

export type LockState = 'unlocked' | 'locked-by-self' | 'locked-by-other'

export type FieldCommonProps = {
  /** Field name — also the key in the EditFormProvider's value map. */
  name: string
  /** Visible label. */
  label?: string
  /** Description / helper text rendered under the field. */
  description?: string
  /** Marks the field required (visual hint + validator hook). */
  required?: boolean
  /** Lock state — `locked-by-other` forces read-only with a hint. */
  lock?: LockState
  /** Override read-only regardless of lock state. */
  readOnly?: boolean
}
