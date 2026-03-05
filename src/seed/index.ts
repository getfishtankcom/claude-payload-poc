/**
 * @description
 * Seed script for FRAS Canada CMS. Populates all collections and globals
 * with realistic sample data for development and testing.
 *
 * Creates:
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
  console.log('🌱 Starting FRAS Canada seed...')

  const payload = await getPayload({ config })

  // -------------------------------------------------------------------------
  // Clear existing data (order matters — delete children before parents)
  // -------------------------------------------------------------------------
  console.log('  Clearing existing data...')
  const collectionsToDelete = [
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
    const created = await payload.create({ collection: 'projects', data: project })
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
    await payload.create({ collection: 'consultations', data: consultation })
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
    { title: 'New AASB Chair Appointed', slug: 'new-aasb-chair', date: daysAgo(15), category: 'News' as const, excerpt: 'FRAS Canada is pleased to announce the appointment of the new Chair of the Auditing and Assurance Standards Board, effective April 1, 2026.', body: richText('FRAS Canada today announced the appointment of a new Chair of the Auditing and Assurance Standards Board (AASB), effective April 1, 2026.', 'The new Chair brings extensive experience in auditing and assurance standards development.'), board: boards.aasb },
    { title: 'AcSB Approves Improvements to ASPE Disclosure Requirements', slug: 'acsb-aspe-disclosures', date: daysAgo(20), category: 'News' as const, excerpt: 'The AcSB has approved amendments to improve disclosure requirements for private enterprises under ASPE, effective for fiscal years beginning on or after January 1, 2027.', body: richText('The Accounting Standards Board has approved amendments to Accounting Standards for Private Enterprises that improve disclosure requirements for private enterprises.', 'These amendments are effective for fiscal years beginning on or after January 1, 2027.'), board: boards.acsb },
    { title: 'CSSB Releases Climate Disclosure Guidance', slug: 'cssb-climate-guidance', date: daysAgo(25), category: 'News' as const, excerpt: 'The CSSB has released non-authoritative guidance to help Canadian organizations prepare for climate-related disclosures under the proposed CSDS 2.', body: richText('The Canadian Sustainability Standards Board has released non-authoritative guidance material to assist Canadian organizations in preparing for climate-related disclosures.'), board: boards.cssb },
    { title: 'RASOC Annual Report 2025 Published', slug: 'rasoc-annual-report-2025', date: daysAgo(30), category: 'News' as const, excerpt: 'RASOC has published its 2025 annual report, providing an overview of its oversight activities and recommendations for the standard-setting boards.', body: richText('The Regulatory and Accounting Standards Oversight Council has published its 2025 annual report.', 'The report provides an overview of RASOC\'s oversight activities during the year and includes recommendations for the standard-setting boards.'), board: boards.rasoc },
    { title: 'PSAB Seeks Volunteers for Revenue Project Advisory Committee', slug: 'psab-volunteers-revenue', date: daysAgo(7), category: 'News' as const, excerpt: 'PSAB is seeking volunteers to serve on the advisory committee for its Revenue project (PS 3400). Applications are due by April 30, 2026.', body: richText('The Public Sector Accounting Board is seeking volunteers to serve on the advisory committee for its revenue recognition project.', 'Committee members will provide input on the development of the new revenue standard.'), board: boards.psab },
    { title: 'AcSB Meeting Summary — February 2026', slug: 'acsb-meeting-feb-2026', date: daysAgo(35), category: 'Meeting Summary' as const, excerpt: 'Summary of key decisions from the February 2026 AcSB meeting, including discussion of the crypto assets project and NFP improvements.', body: richText('The Accounting Standards Board met on February 24-25, 2026.'), board: boards.acsb },
    { title: 'FRAS Canada Strategic Plan 2027-2030 Consultation', slug: 'fras-strategic-plan', date: daysAgo(12), category: 'News' as const, excerpt: 'FRAS Canada is developing its strategic plan for 2027-2030 and invites stakeholder input on priorities for the standard-setting boards.', body: richText('FRAS Canada is seeking stakeholder input as it develops its strategic plan for the 2027-2030 period.'), board: boards.acsb },
    { title: 'AASB Issues Implementation Support for CAS 600', slug: 'aasb-cas-600-support', date: daysAgo(40), category: 'News' as const, excerpt: 'The AASB has issued implementation support materials for Canadian Auditing Standard (CAS) 600 — Special Considerations for Group Audits.', body: richText('The Auditing and Assurance Standards Board has released implementation support materials for CAS 600.'), board: boards.aasb },
    { title: 'CSSB Holds First Public Board Meeting', slug: 'cssb-first-meeting', date: daysAgo(45), category: 'News' as const, excerpt: 'The CSSB held its first public board meeting, discussing its strategic direction and priorities for Canadian sustainability disclosure standards.', body: richText('The Canadian Sustainability Standards Board held its inaugural public board meeting, setting the stage for the development of Canadian sustainability disclosure standards.'), board: boards.cssb },
  ]

  for (const news of newsData) {
    await payload.create({ collection: 'news', data: news })
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

  for (const event of eventsData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.create({ collection: 'events', data: event } as any)
  }
  console.log(`    ✓ Created ${eventsData.length} events`)

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
                { label: 'About FRAS Canada', url: '/about' },
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
      newsletter_description: 'Subscribe to receive updates on standards, consultations, and events from FRAS Canada.',
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
          'FRAS Canada serves the public interest by establishing high-quality accounting, auditing, and sustainability standards.',
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
            'New to FRAS Canada?',
            'Learn about our boards, standards, and how we serve the Canadian financial reporting ecosystem.',
          ),
          links: [
            {
              link: {
                type: 'custom',
                url: '/about',
                label: 'About FRAS Canada',
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

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('\n✅ Seed complete!')
  console.log(`  Boards:        ${Object.keys(boards).length}`)
  console.log(`  Standards:     ${Object.keys(standards).length}`)
  console.log(`  Contacts:      ${contacts.length}`)
  console.log(`  Projects:      ${Object.keys(projects).length}`)
  console.log(`  Consultations: ${consultationsData.length}`)
  console.log(`  News:          ${newsData.length}`)
  console.log(`  Events:        ${eventsData.length}`)
  console.log('  Globals:       Navigation, Footer, Homepage, SearchConfig')

  process.exit(0)
}

// Self-invoke only when run directly (not when imported by payload config)
if (typeof process !== 'undefined' && process.argv[1]?.includes('seed')) {
  seed().catch((err) => {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  })
}
