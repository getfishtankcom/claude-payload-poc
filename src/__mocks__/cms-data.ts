/**
 * @description
 * Mock data factory for Storybook stories and tests.
 * Provides typed factory functions for all CMS collection types.
 * Each factory returns realistic data matching Payload CMS field structures.
 *
 * @dependencies
 * - None (standalone, uses inline types until payload-types.ts is generated)
 *
 * @notes
 * - Types are defined inline until Epic 1 generates payload-types.ts
 * - Once payload-types.ts exists, replace these with imports from there
 * - Factory functions accept partial overrides for flexible story composition
 * - All IDs use string format to match Payload's default ID handling
 * - Dates use ISO 8601 strings (Payload stores dates as strings)
 * - This file will be extended as new collections are built in Epics 1 and 11
 */

// ── Inline Types (replace with payload-types.ts imports after Epic 1) ───────

export type Board = {
  id: string
  name: string
  slug: string
  abbreviation: string
  abbreviationFr: string
  color: string
  description: string
  isOversight: boolean
}

export type Project = {
  id: string
  title: string
  slug: string
  board: Board
  status: 'active' | 'completed' | 'deferred'
  type: string
  summary: string
  frasIdNumber: string
  timelineStages: TimelineStage[]
  publishedDate: string
  updatedAt: string
}

export type TimelineStage = {
  label: string
  status: 'complete' | 'in-progress' | 'not-started'
}

export type News = {
  id: string
  title: string
  slug: string
  board: Board
  summary: string
  content: string
  publishedDate: string
  frasIdNumber: string
  category: 'news' | 'announcement' | 'update'
}

export type Event = {
  id: string
  title: string
  slug: string
  board: Board
  type: 'meeting' | 'webinar' | 'deadline' | 'decision-summary'
  date: string
  startTime?: string
  location?: string
  summary: string
  publishedDate: string
}

export type DocumentForComment = {
  id: string
  title: string
  slug: string
  board: Board
  status: 'open' | 'closed'
  group: 'exposure-draft' | 'consultation-paper' | 're-exposure-draft' | 'discussion-paper'
  commentPeriodStart: string
  commentPeriodEnd: string
  summary: string
  frasIdNumber: string
  publishedDate: string
  documentUrl?: string
  commentSubmitUrl?: string
  commentsPdfUrl?: string
  standard?: { id: string; slug: string; name: string }
}

export type Resource = {
  id: string
  title: string
  slug: string
  board: Board
  type: 'article' | 'guidance' | 'webinar' | 'publication'
  summary: string
  publishedDate: string
  fileUrl?: string
}

export type Contact = {
  id: string
  name: string
  title: string
  email: string
  phone?: string
  board: Board
}

export type BoardMember = {
  id: string
  name: string
  credentials?: string
  role: 'chair' | 'vice-chair' | 'voting-member' | 'non-voting'
  roleLabel?: string
  photo?: string
  appointedDate: string
  termExpires: string
  board: Board
  bioPageUrl?: string
  sortOrder?: number
}

export type Committee = {
  id: string
  name: string
  slug: string
  description: string
  board: Board
  sortOrder: number
  status: 'active' | 'inactive' | 'archived'
  detailPageUrl?: string
  members?: Array<{ name: string; role?: string; organization?: string }>
}

export type StandardsSection = {
  id: string
  title: string
  slug: string
  boardLogo?: string
  boardName: string
  tabs: Array<{ label: string; href: string; isActive: boolean }>
  featureCTAs: Array<{
    heading: string
    description: string
    buttonLabel: string
    buttonHref: string
    variant: 'light' | 'dark-purple'
  }>
  board: Board
  activeProjects: Project[]
}

export type EffectiveDatesData = {
  id: string
  title: string
  introText?: string
  sections: Array<{
    headerLabel: string
    headerDate?: string
    rows: Array<{
      application: string
      pronouncement?: string
      footnoteRef?: string
    }>
  }>
  footnotes?: Array<{ marker: string; text: string }>
}

export type JobPosting = {
  id: string
  title: string
  department?: string
  location?: string
  summary?: string
  postedDate?: string
  closingDate?: string
  externalUrl?: string
  status: 'draft' | 'published' | 'closed'
}

// ── Board Fixtures ──────────────────────────────────────────────────────────

export const BOARDS: Record<string, Board> = {
  acsb: {
    id: '1',
    name: 'Accounting Standards Board',
    slug: 'acsb',
    abbreviation: 'AcSB',
    abbreviationFr: 'CNC',
    color: '#00438C',
    description: 'Sets accounting standards for private enterprises, not-for-profit organizations, and pension plans in Canada.',
    isOversight: false,
  },
  psab: {
    id: '2',
    name: 'Public Sector Accounting Board',
    slug: 'psab',
    abbreviation: 'PSAB',
    abbreviationFr: 'CCSP',
    color: '#00438C',
    description: 'Sets accounting standards for the public sector in Canada.',
    isOversight: false,
  },
  aasb: {
    id: '3',
    name: 'Auditing and Assurance Standards Board',
    slug: 'aasb',
    abbreviation: 'AASB',
    abbreviationFr: 'CNAC',
    color: '#983232',
    description: 'Sets auditing and assurance standards in Canada.',
    isOversight: false,
  },
  cssb: {
    id: '4',
    name: 'Canadian Sustainability Standards Board',
    slug: 'cssb',
    abbreviation: 'CSSB',
    abbreviationFr: 'CCDD',
    color: '#00438C',
    description: 'Develops sustainability disclosure standards for Canada.',
    isOversight: false,
  },
  rasoc: {
    id: '5',
    name: 'Regulatory and Accounting Standards Oversight Council',
    slug: 'rasoc',
    abbreviation: 'RASOC',
    abbreviationFr: 'CSNAC',
    color: '#601F5B',
    description: 'Provides oversight of the standard-setting process in Canada.',
    isOversight: true,
  },
}

