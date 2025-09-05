"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface NavigationContextType {
  isNavigationHidden: boolean
  toggleNavigation: () => void
  hideNavigation: () => void
  showNavigation: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigationHidden, setIsNavigationHidden] = useState(false)

  // Persist state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('navigation-hidden')
    if (saved !== null) {
      setIsNavigationHidden(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('navigation-hidden', JSON.stringify(isNavigationHidden))
  }, [isNavigationHidden])

  const toggleNavigation = () => {
    setIsNavigationHidden(prev => !prev)
  }

  const hideNavigation = () => {
    setIsNavigationHidden(true)
  }

  const showNavigation = () => {
    setIsNavigationHidden(false)
  }

  return (
    <NavigationContext.Provider
      value={{
        isNavigationHidden,
        toggleNavigation,
        hideNavigation,
        showNavigation,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
} 