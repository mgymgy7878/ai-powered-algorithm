import { useMemo } from 'react'

// View cache for better performance
const viewCache = new Map<string, JSX.Element>()

export const useViewCache = (viewKey: string, renderFunction: () => JSX.Element, dependencies: any[] = []) => {
  return useMemo(() => {
    const cacheKey = `${viewKey}-${JSON.stringify(dependencies)}`
    
    if (viewCache.has(cacheKey)) {
      return viewCache.get(cacheKey)!
    }
    
    const element = renderFunction()
    viewCache.set(cacheKey, element)
    
    // Clear old cache entries to prevent memory leaks
    if (viewCache.size > 10) {
      const firstKey = viewCache.keys().next().value
      viewCache.delete(firstKey)
    }
    
    return element
  }, [viewKey, ...dependencies])
}

export const clearViewCache = () => {
  viewCache.clear()
}