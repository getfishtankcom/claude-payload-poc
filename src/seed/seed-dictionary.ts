/**
 * Dictionary seed — 24 accounting / auditing / sustainability terms.
 *
 * Run via the main seed script. Idempotent: skips terms whose `term`
 * already exists (matched by exact string).
 */
import type { Payload } from 'payload'

interface SeedTerm {
  term: string
  termFr?: string
  category: 'accounting' | 'auditing' | 'sustainability' | 'general'
  definitionText: string
  definitionTextFr?: string
}

const TERMS: SeedTerm[] = [
  {
    term: 'IFRS',
    termFr: 'IFRS',
    category: 'accounting',
    definitionText: 'International Financial Reporting Standards — global standards for the preparation of public-company financial statements, issued by the IASB.',
  },
  {
    term: 'GAAP',
    category: 'accounting',
    definitionText: 'Generally Accepted Accounting Principles — the rule set used to compile financial statements in a given jurisdiction.',
  },
  {
    term: 'ASPE',
    category: 'accounting',
    definitionText: 'Accounting Standards for Private Enterprises — the Canadian standards used by private companies that are not required to follow IFRS.',
  },
  {
    term: 'PSAS',
    category: 'accounting',
    definitionText: 'Public Sector Accounting Standards — issued by the PSAB for governments and public-sector entities in Canada.',
  },
  {
    term: 'Exposure Draft',
    termFr: "Exposé-sondage",
    category: 'general',
    definitionText: 'A proposed standard published for public comment before being finalized. Constituents are invited to submit responses during the comment period.',
  },
  {
    term: 'Re-exposure',
    category: 'general',
    definitionText: 'A second round of public comment when significant changes are made to a proposed standard after the initial Exposure Draft.',
  },
  {
    term: 'Decision Summary',
    category: 'general',
    definitionText: 'A meeting summary published shortly after a board / committee meeting documenting the decisions reached and the rationale behind them.',
  },
  {
    term: 'Discussion Paper',
    category: 'general',
    definitionText: 'An early-stage publication presenting alternatives and inviting input on a topic the board is considering — pre-Exposure Draft.',
  },
  {
    term: 'Implementation Guidance',
    category: 'general',
    definitionText: 'Non-authoritative material that helps preparers and auditors apply a standard in practice.',
  },
  {
    term: 'Materiality',
    category: 'auditing',
    definitionText: 'The threshold above which omissions or misstatements could influence the decisions of users of financial statements.',
  },
  {
    term: 'Going Concern',
    category: 'auditing',
    definitionText: "An assumption that an entity will continue to operate for the foreseeable future. Auditors must evaluate the appropriateness of management's use of this basis.",
  },
  {
    term: 'Audit Risk',
    category: 'auditing',
    definitionText: 'The risk that the auditor expresses an inappropriate opinion when financial statements are materially misstated. The product of inherent risk, control risk, and detection risk.',
  },
  {
    term: 'CAS',
    category: 'auditing',
    definitionText: 'Canadian Auditing Standards — converged with International Standards on Auditing (ISAs).',
  },
  {
    term: 'Sustainability Reporting',
    category: 'sustainability',
    definitionText: 'Disclosure of an entity’s impact on the economy, the environment, and society alongside traditional financial reporting.',
  },
  {
    term: 'CSDS 1',
    category: 'sustainability',
    definitionText: 'Canadian Sustainability Disclosure Standard 1 — General Requirements for Disclosure of Sustainability-related Financial Information.',
  },
  {
    term: 'CSDS 2',
    category: 'sustainability',
    definitionText: 'Canadian Sustainability Disclosure Standard 2 — Climate-related Disclosures.',
  },
  {
    term: 'Scope 1, 2, 3 Emissions',
    category: 'sustainability',
    definitionText: 'Scope 1: direct emissions from owned sources. Scope 2: indirect emissions from purchased energy. Scope 3: all other indirect emissions across the value chain.',
  },
  {
    term: 'Climate-related Risk',
    category: 'sustainability',
    definitionText: 'Risks an entity faces from physical or transition impacts of climate change. Often disclosed alongside opportunities under TCFD-style frameworks.',
  },
  {
    term: 'AcSB',
    category: 'general',
    definitionText: 'Accounting Standards Board — sets accounting standards for private enterprises, not-for-profit organizations, and pension plans in Canada.',
  },
  {
    term: 'AASB',
    category: 'general',
    definitionText: 'Auditing and Assurance Standards Board — develops auditing and assurance standards for use in Canada.',
  },
  {
    term: 'PSAB',
    category: 'general',
    definitionText: 'Public Sector Accounting Board — sets accounting standards for governments and public-sector entities in Canada.',
  },
  {
    term: 'CSSB',
    category: 'sustainability',
    definitionText: 'Canadian Sustainability Standards Board — develops sustainability disclosure standards aligned with the ISSB for use in Canada.',
  },
  {
    term: 'RASOC',
    category: 'general',
    definitionText: 'Reporting and Assurance Standards Oversight Council — provides public oversight over the standard-setting boards.',
  },
  {
    term: 'Effective Date',
    category: 'general',
    definitionText: 'The date a new or amended standard becomes mandatory for application.',
  },
]

function richText(text: string) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal' as const,
              style: '',
              text,
              type: 'text',
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

export async function seedDictionary(payload: Payload) {
  const existing = await payload.find({
    collection: 'dictionary',
    limit: 1000,
    depth: 0,
  })
  const existingTerms = new Set(
    existing.docs.map((d) => (d as { term?: string }).term?.toLowerCase()),
  )

  let created = 0
  for (const t of TERMS) {
    if (existingTerms.has(t.term.toLowerCase())) continue
    await payload.create({
      collection: 'dictionary',
      data: {
        term: t.term,
        termFr: t.termFr ?? null,
        category: t.category,
        status: 'published',
        definition: richText(t.definitionText),
        definitionFr: t.definitionTextFr ? richText(t.definitionTextFr) : null,
      },
    })
    created++
  }

  return { created, total: TERMS.length }
}
