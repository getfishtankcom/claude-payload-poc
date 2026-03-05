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
  commentPeriodStart: string
  commentPeriodEnd: string
  summary: string
  frasIdNumber: string
  publishedDate: string
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
  role: 'chair' | 'vice-chair' | 'member'
  photo?: string
  termStart: string
  termEnd: string
  board: Board
  bio: string
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
    commentPeriodStart: '2026-01-15T00:00:00.000Z',
    commentPeriodEnd: '2026-04-15T00:00:00.000Z',
    summary: 'This exposure draft proposes amendments to the revenue recognition standard for not-for-profit organizations.',
    frasIdNumber: 'DOC-2026-005',
    publishedDate: '2026-01-15T00:00:00.000Z',
    ...overrides,
  }
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
    role: 'chair',
    termStart: '2024-01-01T00:00:00.000Z',
    termEnd: '2027-12-31T00:00:00.000Z',
    board: BOARDS.acsb,
    bio: 'Linda Wei is the Chair of the Accounting Standards Board. She has over 25 years of experience in financial reporting.',
    ...overrides,
  }
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

export function mockDocumentForCommentList(count = 3): DocumentForComment[] {
  const docs: Partial<DocumentForComment>[] = [
    { title: 'ED: Revenue Recognition for NFPOs', board: BOARDS.acsb, status: 'open' },
    { title: 'ED: Asset Retirement Obligations', board: BOARDS.psab, status: 'open' },
    { title: 'ED: Group Audits', board: BOARDS.aasb, status: 'closed' },
  ]
  return docs.slice(0, count).map((doc) =>
    mockDocumentForComment(doc),
  )
}

// ── Navigation & Footer Mock Data ────────────────────────────────────────────

import type { Navigation, Footer } from '@/payload-types'

export function mockNavigationData(): Navigation {
  return {
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
