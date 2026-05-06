/**
 * @description
 * Template 15: Contact / Form Page.
 * Full-width layout with H1, intro text, contact form with ReCaptcha,
 * and media inquiries block.
 *
 * Key features:
 * - Page title and intro text from CMS (pages collection)
 * - ContactForm with ReCaptcha v3 integration
 * - MediaInquiriesBlock with contact details from CMS
 * - Server action stores submissions in form-submissions collection
 *
 * @dependencies
 * - ContactFormWrapper: Form + ReCaptcha integration
 * - MediaInquiriesBlock: Contact card
 * - Container: Max-width wrapper
 * - submitContactForm: Server action
 * - payload-helpers: CMS data fetching
 *
 * @notes
 * - Full-width, no sidebar layout
 * - Form field labels are UI chrome (hardcoded)
 * - Page content (title, intro, media inquiries) comes from CMS
 */
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Container } from '@/components/ui/Container'
import { ContactFormWrapper } from '@/components/ContactFormWrapper'
import { MediaInquiriesBlock } from '@/components/MediaInquiriesBlock'
import { RichText } from '@/components/RichText'
import { submitContactForm } from '@/actions/contact'
import { getPageBySlug } from '@/lib/cms'

type PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function ContactUsPage({ params }: PageProps) {
  const { locale } = await params
  // Fetch page content + i18n strings in parallel. We pass `locale`
  // explicitly to getTranslations because the project does not call
  // setRequestLocale anywhere (see PR #143).
  const [page, tNav, tContact] = await Promise.all([
    getPageBySlug('contact-us'),
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'contact' }),
  ])

  // Extract media inquiries data from page (group fields, may not exist on Page type yet)
  const mediaInquiries = (page as unknown as Record<string, unknown>)?.mediaInquiries as {
    heading?: string
    contactName?: string
    contactTitle?: string
    contactEmail?: string
    contactPhone?: string
  } | undefined

  return (
    <Container as="section" variant="narrow" className="py-12 md:py-16">
      <div data-testid="page-contact-us" className="flex flex-col gap-10">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-text-primary md:text-4xl">
          {page?.title || tNav('contactUs')}
        </h1>

        {/* Intro Text — prefer CMS-authored richText, fall back to a default
            so the page never jumps from the H1 straight into form fields. */}
        {page?.hero?.richText ? (
          <div className="prose max-w-none text-text-secondary">
            <RichText content={page.hero.richText as unknown as Record<string, unknown>} />
          </div>
        ) : (
          <p className="text-base text-text-secondary md:text-lg">
            {tContact('introFallback')}
          </p>
        )}

        {/* Contact Form with ReCaptcha */}
        <ContactFormWrapper action={submitContactForm} />

        {/* Media Inquiries Block */}
        {mediaInquiries?.contactName && (
          <MediaInquiriesBlock
            heading={mediaInquiries.heading || tContact('mediaInquiriesHeading')}
            contactName={mediaInquiries.contactName}
            contactTitle={mediaInquiries.contactTitle || ''}
            contactEmail={mediaInquiries.contactEmail || ''}
            contactPhone={mediaInquiries.contactPhone || ''}
          />
        )}
      </div>
    </Container>
  )
}
