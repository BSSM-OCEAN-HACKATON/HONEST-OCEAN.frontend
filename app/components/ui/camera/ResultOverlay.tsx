'use client'

import React from 'react'
import InfoCard from '@/app/components/shared/InfoCard'
import ComparisonItem from '@/app/components/shared/ComparisonItem'
import Button from '@/app/components/shared/Button'
import type { ResultData } from '@/app/types/camera'

interface ResultOverlayProps {
  data: ResultData
  onPurchase: () => void
  onBrowse: () => void
}

const ResultOverlay = ({ data, onPurchase, onBrowse }: ResultOverlayProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] max-h-[75vh]">
      <div className="flex-col gap-[36px] px-[30px] pt-[36px] pb-9 overflow-y-auto">
        {/* 적정가 정보 */}
        <div className="flex-col gap-[4px] animate-fade-in-up">
          <p className="font-bold text-24 text-gray-003 text-center">
            적정가 {data.appropriatePrice.toLocaleString()}원
          </p>
          <p className="font-regular text-16 text-gray-secondary leading-[1.3]">
            상인이 제시한 가격이 적정가보다 {data.priceDifference}% 높아요.
          </p>
        </div>

        {/* 정보 카드 그리드 */}
        <div className="flex gap-[9px] items-center animate-fade-in-up-delay-1">
          <InfoCard label="바가지 위험도" value={data.riskLevel} />
          <InfoCard label="인분" value={data.servings} />
          <InfoCard label="예상무게" value={data.estimatedWeight} />
          {data.hygieneInfo && (
            <InfoCard label="위생정보" value={data.hygieneInfo} />
          )}
        </div>

        {/* 비교 섹션 */}
        <div className="flex-col gap-[12px] animate-fade-in-up-delay-2">
          <p className="font-bold text-14 text-gray-003">
            오늘 본 대게와 비교하기
          </p>
          <div className="h-px bg-gray-002" />
          <div className="flex-col gap-[12px]">
            {data.comparisons.map((item, index) => (
              <ComparisonItem
                key={index}
                imageUrl={item.imageUrl}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-[9px] animate-fade-in-up-delay-3">
          <Button text="구매했어요" onClick={onPurchase} variant="primary" />
          <Button text="둘러보기" onClick={onBrowse} variant="secondary" />
        </div>
      </div>
    </div>
  )
}

export default ResultOverlay

