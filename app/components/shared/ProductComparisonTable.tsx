'use client'

import React from 'react'
import Image from 'next/image'
import InfoCardValue from './InfoCardValue'
import { useProductSelectionStore } from '@/stores/useProductSelectionStore'
import type { ProductComparisonTableProps } from '@/app/types/product'

const ProductComparisonTable = ({ 
  title, 
  showTitle = false, 
  rows, 
  tableIndex = 0,
  isSelecting = false 
}: ProductComparisonTableProps) => {
  const { toggleProduct, isSelected } = useProductSelectionStore()

  const handleRowClick = (rowIndex: number) => {
    if (isSelecting) {
      toggleProduct(tableIndex, rowIndex)
    }
  }

  return (
    <div className="w-full flex-col gap-2">
      {title && (
        <>
          <h3 className="font-bold text-20 text-gray-003">
            {title}
          </h3>
          <div className="h-px w-full bg-gray-002" />
        </>
      )}
      <div className="flex-col gap-2">
        {/* 헤더 */}
        {showTitle && (
          <div className="grid grid-cols-[36px_1fr_1fr_1fr] gap-[10px] items-center">
            <p className="font-bold text-12 text-gray-003">
              사진
            </p>
            <p className="font-bold text-12 text-gray-003 text-center">
              예상무게
            </p>
            <p className="font-bold text-12 text-gray-003 text-center">
              상인 제시가
            </p>
            <p className="font-bold text-12 text-gray-003 text-center">
              가격 차이
            </p>
          </div>
        )}
        {/* 데이터 행들 */}
        {rows.map((row, rowIndex) => {
          const selected = isSelecting && isSelected(tableIndex, rowIndex)

          return (
            <div
              key={rowIndex}
              className={`grid grid-cols-[36px_1fr_1fr_1fr] gap-[10px] items-center ${isSelecting ? 'cursor-pointer' : ''}`}
              onClick={() => handleRowClick(rowIndex)}
            >
              <div className="rounded-md size-9 overflow-hidden bg-gray-placeholder">
                {selected ? (
                  <Image
                    src="/icon/check/check.svg"
                    alt="선택됨"
                    width={36}
                    height={36}
                    className="w-full h-full"
                    unoptimized
                  />
                ) : (
                  <Image
                    src={row.imageUrl}
                    alt={`상품 ${rowIndex + 1}`}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                    unoptimized={row.imageUrl.startsWith('http://localhost:')}
                  />
                )}
              </div>
              <div className="text-center">
                <InfoCardValue value={row.estimatedWeight} />
              </div>
              <div className="text-center">
                <InfoCardValue value={row.merchantPrice} />
              </div>
              <div className="text-center">
                <InfoCardValue value={row.priceDifference} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductComparisonTable

