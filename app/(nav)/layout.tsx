'use client'

import { usePathname } from 'next/navigation'
import TabBar from '../components/ui/TabBar'

export default function NavLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  // 패딩이 필요 없는 페이지들
  const noPaddingPages = ['/camera/scan', '/camera/result']
  const needsPadding = !noPaddingPages.includes(pathname)

  return (
    <div className="mx-auto min-h-screen flex flex-col bg-white overflow-x-hidden" style={{ maxWidth: 'var(--max-width-mobile)' }}>
      <main className={`flex-1 overflow-x-hidden ${needsPadding ? 'px-8 pt-9' : ''}`}>
        {children}
      </main>
      <TabBar />
    </div>
  )
}
