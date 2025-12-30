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

// MerchantRecordSave API 타입 정의

export interface MerchantRecordSaveRequest {
  image: File
  seafoodType: string
  marketPrice: number
  estimatedWeight: number
  merchantWeight: number
  latitude: number
  longitude: number
}

export interface Record {
  recordId: number
  msg: string
}

export interface MerchantRecordSaveResponse {
  status: string
  data: Record
}
