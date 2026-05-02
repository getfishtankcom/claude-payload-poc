/**
 * @description
 * Realistic content tree seed based on Sitecore dump analysis.
 * Creates ~95 pages mirroring the actual frascanada.ca site hierarchy
 * with 5 levels of nesting across boards, standards, news, events, etc.
 *
 * Tree mirrors the Sitecore content-tree.md structure at ~7% coverage
 * (95 of ~1,400 real items) — enough to test tree navigation, nesting,
 * drag-and-drop, and right-click context menus.
 *
 * @dependencies
 * - payload: Local API for creating pages
 * - Boards collection must be seeded first (for board relationships)
 *
 * @notes
 * - Run via: npx tsx src/seed/seed-tree.ts
 * - Deletes existing tree pages (contentType exists) before seeding
 * - Designed to run after main seed script
 * - Mixed workflow states for realistic Workflow Queue widget testing
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

type Payload = Awaited<ReturnType<typeof getPayload>>
type ID = string | number

/** Helper to create a tree node (page) with tree-specific fields */
async function node(
  payload: Payload,
  data: {
    title: string
    slug: string
    contentType: string
    parent?: ID | null
    sortOrder: number
    board?: ID | null
    workflowState?: string
  },
): Promise<ID> {
  // Create as draft first (workflow hook requires it)
  const doc = await payload.create({
    collection: 'pages',
    draft: true,
    data: {
      title: data.title,
      slug: data.slug,
      contentType: data.contentType as 'page' | 'folder' | 'news' | 'project' | 'event' | 'document' | 'media' | 'settings',
      parent: (data.parent || null) as number | null,
      sortOrder: data.sortOrder,
      board: (data.board || null) as number | null,
      workflowState: 'draft',
    },
    context: { skipWorkflowValidation: true, skipWorkflowLogging: true },
  })
  // If a non-draft state is desired, update directly (bypass workflow validation)
  const desiredState = data.workflowState || 'published'
  if (desiredState !== 'draft') {
    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: { workflowState: desiredState as 'draft' | 'in_review' | 'needs_revision' | 'approved' | 'published' | 'unpublished' },
      context: { skipWorkflowValidation: true, skipWorkflowLogging: true },
    })
  }
  return doc.id
}

