'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AddOfferPage() {
  const [offerName, setOfferName] = useState('')
  const [offerUrl, setOfferUrl] = useState('')
  const [logo, setLogo] = useState<File | null>(null)
  const [networkId, setNetworkId] = useState('')
  const [networks, setNetworks] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchNetworks = async () => {
      const { data, error } = await supabase.from('networks').select('id, name')
      if (error) {
        console.error('Error fetching networks:', error)
      } else {
        setNetworks(data)
      }
    }

    fetchNetworks()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!offerName || !offerUrl || !networkId) return alert('Fill all required fields')

    setLoading(true)

    let logoPath = null

    if (logo) {
      const path = `offers/${Date.now()}-${logo.name}`
      const { error: uploadError } = await supabase.storage
        .from('general-images')
        .upload(path, logo)

      if (uploadError) {
        console.error(uploadError)
        alert('Failed to upload logo')
        setLoading(false)
        return
      }

      logoPath = path
    }

    const { error: insertError } = await supabase.from('offers').insert({
      name: offerName,
      url: offerUrl,
      network_id: networkId,
      logo: logoPath,
    })

    if (insertError) {
      console.error(insertError)
      alert('Error adding offer')
    } else {
      alert('Offer added!')
      setOfferName('')
      setOfferUrl('')
      setNetworkId('')
      setLogo(null)
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>➕ Add New Offer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Offer Name:</label><br />
          <input value={offerName} onChange={(e) => setOfferName(e.target.value)} required />
        </div>

        <div>
          <label>Offer URL:</label><br />
          <input value={offerUrl} onChange={(e) => setOfferUrl(e.target.value)} required />
        </div>

        <div>
          <label>Network:</label><br />
          <select value={networkId} onChange={(e) => setNetworkId(e.target.value)} required>
            <option value="">Select network</option>
            {networks.map((net) => (
              <option key={net.id} value={net.id}>{net.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Offer Logo (optional):</label><br />
          <input type="file" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Submitting...' : 'Add Offer'}
        </button>
      </form>
    </div>
  )
} 