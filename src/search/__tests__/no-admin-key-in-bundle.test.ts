/**
 * @description
 * Build-time guard: the Algolia admin API key (`ALGOLIA_ADMIN_API_KEY`)
 * MUST stay server-side. Any code path that lands in a client bundle
 * must NOT reference it. This test scans every file under
 * `src/search/algolia/` and the public-frontend search call site for:
 *
 * - the literal env-var name `ALGOLIA_ADMIN_API_KEY` in a client/runtime context
 * - the variable `algoliaAdminClient` getting exported from a module
 *   marked `'use client'`
 *
 * If either appears in a `'use client'` file, the test fails — that's
 * the regression we're guarding (#175 / Slice 4).
 *
 * @notes
 * - This is a static-analysis test, not a runtime test. It catches the
 *   class of mistake where someone wires the admin client into a React
 *   component "just to fetch one thing". The Next.js bundler would
 *   then ship the env var into the browser bundle.
 * - We intentionally do NOT scan node_modules — only project source.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOTS = [
  resolve(process.cwd(), 'src/search/algolia'),
  resolve(process.cwd(), 'src/app/(frontend)'),
  resolve(process.cwd(), 'src/components'),
  resolve(process.cwd(), 'src/heros'),
  resolve(process.cwd(), 'src/blocks'),
]

function walk(dir: string): string[] {
  const out: string[] = []
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return []
  }
  for (const entry of entries) {
    const full = resolve(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      out.push(...walk(full))
    } else if (/\.(ts|tsx)$/.test(full)) {
      out.push(full)
    }
  }
  return out
}

describe('Algolia admin key — never in client bundles (#175)', () => {
  it("no 'use client' file references ALGOLIA_ADMIN_API_KEY or getAlgoliaAdminClient", () => {
    const offenders: string[] = []
    for (const root of ROOTS) {
      for (const file of walk(root)) {
        // Skip the test files themselves
        if (file.includes('/__tests__/') || file.endsWith('.test.ts') || file.endsWith('.test.tsx')) continue
        const source = readFileSync(file, 'utf8')
        const isClientFile = /^['"]use client['"]/.test(source.trimStart())
        if (!isClientFile) continue
        if (
          source.includes('ALGOLIA_ADMIN_API_KEY') ||
          source.includes('getAlgoliaAdminClient')
        ) {
          offenders.push(file.replace(process.cwd() + '/', ''))
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it('the algoliaProvider module file is NOT marked `use client`', () => {
    const path = resolve(process.cwd(), 'src/search/algolia/provider.ts')
    const source = readFileSync(path, 'utf8')
    expect(source.trimStart().startsWith("'use client'")).toBe(false)
    expect(source.trimStart().startsWith('"use client"')).toBe(false)
  })
})
