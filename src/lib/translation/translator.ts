/**
 * AI translator for the FRAS Canada bilingual workflow (PRD §13.D).
 *
 * Wraps the Anthropic SDK with:
 *   - A frozen system prompt (glossary + slug map + style rules) that
 *     leverages prompt caching — every call after the first reads the
 *     ~5KB system prompt at ~10% of full input cost.
 *   - Cost tracking with a configurable USD ceiling. Each call updates
 *     a running total; calls past the ceiling throw before hitting the
 *     API.
 *   - Slug-aware translation (slug fields use the mapping glossary;
 *     content slugs fall back to slugify(frTitle)).
 *
 * Model: claude-sonnet-4-6 (per PRD §13.5).
 *
 * Used by:
 *   - POST /api/translate (per-doc trigger, PRD §13.E)
 *   - scripts/batch-translate.mjs (bulk run, PRD §13.H)
 */
import Anthropic from '@anthropic-ai/sdk'
import glossary from './glossary.json' with { type: 'json' }
import slugMapping from '../../../data/fr-slug-mapping.json' with { type: 'json' }

const MODEL = 'claude-sonnet-4-6'

// Sonnet 4.6 pricing — see https://platform.claude.com/docs/en/pricing
// (validate against the live source if numbers change)
const PRICING = {
  inputPerMillion: 3.0,
  outputPerMillion: 15.0,
  // Prompt caching: read ~10% of input price; write 1.25× input price (5-min TTL)
  cacheReadPerMillion: 0.3,
  cacheCreationPerMillion: 3.75,
} as const

export type TranslationCost = {
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheCreationTokens: number
  usd: number
}

export type TranslatorOptions = {
  /** Anthropic API key. Defaults to ANTHROPIC_API_KEY env var. */
  apiKey?: string
  /** Hard cost ceiling in USD. Calls past this throw. Default $50 (PRD §13.5). */
  costCeilingUsd?: number
  /** Optional callback fired after every successful call with the cumulative cost. */
  onCostUpdate?: (cumulativeUsd: number, lastCall: TranslationCost) => void
  /** Override the model. Default 'claude-sonnet-4-6'. */
  model?: string
}

export type TranslateInput = {
  /** EN field values to translate. Keys are field names from the Payload doc. */
  fields: Record<string, unknown>
  /** Collection slug for context, e.g. 'news', 'projects'. Helps the model. */
  collection?: string
  /** Field names that contain URL slugs — handled with the mapping glossary. */
  slugFields?: string[]
}

export type TranslateOutput = {
  /** FR field values, same shape as input. */
  fields: Record<string, unknown>
  /** Token + USD cost for this single call. */
  cost: TranslationCost
  /** Cumulative USD across all calls on this Translator instance. */
  cumulativeUsd: number
}

export class CostCeilingExceededError extends Error {
  constructor(public ceiling: number, public spent: number) {
    super(
      `Translation cost ceiling exceeded: spent $${spent.toFixed(4)} of $${ceiling.toFixed(2)} ceiling. ` +
        `Increase the ceiling or stop the batch.`,
    )
    this.name = 'CostCeilingExceededError'
  }
}

/**
 * Builds the system prompt blocks. The glossary + slug map + rules are
 * everything before the last `cache_control` marker — these bytes are
 * frozen across calls, so prompt caching takes effect from call #2 onward.
 */
function buildSystemBlocks(): Anthropic.TextBlockParam[] {
  const lines: string[] = []
  lines.push(
    'You are a professional Canadian French translator working for RAS Canada — the Reporting and Assurance Standards body of Canada (formerly FRAS Canada). You translate accounting, auditing, public sector, and sustainability standards content for a bilingual government-affiliated website.',
    '',
    'CANADIAN FRENCH CONVENTIONS:',
    '- Use Canadian French ("courriel", not "e-mail"; "fin de semaine", not "week-end").',
    '- Keep proper nouns and acronyms in their established Canadian forms.',
    '- Use formal, professional tone appropriate for regulatory and government content.',
    '- Preserve precision in legal/regulatory phrasing — do not paraphrase technical terms.',
    '',
    'STRUCTURE PRESERVATION:',
    '- For any input that is a JSON object or array, return the EXACT SAME SHAPE with values translated. Do not add, remove, or reorder keys.',
    '- For Lexical rich-text JSON (nodes with `type`, `children`, etc.), preserve every node and attribute. Translate only `text` leaves.',
    '- Preserve URLs, email addresses, phone numbers, dates, and numeric values verbatim.',
    '- Preserve HTML tags, Markdown syntax, and any embedded code.',
    '',
    'GLOSSARY — use these exact translations whenever the English term appears:',
  )
  for (const term of glossary.terms) {
    let line = `  - ${term.en} → ${term.fr}`
    if (term.abbr_en && term.abbr_fr) {
      line += ` (${term.abbr_en} → ${term.abbr_fr})`
    }
    lines.push(line)
  }
  lines.push(
    '',
    'DO NOT TRANSLATE these proper nouns — keep them verbatim:',
    ...glossary.doNotTranslate.map((s) => `  - ${s}`),
    '',
    'SLUG TRANSLATION (when the field name is "slug" or appears in the slug-fields list):',
    '- If the EN slug matches a known mapping below, use the FR mapping verbatim.',
    '- Otherwise generate the FR slug from the translated title using lowercase letters, hyphens between words, no accents (à→a, é→e, etc.), no punctuation.',
    '- Path-segment mappings (English → French):',
  )
  // Flatten all known mappings so the model has a single lookup table.
  const allMappings: Array<{ en: string; fr: string }> = []
  for (const group of Object.values(slugMapping)) {
    if (Array.isArray(group)) {
      for (const m of group as Array<{ en: string; fr: string }>) {
        if (m.en && m.fr && m.en !== m.fr) allMappings.push({ en: m.en, fr: m.fr })
      }
    }
  }
  for (const m of allMappings) {
    lines.push(`  - ${m.en} → ${m.fr}`)
  }
  lines.push(
    '',
    'OUTPUT FORMAT:',
    'Return ONLY valid JSON — a single object whose keys exactly match the input keys, with French translations as values. No prose, no code fences, no commentary. The JSON must parse with JSON.parse().',
  )
  // Prompt-caching pattern: one breakpoint at the end of the frozen
  // prefix (everything above). Per PRD §13.5, this is reused across the
  // whole batch run; from call #2 on, ~5KB system prompt reads at ~10%
  // of input cost via the 5-minute ephemeral cache.
  return [
    {
      type: 'text',
      text: lines.join('\n'),
      cache_control: { type: 'ephemeral' },
    },
  ]
}

