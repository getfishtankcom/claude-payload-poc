/**
 * @description
 * Vertical section navigation sidebar for content pages (Template 3B, T4).
 * Renders a vertical link list with active state styling (bold + underline).
 * On mobile (< 768px), drops below main content as a vertical link list.
 *
 * Key features:
 * - Section label above divider (gray text, no heading tag)
 * - Active link: bold + underline, no color change
 * - Non-active links: underline on hover
 * - All items are <a> tags for server navigation
 *
 * @dependencies
 * - None (standalone presentational component)
 *
 * @notes
 * - Distinct from board/SectionNav which uses buttons + client state
 * - This component uses <a> tags for full page navigation between sibling pages
 * - No heading label like "Navigation" — just links under a thin divider
 */

export type SectionNavLink = {
  label: string
  href: string
  isActive: boolean
}

export type SectionNavSidebarProps = {
  /** Gray text label above the divider (e.g., "About") */
  sectionLabel: string
  /** Array of sibling page links */
  links: SectionNavLink[]
}

export function SectionNavSidebar({ sectionLabel, links }: SectionNavSidebarProps) {
  if (!links || links.length === 0) {
    return null
  }

  return (
    <nav
      data-testid="sidebar-nav"
      aria-label="Section navigation"
      className="rounded-sm"
    >
      <p className="mb-2 text-sm text-text-muted">{sectionLabel}</p>
      <hr className="mb-3 border-gray-300" />
      <ul className="space-y-1.5" role="list">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={`block py-1 text-sm text-text-muted transition-colors ${
                link.isActive
                  ? 'font-bold underline underline-offset-4'
                  : 'hover:underline hover:underline-offset-4'
              }`}
              aria-current={link.isActive ? 'page' : undefined}
              data-testid={`section-nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
