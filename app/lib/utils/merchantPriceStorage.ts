// 로컬 스토리지에 상인 가격 정보를 저장하고 조회하는 유틸리티

const STORAGE_KEY = 'merchant_prices'

interface MerchantPriceData {
  recordId: string
  merchantPrice: number
  timestamp: number
}

/**
 * recordId와 상인이 제안한 가격을 로컬 스토리지에 저장
 */
export function saveMerchantPrice(recordId: string, merchantPrice: number): void {
  try {
    const existingData = getAllMerchantPrices()

    const newData: MerchantPriceData = {
      recordId,
      merchantPrice,
      timestamp: Date.now(),
    }

    // 기존 데이터에 새 데이터 추가 (같은 recordId가 있으면 업데이트)
    const updatedData = {
      ...existingData,
      [recordId]: newData,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
    console.log(`상인 가격 저장 완료 - recordId: ${recordId}, price: ${merchantPrice}`)
  } catch (error) {
    console.error('상인 가격 저장 실패:', error)
  }
}

/**
 * recordId로 상인 가격 조회
 */
export function getMerchantPrice(recordId: string): number | null {
  try {
    const allData = getAllMerchantPrices()
    const data = allData[recordId]

    if (data) {
      return data.merchantPrice
    }

    return null
  } catch (error) {
    console.error('상인 가격 조회 실패:', error)
    return null
  }
}

/**
 * 모든 상인 가격 데이터 조회
 */
function getAllMerchantPrices(): Record<string, MerchantPriceData> {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
    return {}
  } catch (error) {
    console.error('로컬 스토리지 읽기 실패:', error)
    return {}
  }
}

/**
 * 특정 recordId의 데이터 삭제
 */
export function removeMerchantPrice(recordId: string): void {
  try {
    const allData = getAllMerchantPrices()
    delete allData[recordId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData))
    console.log(`상인 가격 삭제 완료 - recordId: ${recordId}`)
  } catch (error) {
    console.error('상인 가격 삭제 실패:', error)
  }
}

/**
 * 모든 상인 가격 데이터 삭제
 */
export function clearAllMerchantPrices(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log('모든 상인 가격 데이터 삭제 완료')
  } catch (error) {
    console.error('상인 가격 데이터 삭제 실패:', error)
  }
}

/**
 * 오래된 데이터 정리 (30일 이상 된 데이터)
 */
export function cleanupOldMerchantPrices(): void {
  try {
    const allData = getAllMerchantPrices()
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)

    const cleanedData = Object.entries(allData).reduce((acc, [recordId, data]) => {
      if (data.timestamp > thirtyDaysAgo) {
        acc[recordId] = data
      }
      return acc
    }, {} as Record<string, MerchantPriceData>)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedData))
    console.log('오래된 상인 가격 데이터 정리 완료')
  } catch (error) {
    console.error('데이터 정리 실패:', error)
  }
}