function buildUserPrompt(input: TranslateInput): string {
  const parts: string[] = []
  if (input.collection) {
    parts.push(`Collection: ${input.collection}`)
  }
  if (input.slugFields?.length) {
    parts.push(`Slug fields (use slug-translation rules for these): ${input.slugFields.join(', ')}`)
  }
  parts.push('')
  parts.push(
    'Translate the following EN fields to Canadian French. Return ONLY a JSON object with the same keys, values translated. Preserve any nested JSON structure exactly.',
  )
  parts.push('')
  parts.push(JSON.stringify(input.fields, null, 2))
  return parts.join('\n')
}

function priceCall(usage: Anthropic.Usage): TranslationCost {
  const inputTokens = usage.input_tokens
  const outputTokens = usage.output_tokens
  const cacheReadTokens = usage.cache_read_input_tokens ?? 0
  const cacheCreationTokens = usage.cache_creation_input_tokens ?? 0
  const usd =
    (inputTokens * PRICING.inputPerMillion) / 1_000_000 +
    (outputTokens * PRICING.outputPerMillion) / 1_000_000 +
    (cacheReadTokens * PRICING.cacheReadPerMillion) / 1_000_000 +
    (cacheCreationTokens * PRICING.cacheCreationPerMillion) / 1_000_000
  return { inputTokens, outputTokens, cacheReadTokens, cacheCreationTokens, usd }
}

function extractJsonObject(text: string): Record<string, unknown> {
  // Strip a markdown fence if the model added one (defensive — system
  // prompt forbids it but Sonnet occasionally still wraps).
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  const jsonText = fenceMatch ? fenceMatch[1] : text
  const trimmed = jsonText.trim()
  return JSON.parse(trimmed) as Record<string, unknown>
}

export class Translator {
  private client: Anthropic
  private systemBlocks: Anthropic.TextBlockParam[]
  private model: string
  private costCeilingUsd: number
  private cumulativeUsd = 0
  private onCostUpdate?: (cumulativeUsd: number, lastCall: TranslationCost) => void

  constructor(opts: TranslatorOptions = {}) {
    this.client = new Anthropic({ apiKey: opts.apiKey })
    this.systemBlocks = buildSystemBlocks()
    this.model = opts.model ?? MODEL
    this.costCeilingUsd = opts.costCeilingUsd ?? 50.0
    this.onCostUpdate = opts.onCostUpdate
  }

  /** Cumulative USD spent so far on this Translator. */
  getCumulativeCost(): number {
    return this.cumulativeUsd
  }

  /** Translate a field map. Throws CostCeilingExceededError before exceeding the cap. */
  async translate(input: TranslateInput): Promise<TranslateOutput> {
    if (this.cumulativeUsd >= this.costCeilingUsd) {
      throw new CostCeilingExceededError(this.costCeilingUsd, this.cumulativeUsd)
    }

    const userPrompt = buildUserPrompt(input)

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 8192,
      system: this.systemBlocks,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const cost = priceCall(response.usage)
    this.cumulativeUsd += cost.usd
    this.onCostUpdate?.(this.cumulativeUsd, cost)

    // The first text block holds the JSON. Be tolerant of multiple text
    // blocks (Sonnet sometimes splits long outputs).
    const textParts: string[] = []
    for (const block of response.content) {
      if (block.type === 'text') textParts.push(block.text)
    }
    const responseText = textParts.join('').trim()

    if (!responseText) {
      throw new Error(
        `Translator returned no text content. stop_reason=${response.stop_reason}, ` +
          `block types=${response.content.map((b) => b.type).join(',')}`,
      )
    }

    let translated: Record<string, unknown>
    try {
      translated = extractJsonObject(responseText)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      throw new Error(
        `Translator response was not valid JSON: ${msg}. ` +
          `First 400 chars: ${responseText.slice(0, 400)}`,
      )
    }

    return {
      fields: translated,
      cost,
      cumulativeUsd: this.cumulativeUsd,
    }
  }
}

/** Convenience: one-shot translate without retaining a Translator instance. */
export async function translateOnce(input: TranslateInput, opts?: TranslatorOptions) {
  const t = new Translator(opts)
  return t.translate(input)
}
