'use client'

import { useState } from 'react'
import { getRecommendation } from '@/lib/api'

interface QueryFormProps {
  state: string
  crop: string
  onSubmit: (data: any) => void
  onBack: () => void
}

export default function QueryForm({ state, crop, onSubmit, onBack }: QueryFormProps) {
  const [location, setLocation] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await getRecommendation({
        state,
        crop,
        location,
        quantity: parseFloat(quantity),
      })
      onSubmit(result)
    } catch (error) {
      console.error('Error fetching recommendation:', error)
      alert('Failed to get recommendation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-primary hover:text-primary/80 flex items-center gap-2"
      >
        ← Back to Crops
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">Enter Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Location (District)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Akola"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (Quintals)
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 50"
              min="1"
              step="0.1"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
          </button>
        </form>
      </div>
    </div>
  )
}
