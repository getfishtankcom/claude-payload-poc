/**
 * AI translator for the FRAS Canada bilingual workflow (PRD §13.D).
 *
 * Wraps the Anthropic SDK with multiple cost safeguards. Defaults are
 * deliberately conservative for the validation phase — set higher
 * limits via env vars or constructor options once you trust the
 * pipeline.
 *
 * Safeguards (in order of activation):
 *   1. Kill switch — TRANSLATION_DISABLED=true short-circuits before
 *      any work.
 *   2. Cumulative-cost ceiling — hard cap, throws before the SDK call.
 *      Default $10 USD. Set via TRANSLATION_COST_CEILING_USD.
 *   3. Per-call max_tokens — caps the model's output. Default 4096.
 *      Set via TRANSLATION_MAX_TOKENS_PER_REQUEST.
 *   4. Pre-flight input token check — uses the free messages.countTokens
 *      endpoint to refuse oversized inputs before they hit billing.
 *      Default 20K input tokens. Set via TRANSLATION_MAX_INPUT_TOKENS.
 *   5. Per-call cost estimate — computes a worst-case cost (full
 *      input + max_tokens) and refuses if it exceeds 80% of remaining
 *      budget.
 *   6. Min delay between calls — paces the batch script. Default
 *      500ms. Set via TRANSLATION_MIN_DELAY_MS.
 *   7. Persistent cost log — every call appends a line to
 *      .ai-reports/translation-cost.log so you can audit spend.
 *
 * Prompt caching is on (single ephemeral cache_control on the
 * ~5KB system prompt). Calls 2..N read the cached prefix at ~10% of
 * full input price.
 *
 * Used by:
 *   - POST /api/admin/translate (per-doc trigger, PRD §13.E)
 *   - scripts/batch-translate.mjs (bulk run, PRD §13.H)
 */
import Anthropic from '@anthropic-ai/sdk'
import { appendFile, mkdir } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import glossary from './glossary.json' with { type: 'json' }
import slugMapping from '../../../data/fr-slug-mapping.json' with { type: 'json' }

const MODEL = 'claude-sonnet-4-6'

// Sonnet 4.6 pricing — see https://platform.claude.com/docs/en/pricing
const PRICING = {
  inputPerMillion: 3.0,
  outputPerMillion: 15.0,
  // Prompt caching: read ~10% of input price; write 1.25× input price (5-min TTL)
  cacheReadPerMillion: 0.3,
  cacheCreationPerMillion: 3.75,
} as const

// Conservative defaults for the validation phase. Override via env or
// constructor options once you trust the pipeline.
const DEFAULTS = {
  costCeilingUsd: 10.0,
  maxTokensPerRequest: 4096,
  maxInputTokens: 20_000,
  minDelayMs: 500,
  perCallUsdCap: 1.0, // Absolute single-call ceiling, independent of remaining-budget %
  budgetWarnPct: 80, // Log a warning when cumulative crosses this % of ceiling
} as const

// Resolve the cost log path relative to repo root. Works whether this
// module is loaded by Next.js, a Node script, or tsx. Override via
// TRANSLATION_COST_LOG_PATH if needed.
function resolveLogPath(): string {
  if (process.env.TRANSLATION_COST_LOG_PATH) {
    return resolve(process.env.TRANSLATION_COST_LOG_PATH)
  }
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    return resolve(here, '..', '..', '..', '.ai-reports', 'translation-cost.log')
  } catch {
    return resolve(process.cwd(), '.ai-reports', 'translation-cost.log')
  }
}

function getCostLogPath(): string {
  return resolveLogPath()
}

/**
 * Sum every $X.XXXXXX value in the cost log. Used to seed cumulativeUsd
 * at constructor time so the cost ceiling is **truly cumulative across
 * all calls** (route invocations, batch runs, etc.) until the log is
 * rotated/truncated.
 *
 * Synchronous + best-effort: returns 0 if the log doesn't exist or is
 * unreadable. We don't want to block the constructor on file I/O nor
 * fail-closed on a missing log file.
 */
