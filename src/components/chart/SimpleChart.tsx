import React, { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Maximize2, Search, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { getChartData, ChartData } from '@/services/chartDataResolver'
import { useSymbolStore } from '@/store/useSymbolStore'

interface SimpleChartProps {
  height?: number
  onFullscreenClick?: () => void
}

export function SimpleChart({ height = 180, onFullscreenClick }: SimpleChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
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

  // Canvas çizim fonksiyonu
  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas || chartData.length === 0) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Canvas boyutlarını ayarla
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    
    const padding = 20
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2
    
    // Fiyat aralığını hesapla
    const prices = chartData.map(d => d.close)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice
    
    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
    
    // Grid çizgileri
    ctx.strokeStyle = '#f0f0f0'
    ctx.lineWidth = 1
    
    // Yatay grid
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(rect.width - padding, y)
      ctx.stroke()
    }
    
    // Dikey grid
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, rect.height - padding)
      ctx.stroke()
    }
    
    // Fiyat çizgisi
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    
    chartData.forEach((point, index) => {
      const x = padding + (chartWidth / (chartData.length - 1)) * index
      const y = padding + chartHeight - ((point.close - minPrice) / priceRange) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.stroke()
    
    // Son fiyat noktası
    if (chartData.length > 0) {
      const lastPoint = chartData[chartData.length - 1]
      const x = padding + chartWidth
      const y = padding + chartHeight - ((lastPoint.close - minPrice) / priceRange) * chartHeight
      
      ctx.fillStyle = priceChange.value >= 0 ? '#22c55e' : '#ef4444'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    }
    
    // Fiyat etiketi
    ctx.fillStyle = '#333'
    ctx.font = '12px Inter'
    ctx.textAlign = 'right'
    
    // Min/Max fiyat etiketi
    ctx.fillText(maxPrice.toFixed(2), rect.width - padding - 5, padding + 15)
    ctx.fillText(minPrice.toFixed(2), rect.width - padding - 5, rect.height - padding - 5)
  }

  // Canvas resize handler
  useEffect(() => {
    const handleResize = () => {
      setTimeout(drawChart, 100)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [chartData])

  // Chart data yükleme
  useEffect(() => {
    const loadData = async () => {
      if (!currentSymbol) return
      
      setLoading(true)
      try {
        const data = await getChartData(currentSymbol)
        
        if (data.length > 0) {
          setChartData(data)
          
          // Fiyat değişimi hesapla
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
          
          // Chart çiz
          setTimeout(drawChart, 100)
        }
      } catch (error) {
        console.error('Chart data yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentSymbol, setLoading])

  // Chart çizimi
  useEffect(() => {
    if (chartData.length > 0) {
      drawChart()
    }
  }, [chartData])

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

      {/* Chart Canvas */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          className="w-full border rounded"
          style={{ height: `${height}px` }}
        />
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