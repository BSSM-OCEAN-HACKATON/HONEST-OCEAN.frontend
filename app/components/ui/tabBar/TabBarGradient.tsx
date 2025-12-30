'use client'

import { useTabBarGradient } from './TabBarGradientContext'

const TabBarGradient = () => {
  const { enabled, children } = useTabBarGradient()

  return (
    <>
      {enabled && (
        <div
          className='fixed left-1/2 -translate-x-1/2 py-4 flex items-center justify-center px-9'
          style={{
            maxWidth: 'var(--max-width-mobile)',
            zIndex: 9998, // TabBar보다 1 낮게 설정
            bottom: '94px', // TabBar 실제 높이
            width: '100%',
            background: 'linear-gradient(0deg, #FFF 71.15%, rgba(255, 255, 255, 0.00) 100%)',
            pointerEvents: 'none' // 클릭 이벤트 방지
          }}
        >
          <div className="w-full flex items-center justify-center" style={{ pointerEvents: 'auto' }}>
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default TabBarGradient

