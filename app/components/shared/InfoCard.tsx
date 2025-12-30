'use client'

import React from 'react'

interface InfoCardValueProps {
  value: string
}

const InfoCardValue = ({ value }: InfoCardValueProps) => {
  return (
    <div className="bg-gray-002 flex items-center justify-center px-[23px] py-[10px] rounded-[12px] font-regular text-16 text-gray-003 truncate">
      {value}
    </div>
  )
}

interface InfoCardProps {
  label: string
  value: string
}

const InfoCard = ({ label, value }: InfoCardProps) => {
  return (
    <div className="flex-col flex-1 justify-between h-[57px] min-w-0">
      <p className="font-bold text-12 text-gray-003 text-center whitespace-nowrap">
        {label}
      </p>
      <InfoCardValue value={value} />
    </div>
  )
}

export default InfoCard

