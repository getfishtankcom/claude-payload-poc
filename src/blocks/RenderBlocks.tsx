/**
 * @description
 * Block type → component mapper. Iterates the blocks array from a page/global
 * layout field and renders the matching component for each block's blockType.
 *
 * Key features:
 * - Simple slug → Component mapping object
 * - Unknown block types silently return null (no crash)
 * - Each block wrapped in a spacing div
 * - Spreads block data as props to the component
 *
 * @dependencies
 * - All block Component files from src/blocks/{block-type}/Component.tsx
 *
 * @notes
 * - Follows official Payload website template RenderBlocks pattern
 * - Add new block components here as they're created in future epics
 * - LayoutBlock type comes from payload-types.ts
 */
import React from 'react'

import type { LayoutBlock } from '@/payload-types'

import { CTABlockComponent } from './CTABlock/Component'
import { ContentBlockComponent } from './ContentBlock/Component'
import { RichTextBlockComponent } from './RichTextBlock/Component'
import { NewsGridBlockComponent } from './NewsGridBlock/Component'
import { BrowseByStandardBlockComponent } from './BrowseByStandardBlock/Component'

const blockComponents: Record<string, React.FC<Record<string, unknown>>> = {
  cta: CTABlockComponent as React.FC<Record<string, unknown>>,
  content: ContentBlockComponent as React.FC<Record<string, unknown>>,
  richText: RichTextBlockComponent as React.FC<Record<string, unknown>>,
  newsGrid: NewsGridBlockComponent as React.FC<Record<string, unknown>>,
  browseByStandard: BrowseByStandardBlockComponent as React.FC<Record<string, unknown>>,
}

type RenderBlocksProps = {
  blocks: LayoutBlock[] | null | undefined
}

export const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks }) => {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        const { blockType } = block
        const BlockComponent = blockComponents[blockType]

        if (!BlockComponent) return null

        return (
          <div className="my-16 first:mt-0" key={index}>
            <BlockComponent {...(block as unknown as Record<string, unknown>)} />
          </div>
        )
      })}
    </>
  )
}
