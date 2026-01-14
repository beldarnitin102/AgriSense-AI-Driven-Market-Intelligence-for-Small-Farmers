'use client'

interface Mandi {
  name: string
  distance: number
  price: number
  priceComparison: string
  demand: string
  coordinates: { lat: number; lng: number }
}

interface MandiListProps {
  mandis: Mandi[]
}

export default function MandiList({ mandis }: MandiListProps) {
  const getDemandColor = (demand: string) => {
    if (demand === 'High') return 'bg-success'
    if (demand === 'Medium') return 'bg-warning'
    return 'bg-danger'
  }

  const openDirections = (mandi: Mandi) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mandi.coordinates.lat},${mandi.coordinates.lng}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-4">
      {mandis.map((mandi, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {mandi.name}
              </h4>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>📍 {mandi.distance} km away</span>
                <span className="font-semibold text-primary">
                  ₹{mandi.price}/quintal
                </span>
                <span className={mandi.priceComparison.includes('above') ? 'text-success' : 'text-danger'}>
                  {mandi.priceComparison}
                </span>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs text-white ${getDemandColor(mandi.demand)}`}>
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  {mandi.demand} Demand
                </span>
              </div>
            </div>
            <button
              onClick={() => openDirections(mandi)}
              className="ml-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Directions
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
