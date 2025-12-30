'use client'

import { useRouter } from 'next/navigation'
import WebCamCamera from '@/app/components/ui/camera/WebCamCamera'
import { useCameraStore } from '@/app/store/cameraStore'
import { analyzeFish } from '@/app/lib/api/analyzeFish'

const CameraPage = () => {
  const router = useRouter()
  const { setCapturedImage, setFishAnalysis, setIsLoading, setError } = useCameraStore()

  const handleCapture = async (imageSrc: string) => {
    try {
      // public/fish/Go.webp 파일 사용
      const fishImagePath = '/fish/Go.webp'
      const response = await fetch(fishImagePath)
      const blob = await response.blob()
      const file = new File([blob], 'Go.webp', { type: 'image/webp' })

      // 이미지 URL을 저장 (result 페이지에서 표시용)
      setCapturedImage(fishImagePath)

      // 즉시 form 페이지로 이동
      router.push('/camera/form')

      // 백그라운드에서 API 호출 (응답을 기다리지 않음)
      setIsLoading(true)
      console.log('Calling API with fishLength: 30')
      analyzeFish({
        image: file,
        fishLength: 30,
      })
        .then((result) => {
          console.log('API Response:', result)
          setFishAnalysis(result.data)
          setError(null)
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
          console.error('Fish analysis failed:', err)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
      console.error('Image loading failed:', err)
    }
  }

  return <WebCamCamera onCapture={handleCapture} />
}

export default CameraPage
