import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useWebSocketMonitoring } from '@/hooks/useWebSocketMonitoring'
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  RefreshCw,
  X
} from 'lucide-react'

interface WebSocketStatusProps {
  className?: string
  compact?: boolean
}

export function WebSocketStatus({ className, compact = false }: WebSocketStatusProps) {
  const {
    connectionHealth,
    performanceMetrics,
    activeConnections,
    getConnectionStatus,
    disconnectStream,
    disconnectAll,
    formatUptime,
    getHealthStatus,
    refreshMetrics
  } = useWebSocketMonitoring(2000) // Update every 2 seconds

  const healthStatus = getHealthStatus()

  const getStatusIcon = () => {
    switch (healthStatus) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'critical':
        return <WifiOff className="w-4 h-4 text-red-500" />
      default:
        return <Wifi className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = () => {
    const { totalConnections, healthyConnections } = connectionHealth
    
    if (totalConnections === 0) {
      return (
        <Badge variant="outline" className="text-xs">
          Bağlantı Yok
        </Badge>
      )
    }

    switch (healthStatus) {
      case 'healthy':
        return (
          <Badge variant="default" className="text-xs bg-green-500">
            Sağlıklı ({healthyConnections}/{totalConnections})
          </Badge>
        )
      case 'warning':
        return (
          <Badge variant="default" className="text-xs bg-yellow-500">
            Uyarı ({healthyConnections}/{totalConnections})
          </Badge>
        )
      case 'critical':
        return (
          <Badge variant="destructive" className="text-xs">
            Kritik ({healthyConnections}/{totalConnections})
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Bilinmiyor
          </Badge>
        )
    }
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {getStatusIcon()}
        {getStatusBadge()}
        <span className="text-xs text-muted-foreground">
          {performanceMetrics.totalConnections} bağlantı
        </span>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4" />
            WebSocket Durumu
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshMetrics}
              className="h-7 w-7 p-0"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
            {activeConnections.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={disconnectAll}
                className="h-7 text-xs px-2"
              >
                Tümünü Kapat
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Genel Durum */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">Sistem Durumu</span>
          </div>
          {getStatusBadge()}
        </div>

        {/* Performans Metrikleri */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <div className="text-muted-foreground">Aktif Bağlantı</div>
            <div className="font-semibold">{performanceMetrics.totalConnections}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Yeniden Bağlanma</div>
            <div className="font-semibold">{performanceMetrics.reconnectAttempts}</div>
          </div>
          <div className="col-span-2">
            <div className="text-muted-foreground">Çalışma Süresi</div>
            <div className="font-semibold">{formatUptime(performanceMetrics.uptime)}</div>
          </div>
        </div>

        {/* Aktif Bağlantılar */}
        {activeConnections.length > 0 && (
          <div>
            <div className="text-xs font-medium mb-2">Aktif Bağlantılar</div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {activeConnections.map(streamId => (
                <div key={streamId} className="flex items-center justify-between p-2 bg-muted/50 rounded text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="truncate">{streamId}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => disconnectStream(streamId)}
                    className="h-6 w-6 p-0 ml-2 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sorunlar */}
        {connectionHealth.issues.length > 0 && (
          <div>
            <div className="text-xs font-medium mb-2 text-red-600">Sorunlar</div>
            <div className="space-y-1">
              {connectionHealth.issues.map((issue, index) => (
                <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  {issue}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bağlantı Yok Durumu */}
        {activeConnections.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <WifiOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Aktif WebSocket bağlantısı yok</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}