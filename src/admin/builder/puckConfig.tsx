/**
 * @description
 * Puck configuration for the FRAS page builder. Wires the project's design-
 * system primitives (`@/components/ui`) into Puck components so editor drops
 * render with real FRAS branding in the Live Preview drawer.
 *
 * POC-3 scope: 5 components across 3 categories. Epic 25 task 25.2 expands
 * to the full 31-component registry per PRD §6.2 with `payloadRelationship`
 * + `payloadFilter` field types added.
 *
 * Notes:
 * - All visible content uses `<Container>`, `<Stack>`, `<Button>`, `<Badge>`,
 *   `<Card>` from `@/components/ui` so editors get the real design system.
 * - Components render via Tailwind classes which are loaded in the public
 *   page route (and in the Live Preview drawer). The Puck editor surface
 *   ALSO loads `globals.css` (see PageBuilderClient) so the editor shows
 *   the same styling.
 * - `variant` field is always FIRST in props per G16.
 * - Localized text uses the `LocalizedText` custom field per G4.
 */
import type { Config } from '@measured/puck'

import { localizedTextField, type LocalizedTextValue, pickLocalizedText } from './fields/LocalizedText'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { Stack } from '@/components/ui/Stack'

export type FRASPageProps = {
  Heading: {
    text: LocalizedTextValue
    level: '1' | '2' | '3'
    variant: 'default' | 'eyebrow'
  }
  RichText: {
    body: LocalizedTextValue
  }
  CTAButton: {
    label: LocalizedTextValue
    href: string
    variant: 'primary' | 'secondary' | 'ghost' | 'dark'
    size: 'sm' | 'md' | 'lg'
  }
  ContentBadge: {
    text: LocalizedTextValue
    variant:
      | 'standard'
      | 'news'
      | 'webinar'
      | 'meeting'
      | 'guidance'
      | 'consultation'
      | 'decision'
      | 'deadline'
      | 'resource'
  }
  FeatureCard: {
    eyebrow: LocalizedTextValue
    title: LocalizedTextValue
    body: LocalizedTextValue
    ctaLabel: LocalizedTextValue
    ctaHref: string
  }
  Section: {
    variant: 'default' | 'muted' | 'feature'
    width: 'default' | 'narrow'
    padding: 'sm' | 'md' | 'lg'
    children: { type: string; props: Record<string, unknown> }[]
  }
  CardGrid: {
    columns: 2 | 3 | 4
    gap: 'sm' | 'md' | 'lg'
    cards: {
      eyebrow: LocalizedTextValue
      title: LocalizedTextValue
      body: LocalizedTextValue
      ctaLabel: LocalizedTextValue
      ctaHref: string
    }[]
  }
}

export type FRASRootProps = Record<string, unknown>

/**
 * Build the Puck config given the active locale (used at render time to
 * resolve LocalizedText fields). Epic 25 swaps for a context-driven
 * version that reacts to a locale switcher without rebuilding the config.
 */
