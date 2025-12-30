'use client'

import { useState } from 'react'
import StarRating from '@/app/components/shared/StarRating'
import Button from '@/app/components/shared/Button'
import { useRouter } from 'next/navigation'

const CompletePage = () => {
  const [rating, setRating] = useState(0)
  const router = useRouter()
  return (
    <div className="flex-col min-h-screen items-center justify-center">
      <div className="flex-col gap-3 items-center">
        <p className="font-bold text-20 text-center">
          위생이 마음에 들었나요?
        </p>
        <StarRating rating={rating} onRatingChange={setRating} />
      </div>
      <div className="fixed bottom-9 left-0 right-0 z-40 px-9">
        <div className="w-full flex mx-auto" style={{ maxWidth: 'var(--max-width-mobile)' }}>
          <Button text="완료했어요" onClick={() => router.push('/')} variant="primary" />
        </div>
      </div>
    </div>
  )
}

export default CompletePage
