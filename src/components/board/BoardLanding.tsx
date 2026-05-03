/**
 * @description
 * Board Landing page body — renders for `/[locale]/<board-slug>` URLs
 * where <board-slug> matches a Board record (acsb, psab, aasb, cssb).
 *
 * Sections:
 * - Breadcrumb (Home > <abbreviation>) — uses board.abbreviation for
 *   correct casing (AcSB, not Acsb), fixing the QA-012 capitalization bug.
 * - Page header: H1 = `<abbreviation> — <name>` + description as subtitle.
 * - Tabs (board.tabs[]) — collapsible sections with Lexical content.
 * - Recent News — top 5 from getNewsByBoard.
 * - Active Projects — top 5 with status=active from getProjectsByBoard.
 * - Right rail: QuickActions (board.quick_actions) + Members link.
 *
 * @dependencies
 * - Phase 1.1 <RichText> wrapper for tab Lexical content.
 * - getNewsByBoard, getProjectsByBoard from payload-helpers.
 * - QuickActions, RecentNews, ProjectCard from board components.
 *
 * @notes
 * - RASOC is excluded upstream — this component only renders when the
 *   caller has confirmed the slug is a non-RASOC board landing.
 */
import React from 'react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

import { RichText } from '@/components/RichText'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { QuickActions } from '@/components/board/QuickActions'
import {
  getNewsByBoard,
  getProjectsByBoard,
  toPayloadLocale,
  type PayloadLocale,
} from '@/lib/payload-helpers'
import type { Board, News, Project } from '@/payload-types'

type BoardLandingProps = {
  board: Board
  locale: string
}

function formatDate(value: string, locale: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Per CLAUDE.md "Board-specific colors": each board surface gets a tinted
 * accent so AcSB/AASB (red-brown), PSAB/CSSB (blue), and the FRAS umbrella
 * (purple) read as visually distinct.
 *
 * Returned class names are static so Tailwind v4 picks them up at build time
 * — never compose the slug into the class string at runtime.
 */
function boardAccent(slug: string): { border: string; heading: string } {
  switch (slug) {
    case 'acsb':
    case 'aasb':
      // Standard-setting boards
      return { border: 'border-board-boards', heading: 'text-board-boards' }
    case 'psab':
    case 'cssb':
      // Councils
      return { border: 'border-board-councils', heading: 'text-board-councils' }
    default:
      // FRAS umbrella + RASOC oversight + any future record
      return { border: 'border-board-fras', heading: 'text-board-fras' }
  }
}

export async function BoardLanding({ board, locale }: BoardLandingProps) {
  const payloadLocale: PayloadLocale = toPayloadLocale(locale)
  // Pass `locale` explicitly to getTranslations — without it, next-intl
  // falls through to the default locale on FR routes (see PR #143).
  const [news, allProjects, tBoards, tCommon, tProjects] = await Promise.all([
    getNewsByBoard(board.id, 5, payloadLocale),
    getProjectsByBoard(board.id, 20, payloadLocale),
    getTranslations({ locale, namespace: 'boards' }),
    getTranslations({ locale, namespace: 'common' }),
    getTranslations({ locale, namespace: 'projects' }),
  ])

  const activeProjects = allProjects
    .filter((p) => (p as unknown as { status?: string }).status !== 'closed')
    .slice(0, 5)

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: board.abbreviation || board.name, href: `/${board.slug}` },
  ]

  const tabs = (board.tabs || []).filter(
    (t): t is NonNullable<typeof t> => Boolean(t),
  )
  const quickActions = (board.quick_actions || []).filter(
    (a): a is NonNullable<typeof a> => Boolean(a),
  )

  const accent = boardAccent(board.slug)

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8" data-testid="page-board-detail">
      <Breadcrumb items={breadcrumbItems} />

      <header
        className={`mt-4 border-b-4 ${accent.border} pb-6`}
        data-testid="board-landing-header"
        data-board-accent={board.slug}
      >
        <h1 className={`text-3xl font-bold ${accent.heading} md:text-4xl`}>
          {board.abbreviation ? `${board.abbreviation} — ${board.name}` : board.name}
        </h1>
        {board.description && (
          <p className="mt-3 max-w-3xl text-lg text-text-muted">{board.description}</p>
        )}
      </header>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <main className="space-y-12" data-testid="main-content">
          {tabs.length > 0 && (
            <section data-testid="section-board-tabs" className="space-y-8">
              {tabs.map((tab) => (
                <article key={tab.id || tab.slug} data-testid="board-tab">
                  <h2 className="text-xl font-bold text-text-heading">{tab.label}</h2>
                  <RichText
                    content={tab.content}
                    className="prose mt-3 max-w-none text-text-primary"
                  />
                </article>
              ))}
            </section>
          )}

          <section data-testid="section-recent-news">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-bold text-text-heading">{tBoards('recentNews')}</h2>
              <Link
                href={`/${board.slug}/news-listings`}
                className="text-sm text-primary hover:underline"
              >
                {tCommon('viewAll')} →
              </Link>
            </div>
            {news.length === 0 ? (
              <p className="mt-3 text-sm text-text-muted">
                No recent news for {board.abbreviation || board.name}.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-gray-200">
                {news.map((item: News) => (
                  <li key={item.id} className="py-3" data-testid="news-item">
                    <Link
                      href={`/news/${item.slug}`}
                      className="block text-base font-semibold text-link hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm text-text-muted">
                      <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
                      {item.excerpt && (
                        <>
                          <span className="mx-2" aria-hidden="true">·</span>
                          <span>{item.excerpt}</span>
                        </>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section data-testid="section-active-projects">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-bold text-text-heading">{tProjects('title')}</h2>
              <Link
                href={`/active-projects?board=${board.slug}`}
                className="text-sm text-primary hover:underline"
              >
                {tCommon('viewAll')} →
              </Link>
            </div>
            {activeProjects.length === 0 ? (
              <p className="mt-3 text-sm text-text-muted">
                No active projects for {board.abbreviation || board.name}.
              </p>
            ) : (
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {activeProjects.map((project: Project) => (
                  <li
                    key={project.id}
                    className="rounded-md border border-gray-200 p-4"
                    data-testid="active-project"
                  >
                    <Link
                      href={`/active-projects/${board.slug}/${project.slug}`}
                      className="block text-base font-semibold text-link hover:underline"
                    >
                      {project.title}
                    </Link>
                    {(project as unknown as { description?: string }).description && (
                      <p className="mt-1 line-clamp-2 text-sm text-text-muted">
                        {(project as unknown as { description?: string }).description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>

        <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start" data-testid="right-rail">
          {quickActions.length > 0 && (
            <QuickActions
              actions={quickActions.map((a) => ({
                label: a.label,
                url: a.url,
                icon: a.icon,
              }))}
            />
          )}

          <nav
            aria-labelledby="board-section-links-heading"
            className="rounded-md border border-gray-200 p-4"
          >
            <h2
              id="board-section-links-heading"
              className="text-sm font-bold uppercase tracking-wide text-text-muted"
            >
              {tBoards('about')}
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href={`/${board.slug}/about/members`}
                  className="text-primary hover:underline"
                >
                  {tBoards('membersCommittees')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${board.slug}/about/annual-report`}
                  className="text-primary hover:underline"
                >
                  {tBoards('annualReport')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${board.slug}/meetings-and-events`}
                  className="text-primary hover:underline"
                >
                  {tBoards('meetingsEvents')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${board.slug}/documents`}
                  className="text-primary hover:underline"
                >
                  {tBoards('documentsForComment')}
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  )
}
