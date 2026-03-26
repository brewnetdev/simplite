// ─── Cloudflare R2 Image Upload via Worker ───────────────────────────────────

interface CloudflareUploadResponse {
  success: boolean
  url?: string
  error?: string
}

/**
 * Creates an image upload function that uses a Cloudflare Worker + R2 backend.
 *
 * Usage:
 *   const uploader = createCloudflareUploader('https://my-worker.workers.dev')
 *   const url = await uploader(file)
 */
export function createCloudflareUploader(workerUrl: string) {
  return async function uploadToCloudflare(file: File): Promise<string> {
    if (!workerUrl) {
      throw new Error('Cloudflare Worker URL is not configured')
    }

    const baseUrl = workerUrl.replace(/\/+$/, '')
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`Upload failed (${response.status}): ${errorText}`)
    }

    const result: CloudflareUploadResponse = await response.json()

    if (!result.success || !result.url) {
      throw new Error(result.error || 'Upload failed: invalid response')
    }

    return result.url
  }
}

/**
 * Creates a tiny 1x1 transparent PNG for testing the upload endpoint.
 * No file picker needed — generated programmatically.
 */
export function createTestImage(): File {
  // Minimal 1x1 transparent PNG (67 bytes)
  const base64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new File([bytes], 'test.png', { type: 'image/png' })
}