function readLifetimeCostFromLogSync(): number {
  try {
    const path = getCostLogPath()
    if (!existsSync(path)) return 0
    const content = readFileSync(path, 'utf8')
    let total = 0
    for (const line of content.split('\n')) {
      // Each line: "<iso>\t$0.012345\tcum=$X.XXXX\t..."
      // Match the FIRST $X.XXXXXX (per-call cost), not cum=$.
      const m = line.match(/\t\$(\d+\.\d+)\tcum=/)
      if (m) total += Number(m[1])
    }
    return total
  } catch {
    return 0
  }
}

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
  /** Hard cumulative ceiling in USD. Calls past this throw. Default $10. */
  costCeilingUsd?: number
  /** Absolute per-call worst-case USD cap, independent of cumulative. Default $1.00. */
  perCallUsdCap?: number
  /** Output token cap per call. Default 4096. */
  maxTokensPerRequest?: number
  /** Pre-flight: refuse if input exceeds this. Default 20000. */
  maxInputTokens?: number
  /** Minimum ms between calls (rate-limit). Default 500ms. */
  minDelayMs?: number
  /** Warn (don't block) when cumulative crosses this % of ceiling. Default 80. */
  budgetWarnPct?: number
  /** Skip the SDK call; return synthetic FR for testing the flow with $0 spend. */
  dryRun?: boolean
  /** Disable cost log writing (for tests). */
  disableCostLog?: boolean
  /** Skip seeding cumulativeUsd from the existing cost log. Default false. */
  skipLifetimeBudget?: boolean
  /** Optional callback fired after every successful call. */
  onCostUpdate?: (cumulativeUsd: number, lastCall: TranslationCost) => void
  /** Override the model. Default 'claude-sonnet-4-6'. Honors TRANSLATION_MODEL env. */
  model?: string
}

export type TranslateInput = {
  /** EN field values to translate. Keys are field names from the Payload doc. */
  fields: Record<string, unknown>
  /** Collection slug for context, e.g. 'news', 'projects'. Helps the model. */
  collection?: string
  /** Field names that contain URL slugs — handled with the mapping glossary. */
  slugFields?: string[]
  /** Doc id for cost log audit trail (optional). */
  docId?: string | number
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
        `Increase TRANSLATION_COST_CEILING_USD or stop the batch.`,
    )
    this.name = 'CostCeilingExceededError'
  }
}

export class TranslationDisabledError extends Error {
  constructor() {
    super('Translation disabled (TRANSLATION_DISABLED=true)')
    this.name = 'TranslationDisabledError'
  }
}

export class InputTooLargeError extends Error {
  constructor(public inputTokens: number, public limit: number) {
    super(
      `Translation input too large: ${inputTokens} tokens > ${limit} cap. ` +
        `Either split the doc, raise TRANSLATION_MAX_INPUT_TOKENS, or skip this item.`,
    )
    this.name = 'InputTooLargeError'
  }
}

export class CallEstimateExceedsRemainingBudgetError extends Error {
  constructor(public estimateUsd: number, public remainingUsd: number) {
    super(
      `Single-call worst-case estimate ($${estimateUsd.toFixed(4)}) > 80% of remaining budget ` +
        `($${remainingUsd.toFixed(4)}). Refusing to risk overshooting the ceiling. ` +
        `Increase TRANSLATION_COST_CEILING_USD or shrink the input.`,
    )
    this.name = 'CallEstimateExceedsRemainingBudgetError'
  }
}

export class CallExceedsPerCallCapError extends Error {
  constructor(public estimateUsd: number, public capUsd: number) {
    super(
      `Single-call worst-case estimate ($${estimateUsd.toFixed(4)}) > absolute per-call cap ` +
        `($${capUsd.toFixed(4)}). Increase TRANSLATION_PER_CALL_USD_CAP or shrink the input.`,
    )
    this.name = 'CallExceedsPerCallCapError'
  }
}

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

/** Worst-case per-call cost = full input at uncached rate + full max_tokens output. */
export function estimateWorstCaseCostUsd(
  inputTokens: number,
  maxTokensOutput: number,
): number {
  return (
    (inputTokens * PRICING.inputPerMillion) / 1_000_000 +
    (maxTokensOutput * PRICING.outputPerMillion) / 1_000_000
  )
}

