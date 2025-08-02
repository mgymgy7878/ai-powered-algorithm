import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { websocketService, MarketData } from '@/services/websocketService'
import { TrendingUp, TrendingDown, Activity, Pause, Play, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface MarketDashboardProps {
  className?: string
}

export function MarketDashboard({ className }: MarketDashboardProps) {
  const [marketData, setMarketData] = useState<Map<string, MarketData>>(new Map())
  const [isStreaming, setIsStreaming] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [selectedSymbols] = useState([
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT', 
    'SOLUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'MATICUSDT'
  ])

  const startStreaming = () => {
    if (isStreaming) return

    setIsStreaming(true)
    setLastUpdate(new Date())
    
    // Start multi-ticker stream
    websocketService.subscribeToMultipleTickers(selectedSymbols, (data: MarketData) => {
      setMarketData(prev => {
        const newData = new Map(prev)
        newData.set(data.symbol, data)
        return newData
      })
      setLastUpdate(new Date())
    })

    toast.success('Canlı piyasa verisi başlatıldı')
  }

  const stopStreaming = () => {
    if (!isStreaming) return

    setIsStreaming(false)
    websocketService.disconnect('multi-ticker')
    toast.info('Canlı piyasa verisi durduruldu')
  }

  const toggleStreaming = () => {
    if (isStreaming) {
      stopStreaming()
    } else {
      startStreaming()
    }
  }

  // Component unmount'da bağlantıları temizle
  useEffect(() => {
    return () => {
      websocketService.disconnect('multi-ticker')
    }
  }, [])

  const formatPrice = (price: string) => {
    const num = parseFloat(price)
    if (num < 0.001) return num.toFixed(8)
    if (num < 1) return num.toFixed(6)
    if (num < 100) return num.toFixed(4)
    return num.toFixed(2)
  }

  const formatPercent = (percent: string) => {
    const num = parseFloat(percent)
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
  }

  const formatVolume = (volume: string) => {
    const num = parseFloat(volume)
    if (num > 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num > 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toFixed(0)
  }

  const sortedData = Array.from(marketData.entries()).sort((a, b) => {
    // Sort by symbol name
    return a[0].localeCompare(b[0])
  })

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Canlı Piyasa Verileri
            {isStreaming && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdate && (
              <span className="text-xs text-muted-foreground">
                {lastUpdate.toLocaleTimeString('tr-TR')}
              </span>
            )}
            <Button
              variant={isStreaming ? "destructive" : "default"}
              size="sm"
              onClick={toggleStreaming}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  Durdur
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Başlat
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isStreaming && marketData.size === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Canlı piyasa verisi bekleniyor</p>
            <p className="text-sm">WebSocket bağlantısını başlatmak için yukarıdaki butona tıklayın</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {sortedData.map(([symbol, data]) => {
              const changePercent = parseFloat(data.changePercent)
              const isPositive = changePercent >= 0
              
              return (
                <div
                  key={symbol}
                  className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{symbol}</span>
                    <Badge
                      variant={isPositive ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {formatPercent(data.changePercent)}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold">
                      ${formatPrice(data.price)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      H: ${formatPrice(data.high)} | L: ${formatPrice(data.low)}
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Vol: {formatVolume(data.volume)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {marketData.size === 0 && isStreaming && (
          <div className="text-center py-8 text-muted-foreground">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
            <p>Veri bekleniyor...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}