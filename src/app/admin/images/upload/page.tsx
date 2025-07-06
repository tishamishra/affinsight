'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ImageUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first.')

    setUploading(true)

    const filePath = `uploads/${Date.now()}-${file.name}`

    const { data, error } = await supabase.storage
      .from('general-images')
      .upload(filePath, file)

    if (error) {
      console.error(error)
      alert('Upload failed.')
    } else {
      const { publicUrl } = supabase
        .storage
        .from('general-images')
        .getPublicUrl(filePath).data

      setImageUrl(publicUrl)
    }

    setUploading(false)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🖼️ Upload Image to general-images Bucket</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading} style={{ marginLeft: 8 }}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {imageUrl && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Preview:</strong><br />
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: 400, borderRadius: 8 }} />
        </div>
      )}
    </div>
  )
} 