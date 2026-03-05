/**
 * @description
 * Reusable empty state component for conditional-content pages.
 * Renders an italic message when no items exist in a listing.
 *
 * Key features:
 * - Italic text styling for empty state messaging
 * - Accepts rich text (HTML string) or plain string
 * - Used by Template 17 (jobs) and potentially other listing pages
 *
 * @dependencies
 * - None (standalone presentational component)
 *
 * @notes
 * - Message content comes from CMS (pages.emptyStateMessage field)
 * - No interactive elements in empty state
 */

export type EmptyStateProps = {
  /** Message to display — can be HTML string or plain text */
  message: string
  /** Whether the message is HTML (uses dangerouslySetInnerHTML) */
  isHtml?: boolean
}

export function EmptyState({ message, isHtml = false }: EmptyStateProps) {
  if (!message) return null

  return (
    <div data-testid="empty-state" className="py-6">
      {isHtml ? (
        <div
          className="text-sm italic text-text-muted prose prose-sm"
          dangerouslySetInnerHTML={{ __html: message }}
        />
      ) : (
        <p className="text-sm italic text-text-muted">{message}</p>
      )}
    </div>
  )
}
