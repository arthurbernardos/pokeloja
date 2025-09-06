'use client'

import { createContext, useContext, ReactNode, useCallback } from 'react'

interface AnalyticsContextType {
  trackEvent: (eventType: string, eventData?: any) => void
  trackPageView: (page: string) => void
  trackProductView: (productId: number, productName: string) => void
  trackCategoryClick: (category: string) => void
  trackSearch: (query: string, filters?: any) => void
  trackAddToCart: (productId: number, quantity: number) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

// Generate session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('sessionId')
  if (!sessionId) {
    sessionId = Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem('sessionId', sessionId)
  }
  return sessionId
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const trackEvent = useCallback(async (eventType: string, eventData?: any) => {
    try {
      const userId = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')!).id 
        : null

      await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: eventType,
          event_data: eventData,
          user_id: userId,
          session_id: getSessionId()
        }),
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }
  }, [])

  const trackPageView = useCallback((page: string) => {
    trackEvent('page_view', { page })
  }, [trackEvent])

  const trackProductView = useCallback((productId: number, productName: string) => {
    trackEvent('product_view', { productId, productName })
  }, [trackEvent])

  const trackCategoryClick = useCallback((category: string) => {
    trackEvent('category_click', { category })
  }, [trackEvent])

  const trackSearch = useCallback((query: string, filters?: any) => {
    trackEvent('search', { query, filters })
  }, [trackEvent])

  const trackAddToCart = useCallback((productId: number, quantity: number) => {
    trackEvent('add_to_cart', { productId, quantity })
  }, [trackEvent])

  return (
    <AnalyticsContext.Provider value={{
      trackEvent,
      trackPageView,
      trackProductView,
      trackCategoryClick,
      trackSearch,
      trackAddToCart
    }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}