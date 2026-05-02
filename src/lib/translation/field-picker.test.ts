import { describe, it, expect } from 'vitest'
import { isTranslatable, pickTranslatableFields, SYSTEM_FIELDS } from './field-picker'

describe('isTranslatable', () => {
  it('skips null and undefined', () => {
    expect(isTranslatable(null)).toBe(false)
    expect(isTranslatable(undefined)).toBe(false)
  })

  it('skips numbers (relationship IDs at depth:0)', () => {
    expect(isTranslatable(0)).toBe(false)
    expect(isTranslatable(42)).toBe(false)
    expect(isTranslatable(3.14)).toBe(false)
  })

  it('skips booleans (flag fields)', () => {
    expect(isTranslatable(true)).toBe(false)
    expect(isTranslatable(false)).toBe(false)
  })

  it('skips empty + whitespace-only strings', () => {
    expect(isTranslatable('')).toBe(false)
    expect(isTranslatable('   ')).toBe(false)
    expect(isTranslatable('\n\t')).toBe(false)
  })

  it('skips ISO date strings', () => {
    expect(isTranslatable('2026-05-01T19:30:00.000Z')).toBe(false)
    expect(isTranslatable('2024-12-31T00:00:00')).toBe(false)
  })

  it('skips URLs', () => {
    expect(isTranslatable('https://example.com')).toBe(false)
    expect(isTranslatable('http://localhost:3000/foo')).toBe(false)
  })

  it('keeps real text content', () => {
    expect(isTranslatable('Active Projects')).toBe(true)
    expect(isTranslatable('Single word')).toBe(true)
    expect(isTranslatable('Multi-line\ntext content')).toBe(true)
  })

  it('skips empty arrays', () => {
    expect(isTranslatable([])).toBe(false)
  })

  it('skips arrays of pure numbers (relationship arrays)', () => {
    expect(isTranslatable([1, 2, 3])).toBe(false)
    expect(isTranslatable([42])).toBe(false)
  })

  it('keeps arrays of strings or objects', () => {
    expect(isTranslatable(['hello', 'world'])).toBe(true)
    expect(isTranslatable([{ text: 'hi' }])).toBe(true)
  })

  it('keeps Lexical-shaped objects', () => {
    const lexical = {
      root: {
        type: 'root',
        children: [
          { type: 'paragraph', children: [{ type: 'text', text: 'Hello' }] },
        ],
      },
    }
    expect(isTranslatable(lexical)).toBe(true)
  })
})

describe('pickTranslatableFields', () => {
  it('strips system fields by default', () => {
    const doc = {
      id: 5,
      createdAt: '2026-05-01T19:00:00.000Z',
      updatedAt: '2026-05-01T19:00:00.000Z',
      _status: 'published',
      sortOrder: 3,
      workflowState: 'published',
      title: 'Real Content',
    }
    const out = pickTranslatableFields(doc)
    expect(out).toEqual({ title: 'Real Content' })
  })

  it('keeps richText (Lexical) blocks intact', () => {
    const doc = {
      title: 'Article',
      body: {
        root: {
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'Hi' }] },
          ],
        },
      },
    }
    const out = pickTranslatableFields(doc)
    expect(out.title).toBe('Article')
    expect(out.body).toEqual(doc.body)
  })

  it('always includes slug, even though related system-field names are skipped', () => {
    const doc = {
      id: 5,
      slug: 'my-news-article',
      title: 'My News Article',
    }
    const out = pickTranslatableFields(doc)
    expect(out.slug).toBe('my-news-article')
    expect(out.title).toBe('My News Article')
    expect(out).not.toHaveProperty('id')
  })

  it('skips empty slug', () => {
    const doc = { slug: '', title: 'X' }
    const out = pickTranslatableFields(doc)
    expect(out).not.toHaveProperty('slug')
    expect(out.title).toBe('X')
  })

  it('skips relationship-style numeric fields by default', () => {
    const doc = {
      title: 'Item',
      board: 5, // relationship ID at depth:0
      standard: 11,
      sortOrder: 2,
    }
    const out = pickTranslatableFields(doc)
    expect(out).toEqual({ title: 'Item' })
  })

  it('skips date fields by name (not just by value pattern)', () => {
    const doc = {
      title: 'Event',
      date: '2026-05-15T10:00:00.000Z',
      startDate: '2026-05-15T10:00:00.000Z',
      endDate: '2026-05-15T11:00:00.000Z',
      summary: 'A great event.',
    }
    const out = pickTranslatableFields(doc)
    expect(out).toEqual({ title: 'Event', summary: 'A great event.' })
  })

  it('handles a realistic News doc shape', () => {
    const newsDoc = {
      id: 42,
      slug: 'march-newsletter',
      title: 'March Newsletter',
      excerpt: 'Highlights from this month.',
      body: { root: { children: [] } },
      date: '2026-03-15T00:00:00.000Z',
      category: 'newsletter',
      isVolunteerOpportunity: false,
      board: 1,
      featured_image: 7,
      workflowState: 'published',
      translationStatus: 'untranslated',
      createdBy: 1,
      createdAt: '2026-03-01T00:00:00.000Z',
      updatedAt: '2026-03-15T00:00:00.000Z',
    }
    const out = pickTranslatableFields(newsDoc)
    expect(Object.keys(out).sort()).toEqual(['body', 'excerpt', 'slug', 'title'])
  })

  it('translationStatus itself is a system field (must not be translated)', () => {
    expect(SYSTEM_FIELDS.has('translationStatus')).toBe(true)
    const doc = { title: 'X', translationStatus: 'pending_review' }
    const out = pickTranslatableFields(doc)
    expect(out).not.toHaveProperty('translationStatus')
  })
})
