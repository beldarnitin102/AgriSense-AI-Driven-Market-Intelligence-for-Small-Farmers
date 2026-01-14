'use client'

interface StateSelectorProps {
  onSelect: (state: string) => void
}

const states = [
  { id: 'maharashtra', name: 'Maharashtra', icon: '🌾' },
  { id: 'karnataka', name: 'Karnataka', icon: '🌾' },
  { id: 'rajasthan', name: 'Rajasthan', icon: '🌾' },
  { id: 'punjab', name: 'Punjab', icon: '🌾' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', icon: '🌾' },
]

export default function StateSelector({ onSelect }: StateSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Select Your State
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {states.map((state) => (
          <button
            key={state.id}
            onClick={() => onSelect(state.id)}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-8 text-center border-2 border-transparent hover:border-primary"
          >
            <div className="text-6xl mb-4">{state.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800">
              {state.name}
            </h3>
          </button>
        ))}
      </div>
    </div>
  )
}
