'use client'

interface Mandi {
  name: string
  distance: number
  price: number
  priceComparison: string
  demand: string
  coordinates: { lat: number; lng: number }
}

interface MandiMapProps {
  mandis: Mandi[]
  userLocation: { lat: number; lng: number }
}

export default function MandiMap({ mandis, userLocation }: MandiMapProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-8 text-center">
      <div className="text-gray-600 mb-4">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <p className="text-lg font-medium">Map View</p>
        <p className="text-sm mt-2">
          Google Maps integration requires API key configuration
        </p>
      </div>
      <div className="text-sm text-gray-500 mt-4">
        <p>User Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
        <p className="mt-2">{mandis.length} mandis within 100km</p>
      </div>
    </div>
  )
}
