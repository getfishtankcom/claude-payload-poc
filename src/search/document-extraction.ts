/**
 * @description
 * Document text extraction pipeline for PDF and DOCX files.
 * Extracts text content from uploaded documents and indexes it in Meilisearch
 * for full-text search across document contents.
 *
 * Key features:
 * - PDF text extraction via pdf-parse
 * - DOCX text extraction via mammoth
 * - afterChange hook for the documents collection
 * - Extracted text sent to Meilisearch (NOT stored in PostgreSQL)
 * - Graceful error handling — extraction failures don't block document saves
 *
 * @dependencies
 * - pdf-parse: PDF text extraction
 * - mammoth: DOCX to plain text conversion
 * - meilisearch-client: Singleton Meilisearch client
 *
 * @notes
 * - Only processes files with supported MIME types (PDF, DOCX)
 * - Text is truncated to 100KB to avoid Meilisearch document size limits
 * - The extracted text is added as a `body` field in the Meilisearch document
 * - This runs asynchronously after the document save completes
 */
import type { CollectionAfterChangeHook } from 'payload'
import { getMeilisearchClient } from './meilisearch-client'

const MAX_TEXT_LENGTH = 100_000 // 100KB max text per document

/** Supported MIME types for text extraction */
const SUPPORTED_MIME_TYPES: Record<string, 'pdf' | 'docx'> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

/**
 * Extracts text from a PDF buffer using pdf-parse.
 * Returns empty string on failure.
 */
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

/**
 * Extracts text from a DOCX buffer using mammoth.
 * Returns empty string on failure.
 */
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

/**
 * Extracts text from a file buffer based on its MIME type.
 * Returns null for unsupported file types.
 */
async function extractText(
  buffer: Buffer,
  mimeType: string,
): Promise<string | null> {
  const fileType = SUPPORTED_MIME_TYPES[mimeType]
  if (!fileType) return null

  let text = ''
  if (fileType === 'pdf') {
    text = await extractPdfText(buffer)
  } else if (fileType === 'docx') {
    text = await extractDocxText(buffer)
  }

  // Truncate to avoid Meilisearch document size limits
  if (text.length > MAX_TEXT_LENGTH) {
    text = text.slice(0, MAX_TEXT_LENGTH)
  }

  return text
}

/**
 * afterChange hook that extracts text from uploaded documents
 * and updates the Meilisearch index with the extracted content.
 *
 * Register this on the documents collection alongside the standard
 * syncToMeilisearch hooks.
 */
export const extractDocumentText: CollectionAfterChangeHook = async ({ doc, req }) => {
  const client = getMeilisearchClient()
  if (!client) return doc

  try {
    // Get the file relationship — could be a populated object or just an ID
    const fileRef = (doc as Record<string, unknown>).file
    if (!fileRef) return doc

    // Resolve the media document
    const mediaId = typeof fileRef === 'object' ? (fileRef as Record<string, unknown>).id : fileRef
    if (!mediaId) return doc

    // Fetch the media document to get MIME type and file path
    const media = await req.payload.findByID({
      collection: 'media',
      id: String(mediaId),
    })

    const mimeType = (media as unknown as Record<string, unknown>).mimeType as string | undefined
    if (!mimeType || !SUPPORTED_MIME_TYPES[mimeType]) return doc

    // Get the file URL and fetch its content
    const url = (media as unknown as Record<string, unknown>).url as string | undefined
    if (!url) return doc

    // Fetch the file buffer from the media URL
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const fullUrl = url.startsWith('http') ? url : `${serverUrl}${url}`
    const response = await fetch(fullUrl)
    if (!response.ok) {
      console.warn(`[DocumentExtraction] Failed to fetch file: ${response.status}`)
      return doc
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text
    const extractedText = await extractText(buffer, mimeType)
    if (!extractedText) return doc

    // Update the Meilisearch document with extracted text
    const docId = String((doc as Record<string, unknown>).id)
    const index = client.index('documents_en')
    await index.updateDocuments([
      {
        id: docId,
        body: extractedText,
      },
    ])
  } catch (error) {
    // Don't block document save on extraction failure
    console.warn('[DocumentExtraction] Text extraction pipeline error:', error)
  }

  return doc
}
