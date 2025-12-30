'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface TabBarGradientContextType {
  enabled: boolean
  setEnabled: (enabled: boolean) => void
  children: ReactNode | null
  setChildren: (children: ReactNode | null) => void
}

const TabBarGradientContext = createContext<TabBarGradientContextType | undefined>(undefined)

export const useTabBarGradient = () => {
  const context = useContext(TabBarGradientContext)
  if (!context) {
    throw new Error('useTabBarGradient must be used within TabBarGradientProvider')
  }
  return context
}

interface TabBarGradientProviderProps {
  children: ReactNode
}

export const TabBarGradientProvider = ({ children }: TabBarGradientProviderProps) => {
  const [enabled, setEnabled] = useState(false) // 디폴트는 꺼져있음
  const [gradientChildren, setGradientChildren] = useState<ReactNode | null>(null)

  return (
    <TabBarGradientContext.Provider
      value={{
        enabled,
        setEnabled,
        children: gradientChildren,
        setChildren: setGradientChildren,
      }}
    >
      {children}
    </TabBarGradientContext.Provider>
  )
}

