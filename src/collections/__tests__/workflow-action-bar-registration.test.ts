/**
 * Locks in `WorkflowActionBarField` registration across every workflow-
 * enabled collection.
 *
 * Regression guard for issue #83 (QA-013): News (and 8 other collections)
 * imported `workflowFields` and ran the workflow hooks, but their edit
 * views never registered the `WorkflowActionBarField` Payload custom
 * component. Authors saw Compare versions / Translate to FR / Save in the
 * action bar but no Submit for Review / Approve / Publish.
 *
 * Two-layer guard:
 *   1. Every workflow collection opts into the chrome via `withWorkflow`.
 *   2. The factory itself wires `WorkflowActionBarField` into
 *      `beforeDocumentControls`.
 *
 * If a future refactor drops the opt-in OR breaks the factory, this test
 * fails before the QA pass even runs.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it, vi } from 'vitest'

const COLLECTIONS_DIR = join(process.cwd(), 'src/collections')
const COMPONENT_PATH = '/admin/components/WorkflowActionBarField'

/** Every collection that ships workflow fields via `withWorkflow`. */
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
  it.each(COLLECTIONS_WITH_CONTROLS)('%s opts into withWorkflow()', (filename) => {
    const src = readFileSync(join(COLLECTIONS_DIR, filename), 'utf8')
    expect(src).toContain("from './_lib/with-workflow'")
    expect(src).toContain('withWorkflow(')
  })

  it('withWorkflow injects WorkflowActionBarField into beforeDocumentControls', async () => {
    // Stub the heavier deps so the factory module loads without a Payload runtime.
    vi.doMock('@/search', () => ({
      getSearchProvider: () => ({
        getSyncHooks: () => ({ afterChange: () => undefined, afterDelete: () => undefined }),
      }),
    }))
    vi.doMock('@/admin/hooks/workflow-hooks', () => ({
      validateWorkflowTransition: () => undefined,
      createLogWorkflowTransition: () => () => undefined,
    }))
    vi.doMock('@/access/roles', () => ({
      contentRead: () => true,
      contentCreate: () => true,
      contentUpdate: () => true,
      contentDelete: () => true,
    }))
    vi.doMock('@/fields/workflow', () => ({ workflowFields: [] }))

    const { withWorkflow } = await import('../_lib/with-workflow')
    const config = withWorkflow({ slug: 'news', fields: [] })

    expect(config.admin?.components?.edit?.beforeDocumentControls).toContain(COMPONENT_PATH)
  })

  it('keeps the import path stable so the Payload component-map resolves it', () => {
    // The Payload component-map resolves these path strings against the
    // configured admin importMap. Don't rename without regenerating the map.
    expect(COMPONENT_PATH).toBe('/admin/components/WorkflowActionBarField')
  })
})
