/**
 * @description
 * Barrel export of all block configurations for use in collection/global configs.
 * Import this array into any Payload collection or global that uses a blocks field.
 *
 * @notes
 * - Order here determines the order blocks appear in the admin panel block picker
 * - Each block is imported from its directory's config.ts file
 * - Add new blocks here as they're created in future epics
 */
import type { Block } from 'payload'

import { CTABlock } from './CTABlock/config'
import { ContentBlock } from './ContentBlock/config'
import { RichTextBlock } from './RichTextBlock/config'
import { NewsGridBlock } from './NewsGridBlock/config'
import { BrowseByStandardBlock } from './BrowseByStandardBlock/config'

export const blocks: Block[] = [
  CTABlock,
  ContentBlock,
  RichTextBlock,
  NewsGridBlock,
  BrowseByStandardBlock,
]

// Re-export individual blocks for direct imports
export { CTABlock, ContentBlock, RichTextBlock, NewsGridBlock, BrowseByStandardBlock }
