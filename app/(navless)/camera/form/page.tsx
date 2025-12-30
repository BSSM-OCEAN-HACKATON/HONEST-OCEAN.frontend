'use client'

import PriceForm from '@/app/components/shared/PriceForm'
import Button from '@/app/components/shared/Button'
import React from 'react'

const page = () => {
  const handleComplete = () => {
    // TODO: 완료 로직 구현
    console.log('완료 버튼 클릭됨')
  }

  return (
    <div className="flex-col justify-center min-h-[calc(100vh-200px)] relative">
      <PriceForm />

      {/* 완료 버튼 - 바닥에서 안전한 거리만큼 위에 고정 */}
      <div className="fixed bottom-24 left-8 right-8 z-40">
        <Button text="완료했어요" onClick={handleComplete} />
      </div>
    </div>
  )
}

export default page