/**
 * @description
 * Breadcrumb navigation component used across multiple templates.
 * Renders a trail of links with "/" separator. Last item is plain text (current page).
 *
 * Key features:
 * - Links separated by " / "
 * - Last item rendered as plain text (no link)
 * - Home link always first
 *
 * @dependencies
 * - None (standalone presentational component)
 *
 * @notes
 * - Used by Templates 3A, 3B, 4, 5, 10, 14
 */

export type BreadcrumbItem = {
  label: string
  href?: string
}

export type BreadcrumbsProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" data-testid="breadcrumbs" className="py-3 text-sm text-text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isLast || !item.href ? (
                <span className="text-text-primary" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="text-text-muted hover:text-link hover:underline">
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
