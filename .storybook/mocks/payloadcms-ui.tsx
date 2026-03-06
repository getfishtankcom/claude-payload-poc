/**
 * @description
 * Mock module for @payloadcms/ui in Storybook environment.
 * Provides stub implementations of Payload CMS hooks used by admin components.
 * Aliased in .storybook/main.ts via Vite resolve.alias.
 *
 * @notes
 * - Only hooks actually used by our admin components are mocked
 * - Mock data can be overridden per-story via PayloadMockProvider context
 * - React context is used to allow per-story customization of mock values
 */
import React, { createContext, useContext } from 'react'

// ── Mock Data Context ──────────────────────────────────────────────────────

interface MockUser {
  id: string
  role?: 'admin' | 'editor' | 'author'
  email?: string
  firstName?: string
  lastName?: string
  [key: string]: unknown
}

interface MockDocumentInfo {
  id?: string
  collectionSlug?: string
  [key: string]: unknown
}

interface PayloadMockContextValue {
  user: MockUser | null
  documentInfo: MockDocumentInfo
}

const defaultMockContext: PayloadMockContextValue = {
  user: {
    id: '1',
    role: 'admin',
    email: 'admin@frascanada.ca',
    firstName: 'Admin',
    lastName: 'User',
  },
  documentInfo: {
    id: '123',
    collectionSlug: 'pages',
  },
}

const PayloadMockContext = createContext<PayloadMockContextValue>(defaultMockContext)

// ── Provider for Stories ───────────────────────────────────────────────────

export const PayloadMockProvider: React.FC<{
  value?: Partial<PayloadMockContextValue>
  children: React.ReactNode
}> = ({ value, children }) => {
  const merged = {
    ...defaultMockContext,
    ...value,
    user: value?.user !== undefined ? value.user : defaultMockContext.user,
    documentInfo: { ...defaultMockContext.documentInfo, ...value?.documentInfo },
  }
  return (
    <PayloadMockContext.Provider value={merged}>
      {children}
    </PayloadMockContext.Provider>
  )
}

// ── Hook Mocks ─────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(PayloadMockContext)
  return {
    user: ctx.user,
    logOut: () => {},
    refreshCookie: () => {},
    setToken: () => {},
    token: 'mock-token',
    refreshCookieAsync: async () => {},
    permissions: {},
    strategy: 'local',
  }
}

export function useDocumentInfo() {
  const ctx = useContext(PayloadMockContext)
  return {
    id: ctx.documentInfo.id,
    collectionSlug: ctx.documentInfo.collectionSlug,
    globalSlug: undefined,
    title: 'Mock Document',
    slug: 'mock-document',
    ...ctx.documentInfo,
  }
}

// Re-export anything else components might reference
export function useLocale() {
  return { code: 'en', label: 'English' }
}

export function useConfig() {
  return {
    collections: [],
    globals: [],
    routes: { admin: '/admin', api: '/api' },
    serverURL: '',
  }
}

export function useTranslation() {
  return { t: (key: string) => key, i18n: { language: 'en' } }
}
