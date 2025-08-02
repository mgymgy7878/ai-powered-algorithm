import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { websocketService, MarketData, KlineData, OrderBookData, TradeData } from '@/services/websocketService'
import { 
  Wifi, 
  WifiOff, 
  Play, 
  Square, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  BarChart3,
  DollarSign,
  Clock
} from 'lucide-react'

export function LiveDataMonitor() {
  const [isConnected, setIsConnected] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT')
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [klineData, setKlineData] = useState<KlineData[]>([])
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null)
  const [recentTrades, setRecentTrades] = useState<TradeData[]>([])
  const [symbols] = useState(['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT'])
  const [multiMarketData, setMultiMarketData] = useState<Map<string, MarketData>>(new Map())

  // WebSocket bağlantılarını yönet
  const handleConnect = () => {
    if (isConnected) {
      websocketService.disconnectAll()
      setIsConnected(false)
      setMarketData(null)
      setKlineData([])
      setOrderBook(null)
      setRecentTrades([])
      return
    }

    try {
      // Seçili sembol için detaylı veri akışları
      websocketService.subscribeToTicker(selectedSymbol, (data: MarketData) => {
        setMarketData(data)
      })

      websocketService.subscribeToKline(selectedSymbol, '1m', (data: KlineData) => {
        setKlineData(prev => {
          const newData = [...prev, data].slice(-50) // Son 50 mum
          return newData
        })
      })

      websocketService.subscribeToDepth(selectedSymbol, (data: OrderBookData) => {
        setOrderBook(data)
      })

      websocketService.subscribeToTrades(selectedSymbol, (data: TradeData) => {
        setRecentTrades(prev => {
          const newTrades = [data, ...prev].slice(0, 20) // Son 20 işlem
          return newTrades
        })
      })

      // Çoklu sembol fiyat takibi
      websocketService.subscribeToMultipleTickers(symbols, (data: MarketData) => {
        setMultiMarketData(prev => {
          const newMap = new Map(prev)
          newMap.set(data.symbol, data)
          return newMap
        })
      })

      setIsConnected(true)
      
      if ((window as any).pushNotification) {
        ;(window as any).pushNotification('🔴 Canlı veri akışı başlatıldı', 'success')
      }

    } catch (error) {
      console.error('WebSocket bağlantı hatası:', error)
      if ((window as any).pushNotification) {
        ;(window as any).pushNotification('❌ Bağlantı başarısız', 'error')
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      websocketService.disconnectAll()
    }
  }, [])

  const formatPrice = (price: string | number) => {
    return parseFloat(price.toString()).toFixed(4)
  }

  const formatVolume = (volume: string | number) => {
    const vol = parseFloat(volume.toString())
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`
    return vol.toFixed(2)
  }

  const formatPercentage = (percent: string | number) => {
    const pct = parseFloat(percent.toString())
    return `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Kontrols */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">📡 Canlı Veri İzleme</h1>
          <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isConnected ? 'Bağlı' : 'Bağlı Değil'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Input 
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value.toUpperCase())}
            placeholder="Sembol (örn: BTCUSDT)"
            className="w-32"
          />
          <Button 
            onClick={handleConnect}
            variant={isConnected ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isConnected ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isConnected ? 'Durdur' : 'Başlat'}
          </Button>
        </div>
      </div>

      {/* Çoklu Market Özeti */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Piyasa Özeti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {symbols.map(symbol => {
              const data = multiMarketData.get(symbol)
              const changePercent = data ? parseFloat(data.changePercent) : 0
              
              return (
                <div key={symbol} className="p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{symbol}</span>
                    <Badge 
                      variant={changePercent >= 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {data ? formatPercentage(data.changePercent) : '-%'}
                    </Badge>
                  </div>
                  <div className={`text-lg font-bold ${changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${data ? formatPrice(data.price) : '-.----'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Vol: {data ? formatVolume(data.volume) : '0'}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detaylı Veri */}
      <Tabs defaultValue="ticker" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ticker">Fiyat Verisi</TabsTrigger>
          <TabsTrigger value="chart">Grafik Verisi</TabsTrigger>
          <TabsTrigger value="depth">Emir Defteri</TabsTrigger>
          <TabsTrigger value="trades">Son İşlemler</TabsTrigger>
        </TabsList>

        {/* Fiyat Verisi */}
        <TabsContent value="ticker">
          <Card>
            <CardHeader>
              <CardTitle>{selectedSymbol} - Detaylı Fiyat</CardTitle>
            </CardHeader>
            <CardContent>
              {marketData ? (
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Fiyat</span>
                    </div>
                    <div className="text-2xl font-bold">${formatPrice(marketData.price)}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {parseFloat(marketData.changePercent) >= 0 ? 
                        <TrendingUp className="w-4 h-4 text-green-600" /> : 
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      }
                      <span className="text-sm text-muted-foreground">24s Değişim</span>
                    </div>
                    <div className={`text-xl font-semibold ${
                      parseFloat(marketData.changePercent) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(marketData.changePercent)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">24s Hacim</span>
                    </div>
                    <div className="text-xl font-semibold">{formatVolume(marketData.volume)}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">24s Yüksek</span>
                    <div className="text-lg font-semibold text-green-600">${formatPrice(marketData.high)}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">24s Düşük</span>
                    <div className="text-lg font-semibold text-red-600">${formatPrice(marketData.low)}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Güncelleme</span>
                    <div className="text-sm">{new Date(marketData.timestamp).toLocaleTimeString('tr-TR')}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Veri bekleniyor... Lütfen bağlantıyı başlatın.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grafik Verisi (Kline) */}
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>{selectedSymbol} - 1 Dakikalık Mumlar</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {klineData.length > 0 ? (
                  <div className="space-y-2">
                    {klineData.slice(-10).reverse().map((kline, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(kline.openTime).toLocaleTimeString('tr-TR')}</span>
                        </div>
                        <div className="flex gap-4">
                          <span>A: ${formatPrice(kline.open)}</span>
                          <span className="text-green-600">Y: ${formatPrice(kline.high)}</span>
                          <span className="text-red-600">D: ${formatPrice(kline.low)}</span>
                          <span className="font-semibold">K: ${formatPrice(kline.close)}</span>
                        </div>
                        <div className="text-muted-foreground">
                          Vol: {formatVolume(kline.volume)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Mum verisi bekleniyor...
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emir Defteri */}
        <TabsContent value="depth">
          <Card>
            <CardHeader>
              <CardTitle>{selectedSymbol} - Emir Defteri</CardTitle>
            </CardHeader>
            <CardContent>
              {orderBook ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">ALIŞ EMİRLERİ</h4>
                    <div className="space-y-1 text-sm">
                      {orderBook.bids.slice(0, 10).map(([price, quantity], index) => (
                        <div key={index} className="flex justify-between p-1 bg-green-50 rounded text-green-800">
                          <span>${formatPrice(price)}</span>
                          <span>{formatVolume(quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">SATIŞ EMİRLERİ</h4>
                    <div className="space-y-1 text-sm">
                      {orderBook.asks.slice(0, 10).map(([price, quantity], index) => (
                        <div key={index} className="flex justify-between p-1 bg-red-50 rounded text-red-800">
                          <span>${formatPrice(price)}</span>
                          <span>{formatVolume(quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Emir defteri verisi bekleniyor...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Son İşlemler */}
        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>{selectedSymbol} - Son İşlemler</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {recentTrades.length > 0 ? (
                  <div className="space-y-2">
                    {recentTrades.map((trade, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant={trade.isBuyerMaker ? "destructive" : "default"} className="text-xs">
                            {trade.isBuyerMaker ? 'SATIŞ' : 'ALIŞ'}
                          </Badge>
                          <span className="text-muted-foreground">
                            {new Date(trade.time).toLocaleTimeString('tr-TR')}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <span className={trade.isBuyerMaker ? 'text-red-600' : 'text-green-600'}>
                            ${formatPrice(trade.price)}
                          </span>
                          <span className="text-muted-foreground">
                            {formatVolume(trade.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    İşlem verisi bekleniyor...
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}