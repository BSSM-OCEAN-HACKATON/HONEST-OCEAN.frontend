'use client'

import React from 'react'

interface InfoCardValueProps {
  value: string
}

const InfoCardValue = ({ value }: InfoCardValueProps) => {
  return (
    <div className="bg-gray-002 flex items-center justify-center px-[23px] py-2 rounded-[12px] font-regular text-16 text-gray-003 truncate">
      {value}
    </div>
  )
}

export default InfoCardValue

