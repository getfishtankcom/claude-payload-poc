/**
 * @description
 * Form input component supporting text, email, tel, and textarea types.
 * Follows the label + input + error message pattern for accessibility.
 *
 * @dependencies
 * - Design tokens from globals.css: text colors, border radius, spacing
 *
 * @notes
 * - Error state shows red border and error message text
 * - Label is always visible (no floating label pattern) for WCAG compliance
 * - textarea auto-selects when `type="textarea"` is passed
 * - Supports all standard HTML input/textarea attributes via spread
 */
import React from 'react'

type InputBaseProps = {
  label: string
  error?: string
  id: string
  className?: string
}

type InputAsInput = InputBaseProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof InputBaseProps> & {
    type?: 'text' | 'email' | 'tel' | 'search' | 'url' | 'password'
  }

type InputAsTextarea = InputBaseProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof InputBaseProps> & {
    type: 'textarea'
  }

type InputProps = InputAsInput | InputAsTextarea

const baseInputClasses =
  'w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-base text-text-primary placeholder:text-text-muted transition-colors duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-bright/30'

const errorInputClasses =
  'border-red-500 focus:border-red-500 focus:ring-red-500/30'

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const isTextarea = props.type === 'textarea'
  const inputClasses = `${baseInputClasses} ${error ? errorInputClasses : ''} ${className}`.trim()

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-text-secondary">
        {label}
      </label>

      {isTextarea ? (
        <textarea
          id={id}
          className={inputClasses}
          rows={4}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...(props as Omit<InputAsTextarea, keyof InputBaseProps | 'type'>)}
        />
      ) : (
        <input
          id={id}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...(props as Omit<InputAsInput, keyof InputBaseProps>)}
        />
      )}

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
