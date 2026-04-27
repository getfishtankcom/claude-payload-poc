/**
 * @description
 * Template 9: Document Detail page (Exposure Draft).
 * 2-column layout: ~70% main content + ~30% sticky sidebar with staff contacts.
 *
 * Key features:
 * - H1 title, Highlights section, rich body content
 * - Comments Requested section with BlockquoteQuestion components
 * - When to Reply section with bold deadline date
 * - DarkPurpleCTA "How to Reply" block with contact info
 * - SupportMaterialsList for downloadable documents
 * - Sticky sidebar with staff contact card
 * - Mobile: sidebar collapses below main content
 *
 * @dependencies
 * - BlockquoteQuestion: Numbered comment questions
 * - DarkPurpleCTA: How to Reply CTA block
 * - SupportMaterialsList: Document links with icons
 * - RichText: Rich text rendering
 * - payload-helpers: getDocumentDetailBySlug
 *
 * @notes
 * - Wired to `document-details` collection with depth:2
 * - No "back to listing" link — navigation via breadcrumbs
 * - Route uses [slug]/documents/[docSlug] — slug is standard, docSlug is document
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { BlockquoteQuestion } from '@/components/BlockquoteQuestion'
import { DarkPurpleCTA } from '@/components/DarkPurpleCTA'
import { SupportMaterialsList } from '@/components/SupportMaterialsList'
import { getDocumentDetailBySlug } from '@/lib/payload-helpers'

type Props = {
  params: Promise<{ board: string; docSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { docSlug } = await params
  const doc = await getDocumentDetailBySlug(docSlug) as Record<string, unknown> | null
  return {
    title: doc ? `${doc.title} — RAS Canada` : 'Document Detail — RAS Canada',
    description: 'Exposure draft detail page with comment questions and reply instructions.',
  }
}

export const revalidate = 60

/**
 * Formats an ISO date string to a human-readable format.
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export default async function DocumentDetailPage({ params }: Props) {
  const { docSlug } = await params
  const doc = await getDocumentDetailBySlug(docSlug) as Record<string, unknown> | null

  if (!doc) {
    notFound()
  }

  const title = doc.title as string
  const highlights = doc.highlights as Record<string, unknown> | null
  const bodyContent = doc.bodyContent as Record<string, unknown> | null
  const commentQuestions = (doc.commentQuestions || []) as Array<{
    questionNumber: number
    questionText: Record<string, unknown> | null
  }>
  const replyDeadline = doc.replyDeadline as string | undefined
  const howToReply = doc.howToReply as {
    heading?: string
    body?: Record<string, unknown> | null
    ctaLabel?: string
    ctaHref?: string
    contactName?: string
    contactTitle?: string
    contactAddress?: Record<string, unknown> | null
    contactEmail?: string
  } | undefined
  const supportMaterials = (doc.supportMaterials || []) as Array<{
    label: string
    url: string
    fileType: string
  }>
  const staffContacts = (doc.staffContacts || []) as Array<{
    name: string
    title: string
    email: string
    phone?: string
  }>

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8" data-testid="page-document-detail">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main content (~70%) */}
        <main className="lg:w-[70%]" data-testid="main-content">
          {/* Title */}
          <h1 className="text-3xl font-bold text-primary">{title}</h1>

          {/* Highlights section */}
          {highlights && (
            <section className="mt-6" data-testid="section-highlights">
              <h2 className="text-xl font-bold text-primary">Highlights</h2>
              <RichText
                content={highlights}
                className="mt-3 text-base leading-relaxed text-text-primary"
              />
            </section>
          )}

          {/* Body content */}
          {bodyContent && (
            <section className="mt-6" data-testid="section-body">
              <RichText
                content={bodyContent}
                className="prose max-w-none text-text-primary"
              />
            </section>
          )}

          {/* Comments Requested */}
          {commentQuestions.length > 0 && (
            <section className="mt-8" data-testid="section-comments-requested">
              <h2 className="text-xl font-bold text-primary">Comments Requested</h2>
              <div className="mt-4 space-y-4">
                {commentQuestions.map((q) => (
                  <BlockquoteQuestion
                    key={q.questionNumber}
                    questionNumber={q.questionNumber}
                    questionText={q.questionText}
                  />
                ))}
              </div>
            </section>
          )}

          {/* When to Reply */}
          {replyDeadline && (
            <section className="mt-8" data-testid="section-when-to-reply">
              <h2 className="text-xl font-bold text-primary">When to Reply</h2>
              <p className="mt-2 text-base text-text-primary">
                The deadline for responses is{' '}
                <strong className="font-bold">{formatDate(replyDeadline)}</strong>.
              </p>
            </section>
          )}

          {/* How to Reply CTA */}
          {howToReply && howToReply.ctaLabel && howToReply.ctaHref && (
            <section className="mt-8" data-testid="section-how-to-reply">
              <DarkPurpleCTA
                heading={howToReply.heading || 'How to Reply'}
                body={howToReply.body || null}
                ctaLabel={howToReply.ctaLabel}
                ctaHref={howToReply.ctaHref}
                contactName={howToReply.contactName}
                contactTitle={howToReply.contactTitle}
                contactAddress={howToReply.contactAddress || null}
                contactEmail={howToReply.contactEmail}
              />
            </section>
          )}

          {/* Support Materials */}
          {supportMaterials.length > 0 && (
            <section className="mt-8" data-testid="section-support-materials">
              <SupportMaterialsList materials={supportMaterials} />
            </section>
          )}
        </main>

        {/* Sidebar (~30%) */}
        <aside className="lg:w-[30%]" data-testid="right-rail">
          <div className="sticky top-8 space-y-6">
            {staffContacts.length > 0 && (
              <div className="rounded-sm border border-gray-200 bg-white p-4" data-testid="staff-contact-card">
                <h3 className="text-sm font-bold uppercase tracking-wide text-text-muted">
                  Staff Contact
                </h3>
                {staffContacts.map((contact, index) => (
                  <div key={index} className="mt-3">
                    <p className="font-semibold text-text-primary">{contact.name}</p>
                    <p className="text-sm text-text-muted">{contact.title}</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-1 block text-sm text-primary hover:underline"
                    >
                      {contact.email}
                    </a>
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="mt-0.5 block text-sm text-text-muted"
                      >
                        {contact.phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
