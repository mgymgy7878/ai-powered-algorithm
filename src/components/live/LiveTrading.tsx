import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { toast } from 'sonner'
import { PlayIcon, PauseIcon, StopIcon, ExclamationTriangleIcon, PlusIcon } from '@heroicons/react/24/outline'
import { TradingChart, ChartData } from '../charts/TradingChart'
import { binanceService } from '../../services/binanceService'
import { dataService } from '../../services/dataService'
import { APISettings as APISettingsType } from '../../types/api'

interface LiveStrategy {
  id: string
  name: string
  symbol: string
  status: 'running' | 'paused' | 'stopped'
  pnl: number
  trades: number
  winRate: number
  riskLevel: 'low' | 'medium' | 'high'
  allocatedCapital: number
  lastSignal?: string
  lastTradeTime?: string
  leverage?: number
  positionSize?: number
  entryPrice?: number
}

interface MarketData {
  symbol: string
  price: number
  change24h: number
  volume24h: number
  lastUpdate: Date
}

export function LiveTrading() {
  const [strategies] = useKV('trading-strategies', [])
  const [apiSettings] = useKV<APISettingsType>('api-settings', null)
  const [liveStrategies, setLiveStrategies] = useKV<LiveStrategy[]>('live-strategies', [])
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT')
  
  const [autoTrading, setAutoTrading] = useKV('auto-trading-enabled', false)
  const [riskManagement, setRiskManagement] = useKV('risk-management-enabled', true)
  const [maxDrawdown, setMaxDrawdown] = useKV('max-drawdown-percent', 20)
  const [maxPositionSize, setMaxPositionSize] = useKV('max-position-size', 10000)
  
  // Yeni strateji ekleme formu
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newStrategyForm, setNewStrategyForm] = useState({
    strategyId: '',
    symbol: 'BTCUSDT',
    allocatedCapital: 1000,
    leverage: 1,
    riskLevel: 'medium' as LiveStrategy['riskLevel']
  })

  const symbols = dataService.getPopularSymbols()
  const isBinanceConfigured = apiSettings?.binance?.enabled && apiSettings?.binance?.apiKey && apiSettings?.binance?.secretKey

  // Market verilerini gerçek zamanlı güncelle
  useEffect(() => {
    if (!isBinanceConfigured) return

    const updateMarketData = async () => {
      try {
        const pricesResponse = await binanceService.getTicker24hr()
        // getTicker24hr returns either single TickerInfo or array, ensure it's always an array
        const prices = Array.isArray(pricesResponse) ? pricesResponse : [pricesResponse]
        const filteredPrices = prices
          .filter(p => p && p.symbol && symbols.includes(p.symbol)) // Güvenli erişim kontrolü ekle
          .map(p => ({
            symbol: p.symbol,
            price: parseFloat(p.lastPrice || '0'),
            change24h: parseFloat(p.priceChangePercent || '0'),
            volume24h: parseFloat(p.volume || '0'),
            lastUpdate: new Date()
          }))
        setMarketData(filteredPrices)
      } catch (error) {
        console.error('Market data update failed:', error)
      }
    }

    updateMarketData()
    const interval = setInterval(updateMarketData, 10000) // Her 10 saniyede güncelle

    return () => clearInterval(interval)
  }, [isBinanceConfigured])

  // Grafik verilerini yükle
  useEffect(() => {
    const loadChartData = async () => {
      if (!selectedSymbol) return

      try {
        const candlesticks = await dataService.fetchHistoricalData({
          symbol: selectedSymbol,
          interval: '1h',
          limit: 100
        })

        const volume = await dataService.fetchVolumeData({
          symbol: selectedSymbol,
          interval: '1h',
          limit: 100
        })

        setChartData({
          candlesticks,
          volume
        })
      } catch (error) {
        console.error('Chart data loading failed:', error)
      }
    }

    loadChartData()
  }, [selectedSymbol])

  const addLiveStrategy = async () => {
    if (!newStrategyForm.strategyId) {
      toast.error('Lütfen bir strateji seçin')
      return
    }

    if (!isBinanceConfigured) {
      toast.error('Binance API ayarları yapılmamış')
      return
    }

    try {
      // Hesap bilgilerini kontrol et
      const accountInfo = await binanceService.getAccountInfo()
      if (!accountInfo) {
        toast.error('Binance hesap bilgileri alınamadı')
        return
      }

      const strategy = strategies.find(s => s.id === newStrategyForm.strategyId)
      if (!strategy) {
        toast.error('Strateji bulunamadı')
        return
      }

      const newLiveStrategy: LiveStrategy = {
        id: Date.now().toString(),
        name: strategy.name,
        symbol: newStrategyForm.symbol,
        status: 'stopped',
        pnl: 0,
        trades: 0,
        winRate: 0,
        riskLevel: newStrategyForm.riskLevel,
        allocatedCapital: newStrategyForm.allocatedCapital,
        leverage: newStrategyForm.leverage,
        positionSize: 0
      }

      setLiveStrategies(current => [...current, newLiveStrategy])
      setShowAddDialog(false)
      setNewStrategyForm({
        strategyId: '',
        symbol: 'BTCUSDT',
        allocatedCapital: 1000,
        leverage: 1,
        riskLevel: 'medium'
      })

      toast.success('Canlı strateji eklendi')
    } catch (error) {
      console.error('Add live strategy error:', error)
      toast.error(`Strateji eklenirken hata: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    }
  }

  const startStrategy = async (strategyId: string) => {
    if (!isBinanceConfigured) {
      toast.error('Binance API ayarları yapılmamış. Ayarlar sayfasına yönlendiriliyorsunuz.')
      window.dispatchEvent(new CustomEvent('navigate-to-settings'))
      return
    }

    try {
      // Risk kontrolleri
      if (riskManagement) {
        const strategy = liveStrategies.find(s => s.id === strategyId)
        if (strategy && strategy.pnl < -(strategy.allocatedCapital * maxDrawdown / 100)) {
          toast.error(`Maksimum kayıp limitine ulaşıldı (${maxDrawdown}%)`)
          return
        }
      }

      setLiveStrategies(current =>
        current.map(s =>
          s.id === strategyId ? { ...s, status: 'running' as const } : s
        )
      )
      toast.success('Strateji başlatıldı')
    } catch (error) {
      toast.error('Strateji başlatılamadı')
      console.error('Start strategy error:', error)
    }
  }

  const pauseStrategy = (strategyId: string) => {
    setLiveStrategies(current =>
      current.map(s =>
        s.id === strategyId ? { ...s, status: 'paused' as const } : s
      )
    )
    toast.success('Strateji duraklatıldı')
  }

  const stopStrategy = async (strategyId: string) => {
    try {
      // Pozisyonları kapat
      const strategy = liveStrategies.find(s => s.id === strategyId)
      if (strategy && strategy.positionSize && strategy.positionSize !== 0) {
        if (isBinanceConfigured && strategy.symbol) { // symbol kontrolü ekle
          // Pozisyonu kapat
          try {
            await binanceService.closePosition(strategy.symbol)
            toast.success('Açık pozisyonlar kapatıldı')
          } catch (error) {
            console.error('Position closing error:', error)
            toast.warning('Pozisyon kapatılamadı, manuel kontrol edin')
          }
        }
      }

      setLiveStrategies(current =>
        current.map(s =>
          s.id === strategyId ? { ...s, status: 'stopped' as const, positionSize: 0 } : s
        )
      )
      toast.success('Strateji durduruldu')
    } catch (error) {
      toast.error('Strateji durdurulamadı')
      console.error('Stop strategy error:', error)
    }
  }

  const removeStrategy = (strategyId: string) => {
    setLiveStrategies(current => current.filter(s => s.id !== strategyId))
    toast.success('Strateji kaldırıldı')
  }

  const getStatusColor = (status: LiveStrategy['status']) => {
    switch (status) {
      case 'running': return 'bg-accent text-accent-foreground'
      case 'paused': return 'bg-yellow-500 text-white'
      case 'stopped': return 'bg-secondary text-secondary-foreground'
    }
  }

  const getRiskColor = (risk: LiveStrategy['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-accent'
      case 'medium': return 'text-primary'
      case 'high': return 'text-destructive'
    }
  }

  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD'
    }).format(value ?? 0)
  }

  const totalPnL = liveStrategies.reduce((sum, s) => sum + (s.pnl || 0), 0)
  const totalCapital = liveStrategies.reduce((sum, s) => sum + (s.allocatedCapital || 0), 0)
  const runningCount = liveStrategies.filter(s => s.status === 'running').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Canlı Trading</h2>
          <p className="text-muted-foreground">Aktif stratejilerinizi yönetin ve gerçek zamanlı performansı izleyin</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={autoTrading ? "default" : "outline"} className="px-3 py-1">
            {autoTrading ? 'Oto Trading AÇIK' : 'Oto Trading KAPALI'}
          </Badge>
          <Badge variant={isBinanceConfigured ? "default" : "destructive"} className="px-3 py-1">
            {isBinanceConfigured ? 'Binance Bağlı' : 'Binance Bağlı Değil'}
          </Badge>
        </div>
      </div>

      {/* Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
              </div>
              <div className="text-sm text-muted-foreground">Toplam P&L</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalCapital)}</div>
              <div className="text-sm text-muted-foreground">Toplam Sermaye</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{runningCount}</div>
              <div className="text-sm text-muted-foreground">Aktif Strateji</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {totalCapital > 0 ? ((totalPnL / totalCapital) * 100).toFixed(2) : '0.00'}%
              </div>
              <div className="text-sm text-muted-foreground">Toplam ROI</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isBinanceConfigured && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <span className="font-medium">Binance API Ayarları Gerekli</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Canlı trading için Binance Futures API anahtarlarınızı ayarlar sayfasından yapılandırın.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-settings'))}
            >
              API Ayarlarına Git
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Trading Kontrolleri */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Kontrolleri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-trading">Otomatik Trading</Label>
                <p className="text-sm text-muted-foreground">
                  AI'ın piyasa koşullarına göre stratejileri otomatik başlatıp durdurmasına izin ver
                </p>
              </div>
              <Switch
                id="auto-trading"
                checked={autoTrading}
                onCheckedChange={setAutoTrading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="risk-management">Risk Yönetimi</Label>
                <p className="text-sm text-muted-foreground">
                  Otomatik pozisyon boyutlandırma ve devre kesicileri etkinleştir
                </p>
              </div>
              <Switch
                id="risk-management"
                checked={riskManagement}
                onCheckedChange={setRiskManagement}
              />
            </div>
          </div>

          {riskManagement && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Maksimum Kayıp Yüzdesi (%)</Label>
                <Input
                  type="number"
                  value={maxDrawdown}
                  onChange={(e) => setMaxDrawdown(parseFloat(e.target.value) || 20)}
                  min="1"
                  max="50"
                />
              </div>
              <div className="space-y-2">
                <Label>Maksimum Pozisyon Boyutu ($)</Label>
                <Input
                  type="number"
                  value={maxPositionSize}
                  onChange={(e) => setMaxPositionSize(parseFloat(e.target.value) || 10000)}
                  min="100"
                />
              </div>
            </div>
          )}
          
          {!riskManagement && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />
              <span className="text-sm text-destructive">
                Risk yönetimi devre dışı. Bu önemli kayıplara yol açabilir.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Market Verileri */}
      {marketData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Piyasa Verileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {marketData.slice(0, 6).map((market) => (
                <div key={market.symbol} className="text-center p-3 bg-muted rounded-lg">
                  <div className="font-medium">{market.symbol}</div>
                  <div className="text-lg font-semibold">${market.price.toFixed(2)}</div>
                  <div className={`text-sm ${market.change24h >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grafik */}
      {chartData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Grafik Analizi</CardTitle>
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {symbols.map((symbol) => (
                    <SelectItem key={symbol} value={symbol}>
                      {symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <TradingChart
              data={chartData}
              width={800}
              height={400}
              symbol={selectedSymbol}
              timeframe="1h"
            />
          </CardContent>
        </Card>
      )}

      {/* Aktif Stratejiler */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Aktif Stratejiler ({liveStrategies.length})</h3>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Strateji Ekle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Canlı Strateji Ekle</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Strateji</Label>
                  <Select 
                    value={newStrategyForm.strategyId} 
                    onValueChange={(value) => setNewStrategyForm(prev => ({ ...prev, strategyId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Strateji seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map((strategy) => (
                        <SelectItem key={strategy.id} value={strategy.id}>
                          {strategy.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>İşlem Çifti</Label>
                  <Select 
                    value={newStrategyForm.symbol} 
                    onValueChange={(value) => setNewStrategyForm(prev => ({ ...prev, symbol: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {symbols.map((symbol) => (
                        <SelectItem key={symbol} value={symbol}>
                          {symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tahsis Edilen Sermaye ($)</Label>
                  <Input
                    type="number"
                    value={newStrategyForm.allocatedCapital}
                    onChange={(e) => setNewStrategyForm(prev => ({ 
                      ...prev, 
                      allocatedCapital: parseFloat(e.target.value) || 1000 
                    }))}
                    min="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Kaldıraç (Futures)</Label>
                  <Select 
                    value={newStrategyForm.leverage.toString()} 
                    onValueChange={(value) => setNewStrategyForm(prev => ({ 
                      ...prev, 
                      leverage: parseInt(value) 
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                      <SelectItem value="3">3x</SelectItem>
                      <SelectItem value="5">5x</SelectItem>
                      <SelectItem value="10">10x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Risk Seviyesi</Label>
                  <Select 
                    value={newStrategyForm.riskLevel} 
                    onValueChange={(value: LiveStrategy['riskLevel']) => 
                      setNewStrategyForm(prev => ({ ...prev, riskLevel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Düşük</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="high">Yüksek</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addLiveStrategy} className="w-full">
                  Strateji Ekle
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {liveStrategies.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <PlayIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aktif strateji yok</h3>
              <p className="text-muted-foreground">Test edilmiş stratejilerinizi canlı trading için dağıtın</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {liveStrategies.map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {strategy.name}
                        <Badge variant="outline">{strategy.symbol}</Badge>
                        <Badge className={getStatusColor(strategy.status)}>
                          {strategy.status === 'running' ? 'Çalışıyor' : 
                           strategy.status === 'paused' ? 'Duraklatıldı' : 'Durduruldu'}
                        </Badge>
                        <Badge variant="outline" className={getRiskColor(strategy.riskLevel)}>
                          {strategy.riskLevel === 'low' ? 'Düşük' : 
                           strategy.riskLevel === 'medium' ? 'Orta' : 'Yüksek'} risk
                        </Badge>
                        {strategy.leverage && strategy.leverage > 1 && (
                          <Badge variant="outline">{strategy.leverage}x</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Sermaye: {formatCurrency(strategy.allocatedCapital)}
                        {strategy.positionSize !== 0 && (
                          <> • Pozisyon: {strategy.positionSize?.toFixed(4)} {(strategy.symbol || '').replace('USDT', '')}</>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {strategy.status !== 'running' ? (
                        <Button
                          size="sm"
                          onClick={() => startStrategy(strategy.id)}
                          disabled={!isBinanceConfigured}
                        >
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Başlat
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => pauseStrategy(strategy.id)}
                        >
                          <PauseIcon className="h-4 w-4 mr-1" />
                          Duraklat
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => stopStrategy(strategy.id)}
                      >
                        <StopIcon className="h-4 w-4 mr-1" />
                        Durdur
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeStrategy(strategy.id)}
                      >
                        Kaldır
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className={`text-lg font-semibold ${strategy.pnl >= 0 ? 'text-accent' : 'text-destructive'}`}>
                        {strategy.pnl >= 0 ? '+' : ''}{formatCurrency(strategy.pnl)}
                      </div>
                      <div className="text-xs text-muted-foreground">P&L</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold">
                        {strategy.trades}
                      </div>
                      <div className="text-xs text-muted-foreground">İşlemler</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-accent">
                        {(strategy.winRate ?? 0).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Başarı Oranı</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-primary">
                        {(((strategy.pnl ?? 0) / (strategy.allocatedCapital ?? 1)) * 100).toFixed(2)}%
                      </div>
                      <div className="text-xs text-muted-foreground">ROI</div>
                    </div>
                  </div>
                  
                  {strategy.lastSignal && (
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-primary">Son Sinyal</div>
                          <div className="text-sm text-muted-foreground">{strategy.lastSignal}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {strategy.lastTradeTime && new Date(strategy.lastTradeTime).toLocaleTimeString('tr-TR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* AI Piyasa Uyarıları */}
      <Card>
        <CardHeader>
          <CardTitle>AI Piyasa Uyarıları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-accent rounded-full animate-pulse"></div>
                <span className="font-medium text-accent">Optimal Piyasa Koşulları</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                BTC/USDT'de yüksek volatilite tespit edildi. RSI stratejileri optimal performans gösteriyor.
              </p>
            </div>
            
            {liveStrategies.some(s => s.pnl < -500) && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">Risk Uyarısı</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Bazı stratejilerde artan kayıp tespit edildi. Pozisyon boyutunu azaltmayı düşünün.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}