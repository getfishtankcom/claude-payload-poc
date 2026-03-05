/**
 * @description
 * Renders the Content block as a responsive multi-column grid.
 * Each column has a configurable width and rich text content.
 *
 * Key features:
 * - CSS grid with column size mapping (oneThird, half, twoThirds, full)
 * - Rich text rendered per column
 * - Optional link per column
 *
 * @dependencies
 * - Container from ui components
 * - CMSLink for optional column links
 *
 * @notes
 * - Full-width columns stack naturally
 * - Mixed sizes use CSS grid with 12-column system
 */
import React from 'react'

import { Container } from '@/components/ui'
import { CMSLink } from '@/components/CMSLink'

type Column = {
  size?: 'oneThird' | 'half' | 'twoThirds' | 'full' | null
  richText?: Record<string, unknown> | null
  link?: Record<string, unknown>
  id?: string
}

type ContentBlockProps = {
  columns?: Column[] | null
  blockType: 'content'
}

const sizeClasses: Record<string, string> = {
  oneThird: 'lg:col-span-4',
  half: 'lg:col-span-6',
  twoThirds: 'lg:col-span-8',
  full: 'lg:col-span-12',
}

export const ContentBlockComponent: React.FC<ContentBlockProps> = ({ columns }) => {
  if (!columns?.length) return null

  return (
    <div data-testid="block-content">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {columns.map((col, i) => {
            const colSize = sizeClasses[col.size || 'full'] || sizeClasses.full
            return (
              <div key={col.id || i} className={colSize}>
                {col.richText && (
                  <div className="prose max-w-none [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_p]:text-text-muted [&_p]:leading-relaxed">
                    <RichTextRenderer content={col.richText} />
                  </div>
                )}
                {col.link && (
                  <div className="mt-4">
                    <CMSLink {...col.link} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}

function RichTextRenderer({ content }: { content: Record<string, unknown> | null | undefined }) {
  if (!content) return null
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content }} />
  }
  return null
}
