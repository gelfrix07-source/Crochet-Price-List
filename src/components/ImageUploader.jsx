import { useRef, useState } from 'react'
import { getPublicImageUrl, validateImageFile } from '../services/storageService'

export default function ImageUploader({ currentImagePath, onFileSelected, error }) {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [localError, setLocalError] = useState(null)

  const existingUrl = getPublicImageUrl(currentImagePath)
  const displayUrl = previewUrl || existingUrl

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file)
    if (validationError) {
      setLocalError(validationError)
      onFileSelected(null)
      return
    }

    setLocalError(null)
    setPreviewUrl(URL.createObjectURL(file))
    onFileSelected(file)
  }

  return (
    <div>
      <label className="label-field">Product Image</label>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-cozy border-2 border-dashed border-ink/10 bg-surface-soft">
          {displayUrl ? (
            <img src={displayUrl} alt="Product preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl" aria-hidden="true">🧶</span>
          )}
        </div>
        <div>
          <button type="button" onClick={() => inputRef.current?.click()} className="btn-secondary !px-4 !py-2 text-sm">
            {displayUrl ? 'Replace Image' : 'Upload Image'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleChange}
          />
          <p className="mt-1 font-body text-xs text-ink-soft">JPG, PNG, WEBP, or GIF. Max 5MB.</p>
        </div>
      </div>
      {(localError || error) && <p className="mt-2 font-body text-sm text-peach">{localError || error}</p>}
    </div>
  )
}
