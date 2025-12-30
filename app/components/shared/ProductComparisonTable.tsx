'use client'

import React from 'react'
import Image from 'next/image'
import InfoCardValue from './InfoCardValue'
import { useProductSelectionStore } from '@/stores/useProductSelectionStore'

interface ProductComparisonRow {
  imageUrl: string
  estimatedWeight: string
  merchantPrice: string
  hygiene: string
}

interface ProductComparisonTableProps {
  title?: string
  showTitle?: boolean
  rows: ProductComparisonRow[]
  tableIndex?: number
  isSelecting?: boolean
}

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
          <div className="flex gap-[10px] items-center">
            <p className="font-bold text-12 text-gray-003 w-9 shrink-0">
              사진
            </p>
            <p className="font-bold text-12 text-gray-003 text-center flex-1">
              예상무게
            </p>
            <p className="font-bold text-12 text-gray-003 text-center flex-1">
              상인 제시가
            </p>
            <p className="font-bold text-12 text-gray-003 text-center flex-1">
              위생
            </p>
          </div>
        )}
        {/* 데이터 행들 */}
        {rows.map((row, rowIndex) => {
          const selected = isSelecting && isSelected(tableIndex, rowIndex)
          
          return (
            <div 
              key={rowIndex} 
              className={`flex gap-[9px] items-center ${isSelecting ? 'cursor-pointer' : ''}`}
              onClick={() => handleRowClick(rowIndex)}
            >
              <div className="rounded-md size-9 shrink-0 overflow-hidden bg-gray-placeholder">
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
              <div className="flex-1">
                <InfoCardValue value={row.estimatedWeight} />
              </div>
              <div className="flex-1">
                <InfoCardValue value={row.merchantPrice} />
              </div>
              <div className="flex-1">
                <InfoCardValue value={row.hygiene} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductComparisonTable

