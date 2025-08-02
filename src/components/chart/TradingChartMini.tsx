import React, { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ISeriesApi, LineStyle } from 'lightweight-charts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Maximize2, Search, TrendingUp, TrendingDown } from 'lucide-react'
import { getChartData, ChartData, AssetInfo } from '@/services/chartDataResolver'
import { useSymbolStore } from '@/store/useSymbolStore'

interface TradingChartMiniProps {
  height?: number
  onFullscreenClick?: () => void
}

export function TradingChartMini({ height = 180, onFullscreenClick }: TradingChartMiniProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  
  const { 
    currentSymbol, 
    currentAssetInfo, 
    isLoading, 
    searchHistory,
    setSymbol, 
    setLoading, 
    toggleFullscreen 
  } = useSymbolStore()
  
  const [searchValue, setSearchValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [priceChange, setPriceChange] = useState({ value: 0, percentage: 0 })

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
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

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    })

    chartRef.current = chart
    seriesRef.current = candlestickSeries

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
  }, [height])

  // Load chart data
  useEffect(() => {
    const loadData = async () => {
      if (!currentSymbol) return
      
      setLoading(true)
      try {
        const data = await getChartData(currentSymbol)
        
        if (data.length > 0) {
          const formattedData = data.map(item => ({
            time: Math.floor(item.time / 1000), // Convert to seconds
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          }))
          
          setChartData(data)
          
          if (seriesRef.current) {
            seriesRef.current.setData(formattedData)
          }
          
          // Calculate price change
          if (data.length >= 2) {
            const current = data[data.length - 1].close
            const previous = data[data.length - 2].close
            const change = current - previous
            const changePercent = (change / previous) * 100
            
            setPriceChange({
              value: change,
              percentage: changePercent
            })
          }
        }
      } catch (error) {
        console.error('Chart data yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentSymbol, setLoading])

  const handleSymbolSearch = (symbol: string) => {
    setSymbol(symbol)
    setSearchValue('')
    setShowSuggestions(false)
  }

  const handleFullscreen = () => {
    toggleFullscreen()
    onFullscreenClick?.()
  }

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

  const filteredHistory = searchHistory.filter(symbol => 
    symbol.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <Card className="p-3 bg-background border">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
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
                placeholder="Sembol ara (BTCUSDT, AAPL...)"
                className="w-48 h-8 text-xs"
              />
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && (searchValue || filteredHistory.length > 0) && (
              <div className="absolute top-full left-0 w-full mt-1 bg-background border rounded-md shadow-md z-50 max-h-40 overflow-y-auto">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map(symbol => (
                    <button
                      key={symbol}
                      onClick={() => handleSymbolSearch(symbol)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-muted"
                    >
                      {symbol}
                    </button>
                  ))
                ) : searchValue && (
                  <button
                    onClick={() => handleSymbolSearch(searchValue)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-muted"
                  >
                    "{searchValue.toUpperCase()}" ara
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <Button
          onClick={handleFullscreen}
          size="sm"
          variant="ghost"
          className="h-8 px-2"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Symbol Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{currentAssetInfo?.symbol}</h3>
          <Badge 
            variant="secondary" 
            className={`text-xs ${getAssetTypeColor(currentAssetInfo?.type || 'crypto')}`}
          >
            {currentAssetInfo?.type?.toUpperCase()}
          </Badge>
          <span className="text-xs text-muted-foreground">
            via {currentAssetInfo?.source}
          </span>
        </div>
        
        {/* Price Change */}
        <div className="flex items-center gap-1">
          {priceChange.value !== 0 && (
            <>
              {priceChange.value > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-xs font-medium ${
                priceChange.value > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {priceChange.percentage.toFixed(2)}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full" style={{ height: `${height}px` }} />
      </div>

      {/* Current Price */}
      {chartData.length > 0 && (
        <div className="mt-2 text-right">
          <span className="text-lg font-bold">
            {chartData[chartData.length - 1]?.close.toFixed(currentAssetInfo?.type === 'crypto' ? 2 : 4)}
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            {new Date(chartData[chartData.length - 1]?.time).toLocaleTimeString('tr-TR')}
          </span>
        </div>
      )}
    </Card>
  )
}