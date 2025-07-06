'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

type ImageFile = {
  name: string
  url: string
}

export default function ImageGalleryPage() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .storage
        .from('general-images')
        .list('uploads', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        })

      if (error) {
        console.error('Error fetching images:', error)
        return
      }

      const imageList = data?.map((file) => ({
        name: file.name,
        url: supabase.storage.from('general-images').getPublicUrl(`uploads/${file.name}`).data.publicUrl,
      })) || []

      setImages(imageList)
      setLoading(false)
    }

    fetchImages()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📸 Uploaded Image Gallery</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}>
          {images.map((img) => (
            <div key={img.name} style={{ textAlign: 'center' }}>
              <Image 
                src={img.url} 
                alt={img.name} 
                width={200}
                height={200}
                style={{ maxWidth: '100%', borderRadius: 8 }}
                className="object-cover"
              />
              <p style={{ fontSize: '0.8rem' }}>{img.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 