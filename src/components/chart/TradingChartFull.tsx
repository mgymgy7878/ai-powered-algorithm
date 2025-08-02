import React, { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  X, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Volume2,
  Target,
  AlertTriangle,
  Brain
} from 'lucide-react'
import { getChartData, ChartData, AssetInfo, getAssetInfo } from '@/services/chartDataResolver'
import { useSymbolStore } from '@/store/useSymbolStore'

interface TradingChartFullProps {
  onClose: () => void
}

export function TradingChartFull({ onClose }: TradingChartFullProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  
  const { 
    currentSymbol, 
    currentAssetInfo, 
    isLoading, 
    searchHistory,
    setSymbol, 
    setLoading 
  } = useSymbolStore()
  
  const [searchValue, setSearchValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [timeframe, setTimeframe] = useState('1h')
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [priceStats, setPriceStats] = useState({
    current: 0,
    high24h: 0,
    low24h: 0,
    volume24h: 0,
    change: 0,
    changePercent: 0
  })

  // AI Tahmin verisi (demo)
  const [aiPrediction] = useState({
    trend: 'bullish' as 'bullish' | 'bearish' | 'sideways',
    confidence: 78,
    support: 0,
    resistance: 0,
    prediction: 'Güçlü yükseliş bekleniyor. RSI ve MACD pozitif divergence gösteriyor.'
  })

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#e0e0e0',
      },
      timeScale: {
        borderColor: '#e0e0e0',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    // Candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    })

    // Volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#94a3b8',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'left',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    })

    chartRef.current = chart
    candleSeriesRef.current = candlestickSeries
    volumeSeriesRef.current = volumeSeries

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [])

  // Load chart data
  useEffect(() => {
    const loadData = async () => {
      if (!currentSymbol) return
      
      setLoading(true)
      try {
        const data = await getChartData(currentSymbol)
        
        if (data.length > 0) {
          const candleData = data.map(item => ({
            time: Math.floor(item.time / 1000),
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          }))
          
          const volumeData = data.map(item => ({
            time: Math.floor(item.time / 1000),
            value: item.volume || 0,
            color: item.close >= item.open ? '#22c55e50' : '#ef444450'
          }))
          
          setChartData(data)
          
          if (candleSeriesRef.current) {
            candleSeriesRef.current.setData(candleData)
          }
          
          if (volumeSeriesRef.current) {
            volumeSeriesRef.current.setData(volumeData)
          }
          
          // Calculate stats
          const current = data[data.length - 1]
          const previous = data[data.length - 2]
          const prices = data.map(d => d.close)
          const volumes = data.map(d => d.volume || 0)
          
          const stats = {
            current: current.close,
            high24h: Math.max(...prices),
            low24h: Math.min(...prices),
            volume24h: volumes.reduce((sum, vol) => sum + vol, 0),
            change: current.close - previous.close,
            changePercent: ((current.close - previous.close) / previous.close) * 100
          }
          
          setPriceStats(stats)
        }
      } catch (error) {
        console.error('Chart data yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentSymbol, timeframe, setLoading])

  const handleSymbolSearch = (symbol: string) => {
    setSymbol(symbol)
    setSearchValue('')
    setShowSuggestions(false)
  }

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [])

  const getAssetTypeColor = (type: string) => {
    const colors = {
      crypto: 'bg-orange-100 text-orange-700',
      stock: 'bg-blue-100 text-blue-700',
      forex: 'bg-green-100 text-green-700',
      index: 'bg-purple-100 text-purple-700',
      commodity: 'bg-yellow-100 text-yellow-700'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'bearish':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Target className="w-4 h-4 text-yellow-600" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            {/* Symbol Search */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Sembol ara..."
                  className="w-60"
                />
              </div>
              
              {showSuggestions && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-background border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                  {searchHistory
                    .filter(symbol => symbol.toLowerCase().includes(searchValue.toLowerCase()))
                    .map(symbol => (
                      <button
                        key={symbol}
                        onClick={() => handleSymbolSearch(symbol)}
                        className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                      >
                        {symbol}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Symbol Info */}
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold">{currentAssetInfo?.symbol}</h2>
              <Badge className={getAssetTypeColor(currentAssetInfo?.type || 'crypto')}>
                {currentAssetInfo?.type?.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">
                via {currentAssetInfo?.source}
              </span>
            </div>

            {/* Timeframe Selector */}
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1m</SelectItem>
                <SelectItem value="5m">5m</SelectItem>
                <SelectItem value="15m">15m</SelectItem>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="4h">4h</SelectItem>
                <SelectItem value="1d">1d</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 flex">
          {/* Chart Area */}
          <div className="flex-1 p-4">
            {/* Price Stats */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              <Card className="p-3">
                <div className="text-xs text-muted-foreground">Güncel Fiyat</div>
                <div className="text-lg font-bold">{priceStats.current.toFixed(4)}</div>
                <div className={`text-xs flex items-center gap-1 ${
                  priceStats.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {priceStats.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {priceStats.changePercent.toFixed(2)}%
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="text-xs text-muted-foreground">24h Yüksek</div>
                <div className="text-lg font-bold text-green-600">{priceStats.high24h.toFixed(4)}</div>
              </Card>
              
              <Card className="p-3">
                <div className="text-xs text-muted-foreground">24h Düşük</div>
                <div className="text-lg font-bold text-red-600">{priceStats.low24h.toFixed(4)}</div>
              </Card>
              
              <Card className="p-3">
                <div className="text-xs text-muted-foreground">24h Hacim</div>
                <div className="text-lg font-bold flex items-center gap-1">
                  <Volume2 className="w-4 h-4" />
                  {(priceStats.volume24h / 1000000).toFixed(1)}M
                </div>
              </Card>

              <Card className="p-3">
                <div className="text-xs text-muted-foreground">AI Tahmin</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(aiPrediction.trend)}
                  <span className="text-sm font-semibold">{aiPrediction.confidence}%</span>
                </div>
              </Card>
            </div>

            {/* Chart */}
            <Card className="p-4 h-[500px]">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              <div ref={chartContainerRef} className="w-full h-full" />
            </Card>
          </div>

          {/* Side Panel - AI Analysis */}
          <div className="w-80 border-l p-4 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Analiz
            </h3>

            {/* AI Prediction */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Trend Tahmini</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(aiPrediction.trend)}
                  <span className="text-sm font-semibold">{aiPrediction.confidence}%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{aiPrediction.prediction}</p>
            </Card>

            {/* Support/Resistance */}
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Destek/Direnç Seviyeleri</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-green-600">Destek:</span>
                  <span>{(priceStats.current * 0.98).toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">Direnç:</span>
                  <span>{(priceStats.current * 1.02).toFixed(4)}</span>
                </div>
              </div>
            </Card>

            {/* Technical Indicators */}
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Teknik Göstergeler</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>RSI (14):</span>
                  <span className="text-orange-600">68.5 (Aşırı Alım)</span>
                </div>
                <div className="flex justify-between">
                  <span>MACD:</span>
                  <span className="text-green-600">Pozitif</span>
                </div>
                <div className="flex justify-between">
                  <span>EMA (20):</span>
                  <span>{(priceStats.current * 0.99).toFixed(4)}</span>
                </div>
              </div>
            </Card>

            {/* Risk Warning */}
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Risk Uyarısı</h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    Yüksek volatilite bekleniyor. Pozisyon boyutlarınızı gözden geçirin.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}