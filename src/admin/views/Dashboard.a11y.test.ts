/**
 * @description
 * Structural a11y guards for the admin dashboard (#100 / QA-030). Pins
 * three regression-critical decisions made to clear axe-core violations:
 *
 *   1. The dashboard root is a `<main>` landmark with an aria-label, so
 *      screen-reader users can skip to main content (`landmark-one-main`).
 *   2. Each widget is wrapped in `<WidgetCard>` which renders `<section>`
 *      with an aria-label, so every dashboard widget contributes a region
 *      landmark (`region`).
 *   3. None of the widget files reference Payload's `var(--theme-elevation-*)`
 *      tokens for **text colors** — those have low contrast against white
 *      and were the source of the 15 `color-contrast` failures. Admin-shell
 *      tokens (`--text-primary`, `--text-secondary`, `--text-muted`,
 *      `--workflow-*`) are designed with known-passing contrast.
 *
 * Treats the source files as strings rather than rendering — the contrast
 * fix is structural (no Payload elevation token references) and we want
 * to lock that in so future refactors don't reintroduce them silently.
 */

import * as fs from 'node:fs'
import * as path from 'node:path'
import { describe, expect, it } from 'vitest'

const ADMIN_ROOT = path.resolve(__dirname, '..')

const read = (rel: string): string =>
  fs.readFileSync(path.join(ADMIN_ROOT, rel), 'utf8')

const WIDGET_SOURCE_FILES = [
  'components/widgets/WidgetCard.tsx',
  'components/widgets/QuickActionsWidget.tsx',
  'components/widgets/WorkflowQueueWidget.tsx',
  'components/widgets/RecentItemsWidget.tsx',
  'components/widgets/PublishingScheduleWidget.tsx',
  'components/widgets/PinnedItemsWidget.tsx',
]

describe('Dashboard a11y guards (#100)', () => {
  it('renders the dashboard root as a <main> landmark with an aria-label', () => {
    const src = read('views/DashboardClient.tsx')
    expect(src).toMatch(/<main\b[^>]*aria-label=/)
    // Closing tag pairs the opening one — guards against an accidental
    // <main> -> <div> swap during a future cleanup.
    expect(src).toContain('</main>')
  })

  it('wraps every widget in a <section> with an aria-label (region landmark)', () => {
    const src = read('components/widgets/WidgetCard.tsx')
    expect(src).toMatch(/<section\b[^>]*aria-label=/)
  })

  it.each(WIDGET_SOURCE_FILES)(
    '%s does not paint text with a Payload elevation token (low contrast)',
    (relPath) => {
      const src = read(relPath)
      // It is fine for surfaces / borders to mention elevation tokens, but
      // text colors must use the admin-shell `--text-*` family which is
      // contrast-vetted on the dashboard background. The fix replaced every
      // such usage; this assertion stops them coming back.
      const colorTokenLines = src
        .split('\n')
        .filter(
          (line) =>
            line.includes('color:') && line.includes('--theme-elevation-'),
        )
      expect(colorTokenLines).toEqual([])
    },
  )

  it('uses brand workflow tokens (not literal hex) for the queue state colors', () => {
    const src = read('components/widgets/WorkflowQueueWidget.tsx')
    // The state-color lookup must point at admin-shell workflow tokens.
    // Original literals (#3b82f6 / #f59e0b / #22c55e) failed AA on white
    // at 11px — re-derive contrast via tokens instead.
    expect(src).toContain('var(--workflow-review)')
    expect(src).toContain('var(--workflow-revision)')
    expect(src).toContain('var(--workflow-approved)')
    // Don't allow the originals to come back into the lookup itself. We
    // strip code comments before scanning so historical-context comments
    // can keep referring to the old hex values.
    const codeOnly = src
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('//'))
      .join('\n')
      .replace(/\/\*[\s\S]*?\*\//g, '')
    expect(codeOnly).not.toContain('#3b82f6')
    expect(codeOnly).not.toContain('#f59e0b')
    expect(codeOnly).not.toContain('#22c55e')
  })
})
