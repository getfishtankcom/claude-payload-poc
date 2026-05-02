/**
 * POST /api/admin/translate
 *
 * AI-translates an EN doc into FR (PRD §13.E). Auth-gated to any
 * Clerk/Payload-authenticated user. Body:
 *
 *   { "collectionSlug": "news", "docId": 42 }
 *
 * Process:
 *   1. Load EN locale of the doc
 *   2. Pick translatable fields (skip relationships, dates, system fields)
 *   3. Send to the Anthropic Sonnet 4.6 translator
 *   4. Save FR locale + set translationStatus='pending_review'
 *   5. Return cost + summary
 *
 * Reviewer flow (Path A, PRD §13.4): user opens the doc in Payload admin,
 * switches to the FR locale tab, eyeballs / edits, sets status = 'approved'.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  Translator,
  CostCeilingExceededError,
  TranslationDisabledError,
  InputTooLargeError,
  CallEstimateExceedsRemainingBudgetError,
  CallExceedsPerCallCapError,
} from '@/lib/translation/translator'
import { pickTranslatableFields, SLUG_FIELDS } from '@/lib/translation/field-picker'

export async function POST(request: NextRequest) {
  try {
    if (process.env.TRANSLATION_DISABLED === 'true') {
      return NextResponse.json(
        { error: 'Translation is disabled (TRANSLATION_DISABLED=true)' },
        { status: 503 },
      )
    }
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: request.headers })
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: { collectionSlug?: string; docId?: string | number }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const collectionSlug = body.collectionSlug
    const docId = body.docId
    if (!collectionSlug || !docId) {
      return NextResponse.json(
        { error: 'Missing collectionSlug or docId' },
        { status: 400 },
      )
    }

    // Verify collection exists (else findByID would throw an opaque error).
    const collection = payload.collections[collectionSlug as keyof typeof payload.collections]
    if (!collection) {
      return NextResponse.json(
        { error: `Unknown collection: ${collectionSlug}` },
        { status: 400 },
      )
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Translation service not configured (ANTHROPIC_API_KEY missing)' },
        { status: 503 },
      )
    }

    // Load EN doc — depth:0 returns relationship/upload fields as numeric IDs,
    // which makes filtering trivial.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enDoc = (await (payload.findByID as any)({
      collection: collectionSlug,
      id: docId,
      locale: 'en',
      depth: 0,
    })) as Record<string, unknown>

    if (!enDoc) {
      return NextResponse.json({ error: 'Doc not found' }, { status: 404 })
    }

    const enFields = pickTranslatableFields(enDoc)
    const fieldCount = Object.keys(enFields).length
    if (fieldCount === 0) {
      return NextResponse.json(
        { error: 'No translatable fields found on this doc' },
        { status: 400 },
      )
    }

    const translator = new Translator()
    const result = await translator.translate({
      fields: enFields,
      collection: collectionSlug,
      slugFields: SLUG_FIELDS,
      docId,
    })

    // Save FR locale + flip translationStatus to pending_review.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = (await (payload.update as any)({
      collection: collectionSlug,
      id: docId,
      locale: 'fr',
      data: {
        ...result.fields,
        translationStatus: 'pending_review',
      },
      context: {
        // Skip workflow validation since translation isn't a workflow event.
        skipWorkflowValidation: true,
        skipWorkflowLogging: true,
      },
    })) as Record<string, unknown>

    return NextResponse.json({
      success: true,
      collectionSlug,
      docId,
      translatedFields: Object.keys(result.fields),
      cost: result.cost,
      cumulativeUsd: result.cumulativeUsd,
      updated: { id: updated.id, translationStatus: updated.translationStatus },
    })
  } catch (err) {
    // Surface the safeguard errors as 4xx/5xx with a useful message.
    if (err instanceof TranslationDisabledError) {
      return NextResponse.json({ error: err.message }, { status: 503 })
    }
    if (err instanceof CostCeilingExceededError) {
      return NextResponse.json({ error: err.message }, { status: 429 })
    }
    if (err instanceof InputTooLargeError) {
      return NextResponse.json({ error: err.message }, { status: 413 })
    }
    if (err instanceof CallEstimateExceedsRemainingBudgetError) {
      return NextResponse.json({ error: err.message }, { status: 429 })
    }
    if (err instanceof CallExceedsPerCallCapError) {
      return NextResponse.json({ error: err.message }, { status: 429 })
    }
    const msg = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    if (process.env.NODE_ENV !== 'production') {
      console.error('[/api/admin/translate]', msg, stack)
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
