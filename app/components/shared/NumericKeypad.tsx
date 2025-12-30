'use client'

import React from 'react'

interface NumericKeypadProps {
  onNumberClick: (num: string) => void
  onBackspace: () => void
  onDoubleZero: () => void
}

const NumericKeypad = ({ onNumberClick, onBackspace, onDoubleZero }: NumericKeypadProps) => {
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  // 공통 버튼 클래스
  const baseButtonClass = "py-2 transition-colors rounded-lg"
  const numberButtonClass = "bg-white text-24 font-bold hover:bg-gray-002"
  const backspaceButtonClass = "bg-gray-003 text-white hover:bg-gray-004 flex-center"

  return (
    <div className="w-full flex-col gap-2 bg-gray-002 p-4 rounded-lg">
      {/* 1-9 숫자 버튼 */}
      <div className="grid grid-cols-3 gap-2">
        {numbers.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onNumberClick(num)}
            className={`${baseButtonClass} ${numberButtonClass}`}
          >
            {num}
          </button>
        ))}
      </div>
      
      {/* 하단 행: 00, 0, 백스페이스 */}
      <div className="grid grid-cols-3 gap-2">
        {/* 00 버튼 */}
        <button
          type="button"
          onClick={onDoubleZero}
          className="bg-white rounded-lg text-24 font-bold py-2 hover:bg-gray-002 transition-colors"
        >
          00
        </button>
        
        {/* 0 버튼 */}
        <button
          type="button"
          onClick={() => onNumberClick('0')}
          className="bg-white rounded-lg text-24 font-bold py-2 hover:bg-gray-002 transition-colors"
        >
          0
        </button>
        
        {/* 백스페이스 버튼 */}
        <button
          type="button"
          onClick={onBackspace}
          className={`${baseButtonClass} ${backspaceButtonClass}`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 9H7.83L10.41 6.41L9 5L4 10L9 15L10.41 13.59L7.83 11H16V9Z"
              fill="currentColor"
            />
            <rect x="15" y="3" width="3" height="14" rx="1" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default NumericKeypad

