// AnalyzeFish API 타입 정의

export interface SeafoodStats {
  seafoodType: string
  marketPrice: number
  estimatedWeight: number
  currentlyForbidden: boolean
}

export interface AnalyzeFishRequest {
  image: File
  fishLength: number
}

export interface AnalyzeFishResponse {
  status: string
  data: SeafoodStats
}
