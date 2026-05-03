/**
 * Locks in the `payload.config.ts` registrations for the FRAS-branded
 * admin auth views. Issue #40 requires that the login page render the
 * brand logo + the "Sign in to <fullName>" headline; both flow through
 * Payload custom-component slots:
 *
 *   - admin.components.graphics.Logo  → BrandLogo
 *   - admin.components.beforeLogin    → [LoginIntro]
 *
 * If a future refactor drops either registration, the page silently
 * falls back to Payload's default chrome and the dogfood report will
 * surface the regression — but only after a real human notices. This
 * test catches it at CI time.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const CONFIG_PATH = join(process.cwd(), 'src/payload.config.ts')

describe('payload.config.ts — admin auth branding (#40)', () => {
  it('registers BrandLogo as the auth-page graphics.Logo', () => {
    const src = readFileSync(CONFIG_PATH, 'utf8')
    expect(src).toContain('graphics:')
    expect(src).toContain("Logo: '/admin/components/BrandLogo'")
  })

  it('registers LoginIntro under beforeLogin so the headline renders above the form', () => {
    const src = readFileSync(CONFIG_PATH, 'utf8')
    expect(src).toContain('beforeLogin:')
    expect(src).toContain("'/admin/components/LoginIntro'")
  })
})

describe('admin-tailwind.css — brand purple theming on auth pages (#40)', () => {
  it('themes Payload .template-minimal with brand purple', () => {
    const css = readFileSync(
      join(process.cwd(), 'src/app/(payload)/admin-tailwind.css'),
      'utf8',
    )
    // Auth views (login / forgot / reset) ship inside `.template-minimal`,
    // not `.template-default` — the latter is the authenticated-shell
    // wrapper and would leak the purple to every admin view.
    expect(css).toContain('.template-minimal')
    expect(css).toContain('var(--brand-fras)')
    // Defensive: the theming MUST NOT target .template-default, or the
    // whole admin chrome turns purple.
    expect(css).not.toMatch(/\.template-default\s+\.btn--style-primary/)
  })
})
