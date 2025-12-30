'use client'

import PriceForm from '@/app/components/shared/PriceForm'
import Button from '@/app/components/shared/Button'

const FormPage = () => {
  const handleComplete = () => {
    // TODO: 완료 로직 구현
    console.log('완료 버튼 클릭됨')
  }

  return (
    <div className="flex-col justify-center min-h-[calc(100vh-200px)] relative">
      <PriceForm />
      <div className="fixed bottom-9 left-0 right-0 z-40 px-8">
        <div className="w-full flex mx-auto" style={{ maxWidth: 'var(--max-width-mobile)' }}>
          <Button text="완료했어요" onClick={handleComplete} />
        </div>
      </div>
    </div>
  )
}

export default FormPage
