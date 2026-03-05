/**
 * @description
 * Document row component for the Documents for Comment listing.
 * Shows document title as a purple link with conditional action buttons
 * based on open/closed status.
 *
 * Key features:
 * - Title as purple link to document detail page
 * - "Submit comment" button shown only for open documents
 * - "View Comments" PDF link shown only for closed documents (when URL exists)
 * - Mobile: button stacks below title
 *
 * @dependencies
 * - next/link: Client-side navigation
 * - Design tokens: --color-primary, --color-link
 *
 * @notes
 * - Server component — no client-side state
 * - Button styling matches dark purple fill from wireframe spec
 */
import Link from 'next/link'

type DocumentRowData = {
  /** Document title */
  title: string
  /** Link to document detail page */
  href: string
  /** Link to comment submission page/form (open docs only) */
  commentSubmitUrl?: string
  /** Link to comments PDF (closed docs only) */
  commentsPdfUrl?: string
  /** Document status: open or closed for comment */
  status: 'open' | 'closed'
}

type DocumentRowProps = {
  /** Document data */
  document: DocumentRowData
  className?: string
}

export function DocumentRow({ document, className = '' }: DocumentRowProps) {
  const { title, href, commentSubmitUrl, commentsPdfUrl, status } = document

  return (
    <div
      className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}
      data-testid="document-row"
    >
      {/* Title link */}
      <Link
        href={href}
        className="text-base font-semibold text-primary hover:underline"
        data-testid="document-row-title"
      >
        {title}
      </Link>

      {/* Action buttons */}
      <div className="flex-shrink-0">
        {status === 'open' && commentSubmitUrl && (
          <Link
            href={commentSubmitUrl}
            className="inline-flex items-center rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-vivid transition-colors duration-150"
            data-testid="document-row-submit"
          >
            Submit comment
          </Link>
        )}

        {status === 'closed' && commentsPdfUrl && (
          <a
            href={commentsPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            data-testid="document-row-view-comments"
          >
            {/* PDF icon */}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            View Comments
          </a>
        )}
      </div>
    </div>
  )
}
