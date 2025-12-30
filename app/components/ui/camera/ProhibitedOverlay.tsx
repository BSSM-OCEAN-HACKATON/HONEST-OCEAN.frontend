'use client'

import React from 'react'
import Button from '@/app/components/shared/Button'

interface ProhibitedOverlayProps {
  onExit: () => void
  onReport: () => void
}

const ProhibitedOverlay = ({ onExit, onReport }: ProhibitedOverlayProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-004 rounded-t-[32px]">
      <div className="flex-col gap-[36px] px-[30px] pt-[36px] pb-9 min-h-full">
        {/* 금지 메시지 */}
        <div className="flex-col gap-[12px] animate-fade-in-up">
          <p className="font-bold text-24 text-white text-center">
            해당 상품은 판매 금지 대상입니다.
          </p>
          <div className="flex-col gap-[4px]">
            <p className="font-regular text-16 text-gray-secondary leading-normal text-center whitespace-pre-line">
              {`해당 수산물은 수산자원관리법에 의거하여
포획 및 유통이 금지된 체장 미달 개체입니다.
소중한 해양 생태계 보전을 위하여 해당 수산물의
구매를 자제하여 주시기 바랍니다.`}
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-[9px] animate-fade-in-up-delay-1">
          <Button text="나가기" onClick={onExit} variant="primary" />
          <Button text="제보하기" onClick={onReport} variant="secondary" />
        </div>
      </div>
    </div>
  )
}

export default ProhibitedOverlay

