import { AnalyzeFishRequest, AnalyzeFishResponse } from '@/app/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

export async function analyzeFish(request: AnalyzeFishRequest): Promise<AnalyzeFishResponse> {
  const formData = new FormData()
  formData.append('image', request.image)
  formData.append('fishLength', request.fishLength.toString())

  const apiUrl = `${API_BASE_URL}/api/v1/fish/analyze`
  console.log('API URL:', apiUrl)
  console.log('FormData:', { fishLength: request.fishLength, imageSize: request.image.size })

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`Failed to analyze fish: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
