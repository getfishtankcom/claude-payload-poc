/**
 * @description
 * Two-state tab toggle component. Unlike TabPills, this does NOT collapse
 * to a dropdown on mobile — stays as two side-by-side tabs at all viewports.
 *
 * Key features:
 * - Two-state toggle: active has filled dark background, inactive has outline
 * - Stays as two side-by-side tabs on mobile (no dropdown collapse)
 * - Client component for onChange interaction
 *
 * @dependencies
 * - Design tokens from globals.css
 *
 * @notes
 * - Used on Meetings & Events listing (Upcoming/Past toggle)
 * - Client component due to onChange callback
 */
'use client'

type TabToggleOption = {
  /** Display label */
  label: string
  /** Option value */
  value: string
  /** Whether this option is currently active */
  isActive: boolean
}

type TabToggleProps = {
  /** Array of toggle options (typically 2) */
  options: TabToggleOption[]
  /** Callback when toggle changes */
  onChange: (value: string) => void
  className?: string
}

export function TabToggle({ options, onChange, className = '' }: TabToggleProps) {
  return (
    <div
      className={`inline-flex rounded-sm border border-gray-300 overflow-hidden ${className}`.trim()}
      role="tablist"
      data-testid="tab-toggle"
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.isActive}
          onClick={() => onChange(option.value)}
          className={`px-5 py-2 text-sm font-semibold transition-colors duration-150 cursor-pointer ${
            option.isActive
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-900 hover:bg-gray-50'
          } ${index > 0 ? 'border-l border-gray-300' : ''}`}
          data-testid={`tab-toggle-${option.value}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
