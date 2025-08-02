import React, { useEffect, useRef } from 'react';

interface Props {
  symbol: string; // Örn: "BINANCE:BTCUSDT", "OANDA:XAUUSD", "NASDAQ:AAPL"
  width?: string | number;
  height?: string | number;
  interval?: string;
  theme?: 'light' | 'dark';
  allowSymbolChange?: boolean;
  locale?: string;
}

export const TradingViewWidget: React.FC<Props> = ({
  symbol = "BINANCE:BTCUSDT",
  width = "100%",
  height = 400,
  interval = "30",
  theme = "dark",
  allowSymbolChange = true,
  locale = "tr"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Widget container'ı temizle
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.type = "text/javascript";

    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        try {
          // Eski widget'ı yok et
          if (widgetRef.current) {
            widgetRef.current.remove();
          }

          // Yeni widget oluştur
          widgetRef.current = new window.TradingView.widget({
            autosize: true,
            symbol: symbol,
            interval: interval,
            timezone: "Etc/UTC",
            theme: theme,
            style: "1", // Candlestick
            locale: locale,
            toolbar_bg: theme === "dark" ? "#1a1a1a" : "#f1f3f6",
            enable_publishing: false,
            allow_symbol_change: allowSymbolChange,
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,
            container_id: `tradingview-widget-${Date.now()}`,
            studies: [
              "Volume@tv-basicstudies"
            ],
            overrides: {
              "paneProperties.background": theme === "dark" ? "#0a0a0a" : "#ffffff",
              "paneProperties.vertGridProperties.color": theme === "dark" ? "#363c4e" : "#e1e3e6",
              "paneProperties.horzGridProperties.color": theme === "dark" ? "#363c4e" : "#e1e3e6",
              "symbolWatermarkProperties.transparency": 90,
              "scalesProperties.textColor": theme === "dark" ? "#b2b5be" : "#787b86",
            }
          });
        } catch (error) {
          console.error('TradingView widget error:', error);
        }
      }
    };

    script.onerror = () => {
      console.error('TradingView script yüklenemedi');
    };

    if (containerRef.current) {
      const containerId = `tradingview-widget-${Date.now()}`;
      containerRef.current.id = containerId;
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.warn('Widget cleanup error:', e);
        }
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol, interval, theme, allowSymbolChange, locale]);

  return (
    <div 
      ref={containerRef}
      style={{ width, height }}
      className="tradingview-widget-container rounded-md overflow-hidden"
    />
  );
};

// TradingView tip tanımlaması
declare global {
  interface Window {
    TradingView: any;
  }
}