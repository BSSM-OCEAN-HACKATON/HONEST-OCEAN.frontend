'use client'

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import ProhibitedOverlay from '@/app/components/ui/camera/ProhibitedOverlay'
import ResultOverlay from '@/app/components/ui/camera/ResultOverlay'
import { mockCameraResultData } from '@/app/lib/mocks/cameraResult'

function ResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const imageSrc = searchParams.get('image') || ''

  // TODO: 실제 데이터로 교체 필요
  const data = mockCameraResultData

  const handlePurchase = () => {
    // 완료 페이지로 이동
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
        {imageSrc && (
          <Image
            src={imageSrc}
            alt="촬영한 사진"
            fill
            className="object-cover"
            unoptimized={imageSrc.startsWith('data:')}
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

const ResultPage = () => {
  return (
    <Suspense fallback={<div className="flex-col min-h-screen bg-black" />}>
      <ResultContent />
    </Suspense>
  )
}

export default ResultPage
