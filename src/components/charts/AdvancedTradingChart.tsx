import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { createChart, LineStyle, CrosshairMode } from 'lightweight-charts'
import type { IChartApi, ISeriesApi, UTCTimestamp, LineData, CandlestickData } from 'lightweight-charts'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { 
  Maximize2, 
  Minimize2, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Search,
  Settings,
  Volume2,
  BarChart3
} from 'lucide-react'
import { binanceService } from '../../services/binanceService'
import { useKV } from '@github/spark/hooks'

export interface TradeSignal {
  time: UTCTimestamp
  type: 'buy' | 'sell'
  price: number
  id: string
  indicator?: string
  strength?: number
}

export interface ChartData {
  candlesticks: CandlestickData[]
  signals?: TradeSignal[]
  volume?: Array<{ time: UTCTimestamp; value: number; color?: string }>
}

interface AdvancedTradingChartProps {
  initialSymbol?: string
  compactHeight?: number
  expandedHeight?: number
  onSignalClick?: (signal: TradeSignal) => void
}

const TIMEFRAMES = [
  { value: '1m', label: '1 Dakika' },
  { value: '5m', label: '5 Dakika' },
  { value: '15m', label: '15 Dakika' },
  { value: '1h', label: '1 Saat' },
  { value: '4h', label: '4 Saat' },
  { value: '1d', label: '1 Gün' }
]

const POPULAR_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT',
  'XRPUSDT', 'SOLUSDT', 'DOTUSDT', 'MATICUSDT'
]

