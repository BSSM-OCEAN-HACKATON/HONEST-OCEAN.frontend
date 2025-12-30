import { create } from 'zustand'
import { SeafoodStats } from '@/app/types/api'

interface FormData {
  totalPrice: number
  quantity: number
  pricePerItem: number
}

interface CameraStore {
  // 촬영된 이미지
  capturedImage: string | null
  setCapturedImage: (image: string | null) => void

  // API 응답 데이터
  fishAnalysis: SeafoodStats | null
  setFishAnalysis: (data: SeafoodStats | null) => void

  // Form 데이터
  formData: FormData | null
  setFormData: (data: FormData | null) => void

  // 로딩 상태
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // 에러 상태
  error: string | null
  setError: (error: string | null) => void

  // 초기화
  reset: () => void
}

export const useCameraStore = create<CameraStore>((set) => ({
  capturedImage: null,
  setCapturedImage: (image) => set({ capturedImage: image }),

  fishAnalysis: null,
  setFishAnalysis: (data) => set({ fishAnalysis: data }),

  formData: null,
  setFormData: (data) => set({ formData: data }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  error: null,
  setError: (error) => set({ error }),

  reset: () =>
    set({
      capturedImage: null,
      fishAnalysis: null,
      formData: null,
      isLoading: false,
      error: null,
    }),
}))
