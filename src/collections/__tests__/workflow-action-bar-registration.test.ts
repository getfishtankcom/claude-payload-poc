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
 * Every collection that ships workflow fields AND already has a
 * `beforeDocumentControls` block. Boards-Members and Job-Postings import
 * workflowFields but don't have a controls block at all — that's a wider
 * refactor and intentionally out of scope here (noted in the PR body).
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
