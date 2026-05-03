/**
 * Locks in `WorkflowActionBarField` registration across every workflow-
 * enabled collection that already has a `beforeDocumentControls` block.
 *
 * Regression guard for issue #83 (QA-013): News (and 8 other collections)
 * imported `workflowFields` and ran the workflow hooks, but their edit
 * views never registered the `WorkflowActionBarField` Payload custom
 * component. Authors saw Compare versions / Translate to FR / Save in the
 * action bar but no Submit for Review / Approve / Publish — the only path
 * to advance state was the obscure "Workflow State" select on the right
 * rail.
 *
 * If a future refactor drops the registration from any of these
 * collections, this test fails before the QA pass even runs.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const COLLECTIONS_DIR = join(process.cwd(), 'src/collections')
const COMPONENT_PATH = '/admin/components/WorkflowActionBarField'

/**
 * Every collection that ships workflow fields. The 10 with an existing
 * `beforeDocumentControls` block were wired in the original #83 PR; the
 * follow-up adds BoardMembers (had `components.beforeListTable` only)
 * and JobPostings (no `components` block at all). All 12 workflow-enabled
 * collections now show the action bar in their per-doc edit view.
 */
const COLLECTIONS_WITH_CONTROLS = [
  'Pages.ts',
  'News.ts',
  'Projects.ts',
  'Events.ts',
  'Consultations.ts',
  'Documents.ts',
  'Resources.ts',
  'Committees.ts',
  'DocumentsForComment.ts',
  'DocumentDetails.ts',
  'BoardMembers.ts',
  'JobPostings.ts',
] as const

describe('WorkflowActionBarField registration', () => {
  it.each(COLLECTIONS_WITH_CONTROLS)(
    '%s registers WorkflowActionBarField in beforeDocumentControls',
    (filename) => {
      const src = readFileSync(join(COLLECTIONS_DIR, filename), 'utf8')
      expect(src).toContain('beforeDocumentControls')
      expect(src).toContain(COMPONENT_PATH)
    },
  )

  it('keeps the import path stable so the Payload component-map resolves it', () => {
    // The Payload component-map resolves these path strings against the
    // configured admin importMap. Don't rename without regenerating the map.
    expect(COMPONENT_PATH).toBe('/admin/components/WorkflowActionBarField')
  })
})