export const AdvancedTradingChart = memo(function AdvancedTradingChart({
  initialSymbol = 'BTCUSDT',
  compactHeight = 180,
  expandedHeight = 600,
  onSignalClick
}: AdvancedTradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  
  // State management
  const [symbol, setSymbol] = useKV<string>('chart-symbol', initialSymbol)
  const [timeframe, setTimeframe] = useKV<string>('chart-timeframe', '1h')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState<ChartData>({ candlesticks: [] })
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [showVolumePanel, setShowVolumePanel] = useState(true)

  // Chart dimensions
  const chartWidth = isExpanded ? 1200 : 800
  const chartHeight = isExpanded ? expandedHeight : compactHeight

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    try {
      const chart = createChart(chartContainerRef.current, {
        width: chartWidth,
        height: chartHeight,
        layout: {
          backgroundColor: '#ffffff',
          textColor: '#333333',
          fontSize: 12,
        },
        grid: {
          vertLines: { 
            color: isExpanded ? '#f0f0f0' : 'transparent',
            style: LineStyle.Dotted 
          },
          horzLines: { 
            color: isExpanded ? '#f0f0f0' : 'transparent',
            style: LineStyle.Dotted 
          },
        },
        crosshair: {
          mode: isExpanded ? CrosshairMode.Normal : CrosshairMode.Magnet,
          vertLine: {
            width: 1,
            color: '#C3BCDB44',
            style: LineStyle.Solid,
          },
          horzLine: {
            width: 1,
            color: '#C3BCDB44',
            style: LineStyle.Solid,
          },
        },
        rightPriceScale: {
          borderColor: '#cccccc',
          scaleMargins: {
            top: 0.1,
            bottom: showVolumePanel ? 0.2 : 0.1,
          },
        },
        timeScale: {
          borderColor: '#cccccc',
          timeVisible: true,
          secondsVisible: false,
          rightOffset: isExpanded ? 12 : 5,
          barSpacing: isExpanded ? 8 : 4,
          minBarSpacing: isExpanded ? 2 : 1,
        },
        handleScroll: isExpanded,
        handleScale: isExpanded,
      })

      chartRef.current = chart

      // Add candlestick series
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        priceFormat: {
          type: 'price',
          precision: 2,
          minMove: 0.01,
        },
      })
      candlestickSeriesRef.current = candlestickSeries

      // Add volume series if enabled
      if (showVolumePanel) {
        const volumeSeries = chart.addHistogramSeries({
          color: '#26a69a80',
          priceFormat: {
            type: 'volume',
          },
          priceScaleId: 'volume',
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
        })
        volumeSeriesRef.current = volumeSeries
      }

      return () => {
        try {
          chart.remove()
        } catch (error) {
          console.error('Chart cleanup error:', error)
        }
      }
    } catch (error) {
      console.error('Chart initialization error:', error)
    }
  }, [chartWidth, chartHeight, showVolumePanel, isExpanded])

  // Fetch chart data
  const fetchChartData = useCallback(async (newSymbol: string, newTimeframe: string) => {
    if (!newSymbol.trim()) return

    setIsLoading(true)
    try {
      // Get kline data from Binance
      const klines = await binanceService.getKlineData(newSymbol, newTimeframe, 500)
      
      if (klines && klines.length > 0) {
        const candlesticks: CandlestickData[] = klines.map(kline => ({
          time: Math.floor(kline.openTime / 1000) as UTCTimestamp,
          open: parseFloat(kline.open),
          high: parseFloat(kline.high),
          low: parseFloat(kline.low),
          close: parseFloat(kline.close)
        }))

        const volume = klines.map(kline => ({
          time: Math.floor(kline.openTime / 1000) as UTCTimestamp,
          value: parseFloat(kline.volume),
          color: parseFloat(kline.close) >= parseFloat(kline.open) ? '#26a69a80' : '#ef535080'
        }))

        // Generate demo signals for visualization
        const signals: TradeSignal[] = []
        for (let i = 10; i < candlesticks.length; i += 20) {
          const signal: TradeSignal = {
            time: candlesticks[i].time,
            type: Math.random() > 0.5 ? 'buy' : 'sell',
            price: (candlesticks[i].high + candlesticks[i].low) / 2,
            id: `signal_${i}`,
            indicator: Math.random() > 0.5 ? 'RSI' : 'MACD',
            strength: Math.floor(Math.random() * 40 + 60)
          }
          signals.push(signal)
        }

        setChartData({ candlesticks, volume, signals })
        
        // Update current price and change
        const lastCandle = candlesticks[candlesticks.length - 1]
        const firstCandle = candlesticks[0]
        setCurrentPrice(lastCandle.close)
        setPriceChange(((lastCandle.close - firstCandle.open) / firstCandle.open) * 100)
      }
    } catch (error) {
      console.error('Error fetching chart data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update chart data when series are available
  useEffect(() => {
    if (!chartRef.current || !candlestickSeriesRef.current) return

    try {
      if (chartData.candlesticks.length > 0) {
        candlestickSeriesRef.current.setData(chartData.candlesticks)
        
        // Update volume if available
        if (volumeSeriesRef.current && chartData.volume) {
          volumeSeriesRef.current.setData(chartData.volume)
        }

        // Add signals as markers if expanded
        if (isExpanded && chartData.signals) {
          const markers = chartData.signals.map(signal => ({
            time: signal.time,
            position: signal.type === 'buy' ? 'belowBar' as const : 'aboveBar' as const,
            color: signal.type === 'buy' ? '#26a69a' : '#ef5350',
            shape: signal.type === 'buy' ? 'arrowUp' as const : 'arrowDown' as const,
            text: `${signal.indicator} ${signal.type.toUpperCase()}`,
            size: 1
          }))
          
          candlestickSeriesRef.current.setMarkers(markers)
        }

        chartRef.current.timeScale().fitContent()
      }
    } catch (error) {
      console.error('Error updating chart data:', error)
    }
  }, [chartData, isExpanded])

  // Load data when symbol or timeframe changes
  useEffect(() => {
    fetchChartData(symbol, timeframe)
  }, [symbol, timeframe, fetchChartData])

  // Symbol search handler
  const handleSymbolChange = (newSymbol: string) => {
    const upperSymbol = newSymbol.toUpperCase()
    setSymbol(upperSymbol)
    setSearchTerm('')
  }

  // Filtered symbol suggestions
  const filteredSymbols = POPULAR_SYMBOLS.filter(s => 
    s.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Compact version render
  const renderCompactChart = () => (
    <Card className="p-3 bg-background border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{symbol}</h3>
          <Badge variant="outline" className="text-xs px-1 py-0">
            {timeframe}
          </Badge>
          {isLoading && (
            <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono">${(currentPrice || 0).toLocaleString()}</span>
          <span className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={() => setIsExpanded(true)}
          >
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <div 
        ref={chartContainerRef}
        className="rounded border bg-white"
        style={{ width: '100%', height: `${compactHeight}px` }}
      />
      
      {chartData.signals && chartData.signals.length > 0 && (
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>{chartData.signals.filter(s => s.type === 'buy').length} Alım</span>
          <span>{chartData.signals.filter(s => s.type === 'sell').length} Satım</span>
          <span>{chartData.candlesticks.length} Mum</span>
        </div>
      )}
    </Card>
  )

  // Expanded version render
  const renderExpandedChart = () => (
    <Sheet open={isExpanded} onOpenChange={setIsExpanded}>
      <SheetContent className="max-w-7xl w-full p-6">
        <SheetHeader className="mb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Gelişmiş Grafik Analizi
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Expanded controls */}
        <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
          {/* Symbol search */}
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <div className="relative">
              <Input
                placeholder="İşlem çifti ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-40 text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    handleSymbolChange(searchTerm)
                  }
                }}
              />
              {searchTerm && filteredSymbols.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-lg z-50 max-h-32 overflow-auto">
                  {filteredSymbols.slice(0, 8).map(s => (
                    <button
                      key={s}
                      className="w-full text-left px-3 py-1 text-xs hover:bg-muted"
                      onClick={() => handleSymbolChange(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick symbol buttons */}
          <div className="flex gap-1">
            {POPULAR_SYMBOLS.slice(0, 4).map(s => (
              <Button
                key={s}
                variant={symbol === s ? "default" : "outline"}
                size="sm"
                className="text-xs px-2 py-1 h-7"
                onClick={() => handleSymbolChange(s)}
              >
                {s.replace('USDT', '')}
              </Button>
            ))}
          </div>

          {/* Timeframe selector */}
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAMES.map(tf => (
                <SelectItem key={tf.value} value={tf.value} className="text-xs">
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Chart options */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant={showVolumePanel ? "default" : "outline"}
              size="sm"
              className="text-xs px-2 py-1 h-7"
              onClick={() => setShowVolumePanel(!showVolumePanel)}
            >
              <Volume2 className="w-3 h-3 mr-1" />
              Hacim
            </Button>
            
            <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-7">
              <Settings className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Price info panel */}
        <div className="flex items-center gap-4 mb-4 p-3 bg-card border rounded-lg">
          <div>
            <h2 className="text-lg font-bold">{symbol}</h2>
            <p className="text-sm text-muted-foreground">{timeframe.toUpperCase()} • Binance</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-muted-foreground">Fiyat</p>
              <p className="text-xl font-mono font-bold">${(currentPrice || 0).toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">24s Değişim</p>
              <p className={`text-lg font-semibold flex items-center gap-1 ${
                priceChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </p>
            </div>

            {chartData.signals && (
              <div>
                <p className="text-xs text-muted-foreground">AI Sinyalleri</p>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">
                    {chartData.signals.filter(s => s.type === 'buy').length} Alım
                  </Badge>
                  <Badge variant="destructive" className="text-xs">
                    {chartData.signals.filter(s => s.type === 'sell').length} Satım
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="ml-auto">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Expanded chart */}
        <div 
          ref={chartContainerRef}
          className="rounded-lg border bg-white shadow-sm"
          style={{ width: '100%', height: `${expandedHeight}px` }}
        />
        
        {/* Signal analysis panel */}
        {isExpanded && chartData.signals && chartData.signals.length > 0 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Son Sinyaller</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {chartData.signals.slice(-6).map(signal => (
                <div
                  key={signal.id}
                  className="flex items-center gap-2 p-2 bg-background rounded border cursor-pointer hover:bg-muted/30"
                  onClick={() => onSignalClick?.(signal)}
                >
                  {signal.type === 'buy' ? 
                    <TrendingUp className="w-4 h-4 text-green-600" /> : 
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  }
                  <div className="flex-1">
                    <p className="text-xs font-semibold">
                      {signal.indicator} {signal.type.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${signal.price.toFixed(2)} • %{signal.strength}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      {renderCompactChart()}
      {renderExpandedChart()}
    </>
  )
})