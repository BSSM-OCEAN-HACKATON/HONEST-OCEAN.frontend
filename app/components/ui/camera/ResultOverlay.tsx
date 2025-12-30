'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import InfoCard from '@/app/components/shared/InfoCard'
import Button from '@/app/components/shared/Button'
import { useMerchantRecordList } from '@/app/hooks/useMerchantRecordList'
import { getMerchantPrice } from '@/app/lib/utils/merchantPriceStorage'
import type { ResultData } from '@/app/types/camera'

interface ResultOverlayProps {
  data: ResultData
  seafoodType?: string
  onPurchase: () => void
  onBrowse: () => void
}

const ResultOverlay = ({ data, seafoodType, onPurchase, onBrowse }: ResultOverlayProps) => {
  // React Query로 상인 기록 가져오기
  const { data: merchantData } = useMerchantRecordList(1, 100)
  const records = merchantData?.data.record || []

  // 같은 종류의 해산물 필터링
  const sameTypeRecords = useMemo(() => {
    if (!seafoodType) return []
    return records
      .filter((record) => record.stats.seafoodType === seafoodType)
      .slice(0, 3) // 최대 3개만 표시
  }, [records, seafoodType])

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] max-h-[75vh]">
      <div className="flex-col gap-[36px] px-[30px] pt-[36px] pb-9 overflow-y-auto">
        {/* 적정가 정보 */}
        <div className="flex-col gap-[4px] animate-fade-in-up">
          <p className="font-bold text-24 text-gray-003 text-center">
            적정가 {data.appropriatePrice.toLocaleString()}원
          </p>
          <p className="font-regular text-16 text-gray-secondary leading-[1.3] text-center">
            상인이 <span style={{ color: data.priceDifference <= 0 ? '#089700' : '#EB4343' }}>
              {(Math.abs(data.priceDifference) / 100 + 1).toFixed(1)}배
            </span> 더{' '}
            <span style={{ color: data.priceDifference <= 0 ? '#089700' : '#EB4343' }}>
              {data.priceDifference <= 0 ? '낮은' : '높은'}
            </span>
            {' '}가격을 제시했어요.
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
        {sameTypeRecords.length > 0 && (
          <div className="flex-col gap-[12px] animate-fade-in-up-delay-2">
            <p className="font-bold text-14 text-gray-003">
              오늘 본 {seafoodType}와 비교하기
            </p>
            <div className="h-px bg-gray-002" />
            {sameTypeRecords.length === 1 ? (
              <p className="text-gray-secondary text-14 text-center py-4">
                오늘 본 {seafoodType}가 이것뿐이네요!<br />
                다른 곳도 둘러보시면 좋을 것 같아요.
              </p>
            ) : (
              <>
                <p className="text-gray-secondary text-14">
                  오늘 {sameTypeRecords.length}곳에서 {seafoodType}를 보셨네요!<br />
                  가격을 비교해보세요.
                </p>
                <div className="flex-col gap-[12px]">
                  {sameTypeRecords.map((record) => {
                    const merchantPrice = getMerchantPrice(record.recordId)
                    const actualPrice = merchantPrice !== null ? merchantPrice : record.stats.marketPrice
                    const priceDiff = record.stats.marketPrice > 0
                      ? Math.round(((actualPrice - record.stats.marketPrice) / record.stats.marketPrice) * 100)
                      : 0

                    let priceComment = ''
                    if (priceDiff > 20) {
                      priceComment = '가격이 높아요'
                    } else if (priceDiff > 0) {
                      priceComment = '가격이 조금 높아요'
                    } else if (priceDiff === 0) {
                      priceComment = '적정가예요'
                    } else if (priceDiff > -20) {
                      priceComment = '가격이 저렴해요'
                    } else {
                      priceComment = '가격이 아주 저렴해요!'
                    }

                    const isValidImageUrl = record.image &&
                      (record.image.startsWith('http://') ||
                       record.image.startsWith('https://') ||
                       record.image.startsWith('/'))

                    return (
                      <div
                        key={record.recordId}
                        className="flex gap-3 items-center p-3 bg-gray-001 rounded-[12px]"
                      >
                        <div className="rounded-md size-12 shrink-0 overflow-hidden bg-gray-placeholder">
                          <Image
                            src={isValidImageUrl ? record.image : '/fish/Go.webp'}
                            alt={seafoodType || '해산물'}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            unoptimized={record.image?.startsWith('http://localhost:')}
                          />
                        </div>
                        <div className="flex-col gap-1 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-14 text-gray-003">
                              {record.merchantWeight}kg
                            </span>
                            <span className="font-bold text-16 text-gray-003">
                              {actualPrice.toLocaleString()}원
                            </span>
                          </div>
                          <p className="text-12 text-gray-secondary">
                            {priceComment}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

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

