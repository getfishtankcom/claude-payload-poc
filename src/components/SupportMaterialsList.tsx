/**
 * @description
 * Support materials list component for document detail pages.
 * Renders a list of downloadable document links with chain-link icon prefix.
 *
 * Key features:
 * - Chain-link icon prefix before each labeled document link
 * - Links open in new tab (target="_blank")
 * - Accessible with rel="noopener noreferrer" on external links
 *
 * @dependencies
 * - @heroicons/react: LinkIcon for chain-link prefix
 *
 * @notes
 * - Server component — no interactivity
 * - File type shown as parenthetical label (e.g., "(PDF)")
 */
import { LinkIcon } from '@heroicons/react/24/outline'

type SupportMaterial = {
  /** Display label for the document link */
  label: string
  /** URL to the document/resource */
  url: string
  /** File type identifier for display */
  fileType: string
}

type SupportMaterialsListProps = {
  /** Array of support material items */
  materials: SupportMaterial[]
  className?: string
}

export function SupportMaterialsList({ materials, className = '' }: SupportMaterialsListProps) {
  if (!materials || materials.length === 0) return null

  return (
    <div className={className} data-testid="support-materials-list">
      <h3 className="text-lg font-bold text-text-primary">Support Materials</h3>

      <ul className="mt-3 space-y-2">
        {materials.map((material, index) => (
          <li key={index} className="flex items-start gap-2">
            <LinkIcon
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary"
              aria-hidden="true"
            />
            <a
              href={material.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-primary hover:underline"
              data-testid={`support-material-link-${index}`}
            >
              {material.label}
              {material.fileType && (
                <span className="ml-1 text-sm text-text-muted">
                  ({material.fileType.toUpperCase()})
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
