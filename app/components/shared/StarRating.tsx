'use client'

import { useState } from 'react'
import Image from 'next/image'

interface StarRatingProps {
  rating?: number
  onRatingChange?: (rating: number) => void
  maxRating?: number
}

const StarRating = ({ rating: initialRating = 0, onRatingChange, maxRating = 5 }: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating)
  const [hover, setHover] = useState(0)
  const [dragging, setDragging] = useState(false)

  const updateRating = (index: number) => {
    const newRating = index + 1
    setRating(newRating)
    onRatingChange?.(newRating)
  }

  const handleMove = (index: number) => {
    if (dragging) updateRating(index)
    else setHover(index + 1)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || !e.touches[0]) return
    const target = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)
    const button = target?.closest('button')
    const index = button ? Array.from(button.parentElement?.children || []).indexOf(button) : -1
    if (index >= 0 && index < maxRating) updateRating(index)
  }

  return (
    <div 
      className="flex gap-1.5 items-center h-12 w-60 justify-between"
      onMouseLeave={() => !dragging && setHover(0)}
      onMouseUp={() => { setDragging(false); setHover(0) }}
      onTouchEnd={() => { setDragging(false); setHover(0) }}
    >
      {Array.from({ length: maxRating }).map((_, i) => {
        const display = hover || rating
        return (
          <button
            key={i}
            onClick={() => updateRating(i)}
            onMouseEnter={() => setHover(i + 1)}
            onMouseDown={() => { setDragging(true); updateRating(i) }}
            onMouseMove={() => handleMove(i)}
            onTouchStart={() => { setDragging(true); updateRating(i) }}
            onTouchMove={handleTouchMove}
            className="w-12 h-12 flex items-center justify-center cursor-pointer"
            style={{ touchAction: 'none' }}
            aria-label={`${i + 1}점`}
          >
            <Image
              src={i < display ? '/icon/star/1.svg' : '/icon/star/0.svg'}
              alt={`${i + 1}점`}
              width={48}
              height={48}
              className="w-full h-full"
              priority={i === 0}
            />
          </button>
        )
      })}
    </div>
  )
}

export default StarRating

