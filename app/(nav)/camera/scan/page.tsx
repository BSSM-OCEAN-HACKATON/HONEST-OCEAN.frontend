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
      // 실제 촬영한 이미지를 저장 (result 페이지 배경용)
      setCapturedImage(imageSrc)

      // 즉시 form 페이지로 이동
      router.push('/camera/form')

      // 목 데이터 사용 (API 토큰 절약)
      setIsLoading(true)
      console.log('Using mock data instead of API')

      // 목 데이터 설정 (약간의 지연으로 실제 API 호출처럼 보이게)
      setTimeout(() => {
        const mockData = {
          seafoodType: '고등어',
          marketPrice: 3850,
          estimatedWeight: 0.22,
          currentlyForbidden: false, // false: 정상, true: 금지체장
        }
        setFishAnalysis(mockData)
        setError(null)
        setIsLoading(false)
        console.log('Mock data loaded:', mockData)
      }, 1000)

      // // API 전송용으로는 public/fish/Go.webp 파일 사용
      // const fishImagePath = '/fish/Go.webp'
      // const response = await fetch(fishImagePath)
      // const blob = await response.blob()
      // const file = new File([blob], 'Go.webp', { type: 'image/webp' })

      // // 백그라운드에서 API 호출 (응답을 기다리지 않음)
      // setIsLoading(true)
      // console.log('Calling API with fishLength: 30')
      // analyzeFish({
      //   image: file,
      //   fishLength: 30,
      // })
      //   .then((result) => {
      //     console.log('API Response:', result)
      //     setFishAnalysis(result.data)
      //     setError(null)
      //   })
      //   .catch((err) => {
      //     setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
      //     console.error('Fish analysis failed:', err)
      //   })
      //   .finally(() => {
      //     setIsLoading(false)
      //   })
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다')
      console.error('Image loading failed:', err)
    }
  }

  return <WebCamCamera onCapture={handleCapture} />
}

export default CameraPage
