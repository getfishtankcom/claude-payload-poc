/**
 * @description
 * Renders the RichText block as a prose-styled content section.
 *
 * Key features:
 * - Prose styling with max-width for readability
 * - Centered content within Container
 *
 * @dependencies
 * - Container from ui components
 *
 * @notes
 * - Simplest block renderer — just wraps rich text in prose styles
 */
import React from 'react'

import { Container } from '@/components/ui'
import { RichText } from '@/components/RichText'

type RichTextBlockProps = {
  richText?: Record<string, unknown> | null
  blockType: 'richText'
}

export const RichTextBlockComponent: React.FC<RichTextBlockProps> = ({ richText }) => {
  if (!richText) return null

  return (
    <div data-testid="block-rich-text">
      <Container>
        <div className="mx-auto max-w-3xl prose [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_p]:text-text-muted [&_p]:leading-relaxed">
          <RichText content={richText} />
        </div>
      </Container>
    </div>
  )
}

