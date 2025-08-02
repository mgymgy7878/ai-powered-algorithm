import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { WebSocketStatus } from '@/components/ui/WebSocketStatus'
import { websocketService, MarketData, KlineData, OrderBookData, TradeData } from '@/services/websocketService'
import { webSocketTestSuite } from '@/utils/webSocketTestSuite'
import { Play, Square, Trash2, Wifi, WifiOff, Activity, TrendingUp, TrendingDown, BarChart3, BookOpen, Clock, DollarSign, TestTube } from 'lucide-react'
import { toast } from 'sonner'

interface ConnectionState {
  id: string
  symbol: string
  type: 'ticker' | 'kline' | 'depth' | 'trades' | 'multi'
  status: 'connecting' | 'connected' | 'error' | 'disconnected'
  lastUpdate: Date
  dataCount: number
  interval?: string
}

interface LogEntry {
  id: string
  timestamp: Date
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  data?: any
}

export function WebSocketTester() {
  const [connections, setConnections] = useState<Map<string, ConnectionState>>(new Map())
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const [marketData, setMarketData] = useState<Map<string, MarketData>>(new Map())
  const [klineData, setKlineData] = useState<Map<string, KlineData>>(new Map())
  const [orderBookData, setOrderBookData] = useState<Map<string, OrderBookData>>(new Map())
  const [tradeData, setTradeData] = useState<TradeData[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [testResults, setTestResults] = useState<{ passed: number; failed: number; errors: string[] } | null>(null)
  // Form states
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT')
  const [selectedInterval, setSelectedInterval] = useState('1m')
  const [selectedType, setSelectedType] = useState<'ticker' | 'kline' | 'depth' | 'trades'>('ticker')
  const [multiSymbols, setMultiSymbols] = useState('BTCUSDT,ETHUSDT,ADAUSDT')
  
  const logsRef = useRef<HTMLDivElement>(null)

  // Popüler trading çiftleri
  const popularSymbols = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT', 
    'SOLUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'MATICUSDT'
  ]

  // Kline aralıkları
  const intervals = [
    { value: '1m', label: '1 Dakika' },
    { value: '3m', label: '3 Dakika' },
    { value: '5m', label: '5 Dakika' },
    { value: '15m', label: '15 Dakika' },
    { value: '30m', label: '30 Dakika' },
    { value: '1h', label: '1 Saat' },
    { value: '2h', label: '2 Saat' },
    { value: '4h', label: '4 Saat' },
    { value: '6h', label: '6 Saat' },
    { value: '8h', label: '8 Saat' },
    { value: '12h', label: '12 Saat' },
    { value: '1d', label: '1 Gün' },
    { value: '3d', label: '3 Gün' },
    { value: '1w', label: '1 Hafta' },
    { value: '1M', label: '1 Ay' }
  ]

  const addLog = (type: LogEntry['type'], message: string, data?: any) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      message,
      data
    }
    
    setLogs(prev => {
      const newLogs = [newLog, ...prev].slice(0, 500) // Son 500 log'u tut
      return newLogs
    })
  }

  const updateConnection = (id: string, updates: Partial<ConnectionState>) => {
    setConnections(prev => {
      const newConnections = new Map(prev)
      const existing = newConnections.get(id)
      if (existing) {
        newConnections.set(id, { ...existing, ...updates, lastUpdate: new Date() })
      }
      return newConnections
    })
  }

  // Otomatik scroll
  useEffect(() => {
    if (isAutoScroll && logsRef.current) {
      logsRef.current.scrollTop = 0
    }
  }, [logs, isAutoScroll])

  const startConnection = () => {
    const connectionId = `${selectedType}-${selectedSymbol}-${selectedInterval || 'default'}`
    
    // Mevcut bağlantıyı kapat
    websocketService.disconnect(connectionId)
    
    // Yeni bağlantı durumu ekle
    const newConnection: ConnectionState = {
      id: connectionId,
      symbol: selectedSymbol,
      type: selectedType,
      status: 'connecting',
      lastUpdate: new Date(),
      dataCount: 0,
      interval: selectedInterval
    }
    
    setConnections(prev => new Map(prev.set(connectionId, newConnection)))
    addLog('info', `${selectedType.toUpperCase()} bağlantısı başlatılıyor: ${selectedSymbol}`)

    try {
      switch (selectedType) {
        case 'ticker':
          websocketService.subscribeToTicker(selectedSymbol, (data: MarketData) => {
            setMarketData(prev => new Map(prev.set(data.symbol, data)))
            updateConnection(connectionId, { 
              status: 'connected', 
              dataCount: (connections.get(connectionId)?.dataCount || 0) + 1 
            })
            addLog('success', `Ticker verisi alındı: ${data.symbol} - $${parseFloat(data.price).toFixed(4)}`, data)
          })
          break

        case 'kline':
          websocketService.subscribeToKline(selectedSymbol, selectedInterval, (data: KlineData) => {
            setKlineData(prev => new Map(prev.set(data.symbol, data)))
            updateConnection(connectionId, { 
              status: 'connected', 
              dataCount: (connections.get(connectionId)?.dataCount || 0) + 1 
            })
            addLog('success', `Kline verisi alındı: ${data.symbol} - ${selectedInterval} - Close: $${parseFloat(data.close).toFixed(4)}`, data)
          })
          break

        case 'depth':
          websocketService.subscribeToDepth(selectedSymbol, (data: OrderBookData) => {
            setOrderBookData(prev => new Map(prev.set(data.symbol, data)))
            updateConnection(connectionId, { 
              status: 'connected', 
              dataCount: (connections.get(connectionId)?.dataCount || 0) + 1 
            })
            addLog('success', `Depth verisi alındı: ${data.symbol} - Bids: ${data.bids.length}, Asks: ${data.asks.length}`, data)
          })
          break

        case 'trades':
          websocketService.subscribeToTrades(selectedSymbol, (data: TradeData) => {
            setTradeData(prev => [data, ...prev.slice(0, 99)]) // Son 100 trade'i tut
            updateConnection(connectionId, { 
              status: 'connected', 
              dataCount: (connections.get(connectionId)?.dataCount || 0) + 1 
            })
            addLog('success', `Trade verisi alındı: ${data.symbol} - $${parseFloat(data.price).toFixed(4)} (${data.quantity})`, data)
          })
          break
      }

      toast.success(`${selectedType.toUpperCase()} bağlantısı başlatıldı: ${selectedSymbol}`)
      
    } catch (error) {
      addLog('error', `Bağlantı hatası: ${error}`)
      updateConnection(connectionId, { status: 'error' })
      toast.error('WebSocket bağlantısı başlatılamadı')
    }
  }

  const startMultiConnection = () => {
    const symbols = multiSymbols.split(',').map(s => s.trim().toUpperCase())
    const connectionId = `multi-ticker-${symbols.join('-')}`
    
    websocketService.disconnect(connectionId)
    
    const newConnection: ConnectionState = {
      id: connectionId,
      symbol: symbols.join(', '),
      type: 'multi',
      status: 'connecting',
      lastUpdate: new Date(),
      dataCount: 0
    }
    
    setConnections(prev => new Map(prev.set(connectionId, newConnection)))
    addLog('info', `Multi-ticker bağlantısı başlatılıyor: ${symbols.join(', ')}`)

    try {
      websocketService.subscribeToMultipleTickers(symbols, (data: MarketData) => {
        setMarketData(prev => new Map(prev.set(data.symbol, data)))
        updateConnection(connectionId, { 
          status: 'connected', 
          dataCount: (connections.get(connectionId)?.dataCount || 0) + 1 
        })
        addLog('success', `Multi-ticker verisi: ${data.symbol} - $${parseFloat(data.price).toFixed(4)}`, data)
      })

      toast.success(`Multi-ticker bağlantısı başlatıldı: ${symbols.length} sembol`)
      
    } catch (error) {
      addLog('error', `Multi-ticker bağlantı hatası: ${error}`)
      updateConnection(connectionId, { status: 'error' })
      toast.error('Multi-ticker bağlantısı başlatılamadı')
    }
  }

  const stopConnection = (connectionId: string) => {
    websocketService.disconnect(connectionId)
    updateConnection(connectionId, { status: 'disconnected' })
    addLog('warning', `Bağlantı durduruldu: ${connectionId}`)
    toast.info('Bağlantı durduruldu')
  }

  const stopAllConnections = () => {
    websocketService.disconnectAll()
    setConnections(new Map())
    addLog('warning', 'Tüm bağlantılar durduruldu')
    toast.info('Tüm bağlantılar durduruldu')
  }

  const clearLogs = () => {
    setLogs([])
    toast.info('Loglar temizlendi')
  }

  const runAutomatedTests = async () => {
    setIsRunningTests(true)
    setTestResults(null)
    addLog('info', 'Otomatik testler başlatılıyor...')
    toast.info('WebSocket testleri başlatılıyor')

    try {
      const results = await webSocketTestSuite.runAllTests()
      setTestResults(results)
      
      if (results.failed === 0) {
        addLog('success', `Tüm testler başarılı! (${results.passed}/${results.passed + results.failed})`)
        toast.success('Tüm WebSocket testleri başarılı!')
      } else {
        addLog('error', `${results.failed} test başarısız, ${results.passed} test başarılı`)
        toast.error(`${results.failed} test başarısız oldu`)
      }

      // Hataları logla
      results.errors.forEach(error => {
        addLog('error', `Test hatası: ${error}`)
      })

    } catch (error) {
      addLog('error', `Test suite hatası: ${error}`)
      toast.error('Test suite çalıştırılamadı')
    } finally {
      setIsRunningTests(false)
    }
  }

  const getStatusColor = (status: ConnectionState['status']) => {
    switch (status) {
      case 'connected': return 'bg-green-500'
      case 'connecting': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      case 'disconnected': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: ConnectionState['status']) => {
    switch (status) {
      case 'connected': return <Wifi className="w-4 h-4" />
      case 'connecting': return <Activity className="w-4 h-4 animate-pulse" />
      case 'error': return <WifiOff className="w-4 h-4" />
      case 'disconnected': return <WifiOff className="w-4 h-4" />
      default: return <WifiOff className="w-4 h-4" />
    }
  }

  const formatLogTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">WebSocket Test Merkezi</h1>
          <p className="text-muted-foreground">Gerçek zamanlı piyasa verisi bağlantılarını test edin</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            {connections.size} Aktif Bağlantı
          </Badge>
          <Button
            variant="secondary"
            onClick={runAutomatedTests}
            disabled={isRunningTests}
            size="sm"
          >
            <TestTube className="w-4 h-4 mr-2" />
            {isRunningTests ? 'Test Çalışıyor...' : 'Otomatik Test'}
          </Button>
          <Button variant="destructive" onClick={stopAllConnections} size="sm">
            <Square className="w-4 h-4 mr-2" />
            Tümünü Durdur
          </Button>
        </div>
      </div>

      {/* Bağlantı Kontrolleri */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* WebSocket Durum Monitörü */}
        <WebSocketStatus />
        
        {/* Tekli Bağlantı */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Tekli Bağlantı Başlat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sembol</label>
                <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {popularSymbols.map(symbol => (
                      <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Veri Tipi</label>
                <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ticker">Ticker (24sa)</SelectItem>
                    <SelectItem value="kline">Kline (Mum)</SelectItem>
                    <SelectItem value="depth">Depth (Emir Defteri)</SelectItem>
                    <SelectItem value="trades">Trades (İşlemler)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedType === 'kline' && (
              <div>
                <label className="text-sm font-medium mb-2 block">Zaman Aralığı</label>
                <Select value={selectedInterval} onValueChange={setSelectedInterval}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {intervals.map(interval => (
                      <SelectItem key={interval.value} value={interval.value}>
                        {interval.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={startConnection} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Bağlantıyı Başlat
            </Button>
          </CardContent>
        </Card>

        {/* Çoklu Bağlantı */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Çoklu Ticker Bağlantısı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Semboller (virgülle ayırın)</label>
              <Input
                value={multiSymbols}
                onChange={(e) => setMultiSymbols(e.target.value)}
                placeholder="BTCUSDT,ETHUSDT,ADAUSDT"
              />
            </div>
            <Button onClick={startMultiConnection} className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Multi-Ticker Başlat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Aktif Bağlantılar */}
      {connections.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Aktif Bağlantılar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from(connections.entries()).map(([id, connection]) => (
                <div key={id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(connection.status)}
                      <span className="font-medium text-sm">{connection.type.toUpperCase()}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => stopConnection(id)}
                    >
                      <Square className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="text-sm">
                    <div className="font-medium">{connection.symbol}</div>
                    {connection.interval && (
                      <div className="text-muted-foreground">{connection.interval}</div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="secondary" className={`text-white ${getStatusColor(connection.status)}`}>
                      {connection.status}
                    </Badge>
                    <span className="text-muted-foreground">
                      {connection.dataCount} veri
                    </span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Son güncelleme: {formatLogTime(connection.lastUpdate)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Sonuçları */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Otomatik Test Sonuçları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testResults.passed}</div>
                <div className="text-sm text-muted-foreground">Başarılı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
                <div className="text-sm text-muted-foreground">Başarısız</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {testResults.passed + testResults.failed}
                </div>
                <div className="text-sm text-muted-foreground">Toplam</div>
              </div>
            </div>
            
            {testResults.errors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Test Hataları:</h4>
                <div className="space-y-1">
                  {testResults.errors.map((error, index) => (
                    <div key={index} className="text-sm bg-red-50 text-red-700 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Canlı Veriler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Data */}
        {marketData.size > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Canlı Fiyat Verileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {Array.from(marketData.entries()).map(([symbol, data]) => (
                    <div key={symbol} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          Vol: {parseFloat(data.volume).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${parseFloat(data.price).toFixed(4)}</div>
                        <div className={`text-sm ${parseFloat(data.changePercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {parseFloat(data.changePercent) >= 0 ? '+' : ''}{parseFloat(data.changePercent).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Son İşlemler */}
        {tradeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Son İşlemler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {tradeData.slice(0, 20).map((trade, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                      <div>
                        <div className="font-medium">{trade.symbol}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(trade.time).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${parseFloat(trade.price).toFixed(4)}</div>
                        <div className={`text-xs ${trade.isBuyerMaker ? 'text-red-500' : 'text-green-500'}`}>
                          {trade.quantity} {trade.isBuyerMaker ? 'SELL' : 'BUY'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Log Ekranı */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              WebSocket Logları
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Switch
                  checked={isAutoScroll}
                  onCheckedChange={setIsAutoScroll}
                />
                <span>Otomatik kaydır</span>
              </div>
              <Button variant="outline" size="sm" onClick={clearLogs}>
                <Trash2 className="w-4 h-4 mr-2" />
                Temizle
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96" ref={logsRef}>
            <div className="font-mono text-sm space-y-1">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded">
                  <span className="text-muted-foreground shrink-0">
                    {formatLogTime(log.timestamp)}
                  </span>
                  <Badge 
                    variant={log.type === 'error' ? 'destructive' : log.type === 'success' ? 'default' : 'secondary'}
                    className="shrink-0 text-xs"
                  >
                    {log.type}
                  </Badge>
                  <span className="flex-1 break-words">{log.message}</span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Henüz log kaydı yok. WebSocket bağlantısı başlatın.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}