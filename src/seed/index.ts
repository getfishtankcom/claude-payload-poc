/**
 * @description
 * Seed script for RAS Canada CMS. Populates all collections and globals
 * with realistic sample data for development and testing.
 *
 * Creates:
 * Phase 1:
 * - 5 boards (AcSB, PSAB, AASB, CSSB, RASOC)
 * - 11 standards mapped to boards
 * - 6 contacts
 * - 10 projects with timeline stages
 * - 5 consultations with future deadlines
 * - 12 news items
 * - 6 events (webinars, meetings, deadlines)
 * - Navigation global
 * - Footer global
 * - Homepage global (hero + layout blocks)
 * - SearchConfig global
 *
 * Phase 2 (Epic 21):
 * - 24 board members (6 per board across 4 boards)
 * - 27 committees across 4 boards with embedded members
 * - 32 resources across categories and types
 * - 4 effective dates tables (IFRS, ASPE, PSAS, CAS)
 * - 12 documents for comment (5 open, 7 closed)
 * - 6 document details (with comment questions)
 * - 5 form submissions (test data)
 * - 2 job postings
 * - 5 standards sections with tabs and CTAs
 * - AuthConfig global
 *
 * @dependencies
 * - payload: Local API for data creation
 * - payload.config.ts: CMS configuration
 *
 * @notes
 * - Run via: npx tsx src/seed/index.ts
 * - Clears existing data before seeding (idempotent)
 * - Rich text uses Lexical JSON format
 * - Relationships use IDs from previously created documents
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

// ---------------------------------------------------------------------------
// Lexical rich text helpers
// ---------------------------------------------------------------------------

/** Create a simple Lexical rich text document with paragraphs */
function richText(...paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        children: [{ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        textFormat: 0,
        textStyle: '',
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

/** Create a Lexical heading node */
function headingNode(tag: 'h1' | 'h2' | 'h3', text: string) {
  return {
    type: 'heading',
    tag,
    children: [{ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  }
}

/** Create rich text with a heading followed by paragraphs */
function richTextWithHeading(tag: 'h1' | 'h2' | 'h3', heading: string, ...paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: [
        headingNode(tag, heading),
        ...paragraphs.map((text) => ({
          type: 'paragraph',
          children: [{ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
          textFormat: 0,
          textStyle: '',
        })),
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

// ---------------------------------------------------------------------------
// Future date helpers
// ---------------------------------------------------------------------------

function daysFromNow(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

export async function seed(_payload?: unknown) {
  console.log('🌱 Starting RAS Canada seed...')

  const payload = await getPayload({ config })

  // -------------------------------------------------------------------------
  // Clear existing data (order matters — delete children before parents)
  // -------------------------------------------------------------------------
  console.log('  Clearing existing data...')
  const collectionsToDelete = [
    // Phase 2 (delete first — they depend on Phase 1)
    'document-details',
    'documents-for-comment',
    'effective-dates',
    'resources',
    'standards-sections',
    'committees',
    'board-members',
    'form-submissions',
    'job-postings',
    // Phase 1
    'consultations',
    'news',
    'events',
    'documents',
    'decision-summaries',
    'projects',
    'contacts',
    'standards',
    'boards',
    'pages',
  ] as const

  for (const slug of collectionsToDelete) {
    try {
      await payload.delete({
        collection: slug as 'boards',
        where: { id: { exists: true } },
      })
    } catch {
      // Collection might be empty or not exist yet
    }
  }

  // -------------------------------------------------------------------------
  // 1. BOARDS (5 total)
  // -------------------------------------------------------------------------
  console.log('  Creating boards...')

  const boardData = [
    {
      name: 'Accounting Standards Board',
      abbreviation: 'AcSB',
      slug: 'acsb',
      description:
        'The Accounting Standards Board (AcSB) establishes standards for financial reporting by Canadian private enterprises, not-for-profit organizations, and pension plans.',
      tabs: [
        { label: 'Overview', slug: 'overview', content: richText('The AcSB sets accounting standards for private enterprises, not-for-profit organizations, and pension plans in Canada. Our standards help organizations prepare financial statements that are clear, consistent, and comparable.') },
        { label: 'Current Projects', slug: 'current-projects', content: richText('View our active projects and track their progress through the standards-setting process.') },
        { label: 'Meetings', slug: 'meetings', content: richText('The AcSB meets regularly to discuss standards-setting projects and approve exposure drafts.') },
      ],
      quick_actions: [
        { label: 'Submit a Comment', url: '/open-consultations', icon: 'ChatBubbleLeftIcon' },
        { label: 'View Standards', url: '/standards', icon: 'DocumentTextIcon' },
        { label: 'Volunteer', url: '/volunteer', icon: 'HandRaisedIcon' },
      ],
      resources: [
        { title: 'AcSB Strategic Plan 2022-2027', file_url: '/documents/acsb-strategic-plan.pdf', type: 'pdf' as const },
        { title: 'Due Process Handbook', file_url: '/documents/due-process-handbook.pdf', type: 'pdf' as const },
      ],
    },
    {
      name: 'Public Sector Accounting Board',
      abbreviation: 'PSAB',
      slug: 'psab',
      description:
        'The Public Sector Accounting Board (PSAB) sets accounting standards for the public sector in Canada, including federal, provincial, territorial, and local governments.',
      tabs: [
        { label: 'Overview', slug: 'overview', content: richText('PSAB establishes accounting standards for governments and government organizations in Canada. Our standards promote accountability and transparency in public sector financial reporting.') },
        { label: 'Current Projects', slug: 'current-projects', content: richText('Track PSAB\'s active projects and find opportunities to contribute.') },
      ],
      quick_actions: [
        { label: 'Submit a Comment', url: '/open-consultations', icon: 'ChatBubbleLeftIcon' },
        { label: 'View Standards', url: '/standards', icon: 'DocumentTextIcon' },
      ],
      resources: [
        { title: 'PSAB Strategic Plan', file_url: '/documents/psab-strategic-plan.pdf', type: 'pdf' as const },
      ],
    },
    {
      name: 'Auditing and Assurance Standards Board',
      abbreviation: 'AASB',
      slug: 'aasb',
      description:
        'The Auditing and Assurance Standards Board (AASB) sets standards for auditing, other assurance engagements, and related services in Canada.',
      tabs: [
        { label: 'Overview', slug: 'overview', content: richText('The AASB establishes auditing and assurance standards that promote confidence in the quality of audits and assurance engagements performed in Canada.') },
        { label: 'Current Projects', slug: 'current-projects', content: richText('View current AASB projects and standards under development.') },
      ],
      quick_actions: [
        { label: 'Submit a Comment', url: '/open-consultations', icon: 'ChatBubbleLeftIcon' },
        { label: 'View Standards', url: '/standards', icon: 'DocumentTextIcon' },
      ],
      resources: [
        { title: 'AASB Annual Plan', file_url: '/documents/aasb-annual-plan.pdf', type: 'pdf' as const },
      ],
    },
    {
      name: 'Canadian Sustainability Standards Board',
      abbreviation: 'CSSB',
      slug: 'cssb',
      description:
        'The Canadian Sustainability Standards Board (CSSB) develops sustainability disclosure standards for Canada, building on the ISSB global baseline.',
      tabs: [
        { label: 'Overview', slug: 'overview', content: richText('The CSSB is developing made-in-Canada sustainability disclosure standards that build on the ISSB global baseline while reflecting Canadian market needs.') },
        { label: 'Current Projects', slug: 'current-projects', content: richText('Follow the development of Canadian Sustainability Disclosure Standards.') },
      ],
      quick_actions: [
        { label: 'Submit a Comment', url: '/open-consultations', icon: 'ChatBubbleLeftIcon' },
        { label: 'Learn More', url: '/about/cssb', icon: 'InformationCircleIcon' },
      ],
      resources: [],
    },
    {
      name: 'Regulatory and Accounting Standards Oversight Council',
      abbreviation: 'RASOC',
      slug: 'rasoc',
      description:
        'RASOC provides oversight of the AcSB, AASB, PSAB, and CSSB, ensuring the standard-setting process serves the public interest.',
      tabs: [],
      quick_actions: [],
      resources: [],
    },
  ]

  const boards: Record<string, number> = {}
  for (const board of boardData) {
    const created = await payload.create({ collection: 'boards', data: board })
    boards[board.slug] = created.id as number
  }
  console.log(`    ✓ Created ${Object.keys(boards).length} boards`)

  // -------------------------------------------------------------------------
  // 2. STANDARDS (11 total)
  // -------------------------------------------------------------------------
  console.log('  Creating standards...')

  const standardsData = [
    // Sustainability (CSSB) - 1
    { name: 'Canadian Sustainability Disclosure Standards', slug: 'csds', category: 'Sustainability' as const, board: boards.cssb, parts: [] },
    // Accounting (AcSB) - 5
    {
      name: 'IFRS Accounting Standards',
      slug: 'ifrs',
      category: 'Accounting' as const,
      board: boards.acsb,
      parts: [
        { label: 'Part I — IFRS Accounting Standards', slug: 'part-i-ifrs' },
        { label: 'Part II — Accounting Standards for Private Enterprises (ASPE)', slug: 'part-ii-aspe' },
        { label: 'Part III — Accounting Standards for Not-for-Profit Organizations', slug: 'part-iii-nfpo' },
        { label: 'Part IV — Accounting Standards for Pension Plans', slug: 'part-iv-pension' },
      ],
    },
    { name: 'Accounting Standards for Private Enterprises', slug: 'aspe', category: 'Accounting' as const, board: boards.acsb, parts: [] },
    { name: 'Accounting Standards for Not-for-Profit Organizations', slug: 'nfpo', category: 'Accounting' as const, board: boards.acsb, parts: [] },
    { name: 'Accounting Standards for Pension Plans', slug: 'pension-plans', category: 'Accounting' as const, board: boards.acsb, parts: [] },
    { name: 'Pre-changeover Accounting Standards', slug: 'pre-changeover', category: 'Accounting' as const, board: boards.acsb, parts: [] },
    // Public Sector (PSAB) - 3
    { name: 'Public Sector Accounting Standards', slug: 'psas', category: 'Public Sector' as const, board: boards.psab, parts: [] },
    { name: 'Public Sector Guidelines', slug: 'ps-guidelines', category: 'Public Sector' as const, board: boards.psab, parts: [] },
    { name: 'Public Sector Statements of Recommended Practice', slug: 'ps-sorp', category: 'Public Sector' as const, board: boards.psab, parts: [] },
    // Assurance (AASB) - 2
    { name: 'Canadian Auditing Standards', slug: 'cas', category: 'Assurance' as const, board: boards.aasb, parts: [] },
    { name: 'Canadian Standard on Quality Management', slug: 'csqm', category: 'Assurance' as const, board: boards.aasb, parts: [] },
  ]

  const standards: Record<string, number> = {}
  for (const standard of standardsData) {
    const created = await payload.create({ collection: 'standards', data: standard })
    standards[standard.slug] = created.id as number
  }
  console.log(`    ✓ Created ${Object.keys(standards).length} standards`)

  // -------------------------------------------------------------------------
  // 3. CONTACTS (6 total)
  // -------------------------------------------------------------------------
  console.log('  Creating contacts...')

  const contactsData = [
    { name: 'Andrew White, CPA, CA', credentials: 'CPA, CA', title: 'Director, Accounting Standards', phone: '416-204-3456', email: 'awhite@frascanada.ca' },
    { name: 'Sarah Chen, CPA', credentials: 'CPA', title: 'Principal, Accounting Standards', phone: '416-204-3457', email: 'schen@frascanada.ca' },
    { name: 'Michael Torres, CPA, CA', credentials: 'CPA, CA', title: 'Director, Auditing and Assurance Standards', phone: '416-204-3458', email: 'mtorres@frascanada.ca' },
    { name: 'Jennifer Kim', credentials: '', title: 'Principal, Public Sector Accounting Standards', phone: '416-204-3459', email: 'jkim@frascanada.ca' },
    { name: 'Robert Nguyen, CPA', credentials: 'CPA', title: 'Director, Sustainability Standards', phone: '416-204-3460', email: 'rnguyen@frascanada.ca' },
    { name: 'Lisa Patel, CPA, CA', credentials: 'CPA, CA', title: 'Communications Manager', phone: '416-204-3461', email: 'lpatel@frascanada.ca' },
  ]

  const contacts: number[] = []
  for (const contact of contactsData) {
    const created = await payload.create({ collection: 'contacts', data: contact })
    contacts.push(created.id as number)
  }
  console.log(`    ✓ Created ${contacts.length} contacts`)

  // -------------------------------------------------------------------------
  // 4. PROJECTS (10 total)
  // -------------------------------------------------------------------------
  console.log('  Creating projects...')

  const projectsData = [
    // AcSB projects
    {
      title: 'Post-implementation Review of IFRS 15 Revenue from Contracts with Customers',
      slug: 'pir-ifrs-15',
      summary: richText('The AcSB is conducting a post-implementation review of IFRS 15 to assess whether the standard is working as intended and identify any areas that may need improvement.'),
      status: 'Active' as const,
      badges: [{ badge_type: 'Research' as const }],
      timeline_stages: [
        { phase_number: 1, date: daysAgo(180), title: 'Research', description: 'Initial research and stakeholder outreach' },
        { phase_number: 2, date: daysAgo(90), title: 'Consultation', description: 'Public consultation period' },
        { phase_number: 3, date: daysFromNow(30), title: 'Analysis', description: 'Analyzing feedback and developing recommendations' },
        { phase_number: 4, title: 'Reporting', description: 'Final report to the IASB' },
      ],
      current_stage: 3,
      type: 'Active' as const,
      board: boards.acsb,
      standard: standards.ifrs,
      contacts: [contacts[0], contacts[1]],
    },
    {
      title: 'Accounting for Crypto Assets',
      slug: 'crypto-assets',
      summary: richText('This project considers the accounting implications of crypto assets under ASPE and evaluates whether targeted guidance is needed.'),
      status: 'Active' as const,
      badges: [{ badge_type: 'Exposure Draft' as const }],
      timeline_stages: [
        { phase_number: 1, date: daysAgo(365), title: 'Research', description: 'Research phase complete' },
        { phase_number: 2, date: daysAgo(120), title: 'Exposure Draft', description: 'Exposure draft published for comment' },
        { phase_number: 3, date: daysFromNow(60), title: 'Deliberations', description: 'Board deliberations on feedback' },
        { phase_number: 4, title: 'Final Standard', description: 'Issuance of final standard' },
      ],
      current_stage: 2,
      type: 'Active' as const,
      board: boards.acsb,
      standard: standards.aspe,
      contacts: [contacts[0]],
    },
    {
      title: 'Improvements to Not-for-Profit Standards',
      slug: 'nfpo-improvements',
      summary: richText('The AcSB is considering targeted improvements to the accounting standards for not-for-profit organizations, including contributions revenue recognition and financial statement presentation.'),
      status: 'Active' as const,
      badges: [{ badge_type: 'Public Comment' as const }],
      timeline_stages: [
        { phase_number: 1, date: daysAgo(240), title: 'Research', description: 'Stakeholder consultation complete' },
        { phase_number: 2, date: daysAgo(60), title: 'Discussion Paper', description: 'Discussion paper published' },
        { phase_number: 3, title: 'Exposure Draft', description: 'Pending' },
        { phase_number: 4, title: 'Final Standard', description: 'Pending' },
      ],
      current_stage: 2,
      type: 'Active' as const,
      board: boards.acsb,
      standard: standards.nfpo,
      contacts: [contacts[1]],
    },
    // PSAB projects
    {
      title: 'Revenue — PS 3400',
      slug: 'revenue-ps-3400',
      summary: richText('PSAB is developing a new standard on revenue for the public sector. This project will replace Section PS 3100, Government Transfers.'),
      status: 'Active' as const,
      badges: [{ badge_type: 'Exposure Draft' as const }, { badge_type: 'Public Comment' as const }],
      timeline_stages: [
        { phase_number: 1, date: daysAgo(400), title: 'Research', description: 'Research complete' },
        { phase_number: 2, date: daysAgo(200), title: 'Statement of Principles', description: 'Published for comment' },
        { phase_number: 3, date: daysAgo(30), title: 'Exposure Draft', description: 'ED published for comment' },
        { phase_number: 4, title: 'Re-deliberation', description: 'Board re-deliberations' },
        { phase_number: 5, title: 'Final Standard', description: 'Issuance' },
      ],
      current_stage: 3,
      type: 'Active' as const,
      board: boards.psab,
      standard: standards.psas,
      contacts: [contacts[3]],
    },
    {
      title: 'Employee Benefits — PS 3250',
      slug: 'employee-benefits-ps-3250',
      summary: richText('This project addresses the accounting for employee benefits in the public sector, including pensions, other retirement benefits, and compensated absences.'),
      status: 'Active' as const,
      badges: [{ badge_type: 'Research' as const }],
      timeline_stages: [
        { phase_number: 1, date: daysAgo(150), title: 'Research', description: 'Research in progress' },
        { phase_number: 2, title: 'Consultation Paper', description: 'Pending' },
        { phase_number: 3, title: 'Exposure Draft', description: 'Pending' },
      ],
      current_stage: 1,
      type: 'Active' as const,
      board: boards.psab,
      standard: standards.psas,
      contacts: [contacts[3]],
    },
    {
      title: 'Purchased Intangibles — PS 3070',
      slug: 'purchased-intangibles-ps-3070',
      summary: richText('PSAB is developing guidance on the recognition, measurement, and disclosure of purchased intangible assets in the public sector.'),
      status: 'Active' as const,
      badges: [{ badge_type: 'Survey' as const }],
      timeline_stages: [
        { phase_number: 1, date: daysAgo(300), title: 'Research', description: 'Complete' },
        { phase_number: 2, date: daysAgo(100), title: 'Survey', description: 'Survey published' },
        { phase_number: 3, title: 'Exposure Draft', description: 'Pending' },
      ],
      current_stage: 2,
      type: 'Active' as const,
      board: boards.psab,
      standard: standards.psas,
      contacts: [contacts[3]],
    },
    // AASB projects
    {
      title: 'Quality Management Implementation Support',
      slug: 'qm-implementation',
      summary: richText('The AASB is providing implementation support for the Canadian Standard on Quality Management (CSQM 1), helping firms transition to the new quality management framework.'),
      status: 'Active' as const,
      badges: [{ badge_type: 'Research' as const }],
      timeline_stages: [
        { phase_number: 1, date: daysAgo(365), title: 'Standard Issued', description: 'CSQM 1 effective' },
        { phase_number: 2, date: daysAgo(90), title: 'Implementation Guide', description: 'Guide published' },
        { phase_number: 3, title: 'Monitoring', description: 'Ongoing monitoring' },
      ],
      current_stage: 2,
      type: 'Active' as const,
      board: boards.aasb,
      standard: standards.csqm,
      contacts: [contacts[2]],
    },
    {
      title: 'Sustainability Assurance — CSSA 5000',
      slug: 'sustainability-assurance-cssa-5000',
      summary: richText('The AASB is developing a Canadian standard for sustainability assurance engagements, aligning with the IAASB international standard ISSA 5000.'),
      status: 'Active' as const,
      badges: [{ badge_type: 'Exposure Draft' as const }],
      timeline_stages: [
        { phase_number: 1, date: daysAgo(200), title: 'Research', description: 'Complete' },
        { phase_number: 2, date: daysAgo(60), title: 'Exposure Draft', description: 'ED published' },
        { phase_number: 3, title: 'Deliberations', description: 'Board deliberations' },
        { phase_number: 4, title: 'Final Standard', description: 'Issuance' },
      ],
      current_stage: 2,
      type: 'Active' as const,
      board: boards.aasb,
      standard: standards.cas,
      contacts: [contacts[2]],
    },
    // CSSB projects
    {
      title: 'CSDS 1 — General Requirements for Sustainability Disclosures',
      slug: 'csds-1-general-requirements',
      summary: richText('CSSB is developing Canadian Sustainability Disclosure Standard 1, which establishes the core framework for sustainability-related financial disclosures in Canada.'),
      status: 'Active' as const,
      badges: [{ badge_type: 'Exposure Draft' as const }, { badge_type: 'Public Comment' as const }],
      timeline_stages: [
        { phase_number: 1, date: daysAgo(300), title: 'Research', description: 'Complete' },
        { phase_number: 2, date: daysAgo(150), title: 'Exposure Draft', description: 'ED 1 published' },
        { phase_number: 3, date: daysAgo(30), title: 'Re-deliberation', description: 'Analyzing responses' },
        { phase_number: 4, title: 'Final Standard', description: 'Pending' },
      ],
      current_stage: 3,
      type: 'Active' as const,
      board: boards.cssb,
      standard: standards.csds,
      contacts: [contacts[4]],
    },
    {
      title: 'CSDS 2 — Climate-related Disclosures',
      slug: 'csds-2-climate',
      summary: richText('CSSB is developing Canadian Sustainability Disclosure Standard 2, focused on climate-related disclosures including governance, strategy, risk management, and metrics.'),
      status: 'Active' as const,
      badges: [{ badge_type: 'Exposure Draft' as const }],
      timeline_stages: [
        { phase_number: 1, date: daysAgo(250), title: 'Research', description: 'Complete' },
        { phase_number: 2, date: daysAgo(100), title: 'Exposure Draft', description: 'ED published' },
        { phase_number: 3, title: 'Deliberations', description: 'Pending' },
        { phase_number: 4, title: 'Final Standard', description: 'Pending' },
      ],
      current_stage: 2,
      type: 'Active' as const,
      board: boards.cssb,
      standard: standards.csds,
      contacts: [contacts[4]],
    },
  ]

  const projects: Record<string, number> = {}
  for (const project of projectsData) {
    const created = await payload.create({ collection: 'projects', data: project, draft: true })
    projects[project.slug] = created.id as number
  }
  console.log(`    ✓ Created ${Object.keys(projects).length} projects`)

  // -------------------------------------------------------------------------
  // 5. CONSULTATIONS (5 total — all with future deadlines)
  // -------------------------------------------------------------------------
  console.log('  Creating consultations...')

  const consultationsData = [
    {
      title: 'Exposure Draft: Accounting for Crypto Assets',
      slug: 'ed-crypto-assets',
      type: 'Exposure Draft' as const,
      deadline_date: daysFromNow(45),
      commentPeriodStart: daysAgo(30),
      commentPeriodEnd: daysFromNow(45),
      description: richText('The AcSB invites comments on its proposed amendments to Accounting Standards for Private Enterprises (ASPE) regarding the accounting for crypto assets.'),
      action_documents: [
        { label: 'Exposure Draft (PDF)', url: '/documents/ed-crypto-assets.pdf', type: 'pdf' as const },
        { label: 'Basis for Conclusions', url: '/documents/ed-crypto-basis.pdf', type: 'pdf' as const },
        { label: 'Comment Letter Template', url: '/documents/comment-template.docx', type: 'word' as const },
      ],
      board: boards.acsb,
      standard: standards.aspe,
      project: projects['crypto-assets'],
    },
    {
      title: 'Exposure Draft: Revenue — PS 3400',
      slug: 'ed-revenue-ps-3400',
      type: 'Exposure Draft' as const,
      deadline_date: daysFromNow(60),
      commentPeriodStart: daysAgo(14),
      commentPeriodEnd: daysFromNow(60),
      description: richText('PSAB invites comments on the proposed new Section PS 3400, Revenue, which would replace Section PS 3100, Government Transfers.'),
      action_documents: [
        { label: 'Exposure Draft (PDF)', url: '/documents/ed-ps-3400.pdf', type: 'pdf' as const },
        { label: 'Illustrative Examples', url: '/documents/ed-ps-3400-examples.pdf', type: 'pdf' as const },
      ],
      board: boards.psab,
      standard: standards.psas,
      project: projects['revenue-ps-3400'],
    },
    {
      title: 'Survey: Purchased Intangibles in the Public Sector',
      slug: 'survey-purchased-intangibles',
      type: 'Survey' as const,
      deadline_date: daysFromNow(30),
      commentPeriodStart: daysAgo(45),
      commentPeriodEnd: daysFromNow(30),
      description: richText('PSAB is seeking input on accounting for purchased intangible assets in the public sector. Please complete the survey to share your views.'),
      action_documents: [
        { label: 'Survey Questions', url: '/documents/survey-intangibles.pdf', type: 'pdf' as const },
      ],
      board: boards.psab,
      standard: standards.psas,
      project: projects['purchased-intangibles-ps-3070'],
    },
    {
      title: 'Exposure Draft: Sustainability Assurance — CSSA 5000',
      slug: 'ed-cssa-5000',
      type: 'Exposure Draft' as const,
      deadline_date: daysFromNow(90),
      commentPeriodStart: daysAgo(7),
      commentPeriodEnd: daysFromNow(90),
      description: richText('The AASB invites comments on the proposed Canadian Standard on Sustainability Assurance (CSSA) 5000, which addresses assurance engagements on sustainability information.'),
      action_documents: [
        { label: 'Exposure Draft (PDF)', url: '/documents/ed-cssa-5000.pdf', type: 'pdf' as const },
      ],
      board: boards.aasb,
      standard: standards.cas,
      project: projects['sustainability-assurance-cssa-5000'],
    },
    {
      title: 'Re-exposure Draft: CSDS 1 General Requirements',
      slug: 'red-csds-1',
      type: 'Re-exposure Draft' as const,
      deadline_date: daysFromNow(75),
      commentPeriodStart: daysAgo(5),
      commentPeriodEnd: daysFromNow(75),
      description: richText('The CSSB re-exposes proposed CSDS 1 — General Requirements for Disclosure of Sustainability-related Financial Information — incorporating feedback from the initial exposure draft.'),
      action_documents: [
        { label: 'Re-exposure Draft (PDF)', url: '/documents/red-csds-1.pdf', type: 'pdf' as const },
        { label: 'Summary of Changes', url: '/documents/red-csds-1-changes.pdf', type: 'pdf' as const },
      ],
      board: boards.cssb,
      standard: standards.csds,
      project: projects['csds-1-general-requirements'],
    },
  ]

  for (const consultation of consultationsData) {
    await payload.create({ collection: 'consultations', data: consultation, draft: true })
  }
  console.log(`    ✓ Created ${consultationsData.length} consultations`)

  // -------------------------------------------------------------------------
  // 6. NEWS (12 total)
  // -------------------------------------------------------------------------
  console.log('  Creating news items...')

  const newsData = [
    { title: 'AcSB Publishes Exposure Draft on Crypto Asset Accounting', slug: 'acsb-ed-crypto', date: daysAgo(5), category: 'News' as const, excerpt: 'The AcSB has published an exposure draft proposing amendments to ASPE for the accounting of crypto assets. Comments are due within 90 days.', body: richText('The Accounting Standards Board has published an exposure draft that proposes new guidance on accounting for crypto assets under Accounting Standards for Private Enterprises (ASPE).', 'The proposals address measurement, presentation, and disclosure requirements for entities that hold or transact in crypto assets.'), board: boards.acsb },
    { title: 'CSSB Announces Public Consultation on CSDS 1', slug: 'cssb-csds-1-consultation', date: daysAgo(10), category: 'News' as const, excerpt: 'The CSSB is seeking public input on proposed Canadian Sustainability Disclosure Standard 1, which establishes the core framework for sustainability disclosures in Canada.', body: richText('The Canadian Sustainability Standards Board is pleased to announce a public consultation on the proposed CSDS 1.', 'This standard will establish the foundational requirements for sustainability-related financial disclosures in Canada.'), board: boards.cssb },
    { title: 'PSAB Meeting Summary — March 2026', slug: 'psab-meeting-march-2026', date: daysAgo(3), category: 'Meeting Summary' as const, excerpt: 'Key decisions from the March 2026 PSAB meeting, including progress on revenue recognition and employee benefits projects.', body: richText('The Public Sector Accounting Board met on March 10-11, 2026. Key decisions included approving the exposure draft for PS 3400 Revenue and receiving a progress update on the employee benefits project.'), board: boards.psab },
    { title: 'New AASB Chair Appointed', slug: 'new-aasb-chair', date: daysAgo(15), category: 'News' as const, excerpt: 'RAS Canada is pleased to announce the appointment of the new Chair of the Auditing and Assurance Standards Board, effective April 1, 2026.', body: richText('RAS Canada today announced the appointment of a new Chair of the Auditing and Assurance Standards Board (AASB), effective April 1, 2026.', 'The new Chair brings extensive experience in auditing and assurance standards development.'), board: boards.aasb },
    { title: 'AcSB Approves Improvements to ASPE Disclosure Requirements', slug: 'acsb-aspe-disclosures', date: daysAgo(20), category: 'News' as const, excerpt: 'The AcSB has approved amendments to improve disclosure requirements for private enterprises under ASPE, effective for fiscal years beginning on or after January 1, 2027.', body: richText('The Accounting Standards Board has approved amendments to Accounting Standards for Private Enterprises that improve disclosure requirements for private enterprises.', 'These amendments are effective for fiscal years beginning on or after January 1, 2027.'), board: boards.acsb },
    { title: 'CSSB Releases Climate Disclosure Guidance', slug: 'cssb-climate-guidance', date: daysAgo(25), category: 'News' as const, excerpt: 'The CSSB has released non-authoritative guidance to help Canadian organizations prepare for climate-related disclosures under the proposed CSDS 2.', body: richText('The Canadian Sustainability Standards Board has released non-authoritative guidance material to assist Canadian organizations in preparing for climate-related disclosures.'), board: boards.cssb },
    { title: 'RASOC Annual Report 2025 Published', slug: 'rasoc-annual-report-2025', date: daysAgo(30), category: 'News' as const, excerpt: 'RASOC has published its 2025 annual report, providing an overview of its oversight activities and recommendations for the standard-setting boards.', body: richText('The Regulatory and Accounting Standards Oversight Council has published its 2025 annual report.', 'The report provides an overview of RASOC\'s oversight activities during the year and includes recommendations for the standard-setting boards.'), board: boards.rasoc },
    { title: 'PSAB Seeks Volunteers for Revenue Project Advisory Committee', slug: 'psab-volunteers-revenue', date: daysAgo(7), category: 'News' as const, excerpt: 'PSAB is seeking volunteers to serve on the advisory committee for its Revenue project (PS 3400). Applications are due by April 30, 2026.', body: richText('The Public Sector Accounting Board is seeking volunteers to serve on the advisory committee for its revenue recognition project.', 'Committee members will provide input on the development of the new revenue standard.'), board: boards.psab },
    { title: 'AcSB Meeting Summary — February 2026', slug: 'acsb-meeting-feb-2026', date: daysAgo(35), category: 'Meeting Summary' as const, excerpt: 'Summary of key decisions from the February 2026 AcSB meeting, including discussion of the crypto assets project and NFP improvements.', body: richText('The Accounting Standards Board met on February 24-25, 2026.'), board: boards.acsb },
    { title: 'RAS Canada Strategic Plan 2027-2030 Consultation', slug: 'fras-strategic-plan', date: daysAgo(12), category: 'News' as const, excerpt: 'RAS Canada is developing its strategic plan for 2027-2030 and invites stakeholder input on priorities for the standard-setting boards.', body: richText('RAS Canada is seeking stakeholder input as it develops its strategic plan for the 2027-2030 period.'), board: boards.acsb },
    { title: 'AASB Issues Implementation Support for CAS 600', slug: 'aasb-cas-600-support', date: daysAgo(40), category: 'News' as const, excerpt: 'The AASB has issued implementation support materials for Canadian Auditing Standard (CAS) 600 — Special Considerations for Group Audits.', body: richText('The Auditing and Assurance Standards Board has released implementation support materials for CAS 600.'), board: boards.aasb },
    { title: 'CSSB Holds First Public Board Meeting', slug: 'cssb-first-meeting', date: daysAgo(45), category: 'News' as const, excerpt: 'The CSSB held its first public board meeting, discussing its strategic direction and priorities for Canadian sustainability disclosure standards.', body: richText('The Canadian Sustainability Standards Board held its inaugural public board meeting, setting the stage for the development of Canadian sustainability disclosure standards.'), board: boards.cssb },
  ]

  for (const news of newsData) {
    await payload.create({ collection: 'news', data: news, draft: true })
  }
  console.log(`    ✓ Created ${newsData.length} news items`)

  // -------------------------------------------------------------------------
  // 7. EVENTS (6 total)
  // -------------------------------------------------------------------------
  console.log('  Creating events...')

  const eventsData = [
    { title: 'AcSB Board Meeting', slug: 'acsb-meeting-april-2026', date: daysFromNow(14), publishedDate: daysAgo(7), type: 'meeting' as const, description: 'Regular meeting of the Accounting Standards Board. Agenda includes crypto assets exposure draft feedback and NFP improvements discussion.', board: boards.acsb },
    { title: 'PSAB Board Meeting', slug: 'psab-meeting-april-2026', date: daysFromNow(21), publishedDate: daysAgo(5), type: 'meeting' as const, description: 'Regular meeting of the Public Sector Accounting Board. Agenda includes revenue standard deliberations.', board: boards.psab },
    { title: 'Webinar: Understanding CSDS 1 — General Requirements', slug: 'webinar-csds-1', date: daysFromNow(10), publishedDate: daysAgo(14), type: 'webinar' as const, description: 'Join the CSSB for an overview of proposed CSDS 1 and how it will affect sustainability-related financial disclosures in Canada.', registration_url: 'https://events.frascanada.ca/webinar-csds-1', board: boards.cssb },
    { title: 'Comment Deadline: Exposure Draft — Crypto Assets', slug: 'deadline-crypto-assets', date: daysFromNow(45), type: 'event' as const, description: 'Deadline for submitting comments on the AcSB exposure draft on accounting for crypto assets under ASPE.', board: boards.acsb },
    { title: 'AASB Board Meeting', slug: 'aasb-meeting-may-2026', date: daysFromNow(35), publishedDate: daysAgo(3), type: 'meeting' as const, description: 'Regular meeting of the Auditing and Assurance Standards Board. Sustainability assurance and quality management on the agenda.', board: boards.aasb },
    { title: 'Webinar: Public Sector Revenue Recognition Changes', slug: 'webinar-ps-revenue', date: daysFromNow(28), publishedDate: daysAgo(10), type: 'webinar' as const, description: 'PSAB presents the key changes proposed in the exposure draft for PS 3400 Revenue and what they mean for government financial reporting.', registration_url: 'https://events.frascanada.ca/webinar-ps-revenue', board: boards.psab },
  ]

  // Additional events to reach 50+ total for Phase 2 acceptance criteria
  const additionalEventsData = [
    // Past AcSB meetings (monthly pattern)
    { title: 'AcSB Board Meeting — January 2026', slug: 'acsb-meeting-jan-2026', date: daysAgo(60), publishedDate: daysAgo(90), type: 'meeting' as const, description: 'Regular meeting of the Accounting Standards Board. Agenda includes NFP improvements and crypto assets discussion.', board: boards.acsb },
    { title: 'AcSB Board Meeting — February 2026', slug: 'acsb-meeting-feb-2026-meeting', date: daysAgo(30), publishedDate: daysAgo(60), type: 'meeting' as const, description: 'Regular meeting of the Accounting Standards Board. Focus on exposure draft feedback analysis.', board: boards.acsb },
    { title: 'AcSB Board Meeting — December 2025', slug: 'acsb-meeting-dec-2025', date: daysAgo(90), publishedDate: daysAgo(120), type: 'meeting' as const, description: 'Year-end board meeting covering 2026 work plan approval.', board: boards.acsb },
    { title: 'AcSB Board Meeting — November 2025', slug: 'acsb-meeting-nov-2025', date: daysAgo(120), publishedDate: daysAgo(150), type: 'meeting' as const, description: 'Board meeting discussing crypto assets research findings.', board: boards.acsb },
    { title: 'AcSB Board Meeting — October 2025', slug: 'acsb-meeting-oct-2025', date: daysAgo(150), publishedDate: daysAgo(180), type: 'meeting' as const, description: 'Board meeting reviewing IFRS 15 post-implementation review progress.', board: boards.acsb },
    { title: 'AcSB Board Meeting — September 2025', slug: 'acsb-meeting-sep-2025', date: daysAgo(180), publishedDate: daysAgo(210), type: 'meeting' as const, description: 'Board meeting discussing rate-regulated activities.', board: boards.acsb },
    // Past PSAB meetings
    { title: 'PSAB Board Meeting — February 2026', slug: 'psab-meeting-feb-2026', date: daysAgo(30), publishedDate: daysAgo(60), type: 'meeting' as const, description: 'Regular PSAB meeting. Revenue standard and employee benefits deliberations.', board: boards.psab },
    { title: 'PSAB Board Meeting — January 2026', slug: 'psab-meeting-jan-2026', date: daysAgo(60), publishedDate: daysAgo(90), type: 'meeting' as const, description: 'PSAB meeting reviewing exposure draft comments on PS 3400.', board: boards.psab },
    { title: 'PSAB Board Meeting — December 2025', slug: 'psab-meeting-dec-2025', date: daysAgo(90), publishedDate: daysAgo(120), type: 'meeting' as const, description: 'Year-end PSAB board meeting.', board: boards.psab },
    { title: 'PSAB Board Meeting — November 2025', slug: 'psab-meeting-nov-2025', date: daysAgo(120), publishedDate: daysAgo(150), type: 'meeting' as const, description: 'PSAB meeting reviewing intangibles project.', board: boards.psab },
    { title: 'PSAB Board Meeting — October 2025', slug: 'psab-meeting-oct-2025', date: daysAgo(150), publishedDate: daysAgo(180), type: 'meeting' as const, description: 'PSAB meeting discussing financial instruments implementation.', board: boards.psab },
    { title: 'PSAB Board Meeting — September 2025', slug: 'psab-meeting-sep-2025', date: daysAgo(180), publishedDate: daysAgo(210), type: 'meeting' as const, description: 'PSAB meeting on asset retirement obligations guidance.', board: boards.psab },
    // Past AASB meetings
    { title: 'AASB Board Meeting — February 2026', slug: 'aasb-meeting-feb-2026', date: daysAgo(30), publishedDate: daysAgo(60), type: 'meeting' as const, description: 'Regular AASB meeting. CSSA 5000 and quality management updates.', board: boards.aasb },
    { title: 'AASB Board Meeting — January 2026', slug: 'aasb-meeting-jan-2026', date: daysAgo(60), publishedDate: daysAgo(90), type: 'meeting' as const, description: 'AASB meeting reviewing sustainability assurance draft.', board: boards.aasb },
    { title: 'AASB Board Meeting — December 2025', slug: 'aasb-meeting-dec-2025', date: daysAgo(90), publishedDate: daysAgo(120), type: 'meeting' as const, description: 'Year-end AASB board meeting.', board: boards.aasb },
    { title: 'AASB Board Meeting — November 2025', slug: 'aasb-meeting-nov-2025', date: daysAgo(120), publishedDate: daysAgo(150), type: 'meeting' as const, description: 'AASB meeting on CAS 600 implementation review.', board: boards.aasb },
    { title: 'AASB Board Meeting — October 2025', slug: 'aasb-meeting-oct-2025', date: daysAgo(150), publishedDate: daysAgo(180), type: 'meeting' as const, description: 'AASB meeting discussing less complex entity audit standards.', board: boards.aasb },
    // Past CSSB meetings
    { title: 'CSSB Board Meeting — February 2026', slug: 'cssb-meeting-feb-2026', date: daysAgo(30), publishedDate: daysAgo(60), type: 'meeting' as const, description: 'Regular CSSB meeting. CSDS 1 re-exposure and CSDS 2 deliberations.', board: boards.cssb },
    { title: 'CSSB Board Meeting — January 2026', slug: 'cssb-meeting-jan-2026', date: daysAgo(60), publishedDate: daysAgo(90), type: 'meeting' as const, description: 'CSSB meeting reviewing comment letter responses on CSDS 1.', board: boards.cssb },
    { title: 'CSSB Board Meeting — December 2025', slug: 'cssb-meeting-dec-2025', date: daysAgo(90), publishedDate: daysAgo(120), type: 'meeting' as const, description: 'Year-end CSSB board meeting. 2026 work plan approval.', board: boards.cssb },
    { title: 'CSSB Board Meeting — November 2025', slug: 'cssb-meeting-nov-2025', date: daysAgo(120), publishedDate: daysAgo(150), type: 'meeting' as const, description: 'CSSB meeting discussing proportionality mechanisms.', board: boards.cssb },
    // Additional webinars and deadlines
    { title: 'Webinar: ASPE Crypto Assets — What Private Enterprises Need to Know', slug: 'webinar-aspe-crypto', date: daysAgo(10), publishedDate: daysAgo(30), type: 'webinar' as const, description: 'Webinar covering the proposed ASPE amendments for crypto asset accounting.', registration_url: 'https://events.frascanada.ca/webinar-aspe-crypto', board: boards.acsb },
    { title: 'Webinar: CSQM 1 — One Year In', slug: 'webinar-csqm-1-review', date: daysAgo(45), publishedDate: daysAgo(75), type: 'webinar' as const, description: 'Webinar reviewing the first year of CSQM 1 implementation across Canadian firms.', registration_url: 'https://events.frascanada.ca/webinar-csqm-1-review', board: boards.aasb },
    { title: 'Webinar: PSAB Conceptual Framework Update', slug: 'webinar-psab-concepts', date: daysAgo(60), publishedDate: daysAgo(90), type: 'webinar' as const, description: 'Overview of PSAB\'s evolving conceptual framework for public sector financial reporting.', registration_url: 'https://events.frascanada.ca/webinar-psab-concepts', board: boards.psab },
    { title: 'Comment Deadline: CSDS 1 Re-exposure Draft', slug: 'deadline-csds-1-re', date: daysFromNow(75), type: 'event' as const, description: 'Deadline for submitting comments on the CSSB re-exposure draft for CSDS 1 General Requirements.', board: boards.cssb },
    { title: 'Comment Deadline: Revenue PS 3400', slug: 'deadline-ps-3400', date: daysFromNow(60), type: 'event' as const, description: 'Deadline for submitting comments on the PSAB exposure draft for PS 3400 Revenue.', board: boards.psab },
    { title: 'Comment Deadline: CSSA 5000 Sustainability Assurance', slug: 'deadline-cssa-5000', date: daysFromNow(90), type: 'event' as const, description: 'Deadline for submitting comments on the AASB exposure draft for CSSA 5000.', board: boards.aasb },
    { title: 'Comment Deadline: NFP Contributions Discussion Paper', slug: 'deadline-nfp-dp', date: daysFromNow(55), type: 'event' as const, description: 'Deadline for submitting comments on the AcSB discussion paper on NFP contributions revenue.', board: boards.acsb },
    // Future board meetings
    { title: 'PSAB Board Meeting — May 2026', slug: 'psab-meeting-may-2026', date: daysFromNow(50), publishedDate: daysAgo(7), type: 'meeting' as const, description: 'Regular PSAB meeting. Revenue standard approval discussion anticipated.', board: boards.psab },
    { title: 'AcSB Board Meeting — May 2026', slug: 'acsb-meeting-may-2026', date: daysFromNow(45), publishedDate: daysAgo(5), type: 'meeting' as const, description: 'Regular AcSB meeting. Crypto assets deliberations.', board: boards.acsb },
    { title: 'CSSB Board Meeting — April 2026', slug: 'cssb-meeting-apr-2026', date: daysFromNow(20), publishedDate: daysAgo(10), type: 'meeting' as const, description: 'Regular CSSB meeting. CSDS 1 re-exposure feedback analysis.', board: boards.cssb },
    { title: 'AcSB Board Meeting — June 2026', slug: 'acsb-meeting-jun-2026', date: daysFromNow(75), publishedDate: daysAgo(3), type: 'meeting' as const, description: 'Regular AcSB meeting. NFP contributions and IFRS updates.', board: boards.acsb },
    { title: 'PSAB Board Meeting — June 2026', slug: 'psab-meeting-jun-2026', date: daysFromNow(80), publishedDate: daysAgo(2), type: 'meeting' as const, description: 'Regular PSAB meeting. Employee benefits project update.', board: boards.psab },
    { title: 'AASB Board Meeting — June 2026', slug: 'aasb-meeting-jun-2026', date: daysFromNow(70), publishedDate: daysAgo(4), type: 'meeting' as const, description: 'Regular AASB meeting. CSSA 5000 deliberations.', board: boards.aasb },
    { title: 'CSSB Board Meeting — May 2026', slug: 'cssb-meeting-may-2026', date: daysFromNow(55), publishedDate: daysAgo(3), type: 'meeting' as const, description: 'Regular CSSB meeting. CSDS 2 progress review.', board: boards.cssb },
    // Additional past webinars
    { title: 'Webinar: NFP Contributions — A Discussion', slug: 'webinar-nfp-discussion', date: daysAgo(20), publishedDate: daysAgo(40), type: 'webinar' as const, description: 'Webinar discussing the AcSB discussion paper on NFP contributions revenue recognition.', registration_url: 'https://events.frascanada.ca/webinar-nfp-discussion', board: boards.acsb },
    { title: 'Webinar: Climate Disclosure in Canada', slug: 'webinar-climate-disclosure', date: daysAgo(50), publishedDate: daysAgo(80), type: 'webinar' as const, description: 'Webinar on climate disclosure requirements under CSDS 2 and international comparisons.', registration_url: 'https://events.frascanada.ca/webinar-climate-disclosure', board: boards.cssb },
    { title: 'Webinar: CAS 600 Group Audits — Lessons Learned', slug: 'webinar-cas-600-lessons', date: daysAgo(80), publishedDate: daysAgo(110), type: 'webinar' as const, description: 'Webinar reviewing implementation experiences with the revised CAS 600.', registration_url: 'https://events.frascanada.ca/webinar-cas-600-lessons', board: boards.aasb },
    { title: 'Webinar: Understanding PS 3280 Asset Retirement Obligations', slug: 'webinar-ps-3280', date: daysAgo(100), publishedDate: daysAgo(130), type: 'webinar' as const, description: 'Webinar providing an overview of PS 3280 and practical implementation guidance.', registration_url: 'https://events.frascanada.ca/webinar-ps-3280', board: boards.psab },
    // Decision summaries as events
    { title: 'AcSB Decision Summary — March 2026', slug: 'acsb-decision-mar-2026', date: daysAgo(5), publishedDate: daysAgo(3), type: 'event' as const, description: 'Summary of decisions made at the March 2026 AcSB board meeting.', board: boards.acsb },
    { title: 'PSAB Decision Summary — March 2026', slug: 'psab-decision-mar-2026', date: daysAgo(3), publishedDate: daysAgo(1), type: 'event' as const, description: 'Summary of decisions made at the March 2026 PSAB board meeting.', board: boards.psab },
    { title: 'AASB Decision Summary — February 2026', slug: 'aasb-decision-feb-2026', date: daysAgo(30), publishedDate: daysAgo(25), type: 'event' as const, description: 'Summary of decisions from the February 2026 AASB board meeting.', board: boards.aasb },
    { title: 'CSSB Decision Summary — February 2026', slug: 'cssb-decision-feb-2026', date: daysAgo(30), publishedDate: daysAgo(25), type: 'event' as const, description: 'Summary of decisions from the February 2026 CSSB board meeting.', board: boards.cssb },
  ]

  const allEventsData = [...eventsData, ...additionalEventsData]
  for (const event of allEventsData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.create({ collection: 'events', data: event } as any)
  }
  console.log(`    ✓ Created ${allEventsData.length} events`)

  // -------------------------------------------------------------------------
  // 8. NAVIGATION GLOBAL
  // -------------------------------------------------------------------------
  console.log('  Configuring navigation...')

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      utility_links: [
        { label: 'About Us', url: '/about', has_dropdown: true },
        { label: 'Boards', url: '/boards', has_dropdown: true },
        { label: 'Contact', url: '/contact', has_dropdown: false },
        { label: 'Careers', url: '/careers', has_dropdown: false },
      ],
      primary_nav: [
        { label: 'Active Projects', url: '/active-projects', has_dropdown: false },
        { label: 'Open Consultations', url: '/open-consultations', has_dropdown: false },
        { label: 'News & Updates', url: '/news', has_dropdown: false },
        { label: 'Standards', url: '/standards', has_dropdown: true },
      ],
      mega_menu: [
        {
          trigger_label: 'About Us',
          columns: [
            {
              heading: 'Organization',
              links: [
                { label: 'About RAS Canada', url: '/about' },
                { label: 'Our Mission', url: '/about/mission' },
                { label: 'Oversight Council (RASOC)', url: '/about/rasoc' },
                { label: 'Annual Reports', url: '/about/annual-reports' },
              ],
            },
            {
              heading: 'Get Involved',
              links: [
                { label: 'Volunteer Opportunities', url: '/volunteer' },
                { label: 'Careers', url: '/careers' },
                { label: 'Subscribe to Updates', url: '/subscribe' },
              ],
            },
          ],
        },
        {
          trigger_label: 'Boards',
          columns: [
            {
              heading: 'Standards Boards',
              links: [
                { label: 'Accounting Standards Board (AcSB)', url: '/boards/acsb' },
                { label: 'Auditing and Assurance Standards Board (AASB)', url: '/boards/aasb' },
              ],
            },
            {
              heading: 'Councils',
              links: [
                { label: 'Public Sector Accounting Board (PSAB)', url: '/boards/psab' },
                { label: 'Canadian Sustainability Standards Board (CSSB)', url: '/boards/cssb' },
              ],
            },
          ],
        },
        {
          trigger_label: 'Standards',
          columns: [
            {
              heading: 'Accounting',
              links: [
                { label: 'IFRS Accounting Standards', url: '/standards/ifrs' },
                { label: 'ASPE', url: '/standards/aspe' },
                { label: 'Not-for-Profit', url: '/standards/nfpo' },
                { label: 'Pension Plans', url: '/standards/pension-plans' },
              ],
            },
            {
              heading: 'Public Sector & Assurance',
              links: [
                { label: 'Public Sector Accounting Standards', url: '/standards/psas' },
                { label: 'Canadian Auditing Standards', url: '/standards/cas' },
                { label: 'Quality Management', url: '/standards/csqm' },
              ],
            },
            {
              heading: 'Sustainability',
              links: [
                { label: 'Canadian Sustainability Disclosure Standards', url: '/standards/csds' },
              ],
            },
          ],
        },
      ],
    },
  })
  console.log('    ✓ Navigation configured')

  // -------------------------------------------------------------------------
  // 9. FOOTER GLOBAL
  // -------------------------------------------------------------------------
  console.log('  Configuring footer...')

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      columns: [
        {
          heading: 'Standards',
          links: [
            { label: 'IFRS Accounting Standards', url: '/standards/ifrs' },
            { label: 'ASPE', url: '/standards/aspe' },
            { label: 'Public Sector Standards', url: '/standards/psas' },
            { label: 'Auditing Standards', url: '/standards/cas' },
            { label: 'Sustainability Standards', url: '/standards/csds' },
          ],
        },
        {
          heading: 'Quick Links',
          links: [
            { label: 'Active Projects', url: '/active-projects' },
            { label: 'Open Consultations', url: '/open-consultations' },
            { label: 'News & Updates', url: '/news' },
            { label: 'Contact Us', url: '/contact' },
            { label: 'Careers', url: '/careers' },
          ],
        },
      ],
      boards_links: [
        { label: 'AcSB', url: '/boards/acsb' },
        { label: 'PSAB', url: '/boards/psab' },
        { label: 'AASB', url: '/boards/aasb' },
        { label: 'CSSB', url: '/boards/cssb' },
        { label: 'RASOC', url: '/about/rasoc' },
      ],
      quick_links: [
        { label: 'Privacy Policy', url: '/privacy' },
        { label: 'Terms of Use', url: '/terms' },
        { label: 'Accessibility', url: '/accessibility' },
        { label: 'Sitemap', url: '/sitemap' },
      ],
      newsletter_heading: 'Stay Informed',
      newsletter_description: 'Subscribe to receive updates on standards, consultations, and events from RAS Canada.',
    },
  })
  console.log('    ✓ Footer configured')

  // -------------------------------------------------------------------------
  // 10. HOMEPAGE GLOBAL
  // -------------------------------------------------------------------------
  console.log('  Configuring homepage...')

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        type: 'highImpact',
        richText: richTextWithHeading(
          'h1',
          'Setting the Standards for Financial Reporting in Canada',
          'RAS Canada serves the public interest by establishing high-quality accounting, auditing, and sustainability standards.',
        ),
        links: [
          {
            link: {
              type: 'custom',
              url: '/active-projects',
              label: 'View Active Projects',
              newTab: false,
              appearance: 'default',
            },
          },
          {
            link: {
              type: 'custom',
              url: '/open-consultations',
              label: 'Open Consultations',
              newTab: false,
              appearance: 'outline',
            },
          },
        ],
        search_enabled: true,
      },
      layout: [
        // CTA Block (New to FRAS)
        {
          blockType: 'cta',
          richText: richTextWithHeading(
            'h2',
            'New to RAS Canada?',
            'Learn about our boards, standards, and how we serve the Canadian financial reporting ecosystem.',
          ),
          links: [
            {
              link: {
                type: 'custom',
                url: '/about',
                label: 'About RAS Canada',
                newTab: false,
                appearance: 'default',
              },
            },
          ],
          variant: 'light',
        },
        // News Grid Block
        {
          blockType: 'newsGrid',
          heading: 'Latest News & Updates',
          news_count: 3,
          show_view_all: true,
          populateBy: 'collection',
        },
        // Browse By Standard Block
        {
          blockType: 'browseByStandard',
          heading: 'Browse by Standard',
          categories: [
            {
              name: 'Sustainability',
              links: [
                { label: 'Canadian Sustainability Disclosure Standards', url: '/standards/csds' },
              ],
            },
            {
              name: 'Accounting',
              links: [
                { label: 'IFRS Accounting Standards', url: '/standards/ifrs' },
                { label: 'ASPE', url: '/standards/aspe' },
                { label: 'Not-for-Profit Organizations', url: '/standards/nfpo' },
                { label: 'Pension Plans', url: '/standards/pension-plans' },
              ],
            },
            {
              name: 'Public Sector',
              links: [
                { label: 'Public Sector Accounting Standards', url: '/standards/psas' },
                { label: 'Public Sector Guidelines', url: '/standards/ps-guidelines' },
              ],
            },
            {
              name: 'Assurance',
              links: [
                { label: 'Canadian Auditing Standards', url: '/standards/cas' },
                { label: 'Quality Management', url: '/standards/csqm' },
              ],
            },
          ],
        },
      ],
    },
  })
  console.log('    ✓ Homepage configured')

  // -------------------------------------------------------------------------
  // 11. SEARCH CONFIG GLOBAL
  // -------------------------------------------------------------------------
  console.log('  Configuring search config...')

  await payload.updateGlobal({
    slug: 'search-config',
    data: {
      popular_tags: [
        { label: 'IFRS', query: 'IFRS' },
        { label: 'Sustainability', query: 'sustainability' },
        { label: 'Public Sector', query: 'public sector' },
        { label: 'ASPE', query: 'ASPE' },
        { label: 'Revenue', query: 'revenue' },
        { label: 'Climate', query: 'climate' },
      ],
    },
  })
  console.log('    ✓ Search config configured')

  // =========================================================================
  // PHASE 2 SEED DATA (Epic 21)
  // =========================================================================

  // -------------------------------------------------------------------------
  // 12. BOARD MEMBERS (24 total: 6 per board across 4 boards)
  // -------------------------------------------------------------------------
  console.log('  Creating board members...')

  const boardMembersData = [
    // AcSB members
    { name: 'Armand Capisciolto', credentials: 'FCPA, FCA, CPA(MI)', role: 'chair' as const, roleLabel: 'Chair', appointedDate: '2015-04-01', termExpires: '2028-03-31', sortOrder: 1, board: boards.acsb },
    { name: 'Chris Kovalchuk', credentials: 'CFA, MBA', role: 'vice-chair' as const, roleLabel: 'Vice-Chair', appointedDate: '2021-04-01', termExpires: '2027-03-31', sortOrder: 2, board: boards.acsb },
    { name: 'Crystal Cruickshank', credentials: 'CPA, CA', role: 'voting-member' as const, roleLabel: '', appointedDate: '2024-04-01', termExpires: '2027-03-31', sortOrder: 3, board: boards.acsb },
    { name: 'Johnathon Cziffra', credentials: 'PhD, CPA, CA', role: 'voting-member' as const, roleLabel: '', appointedDate: '2023-04-01', termExpires: '2026-03-31', sortOrder: 4, board: boards.acsb },
    { name: 'Gary J. Hum', credentials: 'CPA, CA, CPA (IL), CFA, MBA', role: 'voting-member' as const, roleLabel: '', appointedDate: '2023-04-01', termExpires: '2026-03-31', sortOrder: 5, board: boards.acsb },
    { name: 'Howard Leung', credentials: 'CPA, CA, CFA', role: 'voting-member' as const, roleLabel: '', appointedDate: '2021-04-01', termExpires: '2028-03-31', sortOrder: 6, board: boards.acsb },
    // PSAB members
    { name: 'Michael Puskaric', credentials: 'FCPA, FCA', role: 'chair' as const, roleLabel: 'Chair', appointedDate: '2019-04-01', termExpires: '2028-03-31', sortOrder: 1, board: boards.psab },
    { name: 'Sandra Biancucci', credentials: 'CPA, CA', role: 'vice-chair' as const, roleLabel: 'Vice-Chair', appointedDate: '2020-04-01', termExpires: '2027-03-31', sortOrder: 2, board: boards.psab },
    { name: 'David Patton', credentials: 'CPA, CGA', role: 'voting-member' as const, roleLabel: '', appointedDate: '2022-04-01', termExpires: '2025-03-31', sortOrder: 3, board: boards.psab },
    { name: 'Nathalie Bherer', credentials: 'CPA, CA', role: 'voting-member' as const, roleLabel: '', appointedDate: '2023-04-01', termExpires: '2026-03-31', sortOrder: 4, board: boards.psab },
    { name: 'Jaspreet Grewal', credentials: 'CPA', role: 'voting-member' as const, roleLabel: '', appointedDate: '2024-04-01', termExpires: '2027-03-31', sortOrder: 5, board: boards.psab },
    { name: 'Thomas Chicken', credentials: 'CPA, CA, MBA', role: 'voting-member' as const, roleLabel: '', appointedDate: '2021-04-01', termExpires: '2027-03-31', sortOrder: 6, board: boards.psab },
    // AASB members
    { name: 'Robert Macaulay', credentials: 'FCPA, FCA', role: 'chair' as const, roleLabel: 'Chair', appointedDate: '2020-04-01', termExpires: '2026-03-31', sortOrder: 1, board: boards.aasb },
    { name: 'Karen Pinnock', credentials: 'CPA, CA', role: 'vice-chair' as const, roleLabel: 'Vice-Chair', appointedDate: '2021-04-01', termExpires: '2027-03-31', sortOrder: 2, board: boards.aasb },
    { name: 'Sylvain Durocher', credentials: 'CPA Auditeur', role: 'voting-member' as const, roleLabel: '', appointedDate: '2022-04-01', termExpires: '2025-03-31', sortOrder: 3, board: boards.aasb },
    { name: 'Angela Bourassa', credentials: 'CPA, CA', role: 'voting-member' as const, roleLabel: '', appointedDate: '2023-04-01', termExpires: '2026-03-31', sortOrder: 4, board: boards.aasb },
    { name: 'Daniel Robertson', credentials: 'CPA, CA, CPA (IL)', role: 'voting-member' as const, roleLabel: '', appointedDate: '2024-04-01', termExpires: '2027-03-31', sortOrder: 5, board: boards.aasb },
    { name: 'Rebecca Wong', credentials: 'CPA, CA', role: 'voting-member' as const, roleLabel: '', appointedDate: '2022-04-01', termExpires: '2028-03-31', sortOrder: 6, board: boards.aasb },
    // CSSB members
    { name: 'Charles-Antoine St-Jean', credentials: 'FCPA, FCA', role: 'chair' as const, roleLabel: 'Chair', appointedDate: '2023-07-01', termExpires: '2026-06-30', sortOrder: 1, board: boards.cssb },
    { name: 'Nadine Leblond', credentials: 'CPA, CA, MBA', role: 'vice-chair' as const, roleLabel: 'Vice-Chair', appointedDate: '2023-07-01', termExpires: '2026-06-30', sortOrder: 2, board: boards.cssb },
    { name: 'Priya Venkatesh', credentials: 'CPA, CA', role: 'voting-member' as const, roleLabel: '', appointedDate: '2023-07-01', termExpires: '2026-06-30', sortOrder: 3, board: boards.cssb },
    { name: 'Andrew Bebbington', credentials: 'PhD', role: 'voting-member' as const, roleLabel: '', appointedDate: '2023-07-01', termExpires: '2026-06-30', sortOrder: 4, board: boards.cssb },
    { name: 'Melanie Fay', credentials: 'CPA, CA', role: 'voting-member' as const, roleLabel: '', appointedDate: '2024-01-01', termExpires: '2027-01-01', sortOrder: 5, board: boards.cssb },
    { name: 'Jean-Pierre Duquette', credentials: 'CPA, CA, ICD.D', role: 'voting-member' as const, roleLabel: '', appointedDate: '2024-01-01', termExpires: '2027-01-01', sortOrder: 6, board: boards.cssb },
  ]

  for (const member of boardMembersData) {
    await payload.create({ collection: 'board-members', data: member, draft: true })
  }
  console.log(`    ✓ Created ${boardMembersData.length} board members`)

  // -------------------------------------------------------------------------
  // 13. COMMITTEES (27 total across 4 boards)
  // -------------------------------------------------------------------------
  console.log('  Creating committees...')

  const committeesData = [
    // AcSB committees (13)
    { name: 'Academic Advisory Committee', slug: 'aac', sortOrder: 1, status: 'active' as const, board: boards.acsb, description: richText('The Academic Advisory Committee provides advice to the AcSB on academic research relevant to Canadian accounting standards development.'), members: [{ name: 'Dr. Patricia Walters, PhD, CPA', role: 'Chair', organization: 'University of Toronto' }, { name: 'Dr. Mark Sullivan, PhD', role: 'Member', organization: 'McGill University' }, { name: 'Dr. Ying Chen, PhD, CPA', role: 'Member', organization: 'University of British Columbia' }, { name: 'Dr. François Leduc, PhD', role: 'Member', organization: 'HEC Montréal' }], meetingReports: [{ title: 'December 2025 Meeting Report', date: daysAgo(90) }, { title: 'September 2025 Meeting Report', date: daysAgo(180) }] },
    { name: 'Agriculture Advisory Group', slug: 'aag', sortOrder: 2, status: 'active' as const, board: boards.acsb, description: richText('The Agriculture Advisory Group provides input on accounting issues specific to the agriculture sector.'), members: [{ name: 'Janet Morrison, CPA, CA', role: 'Chair', organization: 'Farm Credit Canada' }, { name: 'Robert Fields, CPA', role: 'Member', organization: 'MNP LLP' }, { name: 'Linda Parsons, CPA, CA', role: 'Member', organization: 'BDO Canada LLP' }], meetingReports: [{ title: 'November 2025 Meeting Report', date: daysAgo(120) }] },
    { name: 'Canadian Private Enterprise User Advisory Committee', slug: 'cpuc', sortOrder: 3, status: 'active' as const, board: boards.acsb, description: richText('The CPUC provides the AcSB with input on accounting issues affecting users of private enterprise financial statements.'), members: [{ name: 'Stephen Reid, CFA, MBA', role: 'Chair', organization: 'Business Development Bank of Canada' }, { name: 'Alison Knight, CPA, CA', role: 'Member', organization: 'National Bank of Canada' }, { name: 'Derek Wu, CFA', role: 'Member', organization: 'Export Development Canada' }, { name: 'Marie-Josée Tremblay, CPA', role: 'Member', organization: 'Caisse de dépôt et placement du Québec' }], meetingReports: [{ title: 'January 2026 Meeting Report', date: daysAgo(60) }] },
    { name: 'IFRS Accounting Standards Discussion Group', slug: 'ifrsdg', sortOrder: 4, status: 'active' as const, board: boards.acsb, description: richText('The IFRS Discussion Group discusses IFRS application issues in the Canadian context and reports findings to the AcSB.'), members: [{ name: 'Margaret Chicken, FCPA, FCA', role: 'Chair', organization: 'Deloitte LLP' }, { name: 'Paul Henderson, CPA, CA', role: 'Member', organization: 'PwC Canada' }, { name: 'Sarah Nguyen, CPA, CA', role: 'Member', organization: 'KPMG LLP' }, { name: 'James Clarke, CPA, CA', role: 'Member', organization: 'EY Canada' }, { name: 'Natasha Kowalski, CPA, CA', role: 'Member', organization: 'Grant Thornton LLP' }], meetingReports: [{ title: 'February 2026 Meeting Report', date: daysAgo(30) }, { title: 'November 2025 Meeting Report', date: daysAgo(120) }] },
    { name: 'IFRS Interpretations Committee Member Support Group', slug: 'iicmsg', sortOrder: 5, status: 'active' as const, board: boards.acsb, description: richText('This group supports the Canadian member of the IFRS Interpretations Committee.'), members: [{ name: 'Michael Adams, FCPA, FCA', role: 'Chair', organization: 'Deloitte LLP' }, { name: 'Karen Lee, CPA, CA', role: 'Member', organization: 'KPMG LLP' }, { name: 'Richard Stone, CPA, CA', role: 'Member', organization: 'PwC Canada' }], meetingReports: [] },
    { name: 'Insurance Transition Resource Group', slug: 'itrc', sortOrder: 6, status: 'active' as const, board: boards.acsb, description: richText('The Insurance TRG discusses implementation issues related to IFRS 17 Insurance Contracts.'), members: [{ name: 'Andrea McPherson, FCPA, FCA', role: 'Chair', organization: 'Sun Life Financial' }, { name: 'Daniel Fung, CPA, CA, FCIA', role: 'Member', organization: 'Manulife Financial' }, { name: 'Christine Beaulieu, CPA, CA', role: 'Member', organization: 'Intact Financial Corporation' }, { name: 'Raj Patel, FCIA, FSA', role: 'Member', organization: 'Great-West Lifeco' }], meetingReports: [{ title: 'October 2025 Meeting Report', date: daysAgo(150) }] },
    { name: 'Medium and Small Practitioners Advisory Committee', slug: 'mspac', sortOrder: 7, status: 'active' as const, board: boards.acsb, description: richText('MSPAC provides input to the AcSB on how accounting standards affect medium and small practitioners and their clients.'), members: [{ name: 'Brian Thompson, CPA, CA', role: 'Chair', organization: 'Thompson & Associates LLP' }, { name: 'Diane Leblanc, CPA', role: 'Member', organization: 'Raymond Chabot Grant Thornton' }, { name: 'George Panagakos, CPA, CA', role: 'Member', organization: 'BDO Canada LLP' }, { name: 'Sandra Hill, CPA, CA', role: 'Member', organization: 'MNP LLP' }], meetingReports: [{ title: 'January 2026 Meeting Report', date: daysAgo(60) }] },
    { name: 'Not-for-Profit Advisory Committee', slug: 'nfpac', sortOrder: 8, status: 'active' as const, board: boards.acsb, description: richText('The NFPAC provides advice on accounting standards issues for not-for-profit organizations.'), members: [{ name: 'Elizabeth Warren, CPA, CA', role: 'Chair', organization: 'United Way Centraide Canada' }, { name: 'John McBride, CPA', role: 'Member', organization: 'Canadian Red Cross' }, { name: 'Catherine Desjardins, CPA, CA', role: 'Member', organization: 'YMCA Canada' }, { name: 'Robert Kim, CPA', role: 'Member', organization: 'University of Alberta' }], meetingReports: [{ title: 'December 2025 Meeting Report', date: daysAgo(90) }] },
    { name: 'Pension Plan Advisory Committee', slug: 'ppac', sortOrder: 9, status: 'active' as const, board: boards.acsb, description: richText('PPAC advises the AcSB on accounting standards for pension plans.'), members: [{ name: 'Victoria Singh, FCIA, FSA', role: 'Chair', organization: 'OMERS' }, { name: 'Peter Ducharme, CPA, CA', role: 'Member', organization: 'Teachers\' Pension Plan' }, { name: 'Anne Murray, FCIA', role: 'Member', organization: 'CPPIB' }], meetingReports: [] },
    { name: 'Private Enterprise Advisory Committee', slug: 'peac', sortOrder: 10, status: 'active' as const, board: boards.acsb, description: richText('PEAC advises the AcSB on accounting standards for private enterprises under ASPE.'), members: [{ name: 'Martin Savard, CPA, CA', role: 'Chair', organization: 'Mallette LLP' }, { name: 'Amy Richardson, CPA', role: 'Member', organization: 'BDO Canada LLP' }, { name: 'Kenneth Fong, CPA, CA', role: 'Member', organization: 'MNP LLP' }, { name: 'Deborah James, CPA, CA', role: 'Member', organization: 'Grant Thornton LLP' }, { name: 'Steven Park, CPA', role: 'Member', organization: 'PwC Canada' }], meetingReports: [{ title: 'February 2026 Meeting Report', date: daysAgo(30) }] },
    { name: 'Rate-regulated Activities Transition Resource Group', slug: 'rratrg', sortOrder: 11, status: 'active' as const, board: boards.acsb, description: richText('The RRA TRG discusses implementation issues related to IFRS 14 and the IASB\'s rate-regulated activities project.'), members: [{ name: 'William Mackenzie, CPA, CA', role: 'Chair', organization: 'Hydro-Québec' }, { name: 'Rachel Green, CPA, CA', role: 'Member', organization: 'Ontario Energy Board' }, { name: 'Brent Cooper, CPA, CA', role: 'Member', organization: 'BC Hydro' }], meetingReports: [] },
    { name: 'Risk Mitigation Accounting Working Group', slug: 'rmawg', sortOrder: 12, status: 'active' as const, board: boards.acsb, description: richText('This working group considers risk mitigation accounting issues under IFRS 9 Financial Instruments.'), members: [{ name: 'Irene Chen, CPA, CA', role: 'Chair', organization: 'Royal Bank of Canada' }, { name: 'David Mitchell, CPA, CA', role: 'Member', organization: 'TD Bank Group' }, { name: 'Sophie Bergeron, CPA, CA', role: 'Member', organization: 'National Bank of Canada' }], meetingReports: [] },
    { name: 'User Advisory Committee', slug: 'uac', sortOrder: 13, status: 'active' as const, board: boards.acsb, description: richText('The User Advisory Committee provides the AcSB with the perspective of users of financial statements.'), members: [{ name: 'Alexander Fraser, CFA', role: 'Chair', organization: 'Canada Pension Plan Investment Board' }, { name: 'Lisa Wang, CFA, CPA', role: 'Member', organization: 'Ontario Teachers\' Pension Plan' }, { name: 'James Brown, CFA', role: 'Member', organization: 'RBC Global Asset Management' }, { name: 'Maria Santos, CFA', role: 'Member', organization: 'BMO Capital Markets' }], meetingReports: [{ title: 'January 2026 Meeting Report', date: daysAgo(60) }] },
    // PSAB committees (8)
    { name: 'Public Sector Accounting Discussion Group', slug: 'psadg', sortOrder: 1, status: 'active' as const, board: boards.psab, description: richText('The PSADG discusses application issues related to Public Sector Accounting Standards.'), members: [{ name: 'Carol Mitchell, FCPA, FCGA', role: 'Chair', organization: 'Government of Ontario' }, { name: 'Pierre Tremblay, CPA, CA', role: 'Member', organization: 'Government of Quebec' }, { name: 'Helen Darveau, CPA', role: 'Member', organization: 'City of Ottawa' }, { name: 'Mark Johnson, CPA, CA', role: 'Member', organization: 'Government of Alberta' }], meetingReports: [{ title: 'February 2026 Meeting Report', date: daysAgo(30) }] },
    { name: 'International Advisory Group', slug: 'iag', sortOrder: 2, status: 'active' as const, board: boards.psab, description: richText('The IAG advises PSAB on international public sector accounting developments and the work of the IPSASB.'), members: [{ name: 'Brian Fenske, FCPA, FCA', role: 'Chair', organization: 'Office of the Auditor General of Canada' }, { name: 'Nancy Cheng, FCPA, FCA', role: 'Member', organization: 'Treasury Board of Canada Secretariat' }, { name: 'Albert Romain, CPA, CA', role: 'Member', organization: 'CPA Canada' }], meetingReports: [{ title: 'November 2025 Meeting Report', date: daysAgo(120) }] },
    { name: 'Government Not-for-Profit Advisory Committee', slug: 'gnfpac', sortOrder: 3, status: 'active' as const, board: boards.psab, description: richText('The GNFPAC advises PSAB on accounting issues for government not-for-profit organizations.'), members: [{ name: 'Sandra Lawson, CPA, CA', role: 'Chair', organization: 'University Health Network' }, { name: 'Marie-Hélène Poitras, CPA', role: 'Member', organization: 'CHU de Québec' }, { name: 'Jennifer Fung, CPA, CA', role: 'Member', organization: 'Alberta Health Services' }], meetingReports: [] },
    { name: 'Concepts Underlying Financial Performance Task Force', slug: 'cufptf', sortOrder: 4, status: 'active' as const, board: boards.psab, description: richText('This task force examines the concepts underlying the reporting of financial performance in the public sector.'), members: [{ name: 'Kevin Graham, FCPA, FCA', role: 'Chair', organization: 'CPA Canada' }, { name: 'Lisa Brandt, CPA, CA', role: 'Member', organization: 'Government of Saskatchewan' }, { name: 'Patrick Moreau, CPA, CA', role: 'Member', organization: 'Government of New Brunswick' }], meetingReports: [] },
    { name: 'Financial Instruments Government-owned Enterprises', slug: 'figoe', sortOrder: 5, status: 'active' as const, board: boards.psab, description: richText('This group examines financial instruments accounting for government-owned enterprises.'), members: [{ name: 'Michael Chicken, CPA, CA', role: 'Chair', organization: 'Ontario Power Generation' }, { name: 'Donna Chicken, CPA, CA', role: 'Member', organization: 'BC Hydro' }, { name: 'Raymond Li, CPA, CA', role: 'Member', organization: 'Hydro-Québec' }], meetingReports: [] },
    { name: 'Technology Advisory Group', slug: 'tag', sortOrder: 6, status: 'active' as const, board: boards.psab, description: richText('The TAG provides guidance on technology-related accounting matters in the public sector.'), members: [{ name: 'Sanjay Patel, CPA, CGA', role: 'Chair', organization: 'Shared Services Canada' }, { name: 'Christine Lee, CPA', role: 'Member', organization: 'Government of British Columbia' }, { name: 'Tom Anderson, CPA, CA', role: 'Member', organization: 'City of Toronto' }], meetingReports: [{ title: 'December 2025 Meeting Report', date: daysAgo(90) }] },
    { name: 'Revenue Working Group', slug: 'rwg', sortOrder: 7, status: 'active' as const, board: boards.psab, description: richText('The Revenue Working Group supports the development of the proposed revenue standard PS 3400.'), members: [{ name: 'Anne-Marie Boucher, CPA, CA', role: 'Chair', organization: 'Government of Canada' }, { name: 'Doug Henderson, CPA, CA', role: 'Member', organization: 'Government of Ontario' }, { name: 'Sarah Park, CPA', role: 'Member', organization: 'City of Calgary' }], meetingReports: [{ title: 'January 2026 Meeting Report', date: daysAgo(60) }] },
    { name: 'Employee Benefits Advisory Group', slug: 'ebag', sortOrder: 8, status: 'inactive' as const, board: boards.psab, description: richText('The EBAG advised PSAB on accounting for employee benefits in the public sector. This group has completed its mandate.'), members: [{ name: 'Patricia Henderson, CPA, CA', role: 'Chair', organization: 'Government of Manitoba' }, { name: 'Claude Bélanger, CPA, CA', role: 'Member', organization: 'Government of Quebec' }], meetingReports: [] },
    // AASB committees (5)
    { name: 'Auditing and Assurance Standards Board Standing Committee', slug: 'aasbsc', sortOrder: 1, status: 'active' as const, board: boards.aasb, description: richText('The Standing Committee assists the AASB with standards development and international engagement.'), members: [{ name: 'Kathleen Wright, FCPA, FCA', role: 'Chair', organization: 'EY Canada' }, { name: 'Jean-Paul Leclerc, CPA Auditeur', role: 'Member', organization: 'Deloitte LLP' }, { name: 'Bruce Anderson, CPA, CA', role: 'Member', organization: 'KPMG LLP' }, { name: 'Maria Gonzalez, CPA, CA', role: 'Member', organization: 'PwC Canada' }], meetingReports: [{ title: 'February 2026 Meeting Report', date: daysAgo(30) }] },
    { name: 'Sustainability Assurance Advisory Committee', slug: 'sac', sortOrder: 2, status: 'active' as const, board: boards.aasb, description: richText('The SAC advises the AASB on the development of Canadian sustainability assurance standards.'), members: [{ name: 'Dawn McGeachy, CPA, CA', role: 'Chair', organization: 'KPMG LLP' }, { name: 'Alan Brooks, CPA, CA', role: 'Member', organization: 'Deloitte LLP' }, { name: 'Nadia Chowdhury, CPA', role: 'Member', organization: 'EY Canada' }], meetingReports: [{ title: 'January 2026 Meeting Report', date: daysAgo(60) }] },
    { name: 'Quality Control Advisory Group', slug: 'qcag', sortOrder: 3, status: 'active' as const, board: boards.aasb, description: richText('The QCAG provides guidance on implementation of CSQM 1 and related quality management standards.'), members: [{ name: 'Robert Walsh, CPA, CA', role: 'Chair', organization: 'Grant Thornton LLP' }, { name: 'Stephanie Morris, CPA, CA', role: 'Member', organization: 'BDO Canada LLP' }, { name: 'Philippe Lavoie, CPA Auditeur', role: 'Member', organization: 'MNP LLP' }], meetingReports: [] },
    { name: 'Fraud Advisory Group', slug: 'fraud-advisory-group', sortOrder: 4, status: 'active' as const, board: boards.aasb, description: richText('The Fraud Advisory Group advises the AASB on auditing standards related to fraud detection and prevention.'), members: [{ name: 'Gordon Stewart, FCPA, FCA', role: 'Chair', organization: 'Forensic & Integrity Services' }, { name: 'Laura Chen, CPA, CA, CFE', role: 'Member', organization: 'PwC Canada' }, { name: 'Jeffrey Brown, CPA, CA', role: 'Member', organization: 'RCMP Financial Crime Unit' }], meetingReports: [] },
    { name: 'Going Concern Advisory Group', slug: 'going-concern-advisory-group', sortOrder: 5, status: 'inactive' as const, board: boards.aasb, description: richText('This advisory group provided input on going concern auditing standards. The group has completed its mandate.'), members: [{ name: 'Douglas Taylor, CPA, CA', role: 'Chair', organization: 'EY Canada' }, { name: 'Michelle Fontaine, CPA, CA', role: 'Member', organization: 'Deloitte LLP' }], meetingReports: [] },
    // CSSB committee (1)
    { name: 'CSSB Implementation Committee', slug: 'implementation-committee', sortOrder: 1, status: 'active' as const, board: boards.cssb, description: richText('The Implementation Committee supports the CSSB in developing implementation guidance for Canadian Sustainability Disclosure Standards.'), members: [{ name: 'Rachel Dutton, CPA, CA', role: 'Chair', organization: 'TMX Group' }, { name: 'Marcus Thompson, MBA', role: 'Member', organization: 'RBC Capital Markets' }, { name: 'Isabelle Roy, CPA, CA', role: 'Member', organization: 'Caisse de dépôt et placement du Québec' }, { name: 'David Kim, CPA', role: 'Member', organization: 'Canada Pension Plan Investment Board' }], meetingReports: [{ title: 'February 2026 Meeting Report', date: daysAgo(30) }, { title: 'November 2025 Meeting Report', date: daysAgo(120) }] },
  ]

  for (const committee of committeesData) {
    await payload.create({ collection: 'committees', data: committee, draft: true })
  }
  console.log(`    ✓ Created ${committeesData.length} committees`)

  // -------------------------------------------------------------------------
  // 14. RESOURCES (32 total across categories and boards)
  // -------------------------------------------------------------------------
  console.log('  Creating resources...')

  const resourcesData = [
    // AcSB resources (12)
    { title: 'Understanding IFRS 17 Insurance Contracts', slug: 'understanding-ifrs-17', date: daysAgo(60), category: 'Article' as const, resourceType: 'Webpage' as const, excerpt: 'An overview of IFRS 17 Insurance Contracts and its impact on Canadian insurers.', content: richText('IFRS 17 Insurance Contracts became effective for annual reporting periods beginning on or after January 1, 2023.', 'This article provides an overview of the key requirements and their impact on Canadian insurance companies.'), status: 'published' as const, board: boards.acsb, standard: standards.ifrs },
    { title: 'ASPE Disclosure Improvements Summary', slug: 'aspe-disclosure-improvements', date: daysAgo(45), category: 'In Brief' as const, resourceType: 'PDF' as const, excerpt: 'Summary of the approved amendments to ASPE disclosure requirements for private enterprises.', status: 'published' as const, board: boards.acsb, standard: standards.aspe },
    { title: 'NFP Revenue Recognition Guide', slug: 'nfp-revenue-recognition-guide', date: daysAgo(90), category: 'Guidance' as const, resourceType: 'PDF' as const, excerpt: 'Practical guidance on applying revenue recognition requirements for not-for-profit organizations.', status: 'published' as const, board: boards.acsb, standard: standards.nfpo },
    { title: 'Pension Plan Financial Reporting Update 2026', slug: 'pension-plan-update-2026', date: daysAgo(30), category: 'Article' as const, resourceType: 'Webpage' as const, excerpt: 'Latest updates on financial reporting requirements for pension plans in Canada.', content: richText('This update covers recent developments in pension plan accounting standards and their practical implications.'), status: 'published' as const, board: boards.acsb, standard: standards['pension-plans'] },
    { title: 'Crypto Assets Accounting: What You Need to Know', slug: 'crypto-assets-what-to-know', date: daysAgo(15), category: 'In Brief' as const, resourceType: 'Webpage' as const, excerpt: 'Key points from the AcSB exposure draft on accounting for crypto assets under ASPE.', content: richText('The AcSB has proposed new guidance on accounting for crypto assets under Accounting Standards for Private Enterprises.', 'This summary highlights the key proposals and what they mean for private enterprises holding crypto assets.'), status: 'published' as const, board: boards.acsb, standard: standards.aspe },
    { title: 'IFRS 15 Post-Implementation Review Findings', slug: 'ifrs-15-pir-findings', date: daysAgo(120), category: 'Article' as const, resourceType: 'PDF' as const, excerpt: 'Key findings from the Canadian post-implementation review of IFRS 15 Revenue from Contracts with Customers.', status: 'published' as const, board: boards.acsb, standard: standards.ifrs },
    { title: 'Webinar: IFRS 18 Classification Changes', slug: 'webinar-ifrs-18', date: daysAgo(40), category: 'Webinar' as const, resourceType: 'Video' as const, excerpt: 'Recorded webinar discussing the key classification and presentation changes introduced by IFRS 18.', externalUrl: 'https://events.frascanada.ca/webinar-ifrs-18', status: 'published' as const, board: boards.acsb, standard: standards.ifrs },
    { title: 'Webinar: NFP Contributions Revenue', slug: 'webinar-nfp-contributions', date: daysAgo(75), category: 'Webinar' as const, resourceType: 'Video' as const, excerpt: 'Webinar on the AcSB discussion paper addressing contributions revenue recognition for not-for-profit organizations.', externalUrl: 'https://events.frascanada.ca/webinar-nfp-contributions', status: 'published' as const, board: boards.acsb, standard: standards.nfpo },
    { title: 'AcSB Due Process Handbook', slug: 'acsb-due-process-handbook', date: daysAgo(200), category: 'Guidance' as const, resourceType: 'PDF' as const, excerpt: 'The AcSB Due Process Handbook describes the procedures followed in setting accounting standards.', status: 'published' as const, board: boards.acsb },
    { title: 'Private Enterprise Financial Reporting FAQ', slug: 'pe-financial-reporting-faq', date: daysAgo(100), category: 'Guidance' as const, resourceType: 'Webpage' as const, excerpt: 'Frequently asked questions about financial reporting requirements for Canadian private enterprises under ASPE.', content: richText('This FAQ addresses common questions about applying ASPE, including transition issues, measurement options, and disclosure requirements.'), status: 'published' as const, board: boards.acsb, standard: standards.aspe },
    { title: 'Rate-regulated Activities: Plain Language Summary', slug: 'rra-plain-language', date: daysAgo(150), category: 'Other' as const, resourceType: 'Plain Language' as const, excerpt: 'A plain language summary of the IASB rate-regulated activities project and its Canadian implications.', status: 'draft' as const, board: boards.acsb, standard: standards.ifrs },
    { title: 'IFRS Sustainability Disclosure Comparison Chart', slug: 'ifrs-sustainability-comparison', date: daysAgo(80), category: 'Other' as const, resourceType: 'PDF' as const, excerpt: 'Side-by-side comparison of IFRS S1/S2 and proposed Canadian CSDS 1/CSDS 2 requirements.', status: 'published' as const, board: boards.acsb, standard: standards.ifrs },
    // PSAB resources (8)
    { title: 'Public Sector Revenue Recognition Guide', slug: 'ps-revenue-guide', date: daysAgo(50), category: 'Guidance' as const, resourceType: 'PDF' as const, excerpt: 'Guidance on applying the proposed new revenue standard PS 3400 for public sector entities.', status: 'published' as const, board: boards.psab, standard: standards.psas },
    { title: 'Government Transfers: Transition Guidance', slug: 'government-transfers-transition', date: daysAgo(180), category: 'Guidance' as const, resourceType: 'PDF' as const, excerpt: 'Transition guidance for entities moving from PS 3100 Government Transfers to the proposed PS 3400 Revenue.', status: 'published' as const, board: boards.psab, standard: standards.psas },
    { title: 'PSAB Conceptual Framework Overview', slug: 'psab-conceptual-framework', date: daysAgo(250), category: 'Article' as const, resourceType: 'Webpage' as const, excerpt: 'An overview of the PSAB Conceptual Framework for Financial Reporting in the Public Sector.', content: richText('The PSAB Conceptual Framework establishes the concepts that underlie financial reporting by public sector entities in Canada.'), status: 'published' as const, board: boards.psab, standard: standards.psas },
    { title: 'Public Sector Asset Retirement Obligations', slug: 'ps-aro-summary', date: daysAgo(110), category: 'In Brief' as const, resourceType: 'Webpage' as const, excerpt: 'Summary of PS 3280 Asset Retirement Obligations and key implementation considerations.', content: richText('Section PS 3280 establishes standards on the accounting for and reporting of legal obligations associated with the retirement of tangible capital assets.'), status: 'published' as const, board: boards.psab, standard: standards.psas },
    { title: 'Webinar: PS 3400 Revenue — What\'s Changing', slug: 'webinar-ps-3400', date: daysAgo(35), category: 'Webinar' as const, resourceType: 'Video' as const, excerpt: 'Recorded webinar discussing the key changes proposed in the PS 3400 Revenue exposure draft.', externalUrl: 'https://events.frascanada.ca/webinar-ps-3400', status: 'published' as const, board: boards.psab, standard: standards.psas },
    { title: 'Webinar: Financial Instruments for Public Sector', slug: 'webinar-ps-fi', date: daysAgo(160), category: 'Webinar' as const, resourceType: 'Video' as const, excerpt: 'Webinar on the application of PS 3450 Financial Instruments for public sector entities.', externalUrl: 'https://events.frascanada.ca/webinar-ps-fi', status: 'archived' as const, board: boards.psab, standard: standards.psas },
    { title: 'Public Sector Accounting Handbook Quick Reference', slug: 'ps-handbook-quick-ref', date: daysAgo(300), category: 'Guidance' as const, resourceType: 'PDF' as const, excerpt: 'A quick reference guide to the CPA Canada Public Sector Accounting Handbook.', status: 'published' as const, board: boards.psab, standard: standards.psas },
    { title: 'Public Sector Guidelines Update 2026', slug: 'ps-guidelines-update-2026', date: daysAgo(20), category: 'Article' as const, resourceType: 'Webpage' as const, excerpt: 'Update on public sector accounting guidelines issued or amended in 2026.', content: richText('This update covers recent amendments to public sector accounting guidelines.'), status: 'published' as const, board: boards.psab, standard: standards['ps-guidelines'] },
    // AASB resources (7)
    { title: 'CAS 600 Group Audits Implementation Guide', slug: 'cas-600-implementation', date: daysAgo(40), category: 'Guidance' as const, resourceType: 'PDF' as const, excerpt: 'Implementation guidance for Canadian Auditing Standard 600 — Special Considerations for Group Audits.', status: 'published' as const, board: boards.aasb, standard: standards.cas },
    { title: 'CSQM 1 Quality Management: Practical Examples', slug: 'csqm-1-practical-examples', date: daysAgo(70), category: 'Article' as const, resourceType: 'Webpage' as const, excerpt: 'Practical examples of how firms can implement the requirements of CSQM 1 Quality Management.', content: richText('The Canadian Standard on Quality Management (CSQM 1) requires firms to design, implement, and operate a system of quality management.', 'This article provides practical examples and case studies to assist firms in meeting these requirements.'), status: 'published' as const, board: boards.aasb, standard: standards.csqm },
    { title: 'Understanding CAS 540 Accounting Estimates', slug: 'cas-540-estimates', date: daysAgo(130), category: 'In Brief' as const, resourceType: 'Webpage' as const, excerpt: 'Key requirements of CAS 540 Auditing Accounting Estimates and Related Disclosures.', content: richText('CAS 540 addresses the auditor\'s responsibilities relating to accounting estimates, including fair value accounting estimates and related disclosures.'), status: 'published' as const, board: boards.aasb, standard: standards.cas },
    { title: 'Webinar: Sustainability Assurance CSSA 5000', slug: 'webinar-cssa-5000', date: daysAgo(25), category: 'Webinar' as const, resourceType: 'Video' as const, excerpt: 'Webinar on the proposed Canadian Standard on Sustainability Assurance (CSSA) 5000.', externalUrl: 'https://events.frascanada.ca/webinar-cssa-5000', status: 'published' as const, board: boards.aasb, standard: standards.cas },
    { title: 'Auditor Reporting Key Audit Matters Guide', slug: 'kam-guide', date: daysAgo(200), category: 'Guidance' as const, resourceType: 'PDF' as const, excerpt: 'Guidance on communicating Key Audit Matters in the auditor\'s report.', status: 'published' as const, board: boards.aasb, standard: standards.cas },
    { title: 'Less Complex Entities: Audit Considerations', slug: 'lce-audit-considerations', date: daysAgo(95), category: 'Article' as const, resourceType: 'Webpage' as const, excerpt: 'Considerations for audits of less complex entities under Canadian auditing standards.', content: richText('This article discusses the application of Canadian Auditing Standards in the context of auditing less complex entities.'), status: 'published' as const, board: boards.aasb, standard: standards.cas },
    { title: 'AASB Annual Plan 2026-2027', slug: 'aasb-annual-plan-2026', date: daysAgo(55), category: 'Other' as const, resourceType: 'PDF' as const, excerpt: 'The AASB Annual Plan sets out the priorities and planned activities for 2026-2027.', status: 'published' as const, board: boards.aasb },
    // CSSB resources (5)
    { title: 'Introduction to CSDS 1: General Requirements', slug: 'intro-csds-1', date: daysAgo(45), category: 'Article' as const, resourceType: 'Webpage' as const, excerpt: 'An introduction to Canadian Sustainability Disclosure Standard 1 — General Requirements.', content: richText('CSDS 1 establishes the core framework for sustainability-related financial disclosures in Canada.', 'This article provides an overview of the key requirements and what they mean for Canadian organizations.'), status: 'published' as const, board: boards.cssb, standard: standards.csds },
    { title: 'Climate Disclosure Readiness Assessment Tool', slug: 'climate-readiness-tool', date: daysAgo(30), category: 'Guidance' as const, resourceType: 'External Link' as const, excerpt: 'An interactive tool to help organizations assess their readiness for climate-related disclosures under CSDS 2.', externalUrl: 'https://tools.frascanada.ca/climate-readiness', status: 'published' as const, board: boards.cssb, standard: standards.csds },
    { title: 'Webinar: Getting Ready for Canadian Sustainability Disclosures', slug: 'webinar-csds-readiness', date: daysAgo(55), category: 'Webinar' as const, resourceType: 'Video' as const, excerpt: 'Webinar on preparing for Canadian sustainability disclosure requirements.', externalUrl: 'https://events.frascanada.ca/webinar-csds-readiness', status: 'published' as const, board: boards.cssb, standard: standards.csds },
    { title: 'CSSB Strategic Direction 2024-2027', slug: 'cssb-strategic-direction', date: daysAgo(365), category: 'Other' as const, resourceType: 'PDF' as const, excerpt: 'The CSSB\'s strategic direction document outlines priorities for Canadian sustainability standards development.', status: 'archived' as const, board: boards.cssb },
    { title: 'CSDS 2 Climate-related Disclosures Plain Language Summary', slug: 'csds-2-plain-language', date: daysAgo(35), category: 'In Brief' as const, resourceType: 'Plain Language' as const, excerpt: 'A plain language summary of the proposed CSDS 2 Climate-related Disclosures standard.', content: richText('This summary explains the key climate-related disclosure requirements proposed by the CSSB in plain, accessible language.'), status: 'published' as const, board: boards.cssb, standard: standards.csds },
  ]

  for (const resource of resourcesData) {
    await payload.create({ collection: 'resources', data: resource, draft: true })
  }
  console.log(`    ✓ Created ${resourcesData.length} resources`)

  // -------------------------------------------------------------------------
  // 15. EFFECTIVE DATES (4 tables for key standards areas)
  // -------------------------------------------------------------------------
  console.log('  Creating effective dates...')

  const effectiveDatesData = [
    {
      title: 'IFRS Accounting Standards Effective Dates',
      standard: standards.ifrs,
      introText: richText('The following table lists the effective dates of new and amended IFRS Accounting Standards as adopted in Canada by the Accounting Standards Board.'),
      sections: [
        {
          headerLabel: 'New Standards',
          sortOrder: 1,
          rows: [
            { application: richText('IFRS 17 Insurance Contracts'), pronouncement: 'IFRS 17', footnoteRef: '1' },
            { application: richText('IFRS 18 Presentation and Disclosure in Financial Statements'), pronouncement: 'IFRS 18', footnoteRef: '' },
            { application: richText('IFRS S1 General Requirements for Disclosure of Sustainability-related Financial Information'), pronouncement: 'IFRS S1', footnoteRef: '2' },
          ],
        },
        {
          headerLabel: 'Amended Standards',
          sortOrder: 2,
          rows: [
            { application: richText('IAS 1 Disclosure of Accounting Policies — Amendments'), pronouncement: 'IAS 1 (Amended)', footnoteRef: '' },
            { application: richText('IAS 8 Definition of Accounting Estimates — Amendments'), pronouncement: 'IAS 8 (Amended)', footnoteRef: '' },
            { application: richText('IAS 12 Deferred Tax related to Assets and Liabilities from a Single Transaction — Amendments'), pronouncement: 'IAS 12 (Amended)', footnoteRef: '' },
          ],
        },
        {
          headerLabel: 'Annual Improvements 2020-2022',
          sortOrder: 3,
          rows: [
            { application: richText('IAS 41 Agriculture — Taxation in Fair Value Measurements'), pronouncement: 'IAS 41 (AI)', footnoteRef: '' },
            { application: richText('IFRS 16 Lease Incentives — Sale and Leaseback'), pronouncement: 'IFRS 16 (AI)', footnoteRef: '' },
          ],
        },
        {
          headerLabel: 'Forthcoming',
          sortOrder: 4,
          rows: [
            { application: richText('Rate-regulated Activities'), pronouncement: 'IFRS 14 (Replacement)', footnoteRef: '2' },
            { application: richText('Goodwill and Impairment'), pronouncement: 'IAS 36 (Amended)', footnoteRef: '2' },
          ],
        },
      ],
      footnotes: [
        { marker: '1', text: richText('Early adoption is permitted.') },
        { marker: '2', text: richText('Subject to IASB approval. Effective date to be determined.') },
      ],
    },
    {
      title: 'ASPE Effective Dates',
      standard: standards.aspe,
      introText: richText('The following table lists the effective dates of new and amended sections of Part II — Accounting Standards for Private Enterprises (ASPE).'),
      sections: [
        {
          headerLabel: 'New Sections',
          sortOrder: 1,
          rows: [
            { application: richText('Section 3056 Interests in Joint Arrangements'), pronouncement: 'Section 3056', footnoteRef: '' },
            { application: richText('Section 3041 Agriculture'), pronouncement: 'Section 3041', footnoteRef: '1' },
          ],
        },
        {
          headerLabel: 'Amendments',
          sortOrder: 2,
          rows: [
            { application: richText('Section 3856 Financial Instruments — Classification and Measurement Amendments'), pronouncement: 'Section 3856 (Amended)', footnoteRef: '' },
            { application: richText('Section 1510 Current Assets and Current Liabilities — Disclosure Improvements'), pronouncement: 'Section 1510 (Amended)', footnoteRef: '' },
          ],
        },
        {
          headerLabel: 'Forthcoming',
          sortOrder: 3,
          rows: [
            { application: richText('Crypto Assets — Proposed amendments to ASPE'), pronouncement: 'New Section (Proposed)', footnoteRef: '1' },
          ],
        },
      ],
      footnotes: [
        { marker: '1', text: richText('Early adoption is permitted for fiscal years beginning on or after January 1, 2025.') },
      ],
    },
    {
      title: 'Public Sector Accounting Standards Effective Dates',
      standard: standards.psas,
      introText: richText('The following table lists the effective dates of new and amended Public Sector Accounting Standards (PSAS).'),
      sections: [
        {
          headerLabel: 'New Sections',
          sortOrder: 1,
          rows: [
            { application: richText('PS 3280 Asset Retirement Obligations'), pronouncement: 'PS 3280', footnoteRef: '' },
            { application: richText('PS 3450 Financial Instruments'), pronouncement: 'PS 3450', footnoteRef: '1' },
          ],
        },
        {
          headerLabel: 'Amended Sections',
          sortOrder: 2,
          rows: [
            { application: richText('PS 2601 Foreign Currency Translation — Amendments'), pronouncement: 'PS 2601 (Amended)', footnoteRef: '' },
            { application: richText('PS 3041 Portfolio Investments — Consequential Amendments'), pronouncement: 'PS 3041 (Amended)', footnoteRef: '' },
            { application: richText('PS 1201 Financial Statement Presentation — Amendments'), pronouncement: 'PS 1201 (Amended)', footnoteRef: '' },
          ],
        },
        {
          headerLabel: 'Forthcoming',
          sortOrder: 3,
          rows: [
            { application: richText('PS 3400 Revenue — Proposed new section'), pronouncement: 'PS 3400 (Proposed)', footnoteRef: '2' },
            { application: richText('PS 3250 Employee Benefits — Proposed amendments'), pronouncement: 'PS 3250 (Proposed)', footnoteRef: '2' },
          ],
        },
      ],
      footnotes: [
        { marker: '1', text: richText('Early adoption is permitted.') },
        { marker: '2', text: richText('Subject to PSAB approval. Effective date to be determined.') },
      ],
    },
    {
      title: 'Canadian Auditing Standards Effective Dates',
      standard: standards.cas,
      introText: richText('The following table lists the effective dates of new and revised Canadian Auditing Standards (CAS) and related standards.'),
      sections: [
        {
          headerLabel: 'New/Revised Standards',
          sortOrder: 1,
          rows: [
            { application: richText('CAS 600 Special Considerations — Audits of Group Financial Statements (Revised)'), pronouncement: 'CAS 600 (Revised)', footnoteRef: '' },
            { application: richText('CSQM 1 Quality Management for Firms'), pronouncement: 'CSQM 1', footnoteRef: '' },
          ],
        },
        {
          headerLabel: 'Forthcoming',
          sortOrder: 2,
          rows: [
            { application: richText('CSSA 5000 Sustainability Assurance — Proposed new standard'), pronouncement: 'CSSA 5000 (Proposed)', footnoteRef: '1' },
          ],
        },
      ],
      footnotes: [
        { marker: '1', text: richText('Subject to AASB approval. Effective date to be determined.') },
      ],
    },
  ]

  for (const ed of effectiveDatesData) {
    await payload.create({ collection: 'effective-dates', data: ed })
  }
  console.log(`    ✓ Created ${effectiveDatesData.length} effective dates tables`)

  // -------------------------------------------------------------------------
  // 16. DOCUMENTS FOR COMMENT (12 total: 5 open, 7 closed)
  // -------------------------------------------------------------------------
  console.log('  Creating documents for comment...')

  const documentsForCommentData = [
    // Open documents (5)
    { title: 'Exposure Draft: Accounting for Crypto Assets', slug: 'ed-crypto-assets-dfc', frasIdNumber: 'FRAS-2026-001', group: 'exposure-draft' as const, status: 'open' as const, documentUrl: '/documents/ed-crypto-assets.pdf', commentSubmitUrl: '/submit-comment/ed-crypto-assets-dfc', sortOrder: 1, publishedDate: daysAgo(30), commentPeriodStart: daysAgo(30), commentPeriodEnd: daysFromNow(45), board: boards.acsb, standard: standards.aspe },
    { title: 'Exposure Draft: Revenue PS 3400', slug: 'ed-ps-3400-dfc', frasIdNumber: 'FRAS-2026-002', group: 'exposure-draft' as const, status: 'open' as const, documentUrl: '/documents/ed-ps-3400.pdf', commentSubmitUrl: '/submit-comment/ed-ps-3400-dfc', sortOrder: 2, publishedDate: daysAgo(14), commentPeriodStart: daysAgo(14), commentPeriodEnd: daysFromNow(60), board: boards.psab, standard: standards.psas },
    { title: 'Re-exposure Draft: CSDS 1 General Requirements', slug: 'red-csds-1-dfc', frasIdNumber: 'FRAS-2026-003', group: 're-exposure-draft' as const, status: 'open' as const, documentUrl: '/documents/red-csds-1.pdf', commentSubmitUrl: '/submit-comment/red-csds-1-dfc', sortOrder: 3, publishedDate: daysAgo(5), commentPeriodStart: daysAgo(5), commentPeriodEnd: daysFromNow(75), board: boards.cssb, standard: standards.csds },
    { title: 'Exposure Draft: CSSA 5000 Sustainability Assurance', slug: 'ed-cssa-5000-dfc', frasIdNumber: 'FRAS-2026-004', group: 'exposure-draft' as const, status: 'open' as const, documentUrl: '/documents/ed-cssa-5000.pdf', commentSubmitUrl: '/submit-comment/ed-cssa-5000-dfc', sortOrder: 4, publishedDate: daysAgo(7), commentPeriodStart: daysAgo(7), commentPeriodEnd: daysFromNow(90), board: boards.aasb, standard: standards.cas },
    { title: 'Discussion Paper: NFP Contributions Revenue', slug: 'dp-nfp-contributions', frasIdNumber: 'FRAS-2026-005', group: 'discussion-paper' as const, status: 'open' as const, documentUrl: '/documents/dp-nfp-contributions.pdf', commentSubmitUrl: '/submit-comment/dp-nfp-contributions', sortOrder: 5, publishedDate: daysAgo(20), commentPeriodStart: daysAgo(20), commentPeriodEnd: daysFromNow(55), board: boards.acsb, standard: standards.nfpo },
    // Closed documents (7)
    { title: 'Exposure Draft: Employee Benefits PS 3250', slug: 'ed-ps-3250-dfc', frasIdNumber: 'FRAS-2025-018', group: 'exposure-draft' as const, status: 'closed' as const, documentUrl: '/documents/ed-ps-3250.pdf', commentsPdfUrl: '/documents/comments-ed-ps-3250.pdf', sortOrder: 6, publishedDate: daysAgo(180), commentPeriodStart: daysAgo(180), commentPeriodEnd: daysAgo(90), board: boards.psab, standard: standards.psas },
    { title: 'Consultation Paper: Financial Instruments ASPE', slug: 'cp-fi-aspe', frasIdNumber: 'FRAS-2025-015', group: 'consultation-paper' as const, status: 'closed' as const, documentUrl: '/documents/cp-fi-aspe.pdf', commentsPdfUrl: '/documents/comments-cp-fi-aspe.pdf', sortOrder: 7, publishedDate: daysAgo(200), commentPeriodStart: daysAgo(200), commentPeriodEnd: daysAgo(110), board: boards.acsb, standard: standards.aspe },
    { title: 'Exposure Draft: CAS 600 Group Audits', slug: 'ed-cas-600-dfc', frasIdNumber: 'FRAS-2025-012', group: 'exposure-draft' as const, status: 'closed' as const, documentUrl: '/documents/ed-cas-600.pdf', commentsPdfUrl: '/documents/comments-ed-cas-600.pdf', sortOrder: 8, publishedDate: daysAgo(250), commentPeriodStart: daysAgo(250), commentPeriodEnd: daysAgo(160), board: boards.aasb, standard: standards.cas },
    { title: 'Exposure Draft: CSDS 2 Climate-related Disclosures', slug: 'ed-csds-2-dfc', frasIdNumber: 'FRAS-2025-016', group: 'exposure-draft' as const, status: 'closed' as const, documentUrl: '/documents/ed-csds-2.pdf', commentsPdfUrl: '/documents/comments-ed-csds-2.pdf', sortOrder: 9, publishedDate: daysAgo(190), commentPeriodStart: daysAgo(190), commentPeriodEnd: daysAgo(100), board: boards.cssb, standard: standards.csds },
    { title: 'Consultation Paper: Public Sector Intangibles', slug: 'cp-ps-intangibles', frasIdNumber: 'FRAS-2025-010', group: 'consultation-paper' as const, status: 'closed' as const, documentUrl: '/documents/cp-ps-intangibles.pdf', commentsPdfUrl: '/documents/comments-cp-ps-intangibles.pdf', sortOrder: 10, publishedDate: daysAgo(300), commentPeriodStart: daysAgo(300), commentPeriodEnd: daysAgo(210), board: boards.psab, standard: standards.psas },
    { title: 'Exposure Draft: IFRS 18 Canadian Amendments', slug: 'ed-ifrs-18-can', frasIdNumber: 'FRAS-2025-008', group: 'exposure-draft' as const, status: 'closed' as const, documentUrl: '/documents/ed-ifrs-18-can.pdf', commentsPdfUrl: '/documents/comments-ed-ifrs-18-can.pdf', sortOrder: 11, publishedDate: daysAgo(220), commentPeriodStart: daysAgo(220), commentPeriodEnd: daysAgo(130), board: boards.acsb, standard: standards.ifrs },
    { title: 'Re-exposure Draft: Revenue PS 3400 (First)', slug: 'red-ps-3400-first', frasIdNumber: 'FRAS-2024-022', group: 're-exposure-draft' as const, status: 'closed' as const, documentUrl: '/documents/red-ps-3400-first.pdf', commentsPdfUrl: '/documents/comments-red-ps-3400-first.pdf', sortOrder: 12, publishedDate: daysAgo(365), commentPeriodStart: daysAgo(365), commentPeriodEnd: daysAgo(275), board: boards.psab, standard: standards.psas },
  ]

  for (const doc of documentsForCommentData) {
    await payload.create({ collection: 'documents-for-comment', data: doc, draft: true })
  }
  console.log(`    ✓ Created ${documentsForCommentData.length} documents for comment`)

  // -------------------------------------------------------------------------
  // 17. DOCUMENT DETAILS (6 total — paired with open documents-for-comment)
  // -------------------------------------------------------------------------
  console.log('  Creating document details...')

  const documentDetailsData = [
    {
      title: 'Crypto Assets — Proposed Amendments to ASPE',
      slug: 'dd-crypto-assets',
      highlights: richText('The AcSB proposes amendments to ASPE to address the accounting for crypto assets held by private enterprises.', 'Key proposals include measurement at fair value through profit or loss and enhanced disclosure requirements.'),
      bodyContent: richTextWithHeading('h2', 'Background', 'The rapid growth of crypto assets has created a need for specific accounting guidance under ASPE. Currently, private enterprises holding crypto assets must apply existing standards that were not designed for these instruments.', 'The AcSB has developed proposed amendments to address measurement, classification, and disclosure of crypto assets.', 'These proposals are based on feedback received from stakeholders and align with international developments.'),
      commentQuestions: [
        { questionNumber: 1, questionText: richText('Do you agree that crypto assets should be measured at fair value through profit or loss? If not, what alternative measurement approach would you recommend?') },
        { questionNumber: 2, questionText: richText('Are the proposed disclosure requirements sufficient for users of private enterprise financial statements?') },
        { questionNumber: 3, questionText: richText('Do you agree with the proposed scope of the amendments? Should stablecoins be included or excluded?') },
        { questionNumber: 4, questionText: richText('Is the proposed effective date appropriate? Do you anticipate any significant implementation challenges?') },
      ],
      replyDeadline: daysFromNow(45),
      howToReply: {
        heading: 'How to Reply',
        body: richText('Written comments should be addressed to the Accounting Standards Board and sent by email or mail. All comments received will be part of the public record.'),
        ctaLabel: 'Submit Your Comment',
        ctaHref: '/submit-comment/ed-crypto-assets-dfc',
        contactName: 'Andrew White, CPA, CA',
        contactTitle: 'Director, Accounting Standards',
        contactAddress: richText('277 Wellington Street West, Toronto, Ontario M5V 3H2'),
        contactEmail: 'awhite@frascanada.ca',
      },
      supportMaterials: [
        { label: 'Exposure Draft (PDF)', url: '/documents/ed-crypto-assets.pdf', fileType: 'pdf' as const },
        { label: 'Basis for Conclusions', url: '/documents/ed-crypto-basis.pdf', fileType: 'pdf' as const },
        { label: 'Comment Letter Template', url: '/documents/comment-template.docx', fileType: 'word' as const },
      ],
      board: boards.acsb,
      standard: standards.aspe,
      staffContacts: [contacts[0], contacts[1]],
    },
    {
      title: 'Revenue PS 3400 — Proposed New Section',
      slug: 'dd-ps-3400',
      highlights: richText('PSAB proposes a new Section PS 3400, Revenue, to replace Section PS 3100, Government Transfers.', 'The proposed standard introduces a performance obligation approach to revenue recognition in the public sector.'),
      bodyContent: richTextWithHeading('h2', 'Overview', 'The proposed revenue standard represents a significant change to how public sector entities recognize revenue. The performance obligation approach provides a more comprehensive framework for recognizing revenue from exchange and non-exchange transactions.', 'The proposed standard applies to all public sector entities that prepare financial statements in accordance with PSAS.', 'Key changes include distinguishing between revenue with and without performance obligations, measurement of revenue at transaction price, and timing of revenue recognition.'),
      commentQuestions: [
        { questionNumber: 1, questionText: richText('Do you agree with the proposed performance obligation approach for public sector revenue recognition?') },
        { questionNumber: 2, questionText: richText('Are the criteria for distinguishing between revenue with and without performance obligations clear and operational?') },
        { questionNumber: 3, questionText: richText('Do you agree with the proposed transition provisions? Do you need additional time for implementation?') },
      ],
      replyDeadline: daysFromNow(60),
      howToReply: {
        heading: 'How to Reply',
        body: richText('Written comments should be addressed to the Public Sector Accounting Board. All comments received are part of the public record.'),
        ctaLabel: 'Submit Your Comment',
        ctaHref: '/submit-comment/ed-ps-3400-dfc',
        contactName: 'Jennifer Kim',
        contactTitle: 'Principal, Public Sector Accounting Standards',
        contactAddress: richText('277 Wellington Street West, Toronto, Ontario M5V 3H2'),
        contactEmail: 'jkim@frascanada.ca',
      },
      supportMaterials: [
        { label: 'Exposure Draft (PDF)', url: '/documents/ed-ps-3400.pdf', fileType: 'pdf' as const },
        { label: 'Illustrative Examples', url: '/documents/ed-ps-3400-examples.pdf', fileType: 'pdf' as const },
      ],
      board: boards.psab,
      standard: standards.psas,
      staffContacts: [contacts[3]],
    },
    {
      title: 'CSDS 1 — Re-exposure: General Requirements',
      slug: 'dd-csds-1',
      highlights: richText('The CSSB re-exposes proposed CSDS 1 incorporating feedback from the initial exposure draft.', 'Key changes include clarified transition provisions and modified proportionality mechanisms.'),
      bodyContent: richTextWithHeading('h2', 'What Changed', 'Based on feedback received during the initial comment period, the CSSB has made several changes to the proposed standard. The re-exposure draft incorporates clarified transition provisions, modified proportionality mechanisms for smaller entities, and enhanced guidance on materiality.', 'The CSSB received over 100 comment letters on the original exposure draft, representing a broad cross-section of Canadian stakeholders.'),
      commentQuestions: [
        { questionNumber: 1, questionText: richText('Do the revised transition provisions adequately address implementation concerns raised in the first consultation?') },
        { questionNumber: 2, questionText: richText('Are the modified proportionality mechanisms appropriate for smaller reporting entities?') },
        { questionNumber: 3, questionText: richText('Do you have any remaining concerns about the general requirements framework?') },
      ],
      replyDeadline: daysFromNow(75),
      howToReply: {
        heading: 'How to Reply',
        body: richText('Written comments should be addressed to the Canadian Sustainability Standards Board. Comments are due by the deadline indicated above.'),
        ctaLabel: 'Submit Your Comment',
        ctaHref: '/submit-comment/red-csds-1-dfc',
        contactName: 'Robert Nguyen, CPA',
        contactTitle: 'Director, Sustainability Standards',
        contactAddress: richText('277 Wellington Street West, Toronto, Ontario M5V 3H2'),
        contactEmail: 'rnguyen@frascanada.ca',
      },
      supportMaterials: [
        { label: 'Re-exposure Draft (PDF)', url: '/documents/red-csds-1.pdf', fileType: 'pdf' as const },
        { label: 'Summary of Changes', url: '/documents/red-csds-1-changes.pdf', fileType: 'pdf' as const },
        { label: 'Comparison Document', url: '/documents/red-csds-1-comparison.pdf', fileType: 'pdf' as const },
      ],
      board: boards.cssb,
      standard: standards.csds,
      staffContacts: [contacts[4]],
    },
    {
      title: 'CSSA 5000 — Sustainability Assurance',
      slug: 'dd-cssa-5000',
      highlights: richText('The AASB proposes a Canadian Standard on Sustainability Assurance aligned with ISSA 5000.', 'The proposed standard establishes requirements for assurance engagements on sustainability information.'),
      bodyContent: richTextWithHeading('h2', 'Purpose', 'As Canadian sustainability disclosure requirements evolve, there is a need for assurance standards to provide confidence in the quality and reliability of sustainability information. The proposed CSSA 5000 addresses this need.', 'The proposed standard is based on the IAASB\'s International Standard on Sustainability Assurance (ISSA) 5000, with Canadian-specific modifications.'),
      commentQuestions: [
        { questionNumber: 1, questionText: richText('Do you agree with the proposed scope of the standard, which covers both limited and reasonable assurance engagements?') },
        { questionNumber: 2, questionText: richText('Are the proposed competency requirements for sustainability assurance practitioners appropriate?') },
        { questionNumber: 3, questionText: richText('Should the standard require specific considerations for climate-related information?') },
        { questionNumber: 4, questionText: richText('Do you agree with the proposed effective date? Are practitioners ready to perform sustainability assurance engagements?') },
        { questionNumber: 5, questionText: richText('Are there any Canadian-specific issues not addressed by the international base standard?') },
      ],
      replyDeadline: daysFromNow(90),
      howToReply: {
        heading: 'How to Reply',
        body: richText('Written comments should be addressed to the Auditing and Assurance Standards Board. All comments received are part of the public record.'),
        ctaLabel: 'Submit Your Comment',
        ctaHref: '/submit-comment/ed-cssa-5000-dfc',
        contactName: 'Michael Torres, CPA, CA',
        contactTitle: 'Director, Auditing and Assurance Standards',
        contactAddress: richText('277 Wellington Street West, Toronto, Ontario M5V 3H2'),
        contactEmail: 'mtorres@frascanada.ca',
      },
      supportMaterials: [
        { label: 'Exposure Draft (PDF)', url: '/documents/ed-cssa-5000.pdf', fileType: 'pdf' as const },
        { label: 'Basis for Conclusions', url: '/documents/ed-cssa-5000-basis.pdf', fileType: 'pdf' as const },
      ],
      board: boards.aasb,
      standard: standards.cas,
      staffContacts: [contacts[2]],
    },
    {
      title: 'NFP Contributions Revenue — Discussion Paper',
      slug: 'dd-nfp-contributions',
      highlights: richText('The AcSB invites input on the accounting for contributions revenue by not-for-profit organizations.', 'The discussion paper explores alternative approaches to recognizing contributions with conditions or restrictions.'),
      bodyContent: richTextWithHeading('h2', 'Background', 'Not-for-profit organizations often receive contributions with various conditions or restrictions. The current guidance on recognizing these contributions has been the subject of ongoing questions from stakeholders.', 'This discussion paper explores the issues and presents possible approaches for the AcSB to consider in developing improved guidance.'),
      commentQuestions: [
        { questionNumber: 1, questionText: richText('Which of the approaches described in the discussion paper do you prefer for recognizing restricted contributions? Please explain your reasoning.') },
        { questionNumber: 2, questionText: richText('Should the distinction between externally restricted and internally restricted contributions be maintained?') },
        { questionNumber: 3, questionText: richText('Are there practical challenges with applying the current guidance that should be specifically addressed?') },
      ],
      replyDeadline: daysFromNow(55),
      howToReply: {
        heading: 'How to Reply',
        body: richText('Written comments should be addressed to the Accounting Standards Board. Comments may be submitted electronically or by mail.'),
        ctaLabel: 'Submit Your Comment',
        ctaHref: '/submit-comment/dp-nfp-contributions',
        contactName: 'Sarah Chen, CPA',
        contactTitle: 'Principal, Accounting Standards',
        contactAddress: richText('277 Wellington Street West, Toronto, Ontario M5V 3H2'),
        contactEmail: 'schen@frascanada.ca',
      },
      supportMaterials: [
        { label: 'Discussion Paper (PDF)', url: '/documents/dp-nfp-contributions.pdf', fileType: 'pdf' as const },
      ],
      board: boards.acsb,
      standard: standards.nfpo,
      staffContacts: [contacts[1]],
    },
    {
      title: 'Employee Benefits PS 3250 (Closed)',
      slug: 'dd-ps-3250',
      highlights: richText('PSAB sought input on proposed amendments to PS 3250 Employee Benefits.', 'The comment period for this document has closed.'),
      bodyContent: richTextWithHeading('h2', 'Summary', 'The proposed amendments to PS 3250 address the accounting for employee benefits in the public sector, including pensions, other retirement benefits, and compensated absences.', 'The comment period has closed and the feedback is being analyzed by the Board.'),
      commentQuestions: [
        { questionNumber: 1, questionText: richText('Do you agree with the proposed amendments to the recognition and measurement of defined benefit obligations?') },
        { questionNumber: 2, questionText: richText('Are the proposed transition provisions appropriate for public sector entities?') },
      ],
      replyDeadline: daysAgo(30),
      howToReply: {
        heading: 'Comment Period Closed',
        body: richText('The comment period for this document has closed. Thank you to all respondents for their input.'),
        ctaLabel: 'View Submitted Comments',
        ctaHref: '/documents/comments-ed-ps-3250.pdf',
        contactName: 'Jennifer Kim',
        contactTitle: 'Principal, Public Sector Accounting Standards',
        contactAddress: richText('277 Wellington Street West, Toronto, Ontario M5V 3H2'),
        contactEmail: 'jkim@frascanada.ca',
      },
      supportMaterials: [
        { label: 'Exposure Draft (PDF)', url: '/documents/ed-ps-3250.pdf', fileType: 'pdf' as const },
        { label: 'Submitted Comments (PDF)', url: '/documents/comments-ed-ps-3250.pdf', fileType: 'pdf' as const },
      ],
      board: boards.psab,
      standard: standards.psas,
      staffContacts: [contacts[3]],
    },
  ]

  for (const detail of documentDetailsData) {
    await payload.create({ collection: 'document-details', data: detail, draft: true })
  }
  console.log(`    ✓ Created ${documentDetailsData.length} document details`)

  // -------------------------------------------------------------------------
  // 18. FORM SUBMISSIONS (5 test entries)
  // -------------------------------------------------------------------------
  console.log('  Creating form submissions...')

  const formSubmissionsData = [
    { fullName: 'Marie-Claire Dubois', title: 'Senior Auditor', organization: 'Deloitte LLP', email: 'mdubois@deloitte.ca', businessPhone: '416-555-0101', comments: 'I have a question regarding the application of IFRS 15 to multi-element arrangements in the telecommunications industry. Could you direct me to relevant guidance?', submittedAt: daysAgo(1), status: 'new' as const },
    { fullName: 'James O\'Connor', title: 'Controller', organization: 'City of Vancouver', email: 'joconnor@vancouver.ca', businessPhone: '604-555-0202', comments: 'We are preparing to implement PS 3280 Asset Retirement Obligations. Are there any implementation resources or webinars planned for 2026?', submittedAt: daysAgo(2), status: 'new' as const },
    { fullName: 'Priya Mehta', title: 'CFO', organization: 'Northern Health Authority', email: 'pmehta@northernhealth.ca', businessPhone: '250-555-0303', comments: 'Thank you for the webinar on PS 3400 Revenue. Could you provide additional examples of how the performance obligation approach applies to government grants?', submittedAt: daysAgo(5), status: 'read' as const },
    { fullName: 'Wei Zhang', title: 'Accounting Professor', organization: 'University of Waterloo', email: 'wzhang@uwaterloo.ca', businessPhone: '519-555-0404', comments: 'I would like to request permission to include excerpts from the ASPE exposure draft in my Advanced Financial Accounting course materials. Please advise on the process.', submittedAt: daysAgo(10), status: 'replied' as const },
    { fullName: 'David Campbell', title: 'Partner', organization: 'BDO Canada LLP', email: 'dcampbell@bdo.ca', businessPhone: '613-555-0505', comments: 'Our firm would like to nominate two members for the Medium and Small Practitioners Advisory Committee. Please provide information on the nomination process.', submittedAt: daysAgo(7), status: 'read' as const },
  ]

  for (const submission of formSubmissionsData) {
    await payload.create({ collection: 'form-submissions', data: submission })
  }
  console.log(`    ✓ Created ${formSubmissionsData.length} form submissions`)

  // -------------------------------------------------------------------------
  // 19. JOB POSTINGS (2 total)
  // -------------------------------------------------------------------------
  console.log('  Creating job postings...')

  const jobPostingsData = [
    {
      title: 'Principal, Accounting Standards',
      department: 'Accounting Standards',
      location: 'Toronto, Ontario',
      description: richTextWithHeading('h2', 'About the Role', 'RAS Canada is seeking a Principal, Accounting Standards to support the Accounting Standards Board (AcSB) in the development and maintenance of Canadian accounting standards.', 'The successful candidate will lead research and analysis on standards-setting projects, prepare Board meeting materials, and engage with stakeholders including preparers, auditors, and regulators.', 'Qualifications: CPA designation required, minimum 7 years of experience in accounting standards, financial reporting, or auditing. Experience with IFRS and/or ASPE preferred.', 'We offer a competitive salary, comprehensive benefits, and the opportunity to shape the future of financial reporting in Canada.'),
      summary: 'Lead research and analysis on standards-setting projects for the AcSB. CPA designation and 7+ years experience required.',
      postedDate: daysAgo(14),
      closingDate: daysFromNow(30),
      externalUrl: 'https://careers.cpacanada.ca/job/principal-accounting-standards',
      status: 'published' as const,
    },
    {
      title: 'Project Manager, Sustainability Standards',
      department: 'Sustainability Standards',
      location: 'Toronto, Ontario (Hybrid)',
      description: richTextWithHeading('h2', 'About the Role', 'RAS Canada is seeking a Project Manager to support the Canadian Sustainability Standards Board (CSSB) in the development of Canadian Sustainability Disclosure Standards.', 'The role involves managing project timelines, coordinating stakeholder engagement activities, preparing Board materials, and supporting the development of implementation guidance.', 'Qualifications: Bachelor\'s degree required, project management certification preferred. Experience with sustainability reporting frameworks (ISSB, GRI, TCFD) an asset. Strong written and verbal communication skills in English required; French is an asset.', 'This is a hybrid position with a minimum of three days per week in our Toronto office.'),
      summary: 'Support the CSSB in developing Canadian Sustainability Disclosure Standards. Project management experience and sustainability reporting knowledge preferred.',
      postedDate: daysAgo(7),
      closingDate: daysFromNow(45),
      externalUrl: 'https://careers.cpacanada.ca/job/pm-sustainability-standards',
      status: 'published' as const,
    },
  ]

  for (const job of jobPostingsData) {
    await payload.create({ collection: 'job-postings', data: job, draft: true })
  }
  console.log(`    ✓ Created ${jobPostingsData.length} job postings`)

  // -------------------------------------------------------------------------
  // 20. STANDARDS SECTIONS (5 total — one per standards area)
  // -------------------------------------------------------------------------
  console.log('  Creating standards sections...')

  const standardsSectionsData = [
    {
      title: 'IFRS Accounting Standards',
      slug: 'ifrs-overview',
      boardName: 'Accounting Standards Board',
      tabs: [
        { label: 'Overview', href: '/standards/ifrs', isActive: true },
        { label: 'Active Projects', href: '/standards/ifrs/projects', isActive: false },
        { label: 'Effective Dates', href: '/standards/ifrs/effective-dates', isActive: false },
        { label: 'Resources', href: '/standards/ifrs/resources', isActive: false },
        { label: 'Documents for Comment', href: '/standards/ifrs/documents-for-comment', isActive: false },
        { label: 'IFRIC Agenda Decisions', href: '/standards/ifrs/ifric-decisions', isActive: false },
      ],
      featureCTAs: [
        { heading: 'Submit Your Comment', description: 'Share your views on current exposure drafts and consultation papers.', buttonLabel: 'Open Consultations', buttonHref: '/open-consultations', variant: 'light' as const },
        { heading: 'Stay Informed', description: 'Subscribe to receive updates on IFRS developments in Canada.', buttonLabel: 'Subscribe', buttonHref: '/subscribe', variant: 'dark-purple' as const },
        { heading: 'View Active Projects', description: 'Track the progress of current AcSB standards-setting projects.', buttonLabel: 'Active Projects', buttonHref: '/active-projects', variant: 'light' as const },
      ],
      board: boards.acsb,
      activeProjects: [projects['pir-ifrs-15']],
    },
    {
      title: 'ASPE — Accounting Standards for Private Enterprises',
      slug: 'aspe-overview',
      boardName: 'Accounting Standards Board',
      tabs: [
        { label: 'Overview', href: '/standards/aspe', isActive: true },
        { label: 'Active Projects', href: '/standards/aspe/projects', isActive: false },
        { label: 'Effective Dates', href: '/standards/aspe/effective-dates', isActive: false },
        { label: 'Resources', href: '/standards/aspe/resources', isActive: false },
        { label: 'Documents for Comment', href: '/standards/aspe/documents-for-comment', isActive: false },
      ],
      featureCTAs: [
        { heading: 'Private Enterprise Resources', description: 'Access guides, FAQs, and webinars for ASPE preparers.', buttonLabel: 'View Resources', buttonHref: '/standards/aspe/resources', variant: 'light' as const },
        { heading: 'Join a Committee', description: 'Share your expertise on the Private Enterprise Advisory Committee.', buttonLabel: 'Volunteer', buttonHref: '/volunteer', variant: 'dark-purple' as const },
      ],
      board: boards.acsb,
      activeProjects: [projects['crypto-assets']],
    },
    {
      title: 'Public Sector Accounting Standards',
      slug: 'psas-overview',
      boardName: 'Public Sector Accounting Board',
      tabs: [
        { label: 'Overview', href: '/standards/psas', isActive: true },
        { label: 'Active Projects', href: '/standards/psas/projects', isActive: false },
        { label: 'Effective Dates', href: '/standards/psas/effective-dates', isActive: false },
        { label: 'Resources', href: '/standards/psas/resources', isActive: false },
        { label: 'Documents for Comment', href: '/standards/psas/documents-for-comment', isActive: false },
      ],
      featureCTAs: [
        { heading: 'PS 3400 Revenue', description: 'Learn about the proposed new revenue standard for the public sector.', buttonLabel: 'View Exposure Draft', buttonHref: '/documents-for-comment/ed-ps-3400-dfc', variant: 'light' as const },
        { heading: 'Subscribe to Updates', description: 'Stay informed on public sector accounting developments in Canada.', buttonLabel: 'Subscribe', buttonHref: '/subscribe', variant: 'dark-purple' as const },
        { heading: 'Discussion Group', description: 'Join the Public Sector Accounting Discussion Group.', buttonLabel: 'Learn More', buttonHref: '/committees/psadg', variant: 'light' as const },
      ],
      board: boards.psab,
      activeProjects: [projects['revenue-ps-3400'], projects['employee-benefits-ps-3250'], projects['purchased-intangibles-ps-3070']],
    },
    {
      title: 'Canadian Auditing Standards',
      slug: 'cas-overview',
      boardName: 'Auditing and Assurance Standards Board',
      tabs: [
        { label: 'Overview', href: '/standards/cas', isActive: true },
        { label: 'Active Projects', href: '/standards/cas/projects', isActive: false },
        { label: 'Effective Dates', href: '/standards/cas/effective-dates', isActive: false },
        { label: 'Resources', href: '/standards/cas/resources', isActive: false },
        { label: 'Documents for Comment', href: '/standards/cas/documents-for-comment', isActive: false },
      ],
      featureCTAs: [
        { heading: 'Sustainability Assurance', description: 'Learn about the proposed CSSA 5000 sustainability assurance standard.', buttonLabel: 'View Proposal', buttonHref: '/documents-for-comment/ed-cssa-5000-dfc', variant: 'light' as const },
        { heading: 'Quality Management', description: 'Access implementation resources for CSQM 1.', buttonLabel: 'View Resources', buttonHref: '/standards/csqm/resources', variant: 'dark-purple' as const },
      ],
      board: boards.aasb,
      activeProjects: [projects['qm-implementation'], projects['sustainability-assurance-cssa-5000']],
    },
    {
      title: 'Canadian Sustainability Disclosure Standards',
      slug: 'csds-overview',
      boardName: 'Canadian Sustainability Standards Board',
      tabs: [
        { label: 'Overview', href: '/standards/csds', isActive: true },
        { label: 'Active Projects', href: '/standards/csds/projects', isActive: false },
        { label: 'Resources', href: '/standards/csds/resources', isActive: false },
        { label: 'Documents for Comment', href: '/standards/csds/documents-for-comment', isActive: false },
        { label: 'About the CSSB', href: '/boards/cssb', isActive: false },
      ],
      featureCTAs: [
        { heading: 'CSDS 1 Re-exposure', description: 'Review the revised general requirements for sustainability disclosures.', buttonLabel: 'View Document', buttonHref: '/documents-for-comment/red-csds-1-dfc', variant: 'light' as const },
        { heading: 'Get Ready', description: 'Use our readiness assessment tool to prepare for sustainability disclosures.', buttonLabel: 'Start Assessment', buttonHref: 'https://tools.frascanada.ca/climate-readiness', variant: 'dark-purple' as const },
        { heading: 'Learn More', description: 'Explore webinars, articles, and guides on Canadian sustainability disclosure standards.', buttonLabel: 'View Resources', buttonHref: '/standards/csds/resources', variant: 'light' as const },
      ],
      board: boards.cssb,
      activeProjects: [projects['csds-1-general-requirements'], projects['csds-2-climate']],
    },
  ]

  for (const section of standardsSectionsData) {
    await payload.create({ collection: 'standards-sections', data: section })
  }
  console.log(`    ✓ Created ${standardsSectionsData.length} standards sections`)

  // -------------------------------------------------------------------------
  // 21. AUTH CONFIG GLOBAL
  // -------------------------------------------------------------------------
  console.log('  Configuring auth config...')

  await payload.updateGlobal({
    slug: 'auth-config',
    data: {
      usernameLabel: 'Username',
      passwordLabel: 'Password',
      buttonLabel: 'Log In',
      forgotUsernameLabel: 'Forgot Username?',
      forgotUsernameUrl: 'https://www.cpacanada.ca/forgot-username',
      forgotPasswordLabel: 'Forgot Password?',
      forgotPasswordUrl: 'https://www.cpacanada.ca/forgot-password',
      registerPrompt: "Don't have an account?",
      registerLinkLabel: 'Register',
      registerUrl: 'https://www.cpacanada.ca/register',
      cpaExplanation: richText('RAS Canada uses CPA Canada\'s authentication system. If you are a CPA Canada member, you can log in with your existing CPA Canada credentials.', 'Your CPA Canada account provides access to comment submission forms, event registration, and newsletter preferences.'),
      cpaLoginUrl: 'https://www.cpacanada.ca/login',
      supportHeading: 'Need Help?',
      supportEmail: 'support@frascanada.ca',
      supportPhoneTollFree: '1-800-268-3793',
      supportPhoneIntl: '+1-416-977-3222',
    },
  })
  console.log('    ✓ Auth config configured')

  // -------------------------------------------------------------------------
  // 22. DICTIONARY (glossary terms)
  // -------------------------------------------------------------------------
  console.log('  Seeding dictionary terms...')
  const { seedDictionary } = await import('./seed-dictionary')
  const dict = await seedDictionary(payload)
  console.log(`    ✓ Dictionary: created ${dict.created}/${dict.total} terms`)

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('\n✅ Seed complete!')
  console.log('  --- Phase 1 ---')
  console.log(`  Boards:              ${Object.keys(boards).length}`)
  console.log(`  Standards:           ${Object.keys(standards).length}`)
  console.log(`  Contacts:            ${contacts.length}`)
  console.log(`  Projects:            ${Object.keys(projects).length}`)
  console.log(`  Consultations:       ${consultationsData.length}`)
  console.log(`  News:                ${newsData.length}`)
  console.log(`  Events:              ${allEventsData.length}`)
  console.log('  Globals:             Navigation, Footer, Homepage, SearchConfig')
  console.log('  --- Phase 2 ---')
  console.log(`  Board Members:       ${boardMembersData.length}`)
  console.log(`  Committees:          ${committeesData.length}`)
  console.log(`  Resources:           ${resourcesData.length}`)
  console.log(`  Effective Dates:     ${effectiveDatesData.length}`)
  console.log(`  Docs for Comment:    ${documentsForCommentData.length}`)
  console.log(`  Document Details:    ${documentDetailsData.length}`)
  console.log(`  Form Submissions:    ${formSubmissionsData.length}`)
  console.log(`  Job Postings:        ${jobPostingsData.length}`)
  console.log(`  Standards Sections:  ${standardsSectionsData.length}`)
  console.log(`  Dictionary terms:    ${dict.created}/${dict.total}`)
  console.log('  Globals:             AuthConfig')

}

// Auto-run when executed directly (npx tsx src/seed/index.ts)
// When imported by payload.config.ts onInit, the function is called without this wrapper
const isDirectRun = typeof process !== 'undefined' && process.argv[1]?.includes('seed')
if (isDirectRun) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err)
      process.exit(1)
    })
}
