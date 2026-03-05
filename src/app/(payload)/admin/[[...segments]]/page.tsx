/**
 * @description
 * Catch-all page for the Payload CMS admin panel.
 * Handles all /admin/* routes including dashboard, collection views, etc.
 *
 * @dependencies
 * - @payloadcms/next: Provides RootPage and generatePageMetadata
 * - importMap: Auto-generated component map
 */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams })

export default Page
