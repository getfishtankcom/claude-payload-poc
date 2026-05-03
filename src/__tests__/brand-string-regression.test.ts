/**
 * @description
 * Pins the legacy "Financial Reporting & Assurance Standards" brand
 * string out of every metadata code path. The org rebranded to
 * "Reporting and Assurance Standards (RAS) Canada" months ago and
 * #149 / PR #199 swept the surfaces — this test catches a regression
 * if anyone re-introduces the legacy copy via:
 *
 * - Source files that contribute to <title> / <meta> output
 * - Schema.org structured data (alternateName, name, description)
 * - mergeOpenGraph defaults
 * - generateMeta fallback titles
 *
 * The two existing source matches are intentional anti-regression code
 * comments that flag the old copy — those are recognised by being inside
 * a `//` line comment.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const LEGACY_STRING = 'Financial Reporting & Assurance Standards'

const PINNED_FILES = [
  'src/app/(frontend)/[locale]/(frontend)/layout.tsx',
  'src/app/(frontend)/[locale]/(frontend)/page.tsx',
  'src/utilities/mergeOpenGraph.ts',
  'src/utilities/generateMeta.ts',
  'src/components/StructuredData.tsx',
] as const

describe('brand-string regression — legacy "Financial Reporting & Assurance Standards" cannot reappear', () => {
  it.each(PINNED_FILES)('%s does not contain the legacy string outside of code comments', (file) => {
    const path = resolve(process.cwd(), file)
    const source = readFileSync(path, 'utf8')
    const occurrences = source.split(LEGACY_STRING).length - 1
    if (occurrences === 0) {
      expect(occurrences).toBe(0)
      return
    }
    // Walk every line; allow occurrences only inside `//` line comments
    // (the anti-regression flag) — anything else is a regression.
    const offending: string[] = []
    for (const line of source.split('\n')) {
      if (!line.includes(LEGACY_STRING)) continue
      const trimmed = line.trim()
      const commentStart = line.indexOf('//')
      const stringIdx = line.indexOf(LEGACY_STRING)
      const inLineComment = commentStart !== -1 && commentStart < stringIdx
      const inBlockComment = trimmed.startsWith('*') || trimmed.startsWith('/*')
      if (!inLineComment && !inBlockComment) offending.push(line.trim())
    }
    expect(offending).toEqual([])
  })

  it('messages dictionaries (en + fr) do not contain the legacy string', async () => {
    const en = await import('../../messages/en.json')
    const fr = await import('../../messages/fr.json')
    const enJson = JSON.stringify(en.default)
    const frJson = JSON.stringify(fr.default)
    expect(enJson).not.toContain(LEGACY_STRING)
    expect(frJson).not.toContain(LEGACY_STRING)
  })
})
