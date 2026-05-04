/**
 * Document text extraction pipeline for PDF and DOCX files.
 *
 * Runs as an `afterChange` hook on the documents collection. Pulls the
 * uploaded media file, extracts its text content (PDF via pdf-parse,
 * DOCX via mammoth), and pushes the extracted text into the matching
 * Algolia document under the `extracted_text` field — which the
 * algolia/sync transform already declares as a `searchableAttributes`
 * entry for the documents indexes.
 *
 * - Failures never block the document save (extraction is best-effort)
 * - Output is truncated to 100KB to stay under Algolia's record limit
 * - Both `documents_en` and `documents_fr` get the partial update so
 *   FR queries return the same body match
 *
 * Replaces the previous Meilisearch-targeted implementation now that
 * Meilisearch is removed.
 */
import type { CollectionAfterChangeHook } from 'payload'

import { getAlgoliaAdminClient } from './algolia/client'

const MAX_TEXT_LENGTH = 100_000

const SUPPORTED_MIME_TYPES: Record<string, 'pdf' | 'docx'> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

const INDEXES = ['documents_en', 'documents_fr'] as const

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    return result.text || ''
  } catch (error) {
    console.warn('[DocumentExtraction] PDF extraction failed:', error)
    return ''
  }
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value || ''
  } catch (error) {
    console.warn('[DocumentExtraction] DOCX extraction failed:', error)
    return ''
  }
}

async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  const kind = SUPPORTED_MIME_TYPES[mimeType]
  if (!kind) return ''
  const text = kind === 'pdf' ? await extractPdfText(buffer) : await extractDocxText(buffer)
  return text.slice(0, MAX_TEXT_LENGTH)
}

export const extractDocumentText: CollectionAfterChangeHook = async ({ doc, req }) => {
  const client = getAlgoliaAdminClient()
  if (!client) return doc

  try {
    const fileRef = (doc as Record<string, unknown>).file
    if (!fileRef) return doc

    const mediaId = typeof fileRef === 'object' ? (fileRef as Record<string, unknown>).id : fileRef
    if (!mediaId) return doc

    const media = await req.payload.findByID({
      collection: 'media',
      id: String(mediaId),
    })

    const mimeType = (media as unknown as Record<string, unknown>).mimeType as string | undefined
    if (!mimeType || !SUPPORTED_MIME_TYPES[mimeType]) return doc

    const url = (media as unknown as Record<string, unknown>).url as string | undefined
    if (!url) return doc

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const fullUrl = url.startsWith('http') ? url : `${serverUrl}${url}`
    const response = await fetch(fullUrl)
    if (!response.ok) {
      console.warn(`[DocumentExtraction] Failed to fetch file: ${response.status}`)
      return doc
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const extractedText = await extractText(buffer, mimeType)
    if (!extractedText) return doc

    const docId = String((doc as Record<string, unknown>).id)

    // Fan-out to both locale indexes — partialUpdateObject is an upsert,
    // so it's safe even if the locale-specific record was never created
    // (Algolia will just create it with `objectID + extracted_text`).
    await Promise.all(
      INDEXES.map((indexName) =>
        client
          .partialUpdateObject({
            indexName,
            objectID: docId,
            attributesToUpdate: { extracted_text: extractedText },
          })
          .catch((error: unknown) => {
            console.warn(`[DocumentExtraction] partialUpdateObject(${indexName}) failed:`, error)
          }),
      ),
    )
  } catch (error) {
    console.warn('[DocumentExtraction] Text extraction pipeline error:', error)
  }

  return doc
}
