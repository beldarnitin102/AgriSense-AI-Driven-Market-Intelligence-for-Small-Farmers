'use client'

interface CropSelectorProps {
  state: string
  onSelect: (crop: string) => void
  onBack: () => void
}

const cropsByState: Record<string, Array<{ id: string; name: string; icon: string }>> = {
  maharashtra: [
    { id: 'cotton', name: 'Cotton', icon: '🌱' },
    { id: 'soybean', name: 'Soybean', icon: '🫘' },
    { id: 'wheat', name: 'Wheat', icon: '🌾' },
    { id: 'onion', name: 'Onion', icon: '🧅' },
  ],
  karnataka: [
    { id: 'rice', name: 'Rice', icon: '🌾' },
    { id: 'ragi', name: 'Ragi', icon: '🌾' },
    { id: 'sugarcane', name: 'Sugarcane', icon: '🎋' },
  ],
  rajasthan: [
    { id: 'wheat', name: 'Wheat', icon: '🌾' },
    { id: 'mustard', name: 'Mustard', icon: '🌼' },
    { id: 'bajra', name: 'Bajra', icon: '🌾' },
  ],
  punjab: [
    { id: 'wheat', name: 'Wheat', icon: '🌾' },
    { id: 'rice', name: 'Rice', icon: '🌾' },
    { id: 'maize', name: 'Maize', icon: '🌽' },
  ],
  'uttar-pradesh': [
    { id: 'wheat', name: 'Wheat', icon: '🌾' },
    { id: 'rice', name: 'Rice', icon: '🌾' },
    { id: 'sugarcane', name: 'Sugarcane', icon: '🎋' },
  ],
}

export default function CropSelector({ state, onSelect, onBack }: CropSelectorProps) {
  const crops = cropsByState[state] || []

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-primary hover:text-primary/80 flex items-center gap-2"
      >
        ← Back to States
      </button>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Select Your Crop
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <button
            key={crop.id}
            onClick={() => onSelect(crop.id)}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 text-center border-2 border-transparent hover:border-primary"
          >
            <div className="text-6xl mb-4">{crop.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800">
              {crop.name}
            </h3>
          </button>
        ))}
      </div>
    </div>
  )
}
