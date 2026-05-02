/** Folder node returned by /api/media-folders/tree */
export interface FolderNode {
  id: string | number
  name: string
  hasChildren: boolean
  sortOrder: number
  parent: string | number | null
  mediaCount: number
  children?: FolderNode[]
}

/** Media item returned by /api/media */
export interface MediaItem {
  id: string | number
  filename: string
  alt: string
  title?: string
  description?: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  url: string
  folder?: string | number | { id: string | number } | null
  createdAt: string
  updatedAt: string
  createdBy?: { id: string; email?: string; firstName?: string; lastName?: string } | null
  sizes?: {
    thumbnail?: { url: string; width: number; height: number }
    card?: { url: string; width: number; height: number }
  }
}

export type ViewMode = 'grid' | 'list'

export interface UploadProgress {
  id: string
  filename: string
  progress: number
  status: 'uploading' | 'complete' | 'error'
  error?: string
}

/** Flattened folder for select inputs and breadcrumb resolution. */
export interface FlatFolder {
  id: string | number
  name: string
  depth: number
}