function extractJsonObject(text: string): Record<string, unknown> {
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
  const jsonText = fenceMatch ? fenceMatch[1] : text
  return JSON.parse(jsonText.trim()) as Record<string, unknown>
}

async function appendCostLog(line: string): Promise<void> {
  try {
    const path = getCostLogPath()
    await mkdir(dirname(path), { recursive: true })
    await appendFile(path, line + '\n', 'utf8')
  } catch {
    // Don't break translation on a logging failure.
  }
}

function envNum(name: string, fallback: number): number {
  const raw = process.env[name]
  if (!raw) return fallback
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export class Translator {
  private client: Anthropic
  private systemBlocks: Anthropic.TextBlockParam[]
  private model: string
  private costCeilingUsd: number
  private perCallUsdCap: number
  private maxTokensPerRequest: number
  private maxInputTokens: number
  private minDelayMs: number
  private budgetWarnPct: number
  private dryRun: boolean
  private disableCostLog: boolean
  private warnFired = false
  private cumulativeUsd = 0
  private callCount = 0
  private lastCallAt = 0
  private onCostUpdate?: (cumulativeUsd: number, lastCall: TranslationCost) => void

  constructor(opts: TranslatorOptions = {}) {
    if (process.env.TRANSLATION_DISABLED === 'true') {
      throw new TranslationDisabledError()
    }
    this.client = new Anthropic({ apiKey: opts.apiKey })
    this.systemBlocks = buildSystemBlocks()
    this.model = opts.model ?? process.env.TRANSLATION_MODEL ?? MODEL
    this.costCeilingUsd =
      opts.costCeilingUsd ?? envNum('TRANSLATION_COST_CEILING_USD', DEFAULTS.costCeilingUsd)
    this.perCallUsdCap =
      opts.perCallUsdCap ?? envNum('TRANSLATION_PER_CALL_USD_CAP', DEFAULTS.perCallUsdCap)
    this.maxTokensPerRequest =
      opts.maxTokensPerRequest ??
      envNum('TRANSLATION_MAX_TOKENS_PER_REQUEST', DEFAULTS.maxTokensPerRequest)
    this.maxInputTokens =
      opts.maxInputTokens ?? envNum('TRANSLATION_MAX_INPUT_TOKENS', DEFAULTS.maxInputTokens)
    this.minDelayMs =
      opts.minDelayMs ?? envNum('TRANSLATION_MIN_DELAY_MS', DEFAULTS.minDelayMs)
    this.budgetWarnPct =
      opts.budgetWarnPct ?? envNum('TRANSLATION_BUDGET_WARN_PCT', DEFAULTS.budgetWarnPct)
    this.dryRun = opts.dryRun ?? process.env.TRANSLATION_DRY_RUN === 'true'
    this.disableCostLog = !!opts.disableCostLog
    this.onCostUpdate = opts.onCostUpdate

    // Seed cumulativeUsd from the persistent cost log so the ceiling
    // enforces *across* HTTP requests + batch runs, not just within
    // one Translator instance. Set TRANSLATION_SKIP_LIFETIME_BUDGET=true
    // to start fresh (e.g. after intentionally rotating the log).
    if (
      !opts.skipLifetimeBudget &&
      process.env.TRANSLATION_SKIP_LIFETIME_BUDGET !== 'true'
    ) {
      this.cumulativeUsd = readLifetimeCostFromLogSync()
    }
  }

  getCumulativeCost(): number {
    return this.cumulativeUsd
  }

  getCostCeiling(): number {
    return this.costCeilingUsd
  }

  getCallCount(): number {
    return this.callCount
  }

  async translate(input: TranslateInput): Promise<TranslateOutput> {
    // Safeguard 1: kill switch
    if (process.env.TRANSLATION_DISABLED === 'true') {
      throw new TranslationDisabledError()
    }

    // Safeguard 2: cumulative-cost ceiling
    if (this.cumulativeUsd >= this.costCeilingUsd) {
      throw new CostCeilingExceededError(this.costCeilingUsd, this.cumulativeUsd)
    }

    // Safeguard 6: rate limit
    if (this.minDelayMs > 0 && this.lastCallAt > 0) {
      const elapsed = Date.now() - this.lastCallAt
      if (elapsed < this.minDelayMs) {
        await new Promise((r) => setTimeout(r, this.minDelayMs - elapsed))
      }
    }

    const userPrompt = buildUserPrompt(input)

    // Safeguard 4: pre-flight input-token check via the free countTokens endpoint
    const tokenCount = await this.client.messages.countTokens({
      model: this.model,
      system: this.systemBlocks,
      messages: [{ role: 'user', content: userPrompt }],
    })
    if (tokenCount.input_tokens > this.maxInputTokens) {
      throw new InputTooLargeError(tokenCount.input_tokens, this.maxInputTokens)
    }

    // Safeguard 5a: absolute per-call USD cap (independent of remaining budget)
    const worstCase = estimateWorstCaseCostUsd(tokenCount.input_tokens, this.maxTokensPerRequest)
    if (worstCase > this.perCallUsdCap) {
      throw new CallExceedsPerCallCapError(worstCase, this.perCallUsdCap)
    }

    // Safeguard 5b: refuse if a single call's worst case eats >80% of remaining budget
    const remainingBudget = this.costCeilingUsd - this.cumulativeUsd
    if (worstCase > remainingBudget * 0.8) {
      throw new CallEstimateExceedsRemainingBudgetError(worstCase, remainingBudget)
    }

    // Safeguard 8: dry-run mode — skip the SDK entirely, return synthetic FR
    if (this.dryRun) {
      const synthFields: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(input.fields)) {
        synthFields[k] = typeof v === 'string' ? `[FR-DRY] ${v}` : v
      }
      const cost: TranslationCost = {
        inputTokens: tokenCount.input_tokens,
        outputTokens: 0,
        cacheReadTokens: 0,
        cacheCreationTokens: 0,
        usd: 0,
      }
      this.callCount += 1
      this.lastCallAt = Date.now()
      if (!this.disableCostLog) {
        const ts = new Date().toISOString()
        const docRef = `${input.collection ?? '?'}#${input.docId ?? '?'}`
        void appendCostLog(
          `${ts}\t$0.000000\tcum=$${this.cumulativeUsd.toFixed(4)}\t` +
            `in=${tokenCount.input_tokens}\tout=0\tcacheR=0\tcacheW=0\t${docRef}\tDRY_RUN`,
        )
      }
      return { fields: synthFields, cost, cumulativeUsd: this.cumulativeUsd }
    }

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: this.maxTokensPerRequest,
      system: this.systemBlocks,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const cost = priceCall(response.usage)
    this.cumulativeUsd += cost.usd
    this.callCount += 1
    this.lastCallAt = Date.now()
    this.onCostUpdate?.(this.cumulativeUsd, cost)

    // Safeguard 9: budget warning (one-shot — fires the first time we cross the threshold)
    const pct = (this.cumulativeUsd / this.costCeilingUsd) * 100
    if (!this.warnFired && pct >= this.budgetWarnPct) {
      this.warnFired = true
      // eslint-disable-next-line no-console
      console.warn(
        `[translation] cumulative spend $${this.cumulativeUsd.toFixed(4)} ` +
          `(${pct.toFixed(0)}% of $${this.costCeilingUsd.toFixed(2)} ceiling) — ` +
          `${this.callCount} calls so far. Adjust TRANSLATION_COST_CEILING_USD if you need more.`,
      )
    }

    // Safeguard 7: persistent cost log
    if (!this.disableCostLog) {
      const ts = new Date().toISOString()
      const docRef = `${input.collection ?? '?'}#${input.docId ?? '?'}`
      const fieldNames = Object.keys(input.fields).join(',')
      void appendCostLog(
        `${ts}\t$${cost.usd.toFixed(6)}\tcum=$${this.cumulativeUsd.toFixed(4)}\t` +
          `in=${cost.inputTokens}\tout=${cost.outputTokens}\t` +
          `cacheR=${cost.cacheReadTokens}\tcacheW=${cost.cacheCreationTokens}\t` +
          `${docRef}\tmodel=${this.model}\tfields=[${fieldNames}]`,
      )
    }

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
