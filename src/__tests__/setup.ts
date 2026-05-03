import '@testing-library/jest-dom/vitest'
import * as React from 'react'
import { vi } from 'vitest'

/**
 * Globally mock the locale-aware navigation helpers in tests. The real
 * `@/i18n/navigation` requires a NextIntlClientProvider in the React
 * tree, which our component unit tests don't set up. The mocks render
 * plain anchors so existing href / role assertions keep working — the
 * locale prefix runtime behavior is verified at the route + curl level,
 * not in unit tests.
 */
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href, ...rest }, children),
  TypedLink: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) =>
    React.createElement('a', { href, ...rest }, children),
  redirect: () => undefined,
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  getPathname: () => '/',
}))
