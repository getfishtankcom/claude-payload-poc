/**
 * @description
 * Seed script for the content tree hierarchy (Epic 23).
 * Creates the base tree structure with root, board folders, and content folders.
 *
 * Tree structure:
 * - FRAS Canada (root, folder)
 *   - Home (page)
 *   - Boards (folder)
 *     - AcSB (page, linked to AcSB board)
 *       - About (page)
 *       - Members (page)
 *     - PSAB (page, linked to PSAB board)
 *       - About (page)
 *       - Members (page)
 *     - CSSB (page, linked to CSSB board)
 *     - AASB (page, linked to AASB board)
 *     - RASOC (page, linked to RASOC board)
 *   - Projects (folder)
 *     - IFRS S1 Sustainability (project)
 *     - ASPE Review (project)
 *   - News (folder)
 *     - Sample News 1 (news)
 *     - Sample News 2 (news)
 *   - Consultations (folder)
 *   - Events (folder)
 *   - Documents (folder)
 *   - Members (folder)
 *   - Settings (settings)
 *   - Data (folder)
 *     - Contacts (folder)
 *     - Standards (folder)
 *
 * @dependencies
 * - payload: Local API for creating pages
 * - Boards collection must be seeded first (for board relationships)
 *
 * @notes
 * - Run via: npx tsx src/seed/seed-tree.ts
 * - Only creates tree structure pages — does NOT delete existing content
 * - Designed to run after main seed script
 * - Uses contentType field to set tree icons
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

/** Helper to create a tree node (page) with tree-specific fields */
async function createTreeNode(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: {
    title: string
    slug: string
    contentType: string
    parent?: string | number | null
    sortOrder: number
    board?: string | number | null
    workflowState?: string
  },
): Promise<string | number> {
  const doc = await payload.create({
    collection: 'pages',
    data: {
      title: data.title,
      slug: data.slug,
      contentType: data.contentType,
      parent: data.parent || null,
      sortOrder: data.sortOrder,
      board: data.board || null,
      workflowState: data.workflowState || 'published',
    },
  })
  return doc.id
}

