/**
 * Regression test for QA-018 (#88).
 *
 * Pins the Clerk sign-in title override so it can't drift back to the
 * default "Sign in to My Application" copy. The override is consumed
 * by `<ClerkProvider localization={...}>` in the public layout —
 * Clerk v7 only respects `localization` at the provider level.
 */
import { describe, expect, it } from 'vitest'

import { BRAND } from '@/config/brand'
import { RAS_CLERK_LOCALIZATION } from './clerk-localization'

describe('RAS_CLERK_LOCALIZATION', () => {
  it('overrides the sign-in start title with the brand name', () => {
    expect(RAS_CLERK_LOCALIZATION.signIn.start.title).toBe(`Sign in to ${BRAND.name}`)
    expect(RAS_CLERK_LOCALIZATION.signIn.start.title).not.toContain('My Application')
  })

  it('declares a non-empty subtitle so the card is fully branded', () => {
    expect(RAS_CLERK_LOCALIZATION.signIn.start.subtitle.trim().length).toBeGreaterThan(0)
  })
})
