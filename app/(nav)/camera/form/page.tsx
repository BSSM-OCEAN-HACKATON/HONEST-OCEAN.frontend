'use client'

import { useRouter } from 'next/navigation'
import { useState, useMemo, useEffect } from 'react'
import QuantityButtons from '@/app/components/shared/QuantityButtons'
import NumericKeypad from '@/app/components/shared/NumericKeypad'
import Button from '@/app/components/shared/Button'
import { useCameraStore } from '@/app/store/cameraStore'

const FormPage = () => {
  const router = useRouter()
  const { setFormData, fishAnalysis } = useCameraStore()

  const [totalPrice, setTotalPrice] = useState<number>(8000)
  const [quantity, setQuantity] = useState<number>(1)
  const [showKeypad, setShowKeypad] = useState<boolean>(false)
  const [isFirstInput, setIsFirstInput] = useState<boolean>(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  const pricePerItem = useMemo(() => {
    return quantity > 0 ? Math.floor(totalPrice / quantity) : 0
  }, [totalPrice, quantity])

  // 위치 정보 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          console.log('위치 정보:', position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error('위치 정보 가져오기 실패:', error)
          // 기본값 설정 (서울시청)
          setLocation({
            latitude: 37.5665,
            longitude: 126.9780,
          })
        }
      )
    }
  }, [])

  const handleComplete = () => {
    // Form 데이터 저장
    setFormData({
      totalPrice,
      quantity,
      pricePerItem,
      merchantWeight: fishAnalysis?.estimatedWeight || 0,
      latitude: location?.latitude || 37.5665,
      longitude: location?.longitude || 126.9780,
    })

    // result 페이지로 이동
    router.push('/camera/result')
  }

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleNumberClick = (num: string) => {
    if (isFirstInput) {
      setIsFirstInput(false)
      setTotalPrice(parseInt(num))
    } else {
      setTotalPrice((prev) => prev * 10 + parseInt(num))
    }
  }

  const handleBackspace = () => {
    setTotalPrice((prev) => Math.floor(prev / 10))
  }

  const handleDoubleZero = () => {
    setTotalPrice((prev) => prev * 100)
  }

  return (
    <div className="flex-col justify-center min-h-[calc(100vh-200px)] relative">
      <div className="flex-col gap-8">
        {/* 상인이 제안한 전체 가격 */}
        <div className="flex-col gap-1 animate-fade-in-up">
          <label className="text-20 text-gray-003">상인이 제안한 전체 가격</label>
          <button
            type="button"
            onClick={() => {
              setShowKeypad(!showKeypad)
              setIsFirstInput(true)
            }}
            className="text-left text-40 font-bold hover:opacity-80 transition-opacity"
          >
            {totalPrice.toLocaleString()}원
          </button>
        </div>

        {/* 숫자 키패드 오버레이 */}
        {showKeypad && (
          <div className="fixed inset-0 z-50" onClick={() => {
            setShowKeypad(false)
            setIsFirstInput(false)
          }}>
            <div
              className="fixed bottom-0 left-0 right-0 animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <NumericKeypad
                onNumberClick={handleNumberClick}
                onBackspace={handleBackspace}
                onDoubleZero={handleDoubleZero}
              />
            </div>
          </div>
        )}

        {/* 구매할 상품의 갯수 */}
        <div className="flex-col gap-1 space-between animate-fade-in-up-delay-1">
          <label className="text-20 text-gray-003">구매할 상품의 갯수</label>
          <div className="flex-row items-center gap-2 justify-between font-bold">
            <span className="text-40">{quantity}개</span>
            <QuantityButtons onIncrement={handleIncrement} onDecrement={handleDecrement} />
          </div>
        </div>

        {/* 상인이 제안한 개당 가격 */}
        <div className="flex-col gap-1 animate-fade-in-up-delay-2">
          <label className="text-20 text-gray-003">상인이 제안한 개당 가격</label>
          <div className="text-40 font-bold">{pricePerItem.toLocaleString()}원</div>
        </div>
      </div>

      <div className="fixed bottom-9 left-0 right-0 z-40 px-9">
        <div className="w-full flex mx-auto" style={{ maxWidth: 'var(--max-width-mobile)' }}>
          <Button text="완료했어요" onClick={handleComplete} />
        </div>
      </div>
    </div>
  )
}

export default FormPage
