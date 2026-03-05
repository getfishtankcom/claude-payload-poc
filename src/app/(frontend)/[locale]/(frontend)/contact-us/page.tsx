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

import { Container } from '@/components/ui/Container'
import { ContactFormWrapper } from '@/components/ContactFormWrapper'
import { MediaInquiriesBlock } from '@/components/MediaInquiriesBlock'
import { RichText } from '@/components/RichText'
import { submitContactForm } from '@/actions/contact'
import { getPageBySlug } from '@/lib/payload-helpers'

export const metadata: Metadata = {
  title: 'Contact Us — FRAS Canada',
  description: 'Get in touch with FRAS Canada. Send us your questions, comments, or media inquiries.',
}

export default async function ContactUsPage() {
  // Fetch page content from CMS
  const page = await getPageBySlug('contact-us')

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
          {page?.title || 'Contact Us'}
        </h1>

        {/* Intro Text */}
        {page?.hero?.richText && (
          <div className="prose max-w-none text-text-secondary">
            <RichText content={page.hero.richText as unknown as Record<string, unknown>} />
          </div>
        )}

        {/* Contact Form with ReCaptcha */}
        <ContactFormWrapper action={submitContactForm} />

        {/* Media Inquiries Block */}
        {mediaInquiries?.contactName && (
          <MediaInquiriesBlock
            heading={mediaInquiries.heading || 'Media Inquiries'}
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
