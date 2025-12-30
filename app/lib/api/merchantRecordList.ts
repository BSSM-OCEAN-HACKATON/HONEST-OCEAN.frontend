import { MerchantRecordListResponse } from '@/app/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

export async function getMerchantRecordList(
  page: number = 1,
  size: number = 10
): Promise<MerchantRecordListResponse> {
  const apiUrl = `${API_BASE_URL}/api/v1/merchant/records?page=${page}&size=${size}`
  console.log('API URL:', apiUrl)

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`Failed to get merchant record list: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
