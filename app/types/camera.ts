export interface ResultData {
  appropriatePrice: number
  priceDifference: number
  riskLevel: string
  servings: string
  estimatedWeight: string
  isProhibited: boolean
  hygieneInfo?: string // 위생정보 (isProhibited가 false일 때만 사용)
}


