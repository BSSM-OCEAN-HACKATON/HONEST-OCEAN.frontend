'use client'

import React from 'react'
import type { ButtonProps } from '@/app/types/common'

const Button = ({ text, onClick, variant = 'primary', fullWidth = true }: ButtonProps) => {
  const baseClasses = `flex-center rounded-[12px] px-[23px] py-[10px] ${fullWidth ? 'flex-1' : ''}`
  const variantClasses = variant === 'primary'
    ? 'bg-gray-003 text-white'
    : variant === 'dark'
    ? 'bg-gray-004 text-white'
    : 'bg-gray-002 text-[#292929]'

  return (
    <button
      className={`${baseClasses} ${variantClasses}`}
      onClick={onClick}
    >
      <span className="font-regular text-20">
        {text}
      </span>
    </button>
  )
}

export default Button