/**
 * @description
 * CPA Canada shared authentication explanation block.
 * Rich text explaining that auth is via CPA Canada (Aptify DB API),
 * with a link to cpacanada.ca login.
 *
 * Key features:
 * - Rich text content explaining shared CPA auth
 * - External link to CPA Canada login (opens in new tab)
 * - All content from auth-config global
 *
 * @dependencies
 * - RichText: Lexical rich text renderer (optional — can use dangerouslySetInnerHTML)
 *
 * @notes
 * - cpaLoginUrl opens in new tab with rel="noopener noreferrer"
 * - Content is rich text from CMS, but we render a simplified version
 *   since Lexical serialized data requires the RichText renderer
 */
import React from 'react'

type CpaExplanationBlockProps = {
  /** Rich text content (rendered as HTML string for simplicity) */
  content: React.ReactNode
  /** URL to CPA Canada login page */
  cpaLoginUrl?: string
  'data-testid'?: string
}

export function CpaExplanationBlock({
  content,
  cpaLoginUrl,
  ...props
}: CpaExplanationBlockProps) {
  return (
    <section
      data-testid={props['data-testid'] || 'cpa-explanation-block'}
      className="flex flex-col gap-3 text-base text-text-secondary"
    >
      <div className="prose prose-sm max-w-none">{content}</div>
      {cpaLoginUrl && (
        <a
          href={cpaLoginUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary-vivid underline"
        >
          CPA Canada Login →
        </a>
      )}
    </section>
  )
}