export const buildPuckConfig = (
  locale: 'en' | 'fr' = 'en'
): Config<FRASPageProps, FRASRootProps> => ({
  root: {
    render: ({ children }) => (
      <Container>
        <Stack gap="lg" as="section" className="py-8">
          {children}
        </Stack>
      </Container>
    ),
  },
  components: {
    Heading: {
      label: 'Heading',
      defaultProps: {
        text: { en: 'New heading', fr: 'Nouveau titre' },
        level: '2',
        variant: 'default',
      },
      fields: {
        // G16 — variant FIRST.
        variant: {
          type: 'select',
          label: 'Variant',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Eyebrow (small caps)', value: 'eyebrow' },
          ],
        },
        level: {
          type: 'select',
          label: 'Heading level',
          options: [
            { label: 'H1', value: '1' },
            { label: 'H2', value: '2' },
            { label: 'H3', value: '3' },
          ],
        },
        text: {
          type: 'custom',
          label: 'Text',
          render: localizedTextField,
        },
      },
      render: ({ text, level, variant }) => {
        const Tag = `h${level}` as 'h1' | 'h2' | 'h3'
        const display = pickLocalizedText(text, locale)
        if (variant === 'eyebrow') {
          return (
            <Tag className="text-xs uppercase tracking-wide text-primary font-semibold">
              {display}
            </Tag>
          )
        }
        const sizeClass =
          level === '1'
            ? 'text-4xl font-black'
            : level === '2'
              ? 'text-3xl font-black'
              : 'text-xl font-bold'
        return <Tag className={`${sizeClass} text-text-heading`}>{display}</Tag>
      },
    },
    RichText: {
      label: 'Rich Text',
      defaultProps: {
        body: { en: 'Edit me…', fr: 'Modifiez-moi…' },
      },
      fields: {
        body: {
          type: 'custom',
          label: 'Body',
          render: localizedTextField,
        },
      },
      render: ({ body }) => (
        <p className="text-base leading-relaxed text-text-primary">
          {pickLocalizedText(body, locale)}
        </p>
      ),
    },
    CTAButton: {
      label: 'Button',
      defaultProps: {
        label: { en: 'Learn more', fr: 'En savoir plus' },
        href: '#',
        variant: 'primary',
        size: 'md',
      },
      fields: {
        // G16 — variant FIRST.
        variant: {
          type: 'select',
          label: 'Variant',
          options: [
            { label: 'Primary (purple fill)', value: 'primary' },
            { label: 'Secondary (outline)', value: 'secondary' },
            { label: 'Ghost (text + arrow)', value: 'ghost' },
            { label: 'Dark', value: 'dark' },
          ],
        },
        size: {
          type: 'select',
          label: 'Size',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
        label: {
          type: 'custom',
          label: 'Label',
          render: localizedTextField,
        },
        href: { type: 'text', label: 'Link URL' },
      },
      render: ({ label, href, variant, size }) => (
        <Button href={href} variant={variant} size={size}>
          {pickLocalizedText(label, locale)}
        </Button>
      ),
    },
    ContentBadge: {
      label: 'Content Type Badge',
      defaultProps: {
        text: { en: 'New', fr: 'Nouveau' },
        variant: 'news',
      },
      fields: {
        // G16 — variant FIRST.
        variant: {
          type: 'select',
          label: 'Content type',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'News', value: 'news' },
            { label: 'Webinar', value: 'webinar' },
            { label: 'Meeting', value: 'meeting' },
            { label: 'Guidance', value: 'guidance' },
            { label: 'Consultation', value: 'consultation' },
            { label: 'Decision', value: 'decision' },
            { label: 'Deadline', value: 'deadline' },
            { label: 'Resource', value: 'resource' },
          ],
        },
        text: {
          type: 'custom',
          label: 'Label',
          render: localizedTextField,
        },
      },
      render: ({ text, variant }) => (
        <Badge variant={variant}>{pickLocalizedText(text, locale)}</Badge>
      ),
    },
    FeatureCard: {
      label: 'Feature Card',
      defaultProps: {
        eyebrow: { en: 'New', fr: 'Nouveau' },
        title: { en: 'Card title', fr: 'Titre de la carte' },
        body: { en: 'Card body…', fr: 'Corps de la carte…' },
        ctaLabel: { en: 'Read more', fr: 'En savoir plus' },
        ctaHref: '#',
      },
      fields: {
        eyebrow: { type: 'custom', label: 'Eyebrow', render: localizedTextField },
        title: { type: 'custom', label: 'Title', render: localizedTextField },
        body: { type: 'custom', label: 'Body', render: localizedTextField },
        ctaLabel: { type: 'custom', label: 'CTA label', render: localizedTextField },
        ctaHref: { type: 'text', label: 'CTA URL' },
      },
      render: ({ eyebrow, title, body, ctaLabel, ctaHref }) => (
        <Card>
          <Card.Body>
            <Stack gap="sm">
              <span className="text-xs uppercase tracking-wide text-primary font-semibold">
                {pickLocalizedText(eyebrow, locale)}
              </span>
              <h3 className="text-xl font-bold text-text-heading">
                {pickLocalizedText(title, locale)}
              </h3>
              <p className="text-base text-text-primary">
                {pickLocalizedText(body, locale)}
              </p>
            </Stack>
          </Card.Body>
          <Card.Footer>
            <Button href={ctaHref} variant="ghost" size="sm">
              {pickLocalizedText(ctaLabel, locale)}
            </Button>
          </Card.Footer>
        </Card>
      ),
    },
    Section: {
      // A nestable layout container with an inner DropZone (Puck slot field).
      // Editors can drop other components (Heading, RichText, FeatureCard,
      // CardGrid, etc.) into the section. Maps to the Sitecore SXA
      // placeholder pattern — the Section IS a placeholder.
      label: 'Section',
      defaultProps: {
        variant: 'default',
        width: 'default',
        padding: 'md',
        children: [],
      },
      fields: {
        variant: {
          type: 'select',
          label: 'Background',
          options: [
            { label: 'Default (white)', value: 'default' },
            { label: 'Muted (gray-50)', value: 'muted' },
            { label: 'Feature (purple)', value: 'feature' },
          ],
        },
        width: {
          type: 'select',
          label: 'Container width',
          options: [
            { label: 'Default (1440px)', value: 'default' },
            { label: 'Narrow (1200px)', value: 'narrow' },
          ],
        },
        padding: {
          type: 'select',
          label: 'Vertical padding',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
        // The slot field — Puck renders this as a DropZone the editor
        // drops other components into. `disallow: ['Section']` prevents
        // infinite nesting.
        children: {
          type: 'slot',
          disallow: ['Section'],
        },
      },
      render: ({ variant, width, padding, children: Slot }) => {
        const bgClass =
          variant === 'feature'
            ? 'bg-feature text-white'
            : variant === 'muted'
              ? 'bg-alt'
              : 'bg-page'
        const paddingClass =
          padding === 'sm' ? 'py-6' : padding === 'lg' ? 'py-16' : 'py-10'
        return (
          <section className={`${bgClass} ${paddingClass}`}>
            <Container variant={width === 'narrow' ? 'narrow' : 'default'}>
              <Slot />
            </Container>
          </section>
        )
      },
    },
    CardGrid: {
      // Manual-mode card grid: editors configure each card inline in the
      // props drawer. Epic 25 task 25.7 adds a dynamic-mode sibling that
      // pulls cards from a payloadFilter spec (e.g., latest news).
      label: 'Card Grid',
      defaultProps: {
        columns: 3,
        gap: 'md',
        cards: [
          {
            eyebrow: { en: 'Featured', fr: 'En vedette' },
            title: { en: 'Card one', fr: 'Carte un' },
            body: { en: 'Body…', fr: 'Corps…' },
            ctaLabel: { en: 'Read more', fr: 'En savoir plus' },
            ctaHref: '#',
          },
          {
            eyebrow: { en: 'Featured', fr: 'En vedette' },
            title: { en: 'Card two', fr: 'Carte deux' },
            body: { en: 'Body…', fr: 'Corps…' },
            ctaLabel: { en: 'Read more', fr: 'En savoir plus' },
            ctaHref: '#',
          },
          {
            eyebrow: { en: 'Featured', fr: 'En vedette' },
            title: { en: 'Card three', fr: 'Carte trois' },
            body: { en: 'Body…', fr: 'Corps…' },
            ctaLabel: { en: 'Read more', fr: 'En savoir plus' },
            ctaHref: '#',
          },
        ],
      },
      fields: {
        columns: {
          type: 'select',
          label: 'Columns',
          options: [
            { label: '2 columns', value: 2 },
            { label: '3 columns', value: 3 },
            { label: '4 columns', value: 4 },
          ],
        },
        gap: {
          type: 'select',
          label: 'Gap',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
        cards: {
          type: 'array',
          label: 'Cards',
          arrayFields: {
            eyebrow: { type: 'custom', label: 'Eyebrow', render: localizedTextField },
            title: { type: 'custom', label: 'Title', render: localizedTextField },
            body: { type: 'custom', label: 'Body', render: localizedTextField },
            ctaLabel: { type: 'custom', label: 'CTA label', render: localizedTextField },
            ctaHref: { type: 'text', label: 'CTA URL' },
          },
          getItemSummary: (item, idx) =>
            pickLocalizedText(item.title, locale) || `Card ${(idx ?? 0) + 1}`,
        },
      },
      render: ({ columns, gap, cards }) => {
        const colsClass =
          columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
        const gapClass = gap === 'sm' ? 'gap-3' : gap === 'lg' ? 'gap-8' : 'gap-6'
        return (
          <div className={`grid grid-cols-1 ${colsClass} ${gapClass}`}>
            {cards?.map((card, i) => (
              <Card key={i}>
                <Card.Body>
                  <Stack gap="sm">
                    <span className="text-xs uppercase tracking-wide text-primary font-semibold">
                      {pickLocalizedText(card.eyebrow, locale)}
                    </span>
                    <h3 className="text-xl font-bold text-text-heading">
                      {pickLocalizedText(card.title, locale)}
                    </h3>
                    <p className="text-base text-text-primary">
                      {pickLocalizedText(card.body, locale)}
                    </p>
                  </Stack>
                </Card.Body>
                <Card.Footer>
                  <Button href={card.ctaHref} variant="ghost" size="sm">
                    {pickLocalizedText(card.ctaLabel, locale)}
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )
      },
    },
  },
  categories: {
    content: {
      title: 'Content',
      components: ['Heading', 'RichText'],
    },
    actions: {
      title: 'Actions & Labels',
      components: ['CTAButton', 'ContentBadge'],
    },
    layout: {
      title: 'Layout',
      components: ['Section', 'CardGrid', 'FeatureCard'],
    },
  },
})

export const puckConfig = buildPuckConfig('en')
