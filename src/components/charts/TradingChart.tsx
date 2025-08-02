import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Maximize2, Minimize2, Search, TrendingUp } from '@phosphor-icons/react'

interface TradingChartProps {
  symbol?: string
  width?: string | number
  height?: string | number
  isFullscreen?: boolean
  onFullscreenChange?: (isFullscreen: boolean) => void
}

export const TradingChart: React.FC<TradingChartProps> = ({
  symbol = "BINANCE:BTCUSDT",
  width = "100%",
  height = 400,
  isFullscreen = false,
  onFullscreenChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)
  const [currentSymbol, setCurrentSymbol] = useState(symbol)
  const [searchInput, setSearchInput] = useState("")
  const [timeframe, setTimeframe] = useState("15")
  const [isLoading, setIsLoading] = useState(true)

  // TradingView widget yükleme fonksiyonu
  const loadTradingView = useCallback(() => {
    if (!containerRef.current) return
    
    setIsLoading(true)
    
    // Önceki widget'ı temizle
    if (widgetRef.current) {
      try {
        widgetRef.current.remove()
      } catch (e) {
        console.log('Widget cleanup error:', e)
      }
    }

    // Container'ı temizle
    containerRef.current.innerHTML = ''

    // Yeni widget container div'i oluştur
    const widgetDiv = document.createElement('div')
    widgetDiv.id = `tradingview-widget-${Date.now()}`
    containerRef.current.appendChild(widgetDiv)

    // TradingView script'i yükle veya mevcut olanı kullan
    const loadWidget = () => {
      // @ts-ignore
      if (typeof window.TradingView !== 'undefined') {
        try {
          // @ts-ignore
          widgetRef.current = new window.TradingView.widget({
            autosize: true,
            symbol: currentSymbol,
            interval: timeframe,
            timezone: "Etc/UTC",
            theme: "light",
            style: "1",
            locale: "tr",
            toolbar_bg: "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: widgetDiv.id,
            hide_side_toolbar: isFullscreen ? false : true,
            hide_top_toolbar: false,
            hide_legend: isFullscreen ? false : true,
            studies: isFullscreen ? [] : [],
            overrides: {
              "paneProperties.background": "#ffffff",
              "paneProperties.vertGridProperties.color": "#f0f0f0",
              "paneProperties.horzGridProperties.color": "#f0f0f0"
            },
            onChartReady: () => {
              setIsLoading(false)
            }
          })
        } catch (error) {
          console.error('TradingView widget creation error:', error)
          setIsLoading(false)
        }
      }
    }

    // TradingView script'i kontrol et
    // @ts-ignore
    if (typeof window.TradingView === 'undefined') {
      const script = document.createElement("script")
      script.src = "https://s3.tradingview.com/tv.js"
      script.async = true
      script.onload = loadWidget
      script.onerror = () => {
        console.error('TradingView script loading failed')
        setIsLoading(false)
      }
      document.head.appendChild(script)
    } else {
      loadWidget()
    }
  }, [currentSymbol, timeframe, isFullscreen])

  // Widget yükleme
  useEffect(() => {
    const timer = setTimeout(() => {
      loadTradingView()
    }, 100)

    return () => clearTimeout(timer)
  }, [loadTradingView])

  // Sembol değişikliği
  const handleSymbolChange = (newSymbol: string) => {
    const processedSymbol = newSymbol.toUpperCase().trim()
    
    // Otomatik prefix ekleme
    let finalSymbol = processedSymbol
    if (!processedSymbol.includes(':')) {
      if (processedSymbol.includes('USDT') || processedSymbol.includes('BTC')) {
        finalSymbol = `BINANCE:${processedSymbol}`
      } else if (processedSymbol.match(/^[A-Z]{1,4}$/)) {
        finalSymbol = `NASDAQ:${processedSymbol}`
      } else if (processedSymbol.includes('USD') && processedSymbol.length === 6) {
        finalSymbol = `OANDA:${processedSymbol}`
      }
    }
    
    setCurrentSymbol(finalSymbol)
    setSearchInput("")
  }

  // Tam ekran toggle
  const toggleFullscreen = () => {
    onFullscreenChange?.(!isFullscreen)
  }

  // Popüler semboller
  const popularSymbols = [
    { label: "BTC/USDT", value: "BINANCE:BTCUSDT" },
    { label: "ETH/USDT", value: "BINANCE:ETHUSDT" },
    { label: "AAPL", value: "NASDAQ:AAPL" },
    { label: "TSLA", value: "NASDAQ:TSLA" },
    { label: "XAU/USD", value: "OANDA:XAUUSD" },
    { label: "EUR/USD", value: "OANDA:EURUSD" }
  ]

  const ChartContent = () => (
    <>
      {/* Başlık ve Kontroller */}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-gray-800">
              Grafik Analizi
            </h3>
            <span className="text-xs text-gray-500 font-mono">
              {currentSymbol}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Popüler Semboller */}
            <div className="hidden md:flex gap-1">
              {popularSymbols.slice(0, 3).map((sym) => (
                <Button
                  key={sym.value}
                  variant={currentSymbol === sym.value ? "default" : "outline"}
                  size="sm"
                  className="text-[10px] h-6 px-2"
                  onClick={() => handleSymbolChange(sym.value)}
                >
                  {sym.label}
                </Button>
              ))}
            </div>

            {/* Timeframe Seçici */}
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-16 h-6 text-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1m</SelectItem>
                <SelectItem value="5">5m</SelectItem>
                <SelectItem value="15">15m</SelectItem>
                <SelectItem value="30">30m</SelectItem>
                <SelectItem value="60">1h</SelectItem>
                <SelectItem value="240">4h</SelectItem>
                <SelectItem value="D">1D</SelectItem>
                <SelectItem value="W">1W</SelectItem>
              </SelectContent>
            </Select>

            {/* Tam Ekran Butonu */}
            <Button
              variant="outline"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3 h-3" />
              ) : (
                <Maximize2 className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Sembol Arama */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            <Input
              placeholder="BTCUSDT, AAPL, XAUUSD..."
              className="pl-7 h-6 text-[10px]"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchInput.trim()) {
                  handleSymbolChange(searchInput)
                }
              }}
            />
          </div>
          <Button
            size="sm"
            className="h-6 text-[10px] px-2"
            onClick={() => searchInput.trim() && handleSymbolChange(searchInput)}
            disabled={!searchInput.trim()}
          >
            Ara
          </Button>
        </div>
      </CardHeader>

      {/* Grafik İçeriği */}
      <CardContent className="p-0">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
              <div className="flex flex-col items-center gap-1">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-[10px] text-gray-600">Grafik yükleniyor...</span>
              </div>
            </div>
          )}
          <div
            ref={containerRef}
            style={{ 
              width, 
              height: isFullscreen ? 'calc(100vh - 180px)' : height,
              minHeight: isFullscreen ? '600px' : '300px'
            }}
            className="rounded-b-lg overflow-hidden"
          />
        </div>
      </CardContent>
    </>
  )

  // Tam ekran modu
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <Card className="h-full rounded-none border-0">
          <ChartContent />
        </Card>
      </div>
    )
  }

  // Normal mod
  return (
    <Card className="w-full shadow-md">
      <ChartContent />
    </Card>
  )
}