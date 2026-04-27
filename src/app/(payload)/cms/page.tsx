/**
 * /cms — branded admin quick-start landing page.
 *
 * Public, no auth. Surfaces the most-used admin entry points and a
 * status summary so editors can find their way around without
 * memorising URLs.
 */
import React from 'react'
import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import payloadConfig from '@payload-config'
import packageJson from '../../../../package.json'
import { BRAND } from '../../../config/brand'

export const dynamic = 'force-dynamic'

const QUICK_LINKS: Array<{ label: string; href: string; description: string }> = [
  { label: 'Admin Panel', href: '/admin', description: 'Full CMS — collections, globals, settings.' },
  { label: 'Content Tree', href: '/admin/tree', description: 'Hierarchical content browser.' },
  { label: 'Workbox', href: '/admin/workbox', description: 'Workflow queue across all collections.' },
  { label: 'Page Builder', href: '/admin/collections/pages', description: 'Build pages with the visual editor.' },
  { label: 'Media Library', href: '/admin/media', description: 'Upload, browse, and organise media.' },
  { label: 'Schedule', href: '/admin/schedule', description: 'See what is scheduled to publish.' },
  { label: 'Language Audit', href: '/admin/language-audit', description: 'Translation completeness report.' },
  { label: 'Redirects', href: '/admin/collections/redirects', description: 'Manage 301 / 302 redirects.' },
]

export default async function CmsLandingPage() {
  // Auth gate — only signed-in CMS users see the quick-start. Anonymous
  // visitors are bounced to the Payload admin login.
  const payload = await getPayload({ config: payloadConfig })
  const reqHeaders = await nextHeaders()
  const { user } = await payload.auth({ headers: reqHeaders })
  if (!user) {
    redirect('/admin/login?redirect=/cms')
  }

  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME ?? 'dev'
  const versions = {
    next: (packageJson.dependencies as Record<string, string>).next ?? 'unknown',
    payload: (packageJson.dependencies as Record<string, string>).payload ?? 'unknown',
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#fafafa',
        padding: '40px 24px',
        color: '#111',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <header
          style={{
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: 700,
                color: '#601F5B',
              }}
            >
              {BRAND.name}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '15px', color: '#525252' }}>
              Content Management
            </p>
          </div>
          <div style={{ fontSize: '13px', color: '#525252', textAlign: 'right' }}>
            <div>
              Signed in as <strong>{(user as { email?: string })?.email}</strong>
            </div>
            <div>
              <a href="/admin/logout" style={{ color: '#601F5B' }}>
                Sign out
              </a>
            </div>
          </div>
        </header>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#525252', margin: '0 0 12px' }}>
            Quick links
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
            }}
          >
            {QUICK_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  display: 'block',
                  padding: '16px',
                  background: 'white',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: '#111',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '15px' }}>{link.label}</div>
                <div style={{ fontSize: '12px', color: '#737373', marginTop: '4px' }}>
                  {link.description}
                </div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#525252', margin: '0 0 12px' }}>
            Status
          </h2>
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '13px',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              rowGap: '6px',
              columnGap: '12px',
            }}
          >
            <span style={{ color: '#737373' }}>Next.js</span>
            <span style={{ fontFamily: 'monospace' }}>{versions.next}</span>
            <span style={{ color: '#737373' }}>Payload</span>
            <span style={{ fontFamily: 'monospace' }}>{versions.payload}</span>
            <span style={{ color: '#737373' }}>Build time</span>
            <span style={{ fontFamily: 'monospace' }}>{buildTime}</span>
            <span style={{ color: '#737373' }}>Brand</span>
            <span style={{ fontFamily: 'monospace' }}>{BRAND.fullName}</span>
          </div>
        </section>
      </div>
    </main>
  )
}
