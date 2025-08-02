// Debug utilities for troubleshooting the application

export const debugLog = (location: string, message: string, data?: any) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] 🔍 ${location}: ${message}`, data ? data : '')
}

export const checkWindowGlobals = () => {
  const globals = {
    pushNotification: typeof (window as any).pushNotification,
    spark: typeof (window as any).spark,
    location: window.location.href,
    userAgent: navigator.userAgent
  }
  
  debugLog('WINDOW_GLOBALS', 'Current window state', globals)
  return globals
}

export const safePushNotification = (message: string, type: string = 'info') => {
  if (typeof (window as any).pushNotification === 'function') {
    try {
      ;(window as any).pushNotification(message, type)
      debugLog('NOTIFICATION', `Sent: ${message}`, { type })
      return true
    } catch (error) {
      console.error('❌ Error sending notification:', error)
      return false
    }
  } else {
    debugLog('NOTIFICATION', `Failed to send (function not available): ${message}`, { 
      type, 
      available: typeof (window as any).pushNotification 
    })
    return false
  }
}

export const waitForFunction = (
  funcName: string, 
  maxWaitMs: number = 10000,
  checkIntervalMs: number = 100
): Promise<boolean> => {
  return new Promise((resolve) => {
    const startTime = Date.now()
    
    const checkFunction = () => {
      if (typeof (window as any)[funcName] === 'function') {
        debugLog('WAIT_FUNCTION', `${funcName} is now available`)
        resolve(true)
        return
      }
      
      if (Date.now() - startTime > maxWaitMs) {
        debugLog('WAIT_FUNCTION', `Timeout waiting for ${funcName}`)
        resolve(false)
        return
      }
      
      setTimeout(checkFunction, checkIntervalMs)
    }
    
    checkFunction()
  })
}

export const initDebugMode = () => {
  // Add debug info to window for easy access
  ;(window as any).debugUtils = {
    checkWindowGlobals,
    safePushNotification,
    debugLog
  }
  
  debugLog('DEBUG_MODE', 'Debug utilities initialized')
}