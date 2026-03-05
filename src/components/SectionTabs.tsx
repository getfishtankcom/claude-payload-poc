/**
 * @description
 * Horizontal tab navigation for section pages (T3, T4, T5, T10).
 * Each tab is an <a> navigating to its own route (not client-side switch).
 * Active tab has purple bottom border and bold text.
 * Mobile: horizontal scroll with overflow-x: auto.
 *
 * Key features:
 * - Supports up to 7 tabs
 * - Active tab: bottom border highlight (brand purple) + bold
 * - Non-active tabs: underline + subtle color shift on hover
 * - Mobile horizontal scrolling
 *
 * @dependencies
 * - None (standalone presentational component)
 *
 * @notes
 * - Each tab performs full page navigation — no client-side tab switching
 * - Tab data comes from CMS (standards-sections.tabs or board.tabs)
 */

export type SectionTab = {
  label: string
  href: string
  isActive: boolean
}

export type SectionTabsProps = {
  /** Array of tab items */
  tabs: SectionTab[]
}

export function SectionTabs({ tabs }: SectionTabsProps) {
  if (!tabs || tabs.length === 0) {
    return null
  }

  return (
    <nav
      data-testid="section-tabs"
      aria-label="Section tabs"
      className="border-b border-gray-200"
    >
      <div className="-mb-px flex overflow-x-auto">
        {tabs.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors ${
              tab.isActive
                ? 'border-primary font-bold text-primary'
                : 'border-transparent text-text-muted hover:border-gray-300 hover:text-text-primary'
            }`}
            aria-current={tab.isActive ? 'page' : undefined}
            data-testid={`section-tab-${tab.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {tab.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
