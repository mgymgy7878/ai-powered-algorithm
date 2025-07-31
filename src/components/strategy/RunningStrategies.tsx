import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ScrollArea } from '../ui/scroll-area'
import { PlayIcon, PauseIcon, StopIcon, ChartBarIcon, CogIcon, EyeIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'

interface RunningStrategy {
  id: string
  name: string
  status: 'running' | 'paused' | 'stopped'
  startTime: string
  symbol: string
  profit: number
  profitPercent: number
  totalTrades: number
  winningTrades: number
  currentPosition?: {
    type: 'long' | 'short'
    size: number
    entryPrice: number
    unrealizedPnL: number
  }
  performance: {
    todayPnL: number
    weeklyPnL: number
    monthlyPnL: number
    maxDrawdown: number
    sharpeRatio: number
  }
  logs: Array<{
    timestamp: string
    type: 'info' | 'trade' | 'error' | 'warning'
    message: string
  }>
}

export function RunningStrategies() {
  const [runningStrategies, setRunningStrategies] = useKV<RunningStrategy[]>('running-strategies', [])
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Demo verisi oluştur (gerçek uygulamada bu veriler backtesting ve live trading'den gelecek)
  useEffect(() => {
    if (runningStrategies.length === 0) {
      const demoStrategies: RunningStrategy[] = [
        {
          id: '1',
          name: 'BTC Scalping Strategy',
          status: 'running',
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          symbol: 'BTCUSDT',
          profit: 245.67,
          profitPercent: 2.34,
          totalTrades: 23,
          winningTrades: 15,
          currentPosition: {
            type: 'long',
            size: 0.05,
            entryPrice: 43250,
            unrealizedPnL: 12.45
          },
          performance: {
            todayPnL: 89.23,
            weeklyPnL: 156.78,
            monthlyPnL: 445.23,
            maxDrawdown: -45.67,
            sharpeRatio: 1.45
          },
          logs: [
            { timestamp: new Date().toISOString(), type: 'trade', message: 'BUY 0.05 BTC @ 43250 USDT' },
            { timestamp: new Date(Date.now() - 15000).toISOString(), type: 'info', message: 'RSI düştü, alım sinyali' },
            { timestamp: new Date(Date.now() - 30000).toISOString(), type: 'trade', message: 'SELL 0.05 BTC @ 43180 USDT - Profit: +15.67 USDT' }
          ]
        },
        {
          id: '2',
          name: 'ETH Grid Bot',
          status: 'paused',
          startTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          symbol: 'ETHUSDT',
          profit: -23.45,
          profitPercent: -0.89,
          totalTrades: 45,
          winningTrades: 22,
          performance: {
            todayPnL: -12.34,
            weeklyPnL: 34.56,
            monthlyPnL: 123.45,
            maxDrawdown: -67.89,
            sharpeRatio: 0.89
          },
          logs: [
            { timestamp: new Date().toISOString(), type: 'warning', message: 'Strateji manuel olarak duraklatıldı' },
            { timestamp: new Date(Date.now() - 45000).toISOString(), type: 'trade', message: 'SELL 0.1 ETH @ 2845 USDT' }
          ]
        }
      ]
      setRunningStrategies(demoStrategies)
    }
  }, [runningStrategies, setRunningStrategies])

  const handleStrategyAction = (strategyId: string, action: 'start' | 'pause' | 'stop') => {
    setRunningStrategies(prev => prev.map(strategy => {
      if (strategy.id === strategyId) {
        let newStatus: RunningStrategy['status']
        switch (action) {
          case 'start':
            newStatus = 'running'
            toast.success(`${strategy.name} başlatıldı`)
            break
          case 'pause':
            newStatus = 'paused'
            toast.info(`${strategy.name} duraklatıldı`)
            break
          case 'stop':
            newStatus = 'stopped'
            toast.warning(`${strategy.name} durduruldu`)
            break
        }
        return { ...strategy, status: newStatus }
      }
      return strategy
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'stopped': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Çalışıyor'
      case 'paused': return 'Duraklatıldı'
      case 'stopped': return 'Durduruldu'
      default: return 'Bilinmiyor'
    }
  }

  const selectedStrategyData = runningStrategies.find(s => s.id === selectedStrategy)

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-border p-6">
        <h1 className="text-2xl font-bold text-foreground">Çalışan Stratejiler</h1>
        <p className="text-muted-foreground mt-1">
          Aktif stratejilerinizi izleyin ve yönetin
        </p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sol Panel - Strateji Listesi */}
        <div className="w-1/3 border-r border-border">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Aktif Stratejiler</h2>
              <Badge variant="secondary">{runningStrategies.length}</Badge>
            </div>

            <ScrollArea className="h-[calc(100vh-180px)]">
              <div className="space-y-3">
                {runningStrategies.map((strategy) => (
                  <Card 
                    key={strategy.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedStrategy === strategy.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedStrategy(strategy.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{strategy.name}</h3>
                          <p className="text-sm text-muted-foreground">{strategy.symbol}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(strategy.status)}`} />
                          <span className="text-xs">{getStatusText(strategy.status)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className={`text-sm font-medium ${
                            strategy.profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {strategy.profit >= 0 ? '+' : ''}{strategy.profit.toFixed(2)} USDT
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {strategy.totalTrades} işlem
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${
                            strategy.profitPercent >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {strategy.profitPercent >= 0 ? '+' : ''}{strategy.profitPercent.toFixed(2)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            %{((strategy.winningTrades / strategy.totalTrades) * 100).toFixed(0)} kazanç
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1 mt-3">
                        {strategy.status === 'running' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStrategyAction(strategy.id, 'pause')
                            }}
                          >
                            <PauseIcon className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStrategyAction(strategy.id, 'start')
                            }}
                          >
                            <PlayIcon className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStrategyAction(strategy.id, 'stop')
                          }}
                        >
                          <StopIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Sağ Panel - Detaylar */}
        <div className="flex-1 p-6">
          {selectedStrategyData ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedStrategyData.name}</h2>
                  <p className="text-muted-foreground">{selectedStrategyData.symbol}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <CogIcon className="h-4 w-4 mr-2" />
                    Ayarlar
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChartBarIcon className="h-4 w-4 mr-2" />
                    Grafik
                  </Button>
                </div>
              </div>

              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
                <TabsTrigger value="performance">Performans</TabsTrigger>
                <TabsTrigger value="trades">İşlemler</TabsTrigger>
                <TabsTrigger value="logs">Loglar</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Genel Durum</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Durum:</span>
                          <Badge variant={selectedStrategyData.status === 'running' ? 'default' : 'secondary'}>
                            {getStatusText(selectedStrategyData.status)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Başlatma:</span>
                          <span className="text-sm">{new Date(selectedStrategyData.startTime).toLocaleString('tr-TR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Çalışma Süresi:</span>
                          <span className="text-sm">
                            {Math.floor((Date.now() - new Date(selectedStrategyData.startTime).getTime()) / (1000 * 60 * 60))}h
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Kar/Zarar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Toplam P&L:</span>
                          <span className={`text-sm font-medium ${
                            selectedStrategyData.profit >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {selectedStrategyData.profit >= 0 ? '+' : ''}{selectedStrategyData.profit.toFixed(2)} USDT
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Yüzde:</span>
                          <span className={`text-sm font-medium ${
                            selectedStrategyData.profitPercent >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {selectedStrategyData.profitPercent >= 0 ? '+' : ''}{selectedStrategyData.profitPercent.toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Bugün P&L:</span>
                          <span className={`text-sm ${
                            selectedStrategyData.performance.todayPnL >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {selectedStrategyData.performance.todayPnL >= 0 ? '+' : ''}{selectedStrategyData.performance.todayPnL.toFixed(2)} USDT
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {selectedStrategyData.currentPosition && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Mevcut Pozisyon</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Yön:</span>
                            <Badge variant={selectedStrategyData.currentPosition.type === 'long' ? 'default' : 'destructive'}>
                              {selectedStrategyData.currentPosition.type === 'long' ? 'LONG' : 'SHORT'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Miktar:</span>
                            <span className="text-sm">{selectedStrategyData.currentPosition.size}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Giriş:</span>
                            <span className="text-sm">{selectedStrategyData.currentPosition.entryPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Floating P&L:</span>
                            <span className={`text-sm font-medium ${
                              selectedStrategyData.currentPosition.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {selectedStrategyData.currentPosition.unrealizedPnL >= 0 ? '+' : ''}{selectedStrategyData.currentPosition.unrealizedPnL.toFixed(2)} USDT
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="performance" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Performans Metrikleri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Haftalık P&L:</span>
                        <span className={`text-sm font-medium ${
                          selectedStrategyData.performance.weeklyPnL >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedStrategyData.performance.weeklyPnL >= 0 ? '+' : ''}{selectedStrategyData.performance.weeklyPnL.toFixed(2)} USDT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Aylık P&L:</span>
                        <span className={`text-sm font-medium ${
                          selectedStrategyData.performance.monthlyPnL >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedStrategyData.performance.monthlyPnL >= 0 ? '+' : ''}{selectedStrategyData.performance.monthlyPnL.toFixed(2)} USDT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Max Drawdown:</span>
                        <span className="text-sm text-red-600">
                          {selectedStrategyData.performance.maxDrawdown.toFixed(2)} USDT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Sharpe Ratio:</span>
                        <span className="text-sm font-medium">
                          {selectedStrategyData.performance.sharpeRatio.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">İşlem İstatistikleri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Toplam İşlem:</span>
                        <span className="text-sm font-medium">{selectedStrategyData.totalTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Kazanan İşlem:</span>
                        <span className="text-sm text-green-600">{selectedStrategyData.winningTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Kaybeden İşlem:</span>
                        <span className="text-sm text-red-600">{selectedStrategyData.totalTrades - selectedStrategyData.winningTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Kazanç Oranı:</span>
                        <span className="text-sm font-medium">
                          %{((selectedStrategyData.winningTrades / selectedStrategyData.totalTrades) * 100).toFixed(1)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Win Rate:</span>
                          <span className="text-sm">%{((selectedStrategyData.winningTrades / selectedStrategyData.totalTrades) * 100).toFixed(0)}</span>
                        </div>
                        <Progress 
                          value={(selectedStrategyData.winningTrades / selectedStrategyData.totalTrades) * 100} 
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trades" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Son İşlemler</CardTitle>
                    <CardDescription>
                      Son {selectedStrategyData.totalTrades} işlem
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <ChartBarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>İşlem geçmişi henüz yüklenmedi</p>
                      <p className="text-sm">Bu özellik yakında eklenecek</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logs" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Strateji Logları</CardTitle>
                    <CardDescription>
                      Sistem olayları ve işlem kayıtları
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80">
                      <div className="space-y-2">
                        {selectedStrategyData.logs.map((log, index) => (
                          <div key={index} className="flex items-start gap-3 p-2 rounded border">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              log.type === 'trade' ? 'bg-blue-500' :
                              log.type === 'error' ? 'bg-red-500' :
                              log.type === 'warning' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm">{log.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleString('tr-TR')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <EyeIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Strateji Seçin</h3>
                <p className="text-muted-foreground">
                  Detayları görüntülemek için sol panelden bir strateji seçin
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}