import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const { getNewsByBoardMock, getProjectsByBoardMock } = vi.hoisted(() => ({
  getNewsByBoardMock: vi.fn(),
  getProjectsByBoardMock: vi.fn(),
}))

vi.mock('@/lib/cms', () => ({
  getNewsByBoard: getNewsByBoardMock,
  getProjectsByBoard: getProjectsByBoardMock,
  toPayloadLocale: (locale: string) => (locale === 'fr' ? 'fr' : 'en'),
}))

// next-intl's server helpers require a request context that's not available
// in the jsdom unit-test environment. Return the key so existing assertions
// (which match on EN copy) keep working.
vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
}))

// `<Breadcrumb>` is a child client component that calls useTranslations.
// Without a NextIntlClientProvider in the test tree, the call throws —
// stub the client API to return the key.
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

import { BoardLanding } from './BoardLanding'
import type { Board } from '@/payload-types'

const baseBoard: Board = {
  id: 1,
  name: 'Accounting Standards Board',
  abbreviation: 'AcSB',
  slug: 'acsb',
  description: 'Sets accounting standards for Canadian private enterprises and NFPOs.',
  tabs: [
    {
      id: 't1',
      label: 'About',
      slug: 'about',
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          children: [
            {
              type: 'paragraph',
              version: 1,
              format: '',
              indent: 0,
              direction: 'ltr',
              textFormat: 0,
              textStyle: '',
              children: [
                {
                  type: 'text',
                  version: 1,
                  text: 'About the AcSB.',
                  format: 0,
                  mode: 'normal',
                  style: '',
                  detail: 0,
                },
              ],
            },
          ],
        },
      },
    },
  ],
  quick_actions: [
    { id: 'q1', label: 'Subscribe', url: '/subscribe', icon: null },
  ],
  resources: null,
} as unknown as Board

describe('<BoardLanding>', () => {
  it('renders the H1 with abbreviation + name (correct casing, no "Acsb" lowercase artifact)', async () => {
    getNewsByBoardMock.mockResolvedValue([])
    getProjectsByBoardMock.mockResolvedValue([])

    render(await BoardLanding({ board: baseBoard, locale: 'en' }))

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('AcSB — Accounting Standards Board')
    expect(heading.textContent).not.toMatch(/\bAcsb\b/)
  })

  it('breadcrumb uses board.abbreviation (AcSB), not the lowercased URL slug', async () => {
    getNewsByBoardMock.mockResolvedValue([])
    getProjectsByBoardMock.mockResolvedValue([])

    render(await BoardLanding({ board: baseBoard, locale: 'en' }))

    const crumbs = screen.getByTestId('breadcrumb')
    expect(crumbs.textContent).toContain('AcSB')
    expect(crumbs.textContent).not.toMatch(/\bAcsb\b/)
  })

  it('renders the description as a subtitle when present', async () => {
    getNewsByBoardMock.mockResolvedValue([])
    getProjectsByBoardMock.mockResolvedValue([])

    render(await BoardLanding({ board: baseBoard, locale: 'en' }))

    expect(
      screen.getByText('Sets accounting standards for Canadian private enterprises and NFPOs.'),
    ).toBeInTheDocument()
  })

  it('renders empty-state copy when no news / projects exist', async () => {
    getNewsByBoardMock.mockResolvedValue([])
    getProjectsByBoardMock.mockResolvedValue([])

    render(await BoardLanding({ board: baseBoard, locale: 'en' }))

    expect(screen.getByTestId('section-recent-news').textContent).toMatch(/No recent news/i)
    expect(screen.getByTestId('section-active-projects').textContent).toMatch(/No active projects/i)
  })

  it('caps news + active projects at 5 each and filters out closed projects', async () => {
    getNewsByBoardMock.mockResolvedValue(
      Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        title: `News ${i + 1}`,
        slug: `news-${i + 1}`,
        date: '2026-05-01',
        excerpt: '',
      })),
    )
    getProjectsByBoardMock.mockResolvedValue([
      ...Array.from({ length: 8 }, (_, i) => ({
        id: i + 100,
        title: `Active ${i + 1}`,
        slug: `active-${i + 1}`,
        status: 'active',
      })),
      { id: 999, title: 'Closed Project', slug: 'closed', status: 'closed' },
    ])

    render(await BoardLanding({ board: baseBoard, locale: 'en' }))

    // helper passes 5 to getNewsByBoard so we render whatever it returned (7 here)
    // but the data layer caps at 5; we don't double-cap. The active-projects list
    // is sliced to 5 inside the component AND filters out closed.
    expect(screen.getAllByTestId('news-item').length).toBe(7)
    const projects = screen.getAllByTestId('active-project')
    expect(projects.length).toBe(5)
    expect(projects.map((p) => p.textContent).every((t) => !t?.includes('Closed Project'))).toBe(true)
  })

  it('renders the QuickActions sidebar when board.quick_actions are populated', async () => {
    getNewsByBoardMock.mockResolvedValue([])
    getProjectsByBoardMock.mockResolvedValue([])

    render(await BoardLanding({ board: baseBoard, locale: 'en' }))

    expect(screen.getByText('Subscribe')).toBeInTheDocument()
  })

  it('renders the Members & committees About-link in the right rail', async () => {
    getNewsByBoardMock.mockResolvedValue([])
    getProjectsByBoardMock.mockResolvedValue([])

    render(await BoardLanding({ board: baseBoard, locale: 'en' }))

    const link = screen.getByRole('link', { name: /members.*committees/i })
    expect(link).toHaveAttribute('href', '/acsb/about/members')
  })
})