export async function seedTree() {
  const payload = await getPayload({ config })
  console.log('\n--- Seeding Content Tree (Epic 23) ---\n')

  // Look up existing boards for linking
  const boardsResult = await payload.find({
    collection: 'boards',
    limit: 10,
    depth: 0,
  })

  const boardMap: Record<string, string | number> = {}
  for (const board of boardsResult.docs) {
    const slug = (board.slug as string) || ''
    boardMap[slug] = board.id
  }

  console.log(`  Found ${Object.keys(boardMap).length} boards: ${Object.keys(boardMap).join(', ')}`)

  // Delete existing tree pages (pages with contentType set) to make this idempotent
  try {
    await payload.delete({
      collection: 'pages',
      where: {
        contentType: { exists: true },
      },
    })
    console.log('  Cleared existing tree pages')
  } catch {
    // May not have any tree pages yet
  }

  // --- Level 0: Root ---
  const root = await createTreeNode(payload, {
    title: 'FRAS Canada',
    slug: 'fras-canada-root',
    contentType: 'folder',
    sortOrder: 0,
  })
  console.log(`  Root: FRAS Canada (${root})`)

  // --- Level 1: Top-level sections ---
  const home = await createTreeNode(payload, {
    title: 'Home',
    slug: 'home',
    contentType: 'page',
    parent: root,
    sortOrder: 0,
  })

  const boardsFolder = await createTreeNode(payload, {
    title: 'Boards',
    slug: 'boards-folder',
    contentType: 'folder',
    parent: root,
    sortOrder: 1,
  })

  const projectsFolder = await createTreeNode(payload, {
    title: 'Projects',
    slug: 'projects-folder',
    contentType: 'folder',
    parent: root,
    sortOrder: 2,
  })

  const newsFolder = await createTreeNode(payload, {
    title: 'News',
    slug: 'news-folder',
    contentType: 'folder',
    parent: root,
    sortOrder: 3,
  })

  const consultationsFolder = await createTreeNode(payload, {
    title: 'Consultations',
    slug: 'consultations-folder',
    contentType: 'folder',
    parent: root,
    sortOrder: 4,
  })

  const eventsFolder = await createTreeNode(payload, {
    title: 'Events',
    slug: 'events-folder',
    contentType: 'folder',
    parent: root,
    sortOrder: 5,
  })

  const documentsFolder = await createTreeNode(payload, {
    title: 'Documents',
    slug: 'documents-folder',
    contentType: 'folder',
    parent: root,
    sortOrder: 6,
  })

  const membersFolder = await createTreeNode(payload, {
    title: 'Members',
    slug: 'members-folder',
    contentType: 'folder',
    parent: root,
    sortOrder: 7,
  })

  const settingsNode = await createTreeNode(payload, {
    title: 'Settings',
    slug: 'settings-node',
    contentType: 'settings',
    parent: root,
    sortOrder: 8,
  })

  const dataFolder = await createTreeNode(payload, {
    title: 'Data',
    slug: 'data-folder',
    contentType: 'folder',
    parent: root,
    sortOrder: 9,
  })

  console.log(`  Level 1: Home, Boards, Projects, News, Consultations, Events, Documents, Members, Settings, Data`)

  // --- Level 2: Board pages under Boards folder ---
  const boardSlugs = ['acsb', 'psab', 'cssb', 'aasb', 'rasoc']
  const boardNames = ['AcSB', 'PSAB', 'CSSB', 'AASB', 'RASOC']
  const boardPageIds: Record<string, string | number> = {}

  for (let i = 0; i < boardSlugs.length; i++) {
    const boardSlug = boardSlugs[i]
    const boardId = boardMap[boardSlug] || null
    const pageId = await createTreeNode(payload, {
      title: boardNames[i],
      slug: `board-${boardSlug}`,
      contentType: 'page',
      parent: boardsFolder,
      sortOrder: i,
      board: boardId,
    })
    boardPageIds[boardSlug] = pageId
  }
  console.log(`  Level 2: Board pages created (${boardSlugs.length})`)

  // --- Level 3: Sub-pages under AcSB and PSAB ---
  await createTreeNode(payload, {
    title: 'About AcSB',
    slug: 'acsb-about',
    contentType: 'page',
    parent: boardPageIds['acsb'],
    sortOrder: 0,
    board: boardMap['acsb'] || null,
  })
  await createTreeNode(payload, {
    title: 'AcSB Members',
    slug: 'acsb-members',
    contentType: 'page',
    parent: boardPageIds['acsb'],
    sortOrder: 1,
    board: boardMap['acsb'] || null,
  })
  await createTreeNode(payload, {
    title: 'About PSAB',
    slug: 'psab-about',
    contentType: 'page',
    parent: boardPageIds['psab'],
    sortOrder: 0,
    board: boardMap['psab'] || null,
  })
  await createTreeNode(payload, {
    title: 'PSAB Members',
    slug: 'psab-members',
    contentType: 'page',
    parent: boardPageIds['psab'],
    sortOrder: 1,
    board: boardMap['psab'] || null,
  })
  console.log('  Level 3: Sub-pages under AcSB and PSAB')

  // --- Level 2: Sample items in content folders ---
  await createTreeNode(payload, {
    title: 'IFRS S1 Sustainability Disclosure',
    slug: 'project-ifrs-s1',
    contentType: 'project',
    parent: projectsFolder,
    sortOrder: 0,
  })
  await createTreeNode(payload, {
    title: 'ASPE Review',
    slug: 'project-aspe-review',
    contentType: 'project',
    parent: projectsFolder,
    sortOrder: 1,
  })

  await createTreeNode(payload, {
    title: 'New Sustainability Standards Published',
    slug: 'news-sustainability-standards',
    contentType: 'news',
    parent: newsFolder,
    sortOrder: 0,
    workflowState: 'published',
  })
  await createTreeNode(payload, {
    title: 'Board Appointments for 2026',
    slug: 'news-board-appointments',
    contentType: 'news',
    parent: newsFolder,
    sortOrder: 1,
    workflowState: 'draft',
  })
  await createTreeNode(payload, {
    title: 'PSAB Consultation on Public Sector Standards',
    slug: 'news-psab-consultation',
    contentType: 'news',
    parent: newsFolder,
    sortOrder: 2,
    workflowState: 'in_review',
  })

  await createTreeNode(payload, {
    title: 'Exposure Draft — Revenue Recognition',
    slug: 'consultation-revenue-recognition',
    contentType: 'document',
    parent: consultationsFolder,
    sortOrder: 0,
  })

  await createTreeNode(payload, {
    title: 'AcSB Board Meeting — March 2026',
    slug: 'event-acsb-march',
    contentType: 'event',
    parent: eventsFolder,
    sortOrder: 0,
  })
  await createTreeNode(payload, {
    title: 'CSSB Webinar: Climate Disclosure',
    slug: 'event-cssb-webinar',
    contentType: 'event',
    parent: eventsFolder,
    sortOrder: 1,
  })

  // Data sub-folders
  await createTreeNode(payload, {
    title: 'Contacts',
    slug: 'data-contacts',
    contentType: 'folder',
    parent: dataFolder,
    sortOrder: 0,
  })
  await createTreeNode(payload, {
    title: 'Standards',
    slug: 'data-standards',
    contentType: 'folder',
    parent: dataFolder,
    sortOrder: 1,
  })

  console.log('  Level 2: Sample content items in folders')
  console.log('\n--- Tree seeding complete! ---\n')

  // Summary
  const totalPages = await payload.count({ collection: 'pages' })
  console.log(`  Total pages in database: ${totalPages.totalDocs}`)
}

// Auto-run when executed directly
const isDirectRun = typeof process !== 'undefined' && process.argv[1]?.includes('seed-tree')
if (isDirectRun) {
  seedTree()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Tree seed failed:', err)
      process.exit(1)
    })
}
