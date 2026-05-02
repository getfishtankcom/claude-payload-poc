import type { FlatFolder, FolderNode } from './types'

/** Accepted MIME types for upload validation. */
export const ACCEPTED_MIME_TYPES: readonly string[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'video/mp4',
  'video/webm',
]

/** Comma-separated extensions for the file input accept attribute. */
export const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.svg,.gif,.pdf,.docx,.xlsx,.pptx,.mp4,.webm'

export const STORAGE_KEY_EXPANDED = 'fras-media-folders-expanded'
export const STORAGE_KEY_VIEW = 'fras-media-view-mode'

/** Map a mimeType to a coarse file category. */
export function getFileCategory(
  mimeType: string,
): 'image' | 'document' | 'video' | 'audio' | 'other' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (
    mimeType === 'application/pdf' ||
    mimeType.includes('wordprocessingml') ||
    mimeType.includes('spreadsheetml') ||
    mimeType.includes('presentationml')
  ) {
    return 'document'
  }
  return 'other'
}

/** Format bytes as a human-readable size. */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Flatten a nested folder tree into a depth-prefixed list, suitable for
 * select inputs.
 */
export function flattenFolders(nodes: FolderNode[], depth = 0): FlatFolder[] {
  const out: FlatFolder[] = []
  for (const node of nodes) {
    out.push({ id: node.id, name: node.name, depth })
    if (node.children && node.children.length > 0) {
      out.push(...flattenFolders(node.children, depth + 1))
    }
  }
  return out
}
