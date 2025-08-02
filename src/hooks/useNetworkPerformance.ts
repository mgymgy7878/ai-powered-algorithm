import { useState, useEffect, useCallback } from 'react'

interface NetworkPerformance {
  latency: number
  throughput: number
  packetsPerSecond: number
  bytesReceived: number
  connectionUptime: number
  lastUpdate: Date
}

export function useNetworkPerformance(updateInterval: number = 1000) {
  const [performance, setPerformance] = useState<NetworkPerformance>({
    latency: 0,
    throughput: 0,
    packetsPerSecond: 0,
    bytesReceived: 0,
    connectionUptime: 0,
    lastUpdate: new Date()
  })

  const [isMonitoring, setIsMonitoring] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [packetCount, setPacketCount] = useState(0)
  const [totalBytes, setTotalBytes] = useState(0)

  // Network latency measurement using Performance API
  const measureLatency = useCallback(async (): Promise<number> => {
    const start = performance.now()
    
    try {
      // Ping Binance API for latency measurement
      const response = await fetch('https://api.binance.com/api/v3/ping', {
        method: 'GET',
        cache: 'no-cache'
      })
      
      if (response.ok) {
        const end = performance.now()
        return Math.round(end - start)
      }
    } catch (error) {
      console.warn('Latency measurement failed:', error)
    }
    
    return 0
  }, [])

  // WebSocket message interceptor for throughput calculation
  const interceptWebSocketMessages = useCallback(() => {
    if (typeof window === 'undefined') return

    const originalWebSocket = window.WebSocket
    let messageCount = 0
    let byteCount = 0
    let lastCountTime = Date.now()

    // Override WebSocket constructor
    window.WebSocket = class extends originalWebSocket {
      constructor(url: string | URL, protocols?: string | string[]) {
        super(url, protocols)

        this.addEventListener('message', (event) => {
          messageCount++
          
          // Estimate message size
          let messageSize = 0
          if (typeof event.data === 'string') {
            messageSize = new Blob([event.data]).size
          } else if (event.data instanceof ArrayBuffer) {
            messageSize = event.data.byteLength
          } else if (event.data instanceof Blob) {
            messageSize = event.data.size
          }
          
          byteCount += messageSize
          setPacketCount(messageCount)
          setTotalBytes(byteCount)
        })
      }
    }

    return () => {
      window.WebSocket = originalWebSocket
    }
  }, [])

  const startMonitoring = useCallback(() => {
    if (isMonitoring) return

    setIsMonitoring(true)
    setStartTime(Date.now())
    setPacketCount(0)
    setTotalBytes(0)

    // Set up message interception
    const cleanup = interceptWebSocketMessages()

    return cleanup
  }, [isMonitoring, interceptWebSocketMessages])

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
  }, [])

  // Update performance metrics
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(async () => {
      try {
        const latency = await measureLatency()
        const now = Date.now()
        const uptime = startTime > 0 ? now - startTime : 0
        const seconds = uptime / 1000

        // Calculate packets per second
        const pps = seconds > 0 ? packetCount / seconds : 0

        // Calculate throughput (bytes per second)
        const throughput = seconds > 0 ? totalBytes / seconds : 0

        setPerformance({
          latency,
          throughput,
          packetsPerSecond: pps,
          bytesReceived: totalBytes,
          connectionUptime: uptime,
          lastUpdate: new Date()
        })
      } catch (error) {
        console.error('Performance measurement error:', error)
      }
    }, updateInterval)

    return () => {
      clearInterval(interval)
    }
  }, [isMonitoring, startTime, packetCount, totalBytes, measureLatency, updateInterval])

  // Format functions
  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  const formatBytesPerSecond = useCallback((bps: number): string => {
    return formatBytes(bps) + '/s'
  }, [formatBytes])

  const formatUptime = useCallback((uptime: number): string => {
    const seconds = Math.floor(uptime / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }, [])

  const getLatencyStatus = useCallback((): 'excellent' | 'good' | 'fair' | 'poor' => {
    const { latency } = performance
    
    if (latency === 0) return 'poor'
    if (latency < 50) return 'excellent'
    if (latency < 100) return 'good'
    if (latency < 200) return 'fair'
    return 'poor'
  }, [performance])

  const getLatencyColor = useCallback((): string => {
    const status = getLatencyStatus()
    
    switch (status) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'fair': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }, [getLatencyStatus])

  // Reset all metrics
  const reset = useCallback(() => {
    setPacketCount(0)
    setTotalBytes(0)
    setStartTime(Date.now())
    setPerformance({
      latency: 0,
      throughput: 0,
      packetsPerSecond: 0,
      bytesReceived: 0,
      connectionUptime: 0,
      lastUpdate: new Date()
    })
  }, [])

  return {
    performance,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    reset,
    formatBytes,
    formatBytesPerSecond,
    formatUptime,
    getLatencyStatus,
    getLatencyColor
  }
}