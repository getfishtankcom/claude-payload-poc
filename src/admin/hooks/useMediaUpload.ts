/**
 * useMediaUpload — XHR-based file upload with per-file progress reporting.
 *
 * Encapsulates: MIME validation, FormData construction, upload-progress
 * events, completion auto-clear, error reporting. Returns a flat list of
 * UploadProgress entries plus the public uploadFile / uploadFiles
 * callbacks.
 */
'use client'

import { useCallback, useState } from 'react'
import type { UploadProgress } from '../views/media/types'
import { ACCEPTED_MIME_TYPES } from '../views/media/helpers'

export function useMediaUpload(opts: {
  /** Folder id to attach uploads to. */
  selectedFolderId?: string | number | null
  /** Called after a batch of uploads finishes successfully. */
  onUploadComplete?: () => void | Promise<void>
}) {
  const [uploads, setUploads] = useState<UploadProgress[]>([])

  const uploadFile = useCallback(
    async (file: File) => {
      const uploadId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        setUploads((prev) => [
          ...prev,
          {
            id: uploadId,
            filename: file.name,
            progress: 0,
            status: 'error',
            error: `Unsupported file type: ${file.type}`,
          },
        ])
        return
      }

      setUploads((prev) => [
        ...prev,
        { id: uploadId, filename: file.name, progress: 0, status: 'uploading' },
      ])

      return new Promise<void>((resolve) => {
        const xhr = new XMLHttpRequest()
        const formData = new FormData()
        formData.append('file', file)
        formData.append('alt', file.name.replace(/\.[^.]+$/, ''))
        if (opts.selectedFolderId != null) {
          formData.append('folder', String(opts.selectedFolderId))
        }

        xhr.upload.addEventListener('progress', (e) => {
          if (!e.lengthComputable) return
          const pct = Math.round((e.loaded / e.total) * 100)
          setUploads((prev) =>
            prev.map((u) => (u.id === uploadId ? { ...u, progress: pct } : u)),
          )
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === uploadId ? { ...u, progress: 100, status: 'complete' } : u,
              ),
            )
            // Auto-clear completed uploads after 3s.
            setTimeout(() => {
              setUploads((prev) => prev.filter((u) => u.id !== uploadId))
            }, 3000)
          } else {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === uploadId
                  ? { ...u, status: 'error', error: `Upload failed (${xhr.status})` }
                  : u,
              ),
            )
          }
          resolve()
        })

        xhr.addEventListener('error', () => {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === uploadId ? { ...u, status: 'error', error: 'Network error' } : u,
            ),
          )
          resolve()
        })

        xhr.open('POST', '/api/media')
        xhr.send(formData)
      })
    },
    [opts.selectedFolderId],
  )

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      await Promise.all(fileArray.map((f) => uploadFile(f)))
      if (opts.onUploadComplete) await opts.onUploadComplete()
    },
    [uploadFile, opts],
  )

  const dismissUpload = useCallback((id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id))
  }, [])

  return { uploads, uploadFile, uploadFiles, dismissUpload }
}
