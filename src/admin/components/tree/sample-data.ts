/**
 * @description
 * Sample tree data + valid-child map for the AdminShell tree spine.
 * Covers the typical FRAS Canada hierarchy (boards, news, projects, etc.)
 * so the tree renders meaningful content during scaffolding before real
 * Payload-backed data lands.
 *
 * @notes
 * - Replace this with a real loader once `/api/tree` returns live data.
 * - Collection slugs match canonical names from CLAUDE.md "Canonical
 *   Collection Names" table.
 */

import type { TreeNode, ValidChildMap } from './types'

export const SAMPLE_TREE: TreeNode[] = [
  {
    id: 'home',
    slug: '',
    label: 'Home',
    collection: 'pages',
    workflow: 'published',
    hasFr: true,
    children: [
      {
        id: 'boards',
        slug: 'boards',
        label: 'Boards & Councils',
        collection: 'boards',
        workflow: 'published',
        hasFr: true,
        children: [
          {
            id: 'acsb',
            slug: 'acsb',
            label: 'AcSB',
            collection: 'board-detail',
            workflow: 'published',
            hasFr: true,
          },
          {
            id: 'aasb',
            slug: 'aasb',
            label: 'AASB',
            collection: 'board-detail',
            workflow: 'published',
            hasFr: false,
          },
          {
            id: 'psab',
            slug: 'psab',
            label: 'PSAB',
            collection: 'board-detail',
            workflow: 'in-review',
            hasFr: true,
          },
        ],
      },
      {
        id: 'news',
        slug: 'news',
        label: 'News',
        collection: 'news',
        workflow: 'published',
        hasFr: true,
        children: [
          {
            id: 'news-2026-q1',
            slug: 'q1-update',
            label: '2026 Q1 update',
            collection: 'news',
            workflow: 'draft',
            hasFr: false,
            locked: true,
          },
        ],
      },
      {
        id: 'projects',
        slug: 'active-projects',
        label: 'Active projects',
        collection: 'projects',
        workflow: 'published',
        hasFr: true,
        children: [
          {
            id: 'sustainability-2026',
            slug: 'sustainability-2026',
            label: 'Sustainability standards 2026',
            collection: 'projects',
            workflow: 'needs-revision',
            hasFr: true,
          },
        ],
      },
    ],
  },
]

export const SAMPLE_VALID_CHILDREN: ValidChildMap = {
  pages: ['pages', 'news', 'projects', 'boards'],
  boards: ['board-detail'],
  'board-detail': ['committees', 'board-members'],
  news: ['news'],
  projects: ['projects'],
}
