'use client'

import { useState } from 'react'
import MandiList from './MandiList'
import MandiMap from './MandiMap'
import PriceChart from './PriceChart'

interface RecommendationCardProps {
  data: any
  onNewSearch: () => void
}

export default function RecommendationCard({ data, onNewSearch }: RecommendationCardProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  const getRecommendationColor = (rec: string) => {
    if (rec.includes('Sell Now')) return 'bg-success'
    if (rec.includes('Wait')) return 'bg-warning'
    return 'bg-secondary'
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'Rising') return '↗'
    if (trend === 'Falling') return '↘'
    return '→'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Recommendation Card */}
      <div className={`${getRecommendationColor(data.recommendation)} text-white rounded-lg shadow-xl p-8`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">{data.recommendation}</h2>
          <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
            {data.confidence} Confidence
          </span>
        </div>
        <p className="text-lg leading-relaxed">{data.explanation}</p>
      </div>

      {/* Price Info Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Price Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Price Range</p>
            <p className="text-2xl font-bold text-primary">
              ₹{data.priceRange.min} - ₹{data.priceRange.max}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Average Price</p>
            <p className="text-2xl font-bold">₹{data.averagePrice}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Price Trend</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <span>{getTrendIcon(data.trend)}</span>
              {data.trend}
            </p>
          </div>
        </div>

        {/* Price Chart */}
        <div className="mt-6">
          <PriceChart data={data.historicalPrices} />
        </div>
      </div>

      {/* Nearby Mandis */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Nearby Mandis</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700'
                }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'map'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700'
                }`}
            >
              Map View
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <MandiList mandis={data.nearbyMandis} />
        ) : (
          <MandiMap mandis={data.nearbyMandis} userLocation={data.userLocation} />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onNewSearch}
          className="flex-1 bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          New Search
        </button>
        <button
          className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Set Price Alert
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700">
        <strong>Disclaimer:</strong> This information is for guidance only and not financial advice.
        Actual market prices may vary. Always verify current prices before making decisions.
      </div>
    </div>
  )
}
