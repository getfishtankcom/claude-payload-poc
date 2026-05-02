/**
 * @description
 * Root layout for the Payload CMS admin panel route group.
 * Imports RootLayout from @payloadcms/next/layouts which handles
 * the <html> and <body> tags, admin theme, and Payload providers.
 *
 * @dependencies
 * - @payloadcms/next: Provides RootLayout component
 * - importMap: Auto-generated file mapping Payload admin components
 */
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import './admin-tailwind.css'
import './custom.scss'
import { importMap } from './admin/importMap.js'
import { QueryProvider } from '../../admin/providers/QueryProvider'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    <QueryProvider>{children}</QueryProvider>
  </RootLayout>
)

export default Layout
