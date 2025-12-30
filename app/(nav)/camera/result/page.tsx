'use client'

import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ProhibitedOverlay from '@/app/components/ui/camera/ProhibitedOverlay'
import ResultOverlay from '@/app/components/ui/camera/ResultOverlay'
import { useCameraStore } from '@/app/store/cameraStore'
import { mockCameraResultData } from '@/app/lib/mocks/cameraResult'
import type { ResultData } from '@/app/types/camera'

const ResultPage = () => {
  const router = useRouter()
  const { capturedImage, fishAnalysis, formData } = useCameraStore()

  // API 응답과 Form 데이터를 결합하여 ResultData 생성
  const data = useMemo<ResultData>(() => {
    if (!fishAnalysis || !formData) {
      // 데이터가 없으면 mock 데이터 사용
      return mockCameraResultData
    }

    // 시장 가격 대비 상인이 제안한 개당 가격의 차이 계산 (%)
    const priceDifference = fishAnalysis.marketPrice > 0
      ? Math.round(((formData.pricePerItem - fishAnalysis.marketPrice) / fishAnalysis.marketPrice) * 100)
      : 0

    // 위험도 계산
    let riskLevel = '낮음'
    if (priceDifference > 30) {
      riskLevel = '높음'
    } else if (priceDifference > 10) {
      riskLevel = '중간'
    }

    // 추정 무게를 기반으로 인분 계산 (1인분 = 200g 기준)
    const servingsCount = Math.max(1, Math.round(fishAnalysis.estimatedWeight / 200))
    const servings = `${servingsCount}인분`

    return {
      appropriatePrice: fishAnalysis.marketPrice,
      priceDifference,
      riskLevel,
      servings,
      estimatedWeight: `${fishAnalysis.estimatedWeight}kg`,
      isProhibited: fishAnalysis.currentlyForbidden,
      hygieneInfo: fishAnalysis.currentlyForbidden ? undefined : '위생 상태 양호',
      comparisons: mockCameraResultData.comparisons, // TODO: 실제 비교 데이터로 교체
    }
  }, [fishAnalysis, formData])

  const handlePurchase = () => {
    router.push('/camera/complete')
  }

  const handleBrowse = () => {
    // TODO: 둘러보기 로직 구현
    console.log('둘러보기 버튼 클릭됨')
  }

  const handleExit = () => {
    router.back()
  }

  const handleReport = () => {
    // TODO: 제보하기 로직 구현
    console.log('제보하기 버튼 클릭됨')
  }

  return (
    <div className="relative flex-col h-screen overflow-hidden">
      {/* 배경 - 이미지가 있으면 이미지, 없으면 검은색 */}
      <div className="fixed inset-0 bg-black -z-10">
        {capturedImage && (
          <Image
            src={capturedImage}
            alt="촬영한 사진"
            fill
            className="object-cover"
            unoptimized={capturedImage.startsWith('data:')}
            priority
          />
        )}
      </div>

      {/* 오버레이 - 금지체장이면 검은색, 아니면 하얀색 */}
      {data.isProhibited ? (
        <ProhibitedOverlay onExit={handleExit} onReport={handleReport} />
      ) : (
        <ResultOverlay data={data} onPurchase={handlePurchase} onBrowse={handleBrowse} />
      )}
    </div>
  )
}

export default ResultPage
