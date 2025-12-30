'use client'

import React from 'react'
import InfoCardValue from './InfoCardValue'

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

