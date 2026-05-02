/**
 * @description
 * Document/resource links sidebar widget for Board Detail and Project Detail pages.
 * Renders a list of resources with file type icons and download/navigation behavior.
 *
 * Key features:
 * - File type icons: PDF, Word, Link, Video
 * - PDF/Word resources trigger download or open in new tab
 * - External URLs open in new tab
 * - Data from board.resources[] CMS array
 *
 * @dependencies
 * - @heroicons/react: DocumentIcon, LinkIcon, VideoCameraIcon for file type indicators
 *
 * @notes
 * - Server component (no interactivity)
 * - Empty state: section hidden when no resources
 */
import React from 'react'
import {
  DocumentTextIcon,
  DocumentIcon,
  LinkIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline'

export type ResourceItem = {
  /** Resource display title */
  title: string
  /** File URL or external link */
  file_url: string
  /** File type for icon selection */
  type?: 'pdf' | 'word' | 'link' | 'video' | null
}

type ResourcesListProps = {
  /** Resources from CMS board.resources array */
  resources: ResourceItem[]
  /** Section heading */
  heading?: string
  className?: string
}

/** File type icon mapping */
const typeIcons: Record<string, React.FC<{ className?: string }>> = {
  pdf: DocumentTextIcon,
  word: DocumentIcon,
  link: LinkIcon,
  video: VideoCameraIcon,
}

function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

export function ResourcesList({
  resources,
  heading = 'Resources',
  className = '',
}: ResourcesListProps) {
  if (resources.length === 0) return null

  return (
    <div className={`${className}`.trim()} data-testid="resources-list">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-text-heading">
        {heading}
      </h3>
      <ul className="space-y-2" role="list">
        {resources.map((resource, index) => {
          const IconComponent = typeIcons[resource.type || 'link'] || LinkIcon
          const external = isExternalUrl(resource.file_url)

          return (
            <li key={`${resource.file_url}-${index}`}>
              <a
                href={resource.file_url}
                className="flex items-center gap-2.5 rounded-sm px-2 py-2 text-sm text-primary transition-colors hover:bg-gray-50 hover:text-primary-vivid"
                {...(external || resource.type === 'pdf' || resource.type === 'word'
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                data-testid="resource-link"
              >
                <IconComponent className="h-5 w-5 flex-shrink-0 text-text-muted" aria-hidden="true" />
                <span>{resource.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
