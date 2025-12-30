'use client'

import { useState } from 'react'
import Button from '@/app/components/shared/Button'
import StarRating from '@/app/components/shared/StarRating'

const CompletePage = () => {
  const [rating, setRating] = useState(0)

  return (
    <div className="flex-col min-h-screen items-center justify-center px-8" style={{ maxWidth: 'var(--max-width-mobile)' }}>
      <div className="flex-col gap-3 items-center">
        <p className="font-bold text-20 text-center">
          위생이 마음에 들었나요?
        </p>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>
      <div className="fixed bottom-20 left-8 right-8 z-40 flex" style={{ maxWidth: 'var(--max-width-mobile)' }}>
        <Button text="완료했어요" onClick={() => console.log('별점:', rating)} variant="primary" />
      </div>
    </div>
  )
}

export default CompletePage

