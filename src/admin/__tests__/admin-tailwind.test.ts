/**
 * @description
 * Structural tests for `admin-tailwind.css`. The stylesheet is loaded by
 * the Payload route group and we rely on a few specific selectors to
 * suppress upstream chrome bugs (e.g. the Payload Localizer rendering
 * `Locale: undefined` on unresolved routes — see issue #71 / QA-001).
 * These tests pin those selectors so a future cleanup pass doesn't drop
 * them silently.
 *
 * @notes
 * - jsdom's CSS engine does not parse Tailwind layer directives or modern
 *   `@theme inline {}` syntax, so we treat the file as a string and grep
 *   for the regression-critical rules. Cheap, deterministic, and fast.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { describe, expect, it } from 'vitest'

const CSS_PATH = path.resolve(
  __dirname,
  '../../app/(payload)/admin-tailwind.css',
)

const css = fs.readFileSync(CSS_PATH, 'utf8')

describe('admin-tailwind.css regression guards', () => {
  it('hides the Payload Localizer chrome when no locale is resolved (#71)', () => {
    expect(css).toMatch(/\.localizer-button:not\(\[data-locale\]\)\s*\{[^}]*display:\s*none/)
  })

  it('keeps the WCAG 2.2 §2.4.11 focus ring rule intact', () => {
    expect(css).toMatch(/\*:focus-visible\s*\{[^}]*outline:\s*2px\s+solid\s+var\(--focus-ring\)/)
  })

  it('exposes every workflow-state token on :root', () => {
    for (const token of [
      '--workflow-draft',
      '--workflow-review',
      '--workflow-revision',
      '--workflow-approved',
      '--workflow-published',
    ]) {
      expect(css).toContain(token)
    }
  })
})
