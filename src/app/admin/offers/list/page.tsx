'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Offer = {
  id: number
  name: string
  url: string
  logo: string | null
  network_id: number
}

export default function OfferListPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error('Error fetching offers:', error)
        return
      }

      setOffers(data || [])
      setLoading(false)
    }

    fetchOffers()
  }, [])

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to delete this offer?')
    if (!confirm) return

    const { error } = await supabase.from('offers').delete().eq('id', id)

    if (error) {
      alert('Error deleting offer')
      return
    }

    setOffers((prev) => prev.filter((offer) => offer.id !== id))
  }

  const getPublicImageUrl = (path: string | null) => {
    if (!path) return null
    return supabase.storage.from('general-images').getPublicUrl(path).data.publicUrl
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📋 Offers List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Logo</th>
              <th style={{ padding: '8px' }}>Name</th>
              <th style={{ padding: '8px' }}>URL</th>
              <th style={{ padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id} style={{ borderTop: '1px solid #ccc' }}>
                <td style={{ padding: '8px' }}>
                  {offer.logo ? (
                    <img
                      src={getPublicImageUrl(offer.logo) || ''}
                      alt="Logo"
                      style={{ height: 40 }}
                    />
                  ) : (
                    '—'
                  )}
                </td>
                <td style={{ padding: '8px' }}>{offer.name}</td>
                <td style={{ padding: '8px' }}>
                  <a href={offer.url} target="_blank" rel="noopener noreferrer">
                    {offer.url}
                  </a>
                </td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => handleDelete(offer.id)}>🗑️ Delete</button>
                  {/* Future edit link: */}
                  {/* <Link href={`/admin/offers/edit/${offer.id}`}>✏️ Edit</Link> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
} 