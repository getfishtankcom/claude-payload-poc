import { describe, expect, it } from 'vitest'

import {
  buildDocumentForCommentLink,
  buildEventLink,
  buildNewsLink,
  buildRssXml,
  escapeXml,
} from './feed-builder'

const BASE = 'https://frascanada.ca'

describe('RSS link generators', () => {
  it('news link is /<locale>/news/<slug>', () => {
    expect(buildNewsLink(BASE, 'en', 'crypto-explainer')).toBe(
      'https://frascanada.ca/en/news/crypto-explainer',
    )
    expect(buildNewsLink(BASE, 'fr', 'crypto-explainer')).toBe(
      'https://frascanada.ca/fr/news/crypto-explainer',
    )
  })

  it('event link points to the board listing (/<locale>/<board>/meetings-and-events) until detail route lands', () => {
    expect(buildEventLink(BASE, 'en', 'acsb')).toBe(
      'https://frascanada.ca/en/acsb/meetings-and-events',
    )
  })

  it('event link returns null when no board slug is available (caller should drop the item)', () => {
    expect(buildEventLink(BASE, 'en', null)).toBeNull()
  })

  it('document-for-comment link uses the scope (standard or board) slug', () => {
    expect(buildDocumentForCommentLink(BASE, 'en', 'aspe', 'ed-crypto-assets-dfc')).toBe(
      'https://frascanada.ca/en/aspe/documents/ed-crypto-assets-dfc',
    )
  })

  it('document-for-comment link returns null without a scope slug', () => {
    expect(buildDocumentForCommentLink(BASE, 'en', null, 'foo')).toBeNull()
  })
})

describe('escapeXml', () => {
  it('escapes the five XML special characters', () => {
    expect(escapeXml(`<a href="x">it's & "stuff"</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;it&apos;s &amp; &quot;stuff&quot;&lt;/a&gt;',
    )
  })
})

describe('buildRssXml', () => {
  it('renders items with all <link> URLs locale-prefixed', () => {
    const xml = buildRssXml({
      items: [
        {
          title: 'Hello',
          link: 'https://frascanada.ca/en/news/hello',
          description: 'desc',
          pubDate: 'Sun, 03 May 2026 00:00:00 GMT',
          category: 'News',
        },
      ],
      title: 'Feed',
      description: 'd',
      link: 'https://frascanada.ca/en',
      selfLink: 'https://frascanada.ca/api/rss',
      language: 'en-CA',
    })

    expect(xml).toContain('<link>https://frascanada.ca/en/news/hello</link>')
    expect(xml).toContain('<link>https://frascanada.ca/en</link>')
    expect(xml).toContain('<language>en-CA</language>')
    expect(xml).not.toContain('/news/hello</link>'.replace(/^\//, '<link>/'))
  })

  it('produces well-formed XML when there are no items', () => {
    const xml = buildRssXml({
      items: [],
      title: 'Empty',
      description: 'd',
      link: 'https://frascanada.ca/en',
      selfLink: 'https://frascanada.ca/api/rss',
      language: 'en-CA',
    })
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('</channel>')
  })
})
