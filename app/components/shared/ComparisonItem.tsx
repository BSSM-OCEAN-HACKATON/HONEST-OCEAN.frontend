'use client'

import React from 'react'
import Image from 'next/image'

interface ComparisonItemProps {
  imageUrl: string
  title: string
  description: string
}

const ComparisonItem = ({ imageUrl, title, description }: ComparisonItemProps) => {
  return (
    <div className="flex gap-[6px] items-center">
      <div className="relative rounded-[6px] size-[36px] overflow-hidden bg-[#d9d9d9]">
        <Image
          src={imageUrl}
          alt={title}
          width={36}
          height={36}
          className="absolute object-cover rounded-[6px] size-full"
          unoptimized={imageUrl.startsWith('http://localhost:')}
        />
      </div>
      <div className="flex-col w-[294px]">
        <p className="font-bold text-[13px] text-[#292929]">
          {title}
        </p>
        <p className="font-regular text-16 text-[#808080]">
          {description}
        </p>
      </div>
    </div>
  )
}

export default ComparisonItem

