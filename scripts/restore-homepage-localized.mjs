/**
 * One-shot: re-populate the homepage global's localized copy.
 *
 * Why: the audit of #99 found that the live DB has the homepage `layout`
 * blocks with the right structure (4 BrowseByStandard categories, with the
 * right link counts) but every localized leaf (`heading`, `category.name`,
 * `link.label`) is `undefined`. The frontend now guards against empty `<h3>`
 * nodes (good a11y), but the homepage still renders empty cards. This
 * script writes the canonical EN + FR copy back, leaving the (non-localized)
 * structure + the other blocks in `layout` untouched.
 *
 * It's a `payload.updateGlobal` call per locale, scoped to the layout
 * blocks. Safe to re-run.
 *
 * Usage: `npx tsx scripts/restore-homepage-localized.mjs`
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const EN_LAYOUT = [
  {
    blockType: 'cta',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'New to RAS Canada?' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Learn about our boards, standards, and how we serve the Canadian financial reporting ecosystem.',
              },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    },
    links: [
      {
        link: {
          type: 'custom',
          url: '/about',
          label: 'About RAS Canada',
          newTab: false,
          appearance: 'default',
        },
      },
    ],
    variant: 'light',
  },
  {
    blockType: 'newsGrid',
    heading: 'Latest News & Updates',
    news_count: 3,
    show_view_all: true,
    populateBy: 'collection',
  },
  {
    blockType: 'browseByStandard',
    heading: 'Browse by Standard',
    categories: [
      {
        name: 'Sustainability',
        links: [
          { label: 'Canadian Sustainability Disclosure Standards', url: '/standards/csds' },
        ],
      },
      {
        name: 'Accounting',
        links: [
          { label: 'IFRS Accounting Standards', url: '/standards/ifrs' },
          { label: 'ASPE', url: '/standards/aspe' },
          { label: 'Not-for-Profit Organizations', url: '/standards/nfpo' },
          { label: 'Pension Plans', url: '/standards/pension-plans' },
        ],
      },
      {
        name: 'Public Sector',
        links: [
          { label: 'Public Sector Accounting Standards', url: '/standards/psas' },
          { label: 'Public Sector Guidelines', url: '/standards/ps-guidelines' },
        ],
      },
      {
        name: 'Assurance',
        links: [
          { label: 'Canadian Auditing Standards', url: '/standards/cas' },
          { label: 'Quality Management', url: '/standards/csqm' },
        ],
      },
    ],
  },
]

const FR_LAYOUT = [
  {
    blockType: 'cta',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h2',
            children: [{ type: 'text', text: 'Nouveau sur RAS Canada?' }],
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: 'Apprenez-en davantage sur nos conseils, nos normes et la manière dont nous servons l’écosystème canadien d’information financière.',
              },
            ],
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        version: 1,
      },
    },
    links: [
      {
        link: {
          type: 'custom',
          url: '/about',
          label: 'À propos de RAS Canada',
          newTab: false,
          appearance: 'default',
        },
      },
    ],
    variant: 'light',
  },
  {
    blockType: 'newsGrid',
    heading: 'Dernières nouvelles et mises à jour',
    news_count: 3,
    show_view_all: true,
    populateBy: 'collection',
  },
  {
    blockType: 'browseByStandard',
    heading: 'Parcourir par norme',
    categories: [
      {
        name: 'Durabilité',
        links: [
          { label: 'Normes canadiennes d’information sur la durabilité', url: '/standards/csds' },
        ],
      },
      {
        name: 'Comptabilité',
        links: [
          { label: 'Normes comptables internationales (IFRS)', url: '/standards/ifrs' },
          { label: 'NCECF', url: '/standards/aspe' },
          { label: 'Organismes sans but lucratif', url: '/standards/nfpo' },
          { label: 'Régimes de retraite', url: '/standards/pension-plans' },
        ],
      },
      {
        name: 'Secteur public',
        links: [
          { label: 'Normes comptables pour le secteur public', url: '/standards/psas' },
          { label: 'Directives du secteur public', url: '/standards/ps-guidelines' },
        ],
      },
      {
        name: 'Certification',
        links: [
          { label: 'Normes canadiennes d’audit', url: '/standards/cas' },
          { label: 'Gestion de la qualité', url: '/standards/csqm' },
        ],
      },
    ],
  },
]

const payload = await getPayload({ config })

// Hero copy for both locales — needed alongside the layout update because
// Payload re-validates the whole document on update and the hero links
// have required url/label fields.
const EN_HERO = {
  type: 'highImpact',
  richText: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          tag: 'h1',
          children: [
            { type: 'text', text: 'Setting the Standards for Financial Reporting in Canada' },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'RAS Canada serves the public interest by establishing high-quality accounting, auditing, and sustainability standards.',
            },
          ],
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  },
  links: [
    {
      link: {
        type: 'custom',
        url: '/active-projects',
        label: 'View Active Projects',
        newTab: false,
        appearance: 'default',
      },
    },
    {
      link: {
        type: 'custom',
        url: '/open-consultations',
        label: 'Open Consultations',
        newTab: false,
        appearance: 'outline',
      },
    },
  ],
  search_enabled: true,
}

const FR_HERO = {
  type: 'highImpact',
  richText: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          tag: 'h1',
          children: [
            { type: 'text', text: 'Établir les normes d’information financière au Canada' },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'RAS Canada sert l’intérêt public en établissant des normes de qualité élevée en comptabilité, en certification et en durabilité.',
            },
          ],
        },
      ],
      direction: null,
      format: '',
      indent: 0,
      version: 1,
    },
  },
  links: [
    {
      link: {
        type: 'custom',
        url: '/active-projects',
        label: 'Voir les projets actifs',
        newTab: false,
        appearance: 'default',
      },
    },
    {
      link: {
        type: 'custom',
        url: '/open-consultations',
        label: 'Consultations ouvertes',
        newTab: false,
        appearance: 'outline',
      },
    },
  ],
  search_enabled: true,
}

// IMPORTANT: write FR FIRST, then EN with the IDs from the FR write.
// Updating a global's blocks array regenerates row IDs unless explicit
// IDs are provided — that orphans the other-locale rows in the
// `_locales` table. We mirror the FR-assigned IDs into the EN payload
// so each block + category + link maps to the same row across locales.
console.log('Updating homepage (FR)...')
const frResult = await payload.updateGlobal({
  slug: 'homepage',
  locale: 'fr',
  data: { hero: FR_HERO, layout: FR_LAYOUT },
  overrideAccess: true,
})

// Walk the FR layout result and copy IDs into the EN layout. Order is
// preserved by the schema, so positional mapping is safe.
function withIds(targetLayout, sourceLayout) {
  return targetLayout.map((block, i) => {
    const src = sourceLayout?.[i]
    if (!src) return block
    const out = { ...block, id: src.id }
    if (block.categories && src.categories) {
      out.categories = block.categories.map((cat, j) => {
        const sc = src.categories?.[j]
        if (!sc) return cat
        const outCat = { ...cat, id: sc.id }
        if (cat.links && sc.links) {
          outCat.links = cat.links.map((link, k) => {
            const sl = sc.links?.[k]
            return sl ? { ...link, id: sl.id } : link
          })
        }
        return outCat
      })
    }
    if (block.links && src.links) {
      out.links = block.links.map((link, j) => {
        const sl = src.links?.[j]
        return sl ? { ...link, id: sl.id } : link
      })
    }
    return out
  })
}

const EN_LAYOUT_WITH_IDS = withIds(EN_LAYOUT, frResult.layout || [])
const EN_HERO_WITH_IDS = {
  ...EN_HERO,
  links: EN_HERO.links.map((linkWrap, i) => {
    const srcLink = frResult.hero?.links?.[i]
    return srcLink?.id ? { ...linkWrap, id: srcLink.id } : linkWrap
  }),
}

console.log('Updating homepage (EN with mirrored IDs)...')
await payload.updateGlobal({
  slug: 'homepage',
  locale: 'en',
  data: { hero: EN_HERO_WITH_IDS, layout: EN_LAYOUT_WITH_IDS },
  overrideAccess: true,
})

console.log('Verifying...')
const en = await payload.findGlobal({ slug: 'homepage', locale: 'en', fallbackLocale: false })
const browse = en.layout.find((b) => b.blockType === 'browseByStandard')
console.log(`  EN heading: ${JSON.stringify(browse?.heading)}`)
console.log(`  EN first category: ${JSON.stringify(browse?.categories?.[0]?.name)}`)
console.log(`  EN first link: ${JSON.stringify(browse?.categories?.[0]?.links?.[0]?.label)}`)
const enAll = await payload.findGlobal({ slug: 'homepage', locale: 'all' })
const browseAll = enAll.layout.find((b) => b.blockType === 'browseByStandard')
console.log(`  ALL heading: ${JSON.stringify(browseAll?.heading)}`)
console.log(`  ALL first category: ${JSON.stringify(browseAll?.categories?.[0]?.name)}`)

const fr = await payload.findGlobal({ slug: 'homepage', locale: 'fr' })
const browseFr = fr.layout.find((b) => b.blockType === 'browseByStandard')
console.log(`  FR heading: ${JSON.stringify(browseFr?.heading)}`)
console.log(`  FR first category: ${JSON.stringify(browseFr?.categories?.[0]?.name)}`)
console.log(`  FR first link: ${JSON.stringify(browseFr?.categories?.[0]?.links?.[0]?.label)}`)

console.log('Done.')
process.exit(0)
