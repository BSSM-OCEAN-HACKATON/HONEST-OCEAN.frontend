import React from 'react'

interface ButtonProps {
  text: string
  onClick: () => void
}

const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button className='bg-gray-003 text-white flex-center rounded-md w-full py-2'>{text}</button>
  )
}

export default Button