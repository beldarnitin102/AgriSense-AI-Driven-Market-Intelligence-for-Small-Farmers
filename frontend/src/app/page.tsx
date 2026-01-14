'use client'

import { useState } from 'react'
import StateSelector from '@/components/StateSelector'
import CropSelector from '@/components/CropSelector'
import QueryForm from '@/components/QueryForm'
import RecommendationCard from '@/components/RecommendationCard'

export default function Home() {
  const [step, setStep] = useState<'state' | 'crop' | 'query' | 'results'>('state')
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedCrop, setSelectedCrop] = useState<string>('')
  const [recommendation, setRecommendation] = useState<any>(null)

  const handleStateSelect = (state: string) => {
    setSelectedState(state)
    setStep('crop')
  }

  const handleCropSelect = (crop: string) => {
    setSelectedCrop(crop)
    setStep('query')
  }

  const handleQuerySubmit = async (data: any) => {
    setRecommendation(data)
    setStep('results')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Farmer Market Intelligence
          </h1>
          <p className="text-gray-600">
            Get the best price for your crops
          </p>
        </header>

        {step === 'state' && (
          <StateSelector onSelect={handleStateSelect} />
        )}

        {step === 'crop' && (
          <CropSelector
            state={selectedState}
            onSelect={handleCropSelect}
            onBack={() => setStep('state')}
          />
        )}

        {step === 'query' && (
          <QueryForm
            state={selectedState}
            crop={selectedCrop}
            onSubmit={handleQuerySubmit}
            onBack={() => setStep('crop')}
          />
        )}

        {step === 'results' && recommendation && (
          <RecommendationCard
            data={recommendation}
            onNewSearch={() => setStep('state')}
          />
        )}
      </div>
    </main>
  )
}
