'use client'

import React from 'react'
import Image from 'next/image'
import type { ComparisonItemProps } from '@/app/types/common'

const ComparisonItem = ({ imageUrl, title, description }: ComparisonItemProps) => {
  return (
    <div className="flex gap-[6px] items-center overflow-hidden">
      <div className="rounded-md size-9 shrink-0 overflow-hidden bg-gray-placeholder">
        <Image
          src={imageUrl}
          alt={title}
          width={36}
          height={36}
          className="object-cover w-full h-full"
          unoptimized={imageUrl.startsWith('http://localhost:')}
        />
      </div>
      <div className="flex-col flex-1 min-w-0">
        <p className="font-bold text-[13px] text-gray-003 truncate">
          {title}
        </p>
        <p className="font-regular text-16 text-gray-secondary truncate">
          {description}
        </p>
      </div>
    </div>
  )
}

export default ComparisonItem

