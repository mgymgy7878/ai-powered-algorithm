import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useWebSocketMonitoring } from '@/hooks/useWebSocketMonitoring'
import { useNetworkPerformance } from '@/hooks/useNetworkPerformance'
import { 
  Activity, 
  Wifi, 
  Zap, 
  Clock, 
  TrendingUp,
  Server,
  Gauge,
  Play,
  Square,
  RotateCcw
} from 'lucide-react'

interface RealTimeMonitorProps {
  className?: string
}

export function RealTimeMonitor({ className }: RealTimeMonitorProps) {
  const {
    connectionHealth,
    performanceMetrics,
    getHealthStatus,
    formatUptime
  } = useWebSocketMonitoring(1000)

  const {
    performance,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    reset,
    formatBytes,
    formatBytesPerSecond,
    formatUptime: formatNetworkUptime,
    getLatencyStatus,
    getLatencyColor
  } = useNetworkPerformance(1000)

  const [historicalData, setHistoricalData] = useState<{
    timestamps: Date[]
    latencies: number[]
    throughputs: number[]
    packetRates: number[]
  }>({
    timestamps: [],
    latencies: [],
    throughputs: [],
    packetRates: []
  })

  // Store historical data for charts
  useEffect(() => {
    if (performance.latency > 0 || performance.throughput > 0) {
      setHistoricalData(prev => {
        const maxPoints = 50 // Keep last 50 data points
        const newTimestamps = [...prev.timestamps, new Date()].slice(-maxPoints)
        const newLatencies = [...prev.latencies, performance.latency].slice(-maxPoints)
        const newThroughputs = [...prev.throughputs, performance.throughput].slice(-maxPoints)
        const newPacketRates = [...prev.packetRates, performance.packetsPerSecond].slice(-maxPoints)

        return {
          timestamps: newTimestamps,
          latencies: newLatencies,
          throughputs: newThroughputs,
          packetRates: newPacketRates
        }
      })
    }
  }, [performance])

  const healthStatus = getHealthStatus()
  const latencyStatus = getLatencyStatus()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'excellent':
        return <Badge className="bg-green-500 text-white">Mükemmel</Badge>
      case 'good':
        return <Badge className="bg-blue-500 text-white">İyi</Badge>
      case 'warning':
      case 'fair':
        return <Badge className="bg-yellow-500 text-white">Orta</Badge>
      case 'critical':
      case 'poor':
        return <Badge variant="destructive">Kötü</Badge>
      default:
        return <Badge variant="secondary">Bilinmiyor</Badge>
    }
  }

  const calculateThroughputProgress = () => {
    // Normalize throughput to 0-100 scale (assuming 1MB/s as max)
    const maxThroughput = 1024 * 1024 // 1MB/s
    return Math.min((performance.throughput / maxThroughput) * 100, 100)
  }

  const calculateLatencyProgress = () => {
    // Inverse progress - lower latency is better
    // Scale 0-500ms to 100-0%
    const maxLatency = 500
    const progress = 100 - Math.min((performance.latency / maxLatency) * 100, 100)
    return Math.max(progress, 0)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Gerçek Zamanlı Sistem İzleme</h2>
          <p className="text-muted-foreground text-sm">WebSocket ve ağ performansı canlı takibi</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isMonitoring ? "destructive" : "default"}
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            size="sm"
          >
            {isMonitoring ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Dur
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Başlat
              </>
            )}
          </Button>
          <Button variant="outline" onClick={reset} size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Sıfırla
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connection Health */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Bağlantı Sağlığı</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {connectionHealth.healthyConnections}/{connectionHealth.totalConnections}
            </div>
            {getStatusBadge(healthStatus)}
          </CardContent>
        </Card>

        {/* Network Latency */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Ağ Gecikmesi</span>
            </div>
            <div className={`text-2xl font-bold mb-1 ${getLatencyColor()}`}>
              {performance.latency}ms
            </div>
            {getStatusBadge(latencyStatus)}
          </CardContent>
        </Card>

        {/* Data Throughput */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Veri Hızı</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatBytesPerSecond(performance.throughput)}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatBytes(performance.bytesReceived)} toplam
            </div>
          </CardContent>
        </Card>

        {/* Connection Uptime */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Çalışma Süresi</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {formatNetworkUptime(performance.connectionUptime)}
            </div>
            <div className="text-xs text-muted-foreground">
              {performance.packetsPerSecond.toFixed(1)} paket/s
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="w-5 h-5" />
              Gecikme Performansı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Mevcut Gecikme</span>
                <span className={`font-bold ${getLatencyColor()}`}>{performance.latency}ms</span>
              </div>
              <Progress 
                value={calculateLatencyProgress()} 
                className="h-2"
              />
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div>Min: {Math.min(...historicalData.latencies) || 0}ms</div>
                <div>Ort: {(historicalData.latencies.reduce((a, b) => a + b, 0) / historicalData.latencies.length || 0).toFixed(1)}ms</div>
                <div>Max: {Math.max(...historicalData.latencies) || 0}ms</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Throughput Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Server className="w-5 h-5" />
              Veri İşleme Hızı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Anlık Hız</span>
                <span className="font-bold">{formatBytesPerSecond(performance.throughput)}</span>
              </div>
              <Progress 
                value={calculateThroughputProgress()} 
                className="h-2"
              />
              <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div>Min: {formatBytesPerSecond(Math.min(...historicalData.throughputs) || 0)}</div>
                <div>Ort: {formatBytesPerSecond(historicalData.throughputs.reduce((a, b) => a + b, 0) / historicalData.throughputs.length || 0)}</div>
                <div>Max: {formatBytesPerSecond(Math.max(...historicalData.throughputs) || 0)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Detaylı Metrikler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">WebSocket Bağlantıları</div>
              <div className="text-xl font-bold">{performanceMetrics.totalConnections}</div>
              <div className="text-xs text-muted-foreground">
                {connectionHealth.issues.length} sorun
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Yeniden Bağlanma</div>
              <div className="text-xl font-bold">{performanceMetrics.reconnectAttempts}</div>
              <div className="text-xs text-muted-foreground">
                toplam deneme
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Paket İstatistikleri</div>
              <div className="text-xl font-bold">{performance.packetsPerSecond.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">
                paket/saniye
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Son Güncelleme</div>
              <div className="text-xl font-bold">
                {performance.lastUpdate.toLocaleTimeString('tr-TR', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="text-xs text-muted-foreground">
                canlı izleme
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      {!isMonitoring && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Sistem İzleme Kapalı</h3>
            <p className="text-muted-foreground mb-4">
              Gerçek zamanlı performans takibi için izlemeyi başlatın
            </p>
            <Button onClick={startMonitoring}>
              <Play className="w-4 h-4 mr-2" />
              İzlemeyi Başlat
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}