import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { toast } from 'sonner'
import { ChartBarIcon, PlayIcon, CogIcon, ClockIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'
import { TradingChart, ChartData, TradeSignal } from '../charts/TradingChart'
import { dataService, HistoricalDataRequest } from '../../services/dataService'
import { backtestEngine, BacktestResult, BacktestConfiguration, OptimizationConfiguration, OptimizationParameter } from '../../services/backtestEngine'
import { UTCTimestamp } from 'lightweight-charts'

export function BacktestEngine() {
  const [strategies] = useKV('trading-strategies', [])
  const [backtestResults, setBacktestResults] = useKV<BacktestResult[]>('backtest-results', [])
  
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT')
  const [timeframe, setTimeframe] = useState('1h')
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-12-31')
  const [initialCapital, setInitialCapital] = useState('10000')
  const [barCount, setBarCount] = useState('')
  const [useBarCount, setUseBarCount] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedResult, setSelectedResult] = useState<BacktestResult | null>(null)
  const [showChart, setShowChart] = useState(false)
  const [chartData, setChartData] = useState<ChartData | null>(null)

  // Optimizasyon parametreleri
  const [optimizationParams, setOptimizationParams] = useState<OptimizationParameter[]>([
    { name: 'rsiPeriod', type: 'number', min: 10, max: 30, step: 2, current: 14 },
    { name: 'rsiOverbought', type: 'number', min: 70, max: 90, step: 5, current: 80 },
    { name: 'rsiOversold', type: 'number', min: 10, max: 30, step: 5, current: 20 }
  ])

  const symbols = dataService.getPopularSymbols()

  const downloadHistoricalData = async () => {
    if (!selectedSymbol) {
      toast.error('Lütfen bir sembol seçin')
      return
    }

    setIsLoadingData(true)
    try {
      const request: HistoricalDataRequest = {
        symbol: selectedSymbol,
        interval: timeframe as any,
        limit: useBarCount && barCount ? parseInt(barCount) : 1000,
        ...(!useBarCount && {
          startTime: new Date(startDate).getTime(),
          endTime: new Date(endDate).getTime()
        })
      }

      const data = await dataService.fetchHistoricalData(request, false)
      const volumeData = await dataService.fetchVolumeData(request, false)
      
      setChartData({
        candlesticks: data,
        volume: volumeData
      })
      
      toast.success(`${data.length} adet mum verisi indirildi`)
      setShowChart(true)
      
    } catch (error) {
      console.error('Veri indirme hatası:', error)
      toast.error(`Veri indirilemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    } finally {
      setIsLoadingData(false)
    }
  }

  const runBacktest = async () => {
    if (!selectedStrategy) {
      toast.error('Lütfen test edilecek stratejiyi seçin')
      return
    }

    if (!chartData || chartData.candlesticks.length === 0) {
      toast.error('Önce tarihsel veri indirmeniz gerekiyor')
      return
    }

    setIsRunning(true)
    setProgress(0)

    try {
      const strategy = strategies.find(s => s.id === selectedStrategy)
      if (!strategy) {
        toast.error('Strateji bulunamadı')
        return
      }

      const config: BacktestConfiguration = {
        strategyId: selectedStrategy,
        symbol: selectedSymbol,
        timeframe,
        startDate,
        endDate,
        initialCapital: parseFloat(initialCapital),
        feePercentage: 0.1,
        slippage: 0.05,
        ...(useBarCount && barCount && { barCount: parseInt(barCount) })
      }

      // İlerleme simülasyonu
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 20, 90))
      }, 500)

      const result = await backtestEngine.runBacktest(
        config,
        chartData.candlesticks,
        strategy.code || ''
      )

      clearInterval(progressInterval)
      setProgress(100)

      if (result.status === 'completed') {
        setBacktestResults(current => [result, ...current])
        setSelectedResult(result)
        
        // Grafik verilerini güncelle
        setChartData(prev => prev ? {
          ...prev,
          signals: result.signals
        } : null)
        
        toast.success('Backtest başarıyla tamamlandı!')
      } else {
        toast.error(`Backtest başarısız: ${result.error || 'Bilinmeyen hata'}`)
      }
      
    } catch (error) {
      toast.error('Backtest sırasında hata oluştu')
      console.error('Backtest error:', error)
    } finally {
      setIsRunning(false)
      setProgress(0)
    }
  }

  const runOptimization = async () => {
    if (!selectedStrategy || !chartData?.candlesticks.length) {
      toast.error('Strateji ve veri seçimi gerekli')
      return
    }

    setIsOptimizing(true)
    setProgress(0)

    try {
      const strategy = strategies.find(s => s.id === selectedStrategy)
      if (!strategy) return

      const config: OptimizationConfiguration = {
        strategyId: selectedStrategy,
        parameters: optimizationParams,
        targetMetric: 'totalReturnPercentage',
        maximizeMetric: true,
        maxIterations: 50,
        symbol: selectedSymbol,
        timeframe,
        startDate,
        endDate,
        initialCapital: parseFloat(initialCapital)
      }

      await backtestEngine.runOptimization(
        config,
        chartData.candlesticks,
        strategy.code || '',
        (progressInfo) => {
          const progressPercent = (progressInfo.completed / progressInfo.total) * 100
          setProgress(progressPercent)
          
          if (progressInfo.bestResult) {
            setSelectedResult(progressInfo.bestResult)
          }
        }
      )

      toast.success('Optimizasyon tamamlandı!')
      
    } catch (error) {
      toast.error('Optimizasyon sırasında hata oluştu')
      console.error('Optimization error:', error)
    } finally {
      setIsOptimizing(false)
      setProgress(0)
    }
  }

  const viewResultDetails = (result: BacktestResult) => {
    setSelectedResult(result)
    if (result.signals.length > 0) {
      // Bu sonuca ait grafik verilerini yükle
      downloadHistoricalData().then(() => {
        setChartData(prev => prev ? {
          ...prev,
          signals: result.signals
        } : null)
        setShowChart(true)
      })
    }
  }

  const formatPercentage = (value: number | undefined) => `${(value ?? 0).toFixed(2)}%`
  const formatNumber = (value: number | undefined) => (value ?? 0).toFixed(2)
  const formatCurrency = (value: number | undefined) => `$${(value ?? 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Backtest & Optimizasyon Motoru</h2>
          <p className="text-muted-foreground">Stratejilerinizi geçmiş verilerle test edin ve optimize edin</p>
        </div>
      </div>

      <Tabs defaultValue="backtest" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="backtest">Backtest</TabsTrigger>
          <TabsTrigger value="optimization">Optimizasyon</TabsTrigger>
          <TabsTrigger value="results">Sonuçlar</TabsTrigger>
        </TabsList>

        <TabsContent value="backtest" className="space-y-6">
          {/* Backtest Yapılandırması */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CogIcon className="h-5 w-5" />
                Backtest Yapılandırması
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Strateji</Label>
                  <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
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
                  <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
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
                  <Label>Zaman Dilimi</Label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1 Dakika</SelectItem>
                      <SelectItem value="5m">5 Dakika</SelectItem>
                      <SelectItem value="15m">15 Dakika</SelectItem>
                      <SelectItem value="30m">30 Dakika</SelectItem>
                      <SelectItem value="1h">1 Saat</SelectItem>
                      <SelectItem value="4h">4 Saat</SelectItem>
                      <SelectItem value="1d">1 Gün</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Başlangıç Sermayesi</Label>
                  <Input
                    type="number"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(e.target.value)}
                    placeholder="10000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={useBarCount}
                      onChange={(e) => setUseBarCount(e.target.checked)}
                      className="rounded"
                    />
                    Bar Sayısı ile Sınırla
                  </Label>
                  <Input
                    type="number"
                    value={barCount}
                    onChange={(e) => setBarCount(e.target.value)}
                    placeholder="1000"
                    disabled={!useBarCount}
                  />
                </div>
              </div>

              {!useBarCount && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Başlangıç Tarihi</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Bitiş Tarihi</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={downloadHistoricalData} 
                  disabled={isLoadingData}
                  variant="outline"
                  className="flex-1"
                >
                  {isLoadingData ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                      Veri İndiriliyor...
                    </>
                  ) : (
                    <>
                      <ClockIcon className="h-4 w-4 mr-2" />
                      Geçmiş Veri İndir
                    </>
                  )}
                </Button>

                <Button 
                  onClick={runBacktest} 
                  disabled={isRunning || !selectedStrategy || !chartData}
                  className="flex-1"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Backtest Çalıştırılıyor...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Backtest Başlat
                    </>
                  )}
                </Button>
              </div>

              {(isRunning || isOptimizing) && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>İlerleme</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Grafik Görünümü */}
          {showChart && chartData && (
            <Card>
              <CardHeader>
                <CardTitle>Grafik Analizi - {selectedSymbol}</CardTitle>
              </CardHeader>
              <CardContent>
                <TradingChart
                  data={chartData}
                  width={800}
                  height={400}
                  symbol={selectedSymbol}
                  timeframe={timeframe}
                  onSignalClick={(signal) => {
                    toast.info(`${signal.type.toUpperCase()} sinyali: ${signal.price.toFixed(2)}`)
                  }}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parametre Optimizasyonu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimizationParams.map((param, index) => (
                <div key={param.name} className="grid grid-cols-5 gap-4 items-center">
                  <Label>{param.name}</Label>
                  <Input
                    type="number"
                    value={param.min}
                    onChange={(e) => {
                      const newParams = [...optimizationParams]
                      newParams[index].min = parseFloat(e.target.value)
                      setOptimizationParams(newParams)
                    }}
                    placeholder="Min"
                  />
                  <Input
                    type="number"
                    value={param.max}
                    onChange={(e) => {
                      const newParams = [...optimizationParams]
                      newParams[index].max = parseFloat(e.target.value)
                      setOptimizationParams(newParams)
                    }}
                    placeholder="Max"
                  />
                  <Input
                    type="number"
                    value={param.step}
                    onChange={(e) => {
                      const newParams = [...optimizationParams]
                      newParams[index].step = parseFloat(e.target.value)
                      setOptimizationParams(newParams)
                    }}
                    placeholder="Adım"
                  />
                  <Input
                    type="number"
                    value={param.current}
                    onChange={(e) => {
                      const newParams = [...optimizationParams]
                      newParams[index].current = parseFloat(e.target.value)
                      setOptimizationParams(newParams)
                    }}
                    placeholder="Mevcut"
                  />
                </div>
              ))}

              <Button 
                onClick={runOptimization} 
                disabled={isOptimizing || !selectedStrategy || !chartData}
                className="w-full"
              >
                {isOptimizing ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Optimizasyon Çalıştırılıyor...
                  </>
                ) : (
                  <>
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                    Optimizasyonu Başlat
                  </>
                )}
              </Button>

              {(isRunning || isOptimizing) && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>İlerleme</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Test Sonuçları ({backtestResults.length})</h3>
            {backtestResults.length > 0 && (
              <Button variant="outline" onClick={() => setBacktestResults([])}>
                Sonuçları Temizle
              </Button>
            )}
          </div>
          
          {backtestResults.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ChartBarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Henüz test sonucu yok</h3>
                <p className="text-muted-foreground">İlk backtest'inizi çalıştırarak performans metrikleri görün</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {backtestResults.map((result) => (
                <Card key={result.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {result.configuration.symbol}
                          <Badge variant="outline">{result.configuration.timeframe}</Badge>
                          <Badge variant={result.status === 'completed' ? 'default' : 'destructive'}>
                            {result.status === 'completed' ? 'Tamamlandı' : 'Başarısız'}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {result.configuration.startDate} - {result.configuration.endDate} • 
                          Süre: {(result.duration / 1000).toFixed(1)}s • 
                          {new Date(result.runDate).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => viewResultDetails(result)}>
                              Detayları Gör
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Backtest Detayları</DialogTitle>
                            </DialogHeader>
                            {selectedResult && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="text-lg font-semibold text-primary">
                                      {selectedResult.metrics.totalTrades}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Toplam İşlem</div>
                                  </div>
                                  <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="text-lg font-semibold text-accent">
                                      {formatPercentage(selectedResult.metrics.winRate)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Başarı Oranı</div>
                                  </div>
                                  <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="text-lg font-semibold text-primary">
                                      {formatNumber(selectedResult.metrics.sharpeRatio)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Sharpe Oranı</div>
                                  </div>
                                  <div className="text-center p-3 bg-muted rounded-lg">
                                    <div className="text-lg font-semibold text-destructive">
                                      -{formatPercentage(selectedResult.metrics.maxDrawdown)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Max Düşüş</div>
                                  </div>
                                </div>
                                
                                {chartData && (
                                  <TradingChart
                                    data={chartData}
                                    width={700}
                                    height={300}
                                    symbol={selectedResult.configuration.symbol}
                                    timeframe={selectedResult.configuration.timeframe}
                                  />
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className={`text-lg font-semibold ${(result.metrics.totalReturnPercentage ?? 0) >= 0 ? 'text-accent' : 'text-destructive'}`}>
                          {formatPercentage(result.metrics.totalReturnPercentage)}
                        </div>
                        <div className="text-xs text-muted-foreground">Toplam Getiri</div>
                      </div>
                      
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-semibold text-accent">
                          {formatPercentage(result.metrics.winRate)}
                        </div>
                        <div className="text-xs text-muted-foreground">Başarı Oranı</div>
                      </div>
                      
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-semibold text-primary">
                          {formatNumber(result.metrics.sharpeRatio)}
                        </div>
                        <div className="text-xs text-muted-foreground">Sharpe Oranı</div>
                      </div>
                      
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-semibold text-destructive">
                          -{formatPercentage(result.metrics.maxDrawdown)}
                        </div>
                        <div className="text-xs text-muted-foreground">Max Düşüş</div>
                      </div>
                      
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-semibold">
                          {result.metrics.totalTrades ?? 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Toplam İşlem</div>
                      </div>
                      
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-semibold text-primary">
                          {formatNumber(result.metrics.profitFactor)}
                        </div>
                        <div className="text-xs text-muted-foreground">Kar Faktörü</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}