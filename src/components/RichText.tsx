/**
 * @description
 * Wrapper around Payload's Lexical RichText component for rendering
 * CMS rich text content. Handles null/undefined content gracefully.
 *
 * @dependencies
 * - @payloadcms/richtext-lexical/react: RichText component + default converters
 *
 * @notes
 * - Server component — can be imported in both server and client components
 * - Accepts the Lexical JSON format stored by Payload CMS
 * - Uses default JSX converters for headings, paragraphs, lists, links, etc.
 */
import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type RichTextProps = {
  content: SerializedEditorState | null | undefined
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  if (!content) return null

  return (
    <div className={className}>
      <PayloadRichText data={content} />
    </div>
  )
}
