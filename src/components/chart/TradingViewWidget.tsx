import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Maximize2, Minimize2, TrendingUp } from 'lucide-react'

interface TradingViewWidgetProps {
  symbol?: string
  width?: string | number
  height?: string | number
  isFullscreen?: boolean
  onFullscreenToggle?: () => void
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol: initialSymbol = "BINANCE:BTCUSDT",
  width = "100%",
  height = 400,
  isFullscreen = false,
  onFullscreenToggle
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [symbol, setSymbol] = useState(initialSymbol)
  const [timeframe, setTimeframe] = useState('1h')
  const [widgetId] = useState(`tradingview-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    if (!containerRef.current) return

    // TradingView widget scriptini temizle ve yeniden oluştur
    const container = containerRef.current
    container.innerHTML = ''

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true

    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: timeframe,
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "tr",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: widgetId,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: [
            "Volume@tv-basicstudies",
            "RSI@tv-basicstudies"
          ]
        })
      }
    }

    // Script'i container'a ekle
    const scriptContainer = document.createElement('div')
    scriptContainer.id = widgetId
    scriptContainer.style.width = '100%'
    scriptContainer.style.height = '100%'
    container.appendChild(scriptContainer)
    
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [symbol, timeframe, widgetId])

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol.toUpperCase())
  }

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe)
  }

  return (
    <Card className={`${isFullscreen ? 'h-full' : ''} shadow-lg border-border/50`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold">Grafik Analizi</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sembol Girişi */}
            <Input
              type="text"
              value={symbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
              placeholder="BINANCE:BTCUSDT"
              className="w-32 text-xs h-7"
            />
            
            {/* Timeframe Seçici */}
            <Select value={timeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="w-16 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1m</SelectItem>
                <SelectItem value="5m">5m</SelectItem>
                <SelectItem value="15m">15m</SelectItem>
                <SelectItem value="30m">30m</SelectItem>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="4h">4h</SelectItem>
                <SelectItem value="1D">1D</SelectItem>
                <SelectItem value="1W">1W</SelectItem>
                <SelectItem value="1M">1M</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Tam Ekran Butonu */}
            {onFullscreenToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onFullscreenToggle}
                className="h-7 w-7"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          ref={containerRef}
          style={{ width, height: isFullscreen ? 'calc(100vh - 120px)' : height }}
          className="rounded-b-lg overflow-hidden"
        />
      </CardContent>
    </Card>
  )
}

export default TradingViewWidget

// TradingView tipi tanımlaması
declare global {
  interface Window {
    TradingView?: any
  }
}