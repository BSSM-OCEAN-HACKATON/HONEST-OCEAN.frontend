import { MerchantRecordSaveRequest, MerchantRecordSaveResponse } from '@/app/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

export async function saveMerchantRecord(
  request: MerchantRecordSaveRequest
): Promise<MerchantRecordSaveResponse> {
  const formData = new FormData()
  formData.append('image', request.image)
  formData.append('seafoodType', request.seafoodType)
  formData.append('marketPrice', request.marketPrice.toString())
  formData.append('estimatedWeight', request.estimatedWeight.toString())
  formData.append('merchantWeight', request.merchantWeight.toString())
  formData.append('latitude', request.latitude.toString())
  formData.append('longitude', request.longitude.toString())

  const apiUrl = `${API_BASE_URL}/api/v1/merchant/record`
  console.log('API URL:', apiUrl)
  console.log('FormData:', {
    seafoodType: request.seafoodType,
    marketPrice: request.marketPrice,
    estimatedWeight: request.estimatedWeight,
    merchantWeight: request.merchantWeight,
    latitude: request.latitude,
    longitude: request.longitude,
  })

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`Failed to save merchant record: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
