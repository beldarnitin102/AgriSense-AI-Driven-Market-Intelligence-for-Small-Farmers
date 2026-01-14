import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface RecommendationRequest {
  state: string
  crop: string
  location: string
  quantity: number
}

export const getRecommendation = async (data: RecommendationRequest) => {
  const response = await api.post('/recommendation', data)
  return response.data
}

export const getAnalytics = async (state: string, dateRange: { start: string; end: string }) => {
  const response = await api.get('/analytics', {
    params: { state, ...dateRange },
  })
  return response.data
}

export default api
