import { useState, useEffect, useCallback } from 'react'
import { websocketService } from '@/services/websocketService'

interface ConnectionHealth {
  totalConnections: number
  healthyConnections: number
  issues: string[]
  timestamp: Date
}

interface PerformanceMetrics {
  totalConnections: number
  dataReceived: number
  reconnectAttempts: number
  uptime: number
  timestamp: Date
}

export function useWebSocketMonitoring(updateInterval: number = 5000) {
  const [connectionHealth, setConnectionHealth] = useState<ConnectionHealth>({
    totalConnections: 0,
    healthyConnections: 0,
    issues: [],
    timestamp: new Date()
  })
  
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    totalConnections: 0,
    dataReceived: 0,
    reconnectAttempts: 0,
    uptime: 0,
    timestamp: new Date()
  })
  
  const [activeConnections, setActiveConnections] = useState<string[]>([])

  const updateMetrics = useCallback(() => {
    // Connection health check
    const health = websocketService.getConnectionHealth()
    setConnectionHealth({
      ...health,
      timestamp: new Date()
    })

    // Performance metrics
    const metrics = websocketService.getPerformanceMetrics()
    setPerformanceMetrics({
      ...metrics,
      timestamp: new Date()
    })

    // Active connections
    setActiveConnections(websocketService.getActiveConnections())
  }, [])

  useEffect(() => {
    // Initial update
    updateMetrics()

    // Set up interval for periodic updates
    const interval = setInterval(updateMetrics, updateInterval)

    return () => {
      clearInterval(interval)
    }
  }, [updateMetrics, updateInterval])

  const getConnectionStatus = useCallback((streamId: string) => {
    return websocketService.getConnectionStatus(streamId)
  }, [])

  const disconnectStream = useCallback((streamId: string) => {
    websocketService.disconnect(streamId)
    updateMetrics() // Update immediately after disconnect
  }, [updateMetrics])

  const disconnectAll = useCallback(() => {
    websocketService.disconnectAll()
    updateMetrics() // Update immediately after disconnect
  }, [updateMetrics])

  const formatUptime = useCallback((uptime: number): string => {
    const seconds = Math.floor(uptime / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}s ${minutes % 60}d ${seconds % 60}s`
    } else if (minutes > 0) {
      return `${minutes}d ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }, [])

  const getHealthStatus = useCallback((): 'healthy' | 'warning' | 'critical' => {
    const { totalConnections, healthyConnections } = connectionHealth
    
    if (totalConnections === 0) return 'healthy'
    
    const healthPercentage = (healthyConnections / totalConnections) * 100
    
    if (healthPercentage === 100) return 'healthy'
    if (healthPercentage >= 80) return 'warning'
    return 'critical'
  }, [connectionHealth])

  return {
    connectionHealth,
    performanceMetrics,
    activeConnections,
    getConnectionStatus,
    disconnectStream,
    disconnectAll,
    formatUptime,
    getHealthStatus,
    refreshMetrics: updateMetrics
  }
}