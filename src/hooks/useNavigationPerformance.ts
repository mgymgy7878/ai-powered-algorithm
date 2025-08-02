import { useEffect, useRef } from 'react'

export function useNavigationPerformance(currentView: string) {
  const navigationStartTime = useRef<number>(Date.now())
  const lastView = useRef<string>('')

  useEffect(() => {
    if (lastView.current !== currentView) {
      const loadTime = Date.now() - navigationStartTime.current
      
      // Performance monitoring
      console.log(`Navigation to ${currentView} took ${loadTime}ms`)
      
      // Track navigation performance
      if (loadTime > 1000) {
        console.warn(`Slow navigation detected: ${currentView} (${loadTime}ms)`)
        
        // Send notification if available
        if ((window as any).pushNotification) {
          ;(window as any).pushNotification(
            `⚠️ Sayfa yavaş yüklendi: ${currentView} (${loadTime}ms)`, 
            'warning'
          )
        }
      }
      
      // Update refs
      lastView.current = currentView
      navigationStartTime.current = Date.now()
    }
  }, [currentView])

  return { navigationStartTime: navigationStartTime.current }
}