// ── Factory Functions ───────────────────────────────────────────────────────

let idCounter = 100

function nextId(): string {
  return String(++idCounter)
}

export function mockBoard(overrides?: Partial<Board>): Board {
  return {
    ...BOARDS.acsb,
    ...overrides,
  }
}

export function mockProject(overrides?: Partial<Project>): Project {
  return {
    id: nextId(),
    title: 'Revenue Recognition for Not-for-Profit Organizations',
    slug: 'revenue-recognition-nfpo',
    board: BOARDS.acsb,
    status: 'active',
    type: 'Major',
    summary: 'This project proposes amendments to the revenue recognition standard for not-for-profit organizations under Part III of the CPA Canada Handbook.',
    frasIdNumber: 'PRJ-2024-001',
    timelineStages: [
      { label: 'Research', status: 'complete' },
      { label: 'Exposure Draft', status: 'complete' },
      { label: 'Comment Period', status: 'in-progress' },
      { label: 'Re-deliberation', status: 'not-started' },
      { label: 'Final Standard', status: 'not-started' },
    ],
    publishedDate: '2025-09-15T00:00:00.000Z',
    updatedAt: '2026-02-20T00:00:00.000Z',
    ...overrides,
  }
}

export function mockNews(overrides?: Partial<News>): News {
  return {
    id: nextId(),
    title: 'AcSB Publishes New Exposure Draft on Financial Instruments',
    slug: 'acsb-exposure-draft-financial-instruments',
    board: BOARDS.acsb,
    summary: 'The Accounting Standards Board has published a new exposure draft proposing amendments to Section 3856.',
    content: '<p>The AcSB is seeking comments on proposed amendments...</p>',
    publishedDate: '2026-02-15T00:00:00.000Z',
    frasIdNumber: 'NEWS-2026-042',
    category: 'news',
    ...overrides,
  }
}

export function mockEvent(overrides?: Partial<Event>): Event {
  return {
    id: nextId(),
    title: 'AcSB March 2026 Meeting',
    slug: 'acsb-march-2026-meeting',
    board: BOARDS.acsb,
    type: 'meeting',
    date: '2026-03-20T00:00:00.000Z',
    location: 'Toronto, ON',
    summary: 'Regular board meeting to discuss active projects and approve exposure drafts.',
    publishedDate: '2026-02-01T00:00:00.000Z',
    ...overrides,
  }
}

export function mockDocumentForComment(overrides?: Partial<DocumentForComment>): DocumentForComment {
  return {
    id: nextId(),
    title: 'Exposure Draft: Revenue Recognition for NFPOs',
    slug: 'ed-revenue-recognition-nfpos',
    board: BOARDS.acsb,
    status: 'open',
    group: 'exposure-draft',
    commentPeriodStart: '2026-01-15T00:00:00.000Z',
    commentPeriodEnd: '2026-04-15T00:00:00.000Z',
    summary: 'This exposure draft proposes amendments to the revenue recognition standard for not-for-profit organizations.',
    frasIdNumber: 'DOC-2026-005',
    publishedDate: '2026-01-15T00:00:00.000Z',
    commentSubmitUrl: '/submit-comment',
    ...overrides,
  }
}

export type DocumentDetail = {
  id: string
  title: string
  slug: string
  highlights: null
  bodyContent: null
  commentQuestions: Array<{ questionNumber: number; questionText: null }>
  replyDeadline: string
  howToReply: {
    heading: string
    body: null
    ctaLabel: string
    ctaHref: string
    contactName: string
    contactTitle: string
    contactAddress: null
    contactEmail: string
  }
  supportMaterials: Array<{ label: string; url: string; fileType: string }>
  standard?: { id: string; slug: string; name: string }
  board: Board
  staffContacts: Contact[]
}

export function mockDocumentDetail(overrides?: Partial<DocumentDetail>): DocumentDetail {
  return {
    id: nextId(),
    title: 'Exposure Draft: Revenue Recognition for NFPOs',
    slug: 'ed-revenue-recognition-nfpos',
    highlights: null,
    bodyContent: null,
    commentQuestions: [
      { questionNumber: 1, questionText: null },
      { questionNumber: 2, questionText: null },
      { questionNumber: 3, questionText: null },
    ],
    replyDeadline: '2026-04-15T00:00:00.000Z',
    howToReply: {
      heading: 'How to Reply',
      body: null,
      ctaLabel: 'Submit comment',
      ctaHref: '/submit-comment',
      contactName: 'Andrew White, CPA, CA',
      contactTitle: 'Director, Accounting Standards',
      contactAddress: null,
      contactEmail: 'awhite@frascanada.ca',
    },
    supportMaterials: [
      { label: 'Complete Exposure Draft', url: '/files/ed-revenue.pdf', fileType: 'pdf' },
      { label: 'Basis for Conclusions', url: '/files/basis-conclusions.pdf', fileType: 'pdf' },
    ],
    board: BOARDS.acsb,
    staffContacts: [mockContact()],
    ...overrides,
  }
}

