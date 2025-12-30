'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import InfoCard from '@/app/components/shared/InfoCard'
import ComparisonItem from '@/app/components/shared/ComparisonItem'
import Button from '@/app/components/shared/Button'

const ResultPage = () => {
  const searchParams = useSearchParams()
  const imageSrc = searchParams.get('image') || ''

  // TODO: 실제 데이터로 교체 필요
  const data = {
    appropriatePrice: 7000,
    priceDifference: 35,
    riskLevel: '높음',
    servings: '1인분',
    estimatedWeight: '115g',
    hygieneInfo: '긍정',
    comparisons: [
      {
        imageUrl: 'http://localhost:3845/assets/0290102799cfa74d3afcb3b79ae44a54e5c2a286.png',
        title: '붉은 대게 전문점',
        description: '가격 대비 가장 양이 많아요'
      },
      {
        imageUrl: 'http://localhost:3845/assets/681affa9dd4b508f1fcea147ed31f0f6b68382b6.png',
        title: '등붉은 대게 전문점',
        description: '가격은 가장 높지만 신선도 높아요'
      },
      {
        imageUrl: 'http://localhost:3845/assets/ad587fabb06d9e765c38c434b534d106fb0bbbbc.png',
        title: '푸른박스 대게점',
        description: '신선도와 가격 모두 낮아요'
      }
    ]
  }

  const handlePurchase = () => {
    // TODO: 구매 로직 구현
    console.log('구매했어요 버튼 클릭됨')
  }

  const handleBrowse = () => {
    // TODO: 둘러보기 로직 구현
    console.log('둘러보기 버튼 클릭됨')
  }

  return (
    <div className="flex-col min-h-screen" style={{ maxWidth: 'var(--max-width-mobile)' }}>
      {/* 배경 - 이미지가 있으면 이미지, 없으면 검은색 */}
      <div className="relative h-[346px] bg-black">
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

      {/* 하얀색 오버레이 */}
      <div className="bg-white flex-1" style={{ borderTopLeftRadius: '32px', borderTopRightRadius: '32px' }}>
        <div className="flex-col gap-[36px] px-[30px] pt-[36px] pb-[36px]">
          {/* 적정가 정보 */}
          <div className="flex-col gap-[4px]">
            <p className="font-bold text-24 text-[#292929] text-center">
              적정가 {data.appropriatePrice.toLocaleString()}원
            </p>
            <p className="font-regular text-16 text-[#808080] leading-[1.3]">
              상인이 제시한 가격이 적정가보다 {data.priceDifference}% 높아요.
            </p>
          </div>

          {/* 정보 카드 그리드 */}
          <div className="flex gap-[9px] items-center">
            <InfoCard label="바가지 위험도" value={data.riskLevel} />
            <InfoCard label="인분" value={data.servings} />
            <InfoCard label="예상무게" value={data.estimatedWeight} />
            <InfoCard label="위생정보" value={data.hygieneInfo} />
          </div>

          {/* 비교 섹션 */}
          <div className="flex-col gap-[12px]">
            <p className="font-bold text-14 text-[#292929]">
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
          <div className="flex gap-[9px]">
            <Button text="구매했어요" onClick={handlePurchase} variant="primary" />
            <Button text="둘러보기" onClick={handleBrowse} variant="secondary" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultPage

