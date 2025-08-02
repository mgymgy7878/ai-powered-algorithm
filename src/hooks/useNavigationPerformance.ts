import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  viewChangeTime: number
  renderTime: number
  totalTime: number
}

export const useNavigationPerformance = (currentView: string) => {
  const startTimeRef = useRef<number>(0)
  const metricsRef = useRef<Map<string, PerformanceMetrics>>(new Map())

  useEffect(() => {
    // Mark start time when view changes
    startTimeRef.current = performance.now()

    return () => {
      // Calculate metrics on cleanup
      const endTime = performance.now()
      const totalTime = endTime - startTimeRef.current

      const metrics: PerformanceMetrics = {
        viewChangeTime: totalTime,
        renderTime: totalTime,
        totalTime
      }

      metricsRef.current.set(currentView, metrics)

      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`📊 Navigation Performance - ${currentView}:`, {
          'View Change Time': `${totalTime.toFixed(2)}ms`,
          'Average': metricsRef.current.size > 0 
            ? `${Array.from(metricsRef.current.values())
                .reduce((acc, m) => acc + m.totalTime, 0) / metricsRef.current.size}ms`
            : 'N/A'
        })
      }
    }
  }, [currentView])

  return {
    getMetrics: () => metricsRef.current,
    clearMetrics: () => metricsRef.current.clear()
  }
}