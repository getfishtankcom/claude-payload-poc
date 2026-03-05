/**
 * @description
 * 404 handler for the Payload CMS admin panel.
 * Renders Payload's built-in NotFoundPage component.
 *
 * @dependencies
 * - @payloadcms/next: Provides NotFoundPage and generatePageMetadata
 * - importMap: Auto-generated component map
 */
import type { Metadata } from 'next'

import config from '@payload-config'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'
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

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, importMap, params, searchParams })

export default NotFound
