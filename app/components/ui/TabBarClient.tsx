'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

type TabRoute = '/' | '/map' | '/camera/scan' | '/save'

interface Tab {
  label: string
  iconPath: string
  href: TabRoute
}

interface TabBarClientProps {
  tabs: Tab[]
}

const TabBarClient = ({ tabs }: TabBarClientProps) => {
  const pathname = usePathname()

  const renderedTabs = useMemo(() => {
    // 모든 카메라 페이지에서 TabBar 숨김
    if (pathname?.startsWith('/camera')) {
      return null
    }

    return (
      <nav className='bg-white w-full px-8 py-7 fixed bottom-0 left-1/2 -translate-x-1/2' style={{ maxWidth: 'var(--max-width-mobile)', zIndex: 9999 }}>
        <ul className='flex justify-around items-center w-full'>
          {tabs.map((tab) => {
            const isSelected = pathname === tab.href
            return (
              <li key={tab.href}>
                <Link href={tab.href} className='flex items-center justify-center'>
                  <Image
                    src={`${tab.iconPath}/${isSelected ? '1' : '0'}.svg`}
                    alt={tab.label}
                    width={24}
                    height={24}
                    priority
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }, [pathname, tabs])

  return renderedTabs
}

export default TabBarClient