export type ListingItemData = {
  id: string
  date: string
  categories: string[]
  title: string
  href: string
  excerpt: string
  isExternal?: boolean
}

export function mockListingItem(overrides?: Partial<ListingItemData>): ListingItemData {
  return {
    id: nextId(),
    date: '2026-02-15T00:00:00.000Z',
    categories: ['Article'],
    title: 'Guide to Applying ASPE Section 3856',
    href: '/resources/guide-aspe-section-3856',
    excerpt: 'A practical guide to help preparers apply the financial instruments standard under Part II of the CPA Canada Handbook.',
    ...overrides,
  }
}

export function mockListingItemList(count = 5): ListingItemData[] {
  const items: Partial<ListingItemData>[] = [
    { title: 'Guide to Applying ASPE Section 3856', categories: ['Guidance'], date: '2026-02-15T00:00:00.000Z' },
    { title: 'AcSB In Brief: Revenue Recognition Changes', categories: ['In Brief'], date: '2026-02-10T00:00:00.000Z' },
    { title: 'Webinar: Understanding the New Standard', categories: ['Webinar'], date: '2026-02-05T00:00:00.000Z', isExternal: true },
    { title: 'Climate-related Disclosures Framework', categories: ['Article'], date: '2026-01-28T00:00:00.000Z' },
    { title: 'PSAB Guidance on Asset Retirement', categories: ['Guidance'], date: '2026-01-20T00:00:00.000Z' },
  ]
  return items.slice(0, count).map((item) =>
    mockListingItem({
      ...item,
      href: `/resources/${(item.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      excerpt: `Summary text for ${item.title}. This resource provides detailed information for practitioners.`,
    }),
  )
}

export function mockResource(overrides?: Partial<Resource>): Resource {
  return {
    id: nextId(),
    title: 'Guide to Applying ASPE Section 3856',
    slug: 'guide-aspe-section-3856',
    board: BOARDS.acsb,
    type: 'guidance',
    summary: 'A practical guide to help preparers apply the financial instruments standard.',
    publishedDate: '2025-11-01T00:00:00.000Z',
    ...overrides,
  }
}

export function mockContact(overrides?: Partial<Contact>): Contact {
  return {
    id: nextId(),
    name: 'Andrew White, CPA, CA',
    title: 'Director, Accounting Standards',
    email: 'awhite@frascanada.ca',
    phone: '416-204-3456',
    board: BOARDS.acsb,
    ...overrides,
  }
}

export function mockBoardMember(overrides?: Partial<BoardMember>): BoardMember {
  return {
    id: nextId(),
    name: 'Linda Wei, FCPA, FCA',
    credentials: 'FCPA, FCA',
    role: 'chair',
    roleLabel: 'CHAIR',
    appointedDate: '2024-01-01T00:00:00.000Z',
    termExpires: '2027-12-31T00:00:00.000Z',
    board: BOARDS.acsb,
    bioPageUrl: '/acsb/about/members/linda-wei',
    sortOrder: 0,
    ...overrides,
  }
}

export function mockCommittee(overrides?: Partial<Committee>): Committee {
  return {
    id: nextId(),
    name: 'Advisory Committee',
    slug: 'advisory-committee',
    description: 'The Advisory Committee assists the AcSB by providing input on technical accounting matters.',
    board: BOARDS.acsb,
    sortOrder: 0,
    status: 'active',
    ...overrides,
  }
}

export function mockJobPosting(overrides?: Partial<JobPosting>): JobPosting {
  return {
    id: nextId(),
    title: 'Senior Accounting Standards Analyst',
    department: 'Accounting Standards',
    location: 'Toronto, ON',
    summary: 'We are looking for an experienced analyst to join our team.',
    postedDate: '2026-01-15T00:00:00.000Z',
    status: 'published',
    ...overrides,
  }
}

export function mockBoardMembersList(count = 8): BoardMember[] {
  const members: Partial<BoardMember>[] = [
    { name: 'Linda Wei, FCPA, FCA', credentials: 'FCPA, FCA', role: 'chair', roleLabel: 'CHAIR', sortOrder: 0 },
    { name: 'Maria Garcia, CPA, CA', credentials: 'CPA, CA', role: 'vice-chair', sortOrder: 0 },
    { name: 'Alice Chen, FCPA, FCA, CPA(MI)', credentials: 'FCPA, FCA, CPA(MI)', role: 'voting-member', sortOrder: 1 },
    { name: 'Bob Williams, CPA', credentials: 'CPA', role: 'voting-member', sortOrder: 2 },
    { name: 'David Park, CPA, CA', credentials: 'CPA, CA', role: 'voting-member', sortOrder: 3 },
    { name: 'Emily Tremblay, FCPA, FCGA', credentials: 'FCPA, FCGA', role: 'voting-member', sortOrder: 4 },
    { name: 'Frank Liu, CPA, CMA', credentials: 'CPA, CMA', role: 'voting-member', sortOrder: 5 },
    { name: 'Grace Kim, FCPA, FCA', credentials: 'FCPA, FCA', role: 'voting-member', sortOrder: 6 },
  ]
  return members.slice(0, count).map((m) => mockBoardMember(m))
}

export function mockCommitteesList(count = 5): Committee[] {
  const committees: Partial<Committee>[] = [
    { name: 'Accounting Standards Advisory Forum', slug: 'asaf', sortOrder: 0, detailPageUrl: '/acsb/committees/asaf' },
    { name: 'Advisory Committee', slug: 'advisory-committee', sortOrder: 1, detailPageUrl: '/acsb/committees/advisory-committee' },
    { name: 'Agriculture Advisory Group', slug: 'agriculture', sortOrder: 2 },
    { name: 'Due Process Oversight Committee', slug: 'due-process', sortOrder: 3 },
    { name: 'Employee Future Benefits Task Force', slug: 'efb', sortOrder: 4 },
  ]
  return committees.slice(0, count).map((c) => mockCommittee(c))
}

// ── List Generators ─────────────────────────────────────────────────────────

export function mockNewsList(count = 5): News[] {
  const titles = [
    'AcSB Publishes New Exposure Draft on Financial Instruments',
    'PSAB Issues Statement of Principles on Asset Retirement Obligations',
    'AASB Approves New Quality Management Standard',
    'CSSB Releases First Canadian Sustainability Standard',
    'AcSB Decision Summary — February 2026 Meeting',
    'PSAB Invites Comments on Revenue Standard',
    'AASB Updates Guidance on Group Audits',
    'CSSB Announces Consultation on Climate Disclosures',
  ]
  return titles.slice(0, count).map((title, i) =>
    mockNews({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      board: [BOARDS.acsb, BOARDS.psab, BOARDS.aasb, BOARDS.cssb, BOARDS.acsb][i % 5],
      publishedDate: new Date(2026, 1, 15 - i).toISOString(),
    }),
  )
}

export function mockEventsList(count = 5): Event[] {
  const events: Partial<Event>[] = [
    { title: 'AcSB March Meeting', type: 'meeting', board: BOARDS.acsb },
    { title: 'PSAB Webinar: Public Sector Updates', type: 'webinar', board: BOARDS.psab, startTime: '2:00 PM ET' },
    { title: 'Comment Deadline: Financial Instruments ED', type: 'deadline', board: BOARDS.acsb },
    { title: 'AASB April Meeting', type: 'meeting', board: BOARDS.aasb },
    { title: 'CSSB Stakeholder Forum', type: 'webinar', board: BOARDS.cssb, startTime: '10:00 AM ET' },
  ]
  return events.slice(0, count).map((evt, i) =>
    mockEvent({
      ...evt,
      date: new Date(2026, 2, 10 + i * 7).toISOString(),
    }),
  )
}

export function mockProjectsList(count = 5): Project[] {
  const projects: Partial<Project>[] = [
    { title: 'Revenue Recognition for NFPOs', board: BOARDS.acsb, status: 'active' },
    { title: 'Asset Retirement Obligations', board: BOARDS.psab, status: 'active' },
    { title: 'Quality Management', board: BOARDS.aasb, status: 'completed' },
    { title: 'Climate-related Disclosures', board: BOARDS.cssb, status: 'active' },
    { title: 'Financial Instruments — Hedge Accounting', board: BOARDS.acsb, status: 'active' },
  ]
  return projects.slice(0, count).map((proj) =>
    mockProject(proj),
  )
}

export function mockDocumentForCommentList(count = 6): DocumentForComment[] {
  const docs: Partial<DocumentForComment>[] = [
    { title: 'ED: Revenue Recognition for NFPOs', board: BOARDS.acsb, status: 'open', group: 'exposure-draft', commentSubmitUrl: '/submit' },
    { title: 'ED: Proposed Amendments to Section 3856', board: BOARDS.acsb, status: 'open', group: 'exposure-draft', commentSubmitUrl: '/submit' },
    { title: 'Consultation Paper: Climate-related Disclosures', board: BOARDS.cssb, status: 'open', group: 'consultation-paper', commentSubmitUrl: '/submit' },
    { title: 'ED: Asset Retirement Obligations', board: BOARDS.psab, status: 'closed', group: 'exposure-draft', commentsPdfUrl: '/files/comments-aro.pdf' },
    { title: 'ED: Group Audits', board: BOARDS.aasb, status: 'closed', group: 'exposure-draft', commentsPdfUrl: '/files/comments-group-audits.pdf' },
    { title: 'Re-exposure Draft: Financial Instruments', board: BOARDS.acsb, status: 'closed', group: 're-exposure-draft', commentsPdfUrl: '/files/comments-fi.pdf' },
  ]
  return docs.slice(0, count).map((doc) =>
    mockDocumentForComment(doc),
  )
}

// ── Admin Panel Mock Data ────────────────────────────────────────────────────

export type WorkflowHistoryEntry = {
  from?: string
  to?: string
  user?: { firstName?: string; email?: string } | string
  date?: string
  comment?: string
}

export type WorkflowItem = {
  id: string
  title?: string
  slug?: string
  workflowState: string
  createdBy?: { id: string; email?: string; firstName?: string } | string
  updatedAt?: string
}

export type ScheduledItem = {
  id: string
  title?: string
  slug?: string
  publishOn?: string
}

export function mockWorkflowHistory(): WorkflowHistoryEntry[] {
  return [
    { from: 'draft', to: 'in_review', user: { firstName: 'Author', email: 'author@frascanada.ca' }, date: '2026-03-01T10:00:00.000Z' },
    { from: 'in_review', to: 'needs_revision', user: { firstName: 'Editor', email: 'editor@frascanada.ca' }, date: '2026-03-02T14:30:00.000Z', comment: 'Please add the French translation and update the summary to reference Section 3856.' },
    { from: 'needs_revision', to: 'in_review', user: { firstName: 'Author', email: 'author@frascanada.ca' }, date: '2026-03-03T09:15:00.000Z' },
  ]
}

export function mockWorkflowItems(): WorkflowItem[] {
  return [
    { id: '1', title: 'Revenue Recognition Update', workflowState: 'in_review', updatedAt: '2026-03-05T10:00:00.000Z' },
    { id: '2', title: 'Climate Disclosure Framework', workflowState: 'in_review', updatedAt: '2026-03-04T15:30:00.000Z' },
    { id: '3', title: 'PSAB Annual Report 2025', workflowState: 'needs_revision', updatedAt: '2026-03-03T09:15:00.000Z' },
    { id: '4', title: 'New Auditing Standard CAS 600', workflowState: 'approved', updatedAt: '2026-03-02T14:00:00.000Z' },
  ]
}

export function mockScheduledItems(): ScheduledItem[] {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)
  return [
    { id: '1', title: 'Revenue Recognition Update', publishOn: tomorrow.toISOString() },
    { id: '2', title: 'PSAB Guidelines Q1', publishOn: tomorrow.toISOString() },
    { id: '3', title: 'Climate Disclosure Standard', publishOn: nextWeek.toISOString() },
  ]
}

export function mockRecentItems(): Array<{ id: string; title: string; updatedAt: string }> {
  const now = Date.now()
  return [
    { id: '1', title: 'Revenue Recognition for NFPOs', updatedAt: new Date(now - 5 * 60000).toISOString() },
    { id: '2', title: 'AcSB March Meeting Summary', updatedAt: new Date(now - 30 * 60000).toISOString() },
    { id: '3', title: 'Climate Disclosure Framework', updatedAt: new Date(now - 2 * 3600000).toISOString() },
    { id: '4', title: 'PSAB Annual Report 2025', updatedAt: new Date(now - 24 * 3600000).toISOString() },
    { id: '5', title: 'New Auditing Standard CAS 600', updatedAt: new Date(now - 48 * 3600000).toISOString() },
  ]
}

// ── Navigation & Footer Mock Data ────────────────────────────────────────────

import type { Navigation, Footer } from '@/payload-types'

export function mockNavigationData(): Navigation {
  return {
    id: 1,
    utility_links: [
      { label: 'About Us', url: '/about', has_dropdown: true, id: 'u1' },
      { label: 'Boards', url: '/boards', has_dropdown: true, id: 'u2' },
      { label: 'Contact', url: '/contact', has_dropdown: false, id: 'u3' },
      { label: 'Newsletter', url: '/newsletter', has_dropdown: false, id: 'u4' },
      { label: 'Volunteer', url: '/volunteer', has_dropdown: false, id: 'u5' },
      { label: 'FR', url: '/fr', has_dropdown: false, id: 'u6' },
      { label: 'Sign In', url: '/login', has_dropdown: false, id: 'u7' },
    ],
    primary_nav: [
      { label: 'Active Projects', url: '/active-projects', has_dropdown: true, id: 'p1' },
      { label: 'Open Consultations', url: '/consultations', has_dropdown: false, id: 'p2' },
      { label: 'News', url: '/news', has_dropdown: false, id: 'p3' },
    ],
    mega_menu: [
      {
        trigger_label: 'About Us',
        id: 'm1',
        columns: [
          {
            links: [
              { label: 'About FRAS Canada', url: '/about', id: 'al1' },
              { label: 'Oversight Council', url: '/about/oversight-council', id: 'al2' },
              { label: 'Research Program', url: '/about/research', id: 'al3' },
              { label: 'Jobs', url: '/about/jobs', id: 'al4' },
            ],
            id: 'ac1',
          },
        ],
      },
      {
        trigger_label: 'Boards',
        id: 'm2',
        columns: [
          {
            heading: 'CSSB',
            id: 'bc1',
            links: [
              { label: 'Overview', url: '/boards/cssb', id: 'bl1' },
              { label: 'Projects', url: '/boards/cssb/projects', id: 'bl2' },
            ],
          },
          {
            heading: 'AcSB',
            id: 'bc2',
            links: [
              { label: 'Overview', url: '/boards/acsb', id: 'bl3' },
              { label: 'Projects', url: '/boards/acsb/projects', id: 'bl4' },
            ],
          },
          {
            heading: 'PSAB',
            id: 'bc3',
            links: [
              { label: 'Overview', url: '/boards/psab', id: 'bl5' },
              { label: 'Projects', url: '/boards/psab/projects', id: 'bl6' },
            ],
          },
          {
            heading: 'AASB',
            id: 'bc4',
            links: [
              { label: 'Overview', url: '/boards/aasb', id: 'bl7' },
              { label: 'Projects', url: '/boards/aasb/projects', id: 'bl8' },
            ],
          },
        ],
      },
      {
        trigger_label: 'Active Projects',
        id: 'm3',
        columns: [
          {
            id: 'apc1',
            links: [
              { label: 'Canadian Sustainability Standards Board', url: '/boards/cssb/projects', id: 'apl1' },
              { label: 'Accounting Standards Board', url: '/boards/acsb/projects', id: 'apl2' },
              { label: 'Public Sector Accounting Board', url: '/boards/psab/projects', id: 'apl3' },
              { label: 'Auditing and Assurance Standards Board', url: '/boards/aasb/projects', id: 'apl4' },
            ],
          },
        ],
      },
    ],
  }
}

export function mockFooterData(): Footer {
  return {
    id: 1,
    columns: [
      {
        heading: 'FRAS Canada',
        id: 'fc1',
        links: [
          { label: 'About Us', url: '/about', id: 'fl1' },
          { label: 'LinkedIn', url: 'https://www.linkedin.com/company/fras-canada', id: 'fl2' },
        ],
      },
    ],
    boards_links: [
      { label: 'Canadian Sustainability Standards Board', url: '/boards/cssb', id: 'fb1' },
      { label: 'Accounting Standards Board', url: '/boards/acsb', id: 'fb2' },
      { label: 'Public Sector Accounting Board', url: '/boards/psab', id: 'fb3' },
      { label: 'Auditing and Assurance Standards Board', url: '/boards/aasb', id: 'fb4' },
      { label: 'Regulatory and Accounting Standards Oversight Council', url: '/about/oversight-council', id: 'fb5' },
    ],
    quick_links: [
      { label: 'About Us', url: '/about', id: 'fq1' },
      { label: 'Research Program', url: '/about/research', id: 'fq2' },
      { label: 'News', url: '/news', id: 'fq3' },
      { label: 'Jobs', url: '/about/jobs', id: 'fq4' },
      { label: 'Volunteer', url: '/volunteer', id: 'fq5' },
      { label: 'Contact', url: '/contact', id: 'fq6' },
      { label: 'Newsletter', url: '/newsletter', id: 'fq7' },
    ],
    newsletter_heading: 'Stay informed with our weekly updates',
    newsletter_description: 'Get critical updates on regulatory changes and new standard releases.',
  }
}

// ── Tree Node mock data (Epic 23) ────────────────────────────────────────

export type TreeNode = {
  id: string | number
  title: string
  slug: string
  contentType: string
  workflowState: string
  lockedBy: string | number | null
  hasChildren: boolean
  sortOrder: number
  parent: string | number | null
  board: string | number | null
  children?: TreeNode[]
}

/** Returns a mock tree hierarchy for Storybook stories */
export function mockTreeNodes(): TreeNode[] {
  return [
    {
      id: 'root-1',
      title: 'FRAS Canada',
      slug: 'fras-canada-root',
      contentType: 'folder',
      workflowState: 'published',
      lockedBy: null,
      hasChildren: true,
      sortOrder: 0,
      parent: null,
      board: null,
      children: [
        {
          id: 'home-1',
          title: 'Home',
          slug: 'home',
          contentType: 'page',
          workflowState: 'published',
          lockedBy: null,
          hasChildren: false,
          sortOrder: 0,
          parent: 'root-1',
          board: null,
        },
        {
          id: 'boards-folder',
          title: 'Boards',
          slug: 'boards-folder',
          contentType: 'folder',
          workflowState: 'published',
          lockedBy: null,
          hasChildren: true,
          sortOrder: 1,
          parent: 'root-1',
          board: null,
          children: [
            {
              id: 'acsb-page',
              title: 'AcSB',
              slug: 'board-acsb',
              contentType: 'page',
              workflowState: 'published',
              lockedBy: null,
              hasChildren: true,
              sortOrder: 0,
              parent: 'boards-folder',
              board: 'board-1',
              children: [
                { id: 'acsb-about', title: 'About AcSB', slug: 'acsb-about', contentType: 'page', workflowState: 'published', lockedBy: null, hasChildren: false, sortOrder: 0, parent: 'acsb-page', board: 'board-1' },
                { id: 'acsb-members', title: 'AcSB Members', slug: 'acsb-members', contentType: 'page', workflowState: 'draft', lockedBy: null, hasChildren: false, sortOrder: 1, parent: 'acsb-page', board: 'board-1' },
              ],
            },
            { id: 'psab-page', title: 'PSAB', slug: 'board-psab', contentType: 'page', workflowState: 'published', lockedBy: 'user-2', hasChildren: false, sortOrder: 1, parent: 'boards-folder', board: 'board-2' },
            { id: 'cssb-page', title: 'CSSB', slug: 'board-cssb', contentType: 'page', workflowState: 'in_review', lockedBy: null, hasChildren: false, sortOrder: 2, parent: 'boards-folder', board: 'board-3' },
            { id: 'aasb-page', title: 'AASB', slug: 'board-aasb', contentType: 'page', workflowState: 'approved', lockedBy: null, hasChildren: false, sortOrder: 3, parent: 'boards-folder', board: 'board-4' },
            { id: 'rasoc-page', title: 'RASOC', slug: 'board-rasoc', contentType: 'page', workflowState: 'published', lockedBy: null, hasChildren: false, sortOrder: 4, parent: 'boards-folder', board: 'board-5' },
          ],
        },
        {
          id: 'projects-folder',
          title: 'Projects',
          slug: 'projects-folder',
          contentType: 'folder',
          workflowState: 'published',
          lockedBy: null,
          hasChildren: true,
          sortOrder: 2,
          parent: 'root-1',
          board: null,
          children: [
            { id: 'proj-1', title: 'IFRS S1 Sustainability', slug: 'project-ifrs-s1', contentType: 'project', workflowState: 'published', lockedBy: null, hasChildren: false, sortOrder: 0, parent: 'projects-folder', board: null },
            { id: 'proj-2', title: 'ASPE Review', slug: 'project-aspe-review', contentType: 'project', workflowState: 'draft', lockedBy: null, hasChildren: false, sortOrder: 1, parent: 'projects-folder', board: null },
          ],
        },
        {
          id: 'news-folder',
          title: 'News',
          slug: 'news-folder',
          contentType: 'folder',
          workflowState: 'published',
          lockedBy: null,
          hasChildren: true,
          sortOrder: 3,
          parent: 'root-1',
          board: null,
          children: [
            { id: 'news-1', title: 'New Sustainability Standards Published', slug: 'news-sustainability', contentType: 'news', workflowState: 'published', lockedBy: null, hasChildren: false, sortOrder: 0, parent: 'news-folder', board: null },
            { id: 'news-2', title: 'Board Appointments for 2026', slug: 'news-appointments', contentType: 'news', workflowState: 'draft', lockedBy: null, hasChildren: false, sortOrder: 1, parent: 'news-folder', board: null },
            { id: 'news-3', title: 'PSAB Consultation Update', slug: 'news-psab-consult', contentType: 'news', workflowState: 'in_review', lockedBy: 'user-3', hasChildren: false, sortOrder: 2, parent: 'news-folder', board: null },
          ],
        },
        {
          id: 'events-folder',
          title: 'Events',
          slug: 'events-folder',
          contentType: 'folder',
          workflowState: 'published',
          lockedBy: null,
          hasChildren: true,
          sortOrder: 4,
          parent: 'root-1',
          board: null,
          children: [
            { id: 'event-1', title: 'AcSB Board Meeting — March 2026', slug: 'event-acsb-march', contentType: 'event', workflowState: 'approved', lockedBy: null, hasChildren: false, sortOrder: 0, parent: 'events-folder', board: null },
            { id: 'event-2', title: 'CSSB Webinar: Climate Disclosure', slug: 'event-cssb-webinar', contentType: 'event', workflowState: 'needs_revision', lockedBy: null, hasChildren: false, sortOrder: 1, parent: 'events-folder', board: null },
          ],
        },
        { id: 'docs-folder', title: 'Documents', slug: 'documents-folder', contentType: 'folder', workflowState: 'published', lockedBy: null, hasChildren: false, sortOrder: 5, parent: 'root-1', board: null },
        { id: 'settings-node', title: 'Settings', slug: 'settings-node', contentType: 'settings', workflowState: 'published', lockedBy: null, hasChildren: false, sortOrder: 6, parent: 'root-1', board: null },
      ],
    },
  ]
}

// ── Media Library Mocks (Epic 24) ─────────────────────────────────────────

export type MockMediaFolder = {
  id: string | number
  name: string
  hasChildren: boolean
  sortOrder: number
  parent: string | number | null
  mediaCount: number
  children?: MockMediaFolder[]
}

export type MockMediaItem = {
  id: string | number
  filename: string
  alt: string
  title?: string
  description?: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  url: string
  folder?: string | number | null
  createdAt: string
  updatedAt: string
  createdBy?: { id: string; email?: string; firstName?: string; lastName?: string } | null
  sizes?: {
    thumbnail?: { url: string; width: number; height: number }
    card?: { url: string; width: number; height: number }
  }
}

/** Mock folder tree for media library stories */
export function mockMediaFolders(): MockMediaFolder[] {
  return [
    {
      id: 'folder-images',
      name: 'Images',
      hasChildren: true,
      sortOrder: 0,
      parent: null,
      mediaCount: 0,
      children: [
        { id: 'folder-boards', name: 'Boards', hasChildren: false, sortOrder: 0, parent: 'folder-images', mediaCount: 4 },
        { id: 'folder-news', name: 'News', hasChildren: false, sortOrder: 1, parent: 'folder-images', mediaCount: 3 },
        { id: 'folder-heroes', name: 'Heroes', hasChildren: false, sortOrder: 2, parent: 'folder-images', mediaCount: 2 },
      ],
    },
    {
      id: 'folder-documents',
      name: 'Documents',
      hasChildren: true,
      sortOrder: 1,
      parent: null,
      mediaCount: 0,
      children: [
        { id: 'folder-pdfs', name: 'PDFs', hasChildren: false, sortOrder: 0, parent: 'folder-documents', mediaCount: 5 },
        { id: 'folder-reports', name: 'Reports', hasChildren: false, sortOrder: 1, parent: 'folder-documents', mediaCount: 2 },
      ],
    },
    { id: 'folder-logos', name: 'Logos', hasChildren: false, sortOrder: 2, parent: null, mediaCount: 6 },
    { id: 'folder-videos', name: 'Videos', hasChildren: false, sortOrder: 3, parent: null, mediaCount: 1 },
  ]
}

/** Mock media items for media library stories */
export function mockMediaItems(): MockMediaItem[] {
  return [
    {
      id: 'media-1',
      filename: 'acsb-hero-banner.jpg',
      alt: 'AcSB Hero Banner',
      title: 'AcSB Homepage Hero',
      mimeType: 'image/jpeg',
      filesize: 1200000,
      width: 1920,
      height: 600,
      url: '/media/acsb-hero-banner.jpg',
      folder: 'folder-heroes',
      createdAt: '2026-02-15T10:30:00Z',
      updatedAt: '2026-02-15T10:30:00Z',
      createdBy: { id: '1', email: 'admin@frascanada.ca', firstName: 'Admin' },
      sizes: {
        thumbnail: { url: '/media/acsb-hero-banner-200x200.jpg', width: 200, height: 200 },
        card: { url: '/media/acsb-hero-banner-640x480.jpg', width: 640, height: 480 },
      },
    },
    {
      id: 'media-2',
      filename: 'fras-logo-purple.svg',
      alt: 'FRAS Canada Logo',
      title: 'FRAS Logo Purple',
      mimeType: 'image/svg+xml',
      filesize: 45000,
      width: 400,
      height: 120,
      url: '/media/fras-logo-purple.svg',
      folder: 'folder-logos',
      createdAt: '2026-01-10T08:00:00Z',
      updatedAt: '2026-01-10T08:00:00Z',
      createdBy: { id: '1', email: 'admin@frascanada.ca', firstName: 'Admin' },
    },
    {
      id: 'media-3',
      filename: 'psab-board-photo.jpg',
      alt: 'PSAB Board Members Photo',
      title: 'PSAB Board Photo 2026',
      mimeType: 'image/jpeg',
      filesize: 800000,
      width: 1200,
      height: 800,
      url: '/media/psab-board-photo.jpg',
      folder: 'folder-boards',
      createdAt: '2026-02-20T14:00:00Z',
      updatedAt: '2026-02-20T14:00:00Z',
      createdBy: { id: '2', email: 'editor@frascanada.ca', firstName: 'Sarah' },
      sizes: {
        thumbnail: { url: '/media/psab-board-photo-200x200.jpg', width: 200, height: 200 },
      },
    },
    {
      id: 'media-4',
      filename: '2026-annual-report.pdf',
      alt: '2026 Annual Report',
      title: 'FRAS 2026 Annual Report',
      description: 'Complete annual report covering all board activities for fiscal year 2025-2026.',
      mimeType: 'application/pdf',
      filesize: 5400000,
      url: '/media/2026-annual-report.pdf',
      folder: 'folder-reports',
      createdAt: '2026-03-01T09:00:00Z',
      updatedAt: '2026-03-01T09:00:00Z',
      createdBy: { id: '1', email: 'admin@frascanada.ca', firstName: 'Admin' },
    },
    {
      id: 'media-5',
      filename: 'sustainability-webinar.mp4',
      alt: 'CSSB Sustainability Webinar',
      title: 'Climate Disclosure Standards Webinar',
      mimeType: 'video/mp4',
      filesize: 125000000,
      url: '/media/sustainability-webinar.mp4',
      folder: 'folder-videos',
      createdAt: '2026-02-28T16:00:00Z',
      updatedAt: '2026-02-28T16:00:00Z',
      createdBy: { id: '2', email: 'editor@frascanada.ca', firstName: 'Sarah' },
    },
    {
      id: 'media-6',
      filename: 'news-standards-update.jpg',
      alt: 'Standards Update Illustration',
      mimeType: 'image/jpeg',
      filesize: 320000,
      width: 800,
      height: 450,
      url: '/media/news-standards-update.jpg',
      folder: 'folder-news',
      createdAt: '2026-03-03T11:00:00Z',
      updatedAt: '2026-03-03T11:00:00Z',
      createdBy: { id: '3', email: 'author@frascanada.ca', firstName: 'James' },
      sizes: {
        thumbnail: { url: '/media/news-standards-update-200x200.jpg', width: 200, height: 200 },
      },
    },
  ]
}
