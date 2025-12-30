'use client'

import Image from 'next/image'
import React from 'react'

interface QuantityButtonsProps {
  onIncrement?: () => void
  onDecrement?: () => void
}

const QuantityButtons = ({ onIncrement, onDecrement }: QuantityButtonsProps) => {
  return (
    <div
      className="flex-row gap-[5px] items-center opacity-0 animate-fade-in"
    >
      <button
        onClick={onDecrement}
        className="w-12 h-12"
        aria-label="감소"
      >
        <Image
          src="/button/minus.svg"
          alt="minus"
          width={48}
          height={51}
          className="w-full h-full"
        />
      </button>
      <button
        onClick={onIncrement}
        className="w-12 h-12"
        aria-label="증가"
      >
        <Image
          src="/button/plus.svg"
          alt="plus"
          width={48}
          height={51}
          className="w-full h-full"
        />
      </button>
    </div>
  )
}

export default QuantityButtons