export async function seedTree() {
  const payload = await getPayload({ config })
  console.log('\n=== Seeding Realistic Content Tree (Sitecore-based) ===\n')

  // Look up existing boards for linking
  const boardsResult = await payload.find({ collection: 'boards', limit: 10, depth: 0 })
  const bm: Record<string, ID> = {}
  for (const b of boardsResult.docs) bm[(b.slug as string) || ''] = b.id
  console.log(`  Boards found: ${Object.keys(bm).join(', ')}`)

  // Clear existing tree pages for idempotency
  try {
    await payload.delete({ collection: 'pages', where: { contentType: { exists: true } } })
    console.log('  Cleared existing tree pages')
  } catch { /* no existing tree pages */ }

  // ────────────────────────────────────────────
  // Level 0: Root
  // ────────────────────────────────────────────
  const root = await node(payload, { title: 'RAS Canada', slug: 'fras-canada-root', contentType: 'folder', sortOrder: 0 })

  // ────────────────────────────────────────────
  // Level 1: Top-level sections
  // ────────────────────────────────────────────
  const home = await node(payload, { title: 'Home', slug: 'home', contentType: 'page', parent: root, sortOrder: 0 })
  const boardsF = await node(payload, { title: 'Boards & Councils', slug: 'boards', contentType: 'folder', parent: root, sortOrder: 1 })
  const standardsF = await node(payload, { title: 'Standards', slug: 'standards', contentType: 'folder', parent: root, sortOrder: 2 })
  const newsF = await node(payload, { title: 'News', slug: 'news-folder', contentType: 'folder', parent: root, sortOrder: 3 })
  const eventsF = await node(payload, { title: 'Events & Meetings', slug: 'events-folder', contentType: 'folder', parent: root, sortOrder: 4 })
  const consultF = await node(payload, { title: 'Consultations', slug: 'consultations-folder', contentType: 'folder', parent: root, sortOrder: 5 })
  const resourcesF = await node(payload, { title: 'Resources', slug: 'resources-folder', contentType: 'folder', parent: root, sortOrder: 6 })
  const aboutF = await node(payload, { title: 'About', slug: 'about-folder', contentType: 'folder', parent: root, sortOrder: 7 })
  const contactF = await node(payload, { title: 'Contact', slug: 'contact-folder', contentType: 'folder', parent: root, sortOrder: 8 })
  const accountF = await node(payload, { title: 'My Account', slug: 'my-account-folder', contentType: 'folder', parent: root, sortOrder: 9 })
  const policiesF = await node(payload, { title: 'Policies', slug: 'policies-folder', contentType: 'folder', parent: root, sortOrder: 10 })
  const settingsN = await node(payload, { title: 'Settings', slug: 'settings-node', contentType: 'settings', parent: root, sortOrder: 11 })
  console.log('  Level 1: 12 top-level sections')

  // ────────────────────────────────────────────
  // Level 2-5: Boards & Councils
  // ────────────────────────────────────────────
  // AcSB — deepest nesting (5 levels)
  const acsb = await node(payload, { title: 'AcSB — Accounting Standards Board', slug: 'acsb', contentType: 'page', parent: boardsF, sortOrder: 0, board: bm['acsb'] })
  const acsbAbout = await node(payload, { title: 'About AcSB', slug: 'acsb-about', contentType: 'page', parent: acsb, sortOrder: 0, board: bm['acsb'] })
  await node(payload, { title: 'AcSB Members', slug: 'acsb-members', contentType: 'page', parent: acsb, sortOrder: 1, board: bm['acsb'] })
  await node(payload, { title: 'AcSB Strategic Plan', slug: 'acsb-strategic-plan', contentType: 'page', parent: acsbAbout, sortOrder: 0, board: bm['acsb'] })
  await node(payload, { title: 'AcSB Annual Report', slug: 'acsb-annual-report', contentType: 'page', parent: acsbAbout, sortOrder: 1, board: bm['acsb'] })
  await node(payload, { title: 'AcSB Due Process', slug: 'acsb-due-process', contentType: 'page', parent: acsbAbout, sortOrder: 2, board: bm['acsb'] })
  await node(payload, { title: 'AcSB Terms of Reference', slug: 'acsb-terms-of-reference', contentType: 'page', parent: acsbAbout, sortOrder: 3, board: bm['acsb'] })
  // AcSB Committees (Level 3-5)
  const acsbComm = await node(payload, { title: 'Committees', slug: 'acsb-committees', contentType: 'folder', parent: acsb, sortOrder: 2, board: bm['acsb'] })
  const ifrsdg = await node(payload, { title: 'IFRS Discussion Group', slug: 'acsb-ifrsdg', contentType: 'page', parent: acsbComm, sortOrder: 0, board: bm['acsb'] })
  const ifrsdgMeetings = await node(payload, { title: 'IFRSDG Meetings', slug: 'acsb-ifrsdg-meetings', contentType: 'folder', parent: ifrsdg, sortOrder: 0, board: bm['acsb'] })
  await node(payload, { title: 'IFRSDG — December 2025', slug: 'acsb-ifrsdg-dec-2025', contentType: 'event', parent: ifrsdgMeetings, sortOrder: 0, board: bm['acsb'] })
  await node(payload, { title: 'IFRSDG — March 2026', slug: 'acsb-ifrsdg-mar-2026', contentType: 'event', parent: ifrsdgMeetings, sortOrder: 1, board: bm['acsb'] })
  await node(payload, { title: 'NFP Advisory Committee', slug: 'acsb-nfp-advisory', contentType: 'page', parent: acsbComm, sortOrder: 1, board: bm['acsb'] })
  await node(payload, { title: 'Academic Advisory Committee', slug: 'acsb-academic-advisory', contentType: 'page', parent: acsbComm, sortOrder: 2, board: bm['acsb'] })
  await node(payload, { title: 'ASPE Discussion Group', slug: 'acsb-aspe-dg', contentType: 'page', parent: acsbComm, sortOrder: 3, board: bm['acsb'] })
  await node(payload, { title: 'Contact AcSB', slug: 'acsb-contact', contentType: 'page', parent: acsb, sortOrder: 3, board: bm['acsb'] })
  await node(payload, { title: 'AcSB Volunteer Opportunities', slug: 'acsb-volunteer', contentType: 'page', parent: acsb, sortOrder: 4, board: bm['acsb'] })

  // PSAB
  const psab = await node(payload, { title: 'PSAB — Public Sector Accounting Board', slug: 'psab', contentType: 'page', parent: boardsF, sortOrder: 1, board: bm['psab'] })
  const psabAbout = await node(payload, { title: 'About PSAB', slug: 'psab-about', contentType: 'page', parent: psab, sortOrder: 0, board: bm['psab'] })
  await node(payload, { title: 'PSAB Members', slug: 'psab-members', contentType: 'page', parent: psab, sortOrder: 1, board: bm['psab'] })
  await node(payload, { title: 'PSAB Strategic Plan', slug: 'psab-strategic-plan', contentType: 'page', parent: psabAbout, sortOrder: 0, board: bm['psab'] })
  const psabComm = await node(payload, { title: 'Committees', slug: 'psab-committees', contentType: 'folder', parent: psab, sortOrder: 2, board: bm['psab'] })
  await node(payload, { title: 'Financial Reporting by Governments', slug: 'psab-frbg', contentType: 'page', parent: psabComm, sortOrder: 0, board: bm['psab'] })
  await node(payload, { title: 'Public Sector Conceptual Framework', slug: 'psab-conceptual', contentType: 'page', parent: psabComm, sortOrder: 1, board: bm['psab'] })
  await node(payload, { title: 'Contact PSAB', slug: 'psab-contact', contentType: 'page', parent: psab, sortOrder: 3, board: bm['psab'] })

  // AASB
  const aasb = await node(payload, { title: 'AASB — Auditing and Assurance Standards Board', slug: 'aasb', contentType: 'page', parent: boardsF, sortOrder: 2, board: bm['aasb'] })
  await node(payload, { title: 'About AASB', slug: 'aasb-about', contentType: 'page', parent: aasb, sortOrder: 0, board: bm['aasb'] })
  await node(payload, { title: 'AASB Members', slug: 'aasb-members', contentType: 'page', parent: aasb, sortOrder: 1, board: bm['aasb'] })
  const aasbComm = await node(payload, { title: 'Committees', slug: 'aasb-committees', contentType: 'folder', parent: aasb, sortOrder: 2, board: bm['aasb'] })
  await node(payload, { title: 'Auditing Standards Committee', slug: 'aasb-auditing-committee', contentType: 'page', parent: aasbComm, sortOrder: 0, board: bm['aasb'] })
  await node(payload, { title: 'Quality Management Committee', slug: 'aasb-quality-committee', contentType: 'page', parent: aasbComm, sortOrder: 1, board: bm['aasb'] })
  await node(payload, { title: 'Contact AASB', slug: 'aasb-contact', contentType: 'page', parent: aasb, sortOrder: 3, board: bm['aasb'] })

  // CSSB
  const cssb = await node(payload, { title: 'CSSB — Canadian Sustainability Standards Board', slug: 'cssb', contentType: 'page', parent: boardsF, sortOrder: 3, board: bm['cssb'] })
  await node(payload, { title: 'About CSSB', slug: 'cssb-about', contentType: 'page', parent: cssb, sortOrder: 0, board: bm['cssb'] })
  await node(payload, { title: 'CSSB Members', slug: 'cssb-members', contentType: 'page', parent: cssb, sortOrder: 1, board: bm['cssb'] })
  await node(payload, { title: 'Contact CSSB', slug: 'cssb-contact', contentType: 'page', parent: cssb, sortOrder: 2, board: bm['cssb'] })

  // RASOC — oversight, minimal nesting
  const rasoc = await node(payload, { title: 'RASOC — Oversight Council', slug: 'rasoc', contentType: 'page', parent: boardsF, sortOrder: 4, board: bm['rasoc'] })
  await node(payload, { title: 'About RASOC', slug: 'rasoc-about', contentType: 'page', parent: rasoc, sortOrder: 0, board: bm['rasoc'] })
  await node(payload, { title: 'RASOC Members', slug: 'rasoc-members', contentType: 'page', parent: rasoc, sortOrder: 1, board: bm['rasoc'] })
  console.log('  Boards: 5 boards + 40 sub-pages')

  // ────────────────────────────────────────────
  // Level 2-4: Standards sections
  // ────────────────────────────────────────────
  const stdSections = [
    { title: 'IFRS Standards', slug: 'ifrs', projects: ['IFRS S1 Sustainability Disclosure', 'IFRS 15 Revenue Recognition', 'IFRS 17 Insurance Contracts', 'IFRS 9 Financial Instruments'] },
    { title: 'ASPE', slug: 'aspe', projects: ['ASPE Comprehensive Review', 'ASPE Section 3856 Simplification', 'ASPE Agriculture'] },
    { title: 'Public Sector (PSAS)', slug: 'psas', projects: ['PS 3280 Asset Retirement Obligations', 'PS Revenue Recognition'] },
    { title: 'Auditing (CAS)', slug: 'cas', projects: ['CAS Quality Management'] },
    { title: 'Sustainability (CSDS)', slug: 'csds', projects: ['CSDS 1 General Requirements', 'CSDS 2 Climate-related Disclosures'] },
    { title: 'NFPO', slug: 'nfpo', projects: ['NFPO Contributions Review'] },
    { title: 'Pension Plans', slug: 'pension-plans', projects: [] },
    { title: 'Other Standards', slug: 'other-standards', projects: [] },
  ]
  let stdCount = 0
  for (let i = 0; i < stdSections.length; i++) {
    const s = stdSections[i]
    const stdF = await node(payload, { title: s.title, slug: `std-${s.slug}`, contentType: 'folder', parent: standardsF, sortOrder: i })
    await node(payload, { title: `${s.title} Overview`, slug: `std-${s.slug}-overview`, contentType: 'page', parent: stdF, sortOrder: 0 })
    stdCount++
    if (s.projects.length > 0) {
      const projF = await node(payload, { title: 'Projects', slug: `std-${s.slug}-projects`, contentType: 'folder', parent: stdF, sortOrder: 1 })
      for (let j = 0; j < s.projects.length; j++) {
        await node(payload, { title: s.projects[j], slug: `std-${s.slug}-proj-${j}`, contentType: 'project', parent: projF, sortOrder: j, workflowState: j === 0 ? 'published' : 'draft' })
        stdCount++
      }
    }
    await node(payload, { title: 'Effective Dates', slug: `std-${s.slug}-effective-dates`, contentType: 'page', parent: stdF, sortOrder: 2 })
    await node(payload, { title: 'Resources', slug: `std-${s.slug}-resources`, contentType: 'folder', parent: stdF, sortOrder: 3 })
    stdCount += 3 // overview + effective dates + resources folder
  }
  console.log(`  Standards: 8 sections + ${stdCount} sub-items`)

  // ────────────────────────────────────────────
  // Level 2: News articles (mixed workflow states)
  // ────────────────────────────────────────────
  const newsItems = [
    { title: 'AcSB Endorses IFRS 18 Presentation and Disclosure', state: 'published' },
    { title: 'New Sustainability Disclosure Standards Published', state: 'published' },
    { title: 'PSAB Consultation on Asset Retirement Obligations', state: 'published' },
    { title: '2026 Board Appointments Announced', state: 'published' },
    { title: 'CAS Quality Management Standards Update', state: 'published' },
    { title: 'AcSB March 2026 Meeting Summary', state: 'published' },
    { title: 'CSSB Climate Disclosure Framework Released', state: 'in_review' },
    { title: 'PSAB Publishes Implementation Guidance', state: 'in_review' },
    { title: 'Volunteer Opportunities — Spring 2026', state: 'draft' },
    { title: 'Upcoming Webinar: IFRS Update for Practitioners', state: 'draft' },
    { title: 'Research Program: Financial Reporting Trends', state: 'approved' },
    { title: 'AASB Issues Revised Quality Management Standard', state: 'published' },
  ]
  for (let i = 0; i < newsItems.length; i++) {
    await node(payload, { title: newsItems[i].title, slug: `news-${i}`, contentType: 'news', parent: newsF, sortOrder: i, workflowState: newsItems[i].state })
  }
  console.log(`  News: ${newsItems.length} articles`)

  // ────────────────────────────────────────────
  // Level 2: Events & Meetings
  // ────────────────────────────────────────────
  const eventItems = [
    { title: 'AcSB Board Meeting — March 2026', state: 'published' },
    { title: 'AcSB Board Meeting — June 2026', state: 'draft' },
    { title: 'PSAB Board Meeting — April 2026', state: 'published' },
    { title: 'AASB Board Meeting — May 2026', state: 'published' },
    { title: 'CSSB Inaugural Meeting', state: 'published' },
    { title: 'Webinar: IFRS S1 Implementation Guidance', state: 'published' },
    { title: 'Webinar: PSAS Update for Government CFOs', state: 'in_review' },
    { title: 'Comment Deadline: Revenue Recognition ED', state: 'published' },
  ]
  for (let i = 0; i < eventItems.length; i++) {
    await node(payload, { title: eventItems[i].title, slug: `event-${i}`, contentType: 'event', parent: eventsF, sortOrder: i, workflowState: eventItems[i].state })
  }
  console.log(`  Events: ${eventItems.length} items`)

  // ────────────────────────────────────────────
  // Level 2: Consultations (Documents for Comment)
  // ────────────────────────────────────────────
  const consultItems = [
    { title: 'ED: Revenue Recognition for Private Enterprises', state: 'published' },
    { title: 'ED: Lease Accounting Amendments', state: 'published' },
    { title: 'ED: Financial Instruments — Expected Credit Losses', state: 'published' },
    { title: 'ED: Public Sector Liability Measurement', state: 'in_review' },
    { title: 'Consultation Paper: Intangible Assets', state: 'draft' },
    { title: 'ED: Sustainability Disclosure — Sector-Specific', state: 'draft' },
  ]
  for (let i = 0; i < consultItems.length; i++) {
    await node(payload, { title: consultItems[i].title, slug: `consult-${i}`, contentType: 'document', parent: consultF, sortOrder: i, workflowState: consultItems[i].state })
  }
  console.log(`  Consultations: ${consultItems.length} items`)

  // ────────────────────────────────────────────
  // Level 2-3: Resources
  // ────────────────────────────────────────────
  const implGuides = await node(payload, { title: 'Implementation Guides', slug: 'res-impl-guides', contentType: 'folder', parent: resourcesF, sortOrder: 0 })
  await node(payload, { title: 'IFRS Implementation Guidance', slug: 'res-ifrs-impl', contentType: 'page', parent: implGuides, sortOrder: 0 })
  await node(payload, { title: 'ASPE Implementation Guidance', slug: 'res-aspe-impl', contentType: 'page', parent: implGuides, sortOrder: 1 })
  await node(payload, { title: 'PSAS Implementation Guidance', slug: 'res-psas-impl', contentType: 'page', parent: implGuides, sortOrder: 2 })
  await node(payload, { title: 'Research Papers', slug: 'res-research', contentType: 'folder', parent: resourcesF, sortOrder: 1 })
  await node(payload, { title: 'Educational Materials', slug: 'res-educational', contentType: 'folder', parent: resourcesF, sortOrder: 2 })
  await node(payload, { title: 'Podcasts & Webinar Recordings', slug: 'res-podcasts', contentType: 'folder', parent: resourcesF, sortOrder: 3 })
  console.log('  Resources: 7 items')

  // ────────────────────────────────────────────
  // Level 2: About section
  // ────────────────────────────────────────────
  await node(payload, { title: 'About RAS Canada', slug: 'about-fras', contentType: 'page', parent: aboutF, sortOrder: 0 })
  await node(payload, { title: 'Strategic Plan', slug: 'about-strategic-plan', contentType: 'page', parent: aboutF, sortOrder: 1 })
  await node(payload, { title: 'Annual Report', slug: 'about-annual-report', contentType: 'page', parent: aboutF, sortOrder: 2 })
  await node(payload, { title: 'History', slug: 'about-history', contentType: 'page', parent: aboutF, sortOrder: 3 })
  await node(payload, { title: 'International Activities', slug: 'about-international', contentType: 'page', parent: aboutF, sortOrder: 4 })
  await node(payload, { title: 'Research Program', slug: 'about-research-program', contentType: 'page', parent: aboutF, sortOrder: 5 })
  console.log('  About: 6 pages')

  // ────────────────────────────────────────────
  // Level 2: Contact
  // ────────────────────────────────────────────
  await node(payload, { title: 'Contact Information', slug: 'contact-info', contentType: 'page', parent: contactF, sortOrder: 0 })
  await node(payload, { title: 'Staff Directory', slug: 'contact-staff', contentType: 'page', parent: contactF, sortOrder: 1 })
  await node(payload, { title: 'Media Inquiries', slug: 'contact-media', contentType: 'page', parent: contactF, sortOrder: 2 })
  console.log('  Contact: 3 pages')

  // ────────────────────────────────────────────
  // Level 2: My Account
  // ────────────────────────────────────────────
  await node(payload, { title: 'Login', slug: 'account-login', contentType: 'page', parent: accountF, sortOrder: 0 })
  await node(payload, { title: 'Register', slug: 'account-register', contentType: 'page', parent: accountF, sortOrder: 1 })
  await node(payload, { title: 'Forgot Password', slug: 'account-forgot-password', contentType: 'page', parent: accountF, sortOrder: 2 })
  await node(payload, { title: 'My Profile', slug: 'account-profile', contentType: 'page', parent: accountF, sortOrder: 3 })
  console.log('  My Account: 4 pages')

  // ────────────────────────────────────────────
  // Level 2: Policies
  // ────────────────────────────────────────────
  await node(payload, { title: 'Privacy Policy', slug: 'policy-privacy', contentType: 'page', parent: policiesF, sortOrder: 0 })
  await node(payload, { title: 'Terms of Use', slug: 'policy-terms', contentType: 'page', parent: policiesF, sortOrder: 1 })
  await node(payload, { title: 'Accessibility', slug: 'policy-accessibility', contentType: 'page', parent: policiesF, sortOrder: 2 })
  await node(payload, { title: 'Cookie Policy', slug: 'policy-cookies', contentType: 'page', parent: policiesF, sortOrder: 3 })
  await node(payload, { title: 'Copyright', slug: 'policy-copyright', contentType: 'page', parent: policiesF, sortOrder: 4 })
  console.log('  Policies: 5 pages')

  // ────────────────────────────────────────────
  // Summary
  // ────────────────────────────────────────────
  const total = await payload.count({ collection: 'pages' })
  console.log(`\n=== Tree seeding complete! Total pages: ${total.totalDocs} ===\n`)
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
