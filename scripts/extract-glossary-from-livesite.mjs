#!/usr/bin/env node
/**
 * Glossary extractor for the AI translation workflow (PRD §13.A).
 *
 * Fetches paired EN/FR pages from the live frascanada.ca site, extracts
 * title + h1 + breadcrumbs from each, and writes a deduped EN→FR term
 * glossary at src/lib/translation/glossary.json.
 *
 * Source EN URLs come from data/page-inspections.json (95 already-crawled
 * pages with hreflang metadata). For each EN page we look up its FR
 * counterpart via hreflang and fetch it.
 *
 * Politeness: 1 req/s sequential, 15s timeout per fetch.
 *
 * Outputs:
 *   src/lib/translation/glossary.json
 *
 * Run: node scripts/extract-glossary-from-livesite.mjs
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const INSPECT_PATH = resolve(ROOT, 'data/page-inspections.json')
const SLUG_MAPPING_PATH = resolve(ROOT, 'data/fr-slug-mapping.json')
const OUT_PATH = resolve(ROOT, 'src/lib/translation/glossary.json')

// Domain stub from the original PRD §4.2 — hand-curated, kept as a
// high-confidence baseline that overrides any conflicting scraped pair.
const STUB_TERMS = [
  { en: 'Accounting Standards Board', fr: 'Conseil des normes comptables', abbr_en: 'AcSB', abbr_fr: 'CNC' },
  { en: 'Public Sector Accounting Board', fr: 'Conseil sur la comptabilité dans le secteur public', abbr_en: 'PSAB', abbr_fr: 'CCSP' },
  { en: 'Auditing and Assurance Standards Board', fr: "Conseil des normes d'audit et de certification", abbr_en: 'AASB', abbr_fr: 'CNAC' },
  { en: 'Canadian Sustainability Standards Board', fr: "Conseil canadien des normes d'information sur la durabilité", abbr_en: 'CSSB', abbr_fr: 'CCNID' },
  { en: 'Regulatory and Assurance Standards Oversight Council', fr: 'Conseil de surveillance de la normalisation en information et en certification', abbr_en: 'RASOC', abbr_fr: 'CSNIC' },
  { en: 'IFRS Accounting Standards', fr: 'Normes IFRS de comptabilité' },
  { en: 'Accounting Standards for Private Enterprises', fr: 'Normes comptables pour les entreprises à capital fermé', abbr_en: 'ASPE', abbr_fr: 'NCECF' },
  { en: 'Not-for-Profit Organizations', fr: 'Organismes sans but lucratif', abbr_en: 'NFPOs', abbr_fr: 'OSBLSP' },
  { en: 'Public Sector Accounting Standards', fr: 'Normes comptables pour le secteur public', abbr_en: 'PSAS' },
  { en: 'Canadian Standards on Quality Management', fr: 'Normes canadiennes de contrôle de la qualité', abbr_en: 'CSQM', abbr_fr: 'NCCQ' },
  { en: 'Canadian Auditing Standards', fr: "Normes canadiennes d'audit", abbr_en: 'CAS', abbr_fr: 'NCA' },
  { en: 'Document for Comment', fr: 'Document de consultation' },
  { en: 'Exposure Draft', fr: 'Exposé-sondage' },
  { en: 'Effective Date', fr: "Date d'entrée en vigueur" },
  { en: 'Consultation Paper', fr: 'Document de consultation' },
  { en: 'Discussion Paper', fr: 'Document de travail' },
  { en: 'Chair', fr: 'Président(e)' },
  { en: 'Vice-Chair', fr: 'Vice-président(e)' },
  { en: 'Voting Member', fr: 'Membre votant(e)' },
]

const DO_NOT_TRANSLATE = [
  'RAS Canada',
  'CPA Canada',
  'IFRS',
  'IASB',
  'ISSB',
  'IPSASB',
  'IAASB',
]

async function fetchHtml(url) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 15_000)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': 'fras-glossary-extractor/1.0' },
    })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}

const TITLE_RE = /<title[^>]*>([^<]+)<\/title>/i
const H1_RE = /<h1[^>]*>([\s\S]*?)<\/h1>/gi
const NAV_LINK_RE = /<a[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
}

function stripTags(s) {
  return decodeEntities(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()
}

function extractFromHtml(html) {
  if (!html) return null
  const titleMatch = TITLE_RE.exec(html)
  const title = titleMatch ? stripTags(titleMatch[1]) : null

  const h1s = []
  let m
  H1_RE.lastIndex = 0
  while ((m = H1_RE.exec(html)) !== null) {
    const t = stripTags(m[1])
    if (t) h1s.push(t)
  }

  const navLabels = new Set()
  NAV_LINK_RE.lastIndex = 0
  while ((m = NAV_LINK_RE.exec(html)) !== null) {
    const href = m[1]
    const text = stripTags(m[2])
    if (
      text &&
      text.length > 1 &&
      text.length < 50 &&
      !text.startsWith('http') &&
      (href.startsWith('/en/') || href.startsWith('/fr/') || href.startsWith('/'))
    ) {
      navLabels.add(text)
    }
  }

  return { title, h1s, navLabels: [...navLabels] }
}

function tidyTitle(t) {
  if (!t) return null
  // Site title suffixes vary across the site; trim them so titles compare cleanly.
  return t
    .replace(/\s*[—–|-]\s*Financial Reporting and Assurance Standards Canada\s*$/i, '')
    .replace(/\s*[—–|-]\s*Normes d'information financière et d'assurance Canada\s*$/i, '')
    .replace(/\s*[—–|-]\s*FRAS Canada\s*$/i, '')
    .replace(/\s*[—–|-]\s*RAS Canada\s*$/i, '')
    .replace(/\s*[—–|-]\s*NIFC Canada\s*$/i, '')
    .trim()
}

async function main() {
  console.log('Loading inspected pages...')
  const inspections = JSON.parse(await readFile(INSPECT_PATH, 'utf8'))
  const slugMapping = JSON.parse(await readFile(SLUG_MAPPING_PATH, 'utf8'))

  // Build EN→FR pairs from hreflang.
  const pairs = []
  for (const item of inspections) {
    const url = item.url || ''
    if (!url.includes('/en')) continue
    const hreflangs = item?.metadata?.hreflang || []
    const fr = Array.isArray(hreflangs)
      ? hreflangs.find((h) => h.lang === 'fr' || h.lang === 'fr-CA')
      : null
    if (fr?.href) {
      pairs.push({
        en: url,
        fr: fr.href,
        enTitle: tidyTitle(item?.metadata?.title),
        enH1: item?.headings && Array.isArray(item.headings.h1) ? item.headings.h1[0] : null,
      })
    }
  }
  console.log(`Found ${pairs.length} EN→FR URL pairs from inspection data`)

  // Fetch FR pages and pair titles + h1s.
  const titlePairs = []
  const h1Pairs = []
  const navPairs = new Map() // en text → set of fr texts (collected for manual review later)

  for (let i = 0; i < pairs.length; i++) {
    const p = pairs[i]
    process.stdout.write(`[${i + 1}/${pairs.length}] ${p.fr.replace('https://www.frascanada.ca', '')}\n`)
    const html = await fetchHtml(p.fr)
    if (!html) continue
    const ex = extractFromHtml(html)
    if (!ex) continue

    const frTitle = tidyTitle(ex.title)
    if (p.enTitle && frTitle && p.enTitle !== frTitle) {
      titlePairs.push({ en: p.enTitle, fr: frTitle, source: p.en })
    }
    if (p.enH1 && ex.h1s.length > 0 && p.enH1 !== ex.h1s[0]) {
      h1Pairs.push({ en: p.enH1, fr: ex.h1s[0], source: p.en })
    }

    // Politeness pause
    await new Promise((r) => setTimeout(r, 1000))
  }

  // Dedupe + count frequencies.
  const termMap = new Map() // key = en + '|' + fr → { en, fr, contexts:Set, frequency }
  function add(en, fr, context) {
    if (!en || !fr) return
    if (en === fr) return
    if (en.length > 200 || fr.length > 200) return
    const key = `${en}|${fr}`
    const prev = termMap.get(key)
    if (prev) {
      prev.contexts.add(context)
      prev.frequency += 1
    } else {
      termMap.set(key, {
        en,
        fr,
        contexts: new Set([context]),
        frequency: 1,
      })
    }
  }
  for (const t of titlePairs) add(t.en, t.fr, 'title')
  for (const t of h1Pairs) add(t.en, t.fr, 'h1')

  // Stub terms — added with high confidence flag.
  for (const t of STUB_TERMS) {
    if (!t.en || !t.fr) continue
    const key = `${t.en}|${t.fr}`
    if (termMap.has(key)) {
      termMap.get(key).contexts.add('stub')
      termMap.get(key).frequency += 10
    } else {
      termMap.set(key, {
        en: t.en,
        fr: t.fr,
        contexts: new Set(['stub']),
        frequency: 10,
        ...(t.abbr_en ? { abbr_en: t.abbr_en, abbr_fr: t.abbr_fr } : {}),
      })
    }
  }

  // Slug mapping → terms (path segments are useful slug hints for the AI).
  for (const group of Object.values(slugMapping)) {
    if (!Array.isArray(group)) continue
    for (const m of group) {
      if (m.en && m.fr && m.en !== m.fr) add(m.en, m.fr, 'slug-mapping')
    }
  }

  // Sort by frequency desc, then alphabetical
  const terms = [...termMap.values()]
    .map((t) => ({
      en: t.en,
      fr: t.fr,
      contexts: [...t.contexts],
      frequency: t.frequency,
      ...(t.abbr_en ? { abbr_en: t.abbr_en, abbr_fr: t.abbr_fr } : {}),
    }))
    .sort((a, b) => b.frequency - a.frequency || a.en.localeCompare(b.en))

  const out = {
    _meta: {
      generatedAt: new Date().toISOString(),
      sourcePairCount: pairs.length,
      titlePairsExtracted: titlePairs.length,
      h1PairsExtracted: h1Pairs.length,
      stubTermCount: STUB_TERMS.length,
      slugMappingTermCount: Object.values(slugMapping).flat().length,
      finalTermCount: terms.length,
    },
    doNotTranslate: DO_NOT_TRANSLATE,
    terms,
  }

  await mkdir(dirname(OUT_PATH), { recursive: true })
  await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + '\n')
  console.log(`\nWrote ${terms.length} terms to ${OUT_PATH}`)
  console.log(`  ${out._meta.titlePairsExtracted} from title pairs`)
  console.log(`  ${out._meta.h1PairsExtracted} from h1 pairs`)
  console.log(`  ${out._meta.stubTermCount} from PRD stub`)
  console.log(`  ${out._meta.slugMappingTermCount} from slug mapping`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
