'use client'

import React from 'react'

interface ButtonProps {
  text: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

const Button = ({ text, onClick, variant = 'primary' }: ButtonProps) => {
  const baseClasses = 'flex-center rounded-[12px] flex-1 h-[45px] px-[23px] py-[10px]'
  const variantClasses = variant === 'primary' 
    ? 'bg-gray-003 text-white' 
    : 'bg-gray-002 text-[#292929]'
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses}`}
      onClick={onClick}
    >
      <p className="font-regular text-20">
        {text}
      </p>
    </button>
  )
}

export default Button