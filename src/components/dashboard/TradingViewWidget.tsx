import React, { useEffect, useRef } from 'react'

interface TradingViewWidgetProps {
  symbol?: string
  width?: string | number
  height?: string | number
  interval?: string
  theme?: 'light' | 'dark'
  style?: string
  locale?: string
  toolbar_bg?: string
  enable_publishing?: boolean
  allow_symbol_change?: boolean
  container_id?: string
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol = "BINANCE:BTCUSDT",
  width = "100%",
  height = 400,
  interval = "30",
  theme = "light",
  style = "1",
  locale = "tr",
  toolbar_bg = "#f1f3f6",
  enable_publishing = false,
  allow_symbol_change = true,
  container_id = "tradingview-widget-container"
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    // Önceki widget'ı temizle
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }

    // TradingView script'ini kontrol et ve yükle
    const loadTradingViewScript = () => {
      return new Promise((resolve) => {
        // Eğer TradingView zaten yüklenmiş ise
        if ((window as any).TradingView) {
          resolve(true)
          return
        }

        const script = document.createElement("script")
        script.src = "https://s3.tradingview.com/tv.js"
        script.async = true
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.head.appendChild(script)
      })
    }

    const initWidget = async () => {
      const isLoaded = await loadTradingViewScript()
      
      if (isLoaded && (window as any).TradingView && containerRef.current) {
        try {
          // Benzersiz container ID oluştur
          const uniqueId = `${container_id}-${Math.random().toString(36).substr(2, 9)}`
          containerRef.current.id = uniqueId

          // Widget'ı oluştur
          widgetRef.current = new (window as any).TradingView.widget({
            autosize: true,
            symbol: symbol,
            interval: interval,
            timezone: "Etc/UTC",
            theme: theme,
            style: style,
            locale: locale,
            toolbar_bg: toolbar_bg,
            enable_publishing: enable_publishing,
            allow_symbol_change: allow_symbol_change,
            container_id: uniqueId,
            // Ek özellikler
            studies: [
              "Volume@tv-basicstudies"
            ],
            show_popup_button: true,
            popup_width: "1000",
            popup_height: "650"
          })
        } catch (error) {
          console.error('TradingView widget initialization error:', error)
          // Fallback içerik göster
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div class="flex items-center justify-center h-full bg-muted rounded-md">
                <div class="text-center">
                  <div class="text-sm font-semibold">${symbol}</div>
                  <div class="text-xs text-muted-foreground">Grafik yüklenemiyor</div>
                </div>
              </div>
            `
          }
        }
      }
    }

    initWidget()

    // Cleanup function
    return () => {
      if (widgetRef.current && widgetRef.current.remove) {
        try {
          widgetRef.current.remove()
        } catch (error) {
          console.error('Widget cleanup error:', error)
        }
      }
      widgetRef.current = null
    }
  }, [symbol, interval, theme, style, locale, toolbar_bg, enable_publishing, allow_symbol_change])

  return (
    <div 
      ref={containerRef}
      style={{ width, height }}
      className="tradingview-widget-container"
    />
  )
}

export default TradingViewWidget