'use client'

import { useEffect, useCallback } from 'react'
import { useTabBarGradient } from '@/app/components/ui/TabBarGradientContext'
import Button from '@/app/components/shared/Button'

export default function SavePage() {
  const { setEnabled, setChildren } = useTabBarGradient()

  const handleSelectProducts = useCallback(() => {
    // TODO: 구매할 상품 선택 로직 구현
    console.log('구매할 상품 선택하기')
  }, [])

  useEffect(() => {
    setChildren(
      <Button 
        text="구매할 상품 선택하기" 
        onClick={handleSelectProducts} 
        variant="primary"
      />
    )
    setEnabled(true)

    return () => {
      setEnabled(false)
      setChildren(null)
    }
  }, [setEnabled, setChildren, handleSelectProducts])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      {/* TabBarGradient에 버튼이 표시됨 */}
    </div>
  )
}

