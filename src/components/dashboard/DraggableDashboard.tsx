import React, { useState, useCallback } from 'react'
import { Responsive, WidthProvider, Layout } from 'react-grid-layout'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Settings, Lock, Unlock, RotateCcw } from 'lucide-react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TradingViewWidget } from './TradingViewWidget'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './dashboard-grid.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

// Dashboard bileşenlerinin varsayılan layout yapılandırması
const defaultLayouts = {
  lg: [
    { i: 'ai-prediction', x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'portfolio-metrics', x: 6, y: 0, w: 6, h: 2, minW: 4, minH: 2 },
    { i: 'risk-alerts', x: 0, y: 4, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'market-signals', x: 4, y: 4, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'economic-calendar', x: 8, y: 4, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'trading-chart', x: 0, y: 7, w: 12, h: 6, minW: 8, minH: 4 },
    { i: 'news-feed', x: 0, y: 13, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'recent-trades', x: 6, y: 13, w: 6, h: 4, minW: 4, minH: 3 }
  ],
  md: [
    { i: 'ai-prediction', x: 0, y: 0, w: 8, h: 4, minW: 4, minH: 3 },
    { i: 'portfolio-metrics', x: 0, y: 4, w: 8, h: 2, minW: 4, minH: 2 },
    { i: 'risk-alerts', x: 0, y: 6, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'market-signals', x: 4, y: 6, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'economic-calendar', x: 0, y: 9, w: 8, h: 3, minW: 3, minH: 2 },
    { i: 'trading-chart', x: 0, y: 12, w: 8, h: 6, minW: 6, minH: 4 },
    { i: 'news-feed', x: 0, y: 18, w: 8, h: 4, minW: 4, minH: 3 },
    { i: 'recent-trades', x: 0, y: 22, w: 8, h: 4, minW: 4, minH: 3 }
  ],
  sm: [
    { i: 'ai-prediction', x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'portfolio-metrics', x: 0, y: 4, w: 6, h: 2, minW: 4, minH: 2 },
    { i: 'risk-alerts', x: 0, y: 6, w: 6, h: 3, minW: 3, minH: 2 },
    { i: 'market-signals', x: 0, y: 9, w: 6, h: 3, minW: 3, minH: 2 },
    { i: 'economic-calendar', x: 0, y: 12, w: 6, h: 3, minW: 3, minH: 2 },
    { i: 'trading-chart', x: 0, y: 15, w: 6, h: 6, minW: 4, minH: 4 },
    { i: 'news-feed', x: 0, y: 21, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'recent-trades', x: 0, y: 25, w: 6, h: 4, minW: 4, minH: 3 }
  ]
}

interface DashboardProps {
  className?: string
}

export function DraggableDashboard({ className }: DashboardProps) {
  // Layout durumunu KV store'da saklıyoruz
  const [layouts, setLayouts] = useKV('dashboard-layouts', defaultLayouts)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState('BINANCE:BTCUSDT')

  // Layout değişikliklerini kaydet
  const handleLayoutChange = useCallback((layout: Layout[], allLayouts: any) => {
    if (isEditMode) {
      setLayouts(allLayouts)
    }
  }, [isEditMode, setLayouts])

  // Varsayılan layout'a sıfırla
  const resetLayout = useCallback(() => {
    setLayouts(defaultLayouts)
  }, [setLayouts])

  // Dashboard bileşenlerini render eden fonksiyon
  const renderWidget = (key: string) => {
    const commonClass = "h-full w-full"
    
    switch (key) {
      case 'ai-prediction':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                🧠 AI Tahmin Paneli
                <Badge variant="outline" className="text-xs">GPT-4</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>BTC/USDT Trend:</span>
                <span className="text-green-600 font-semibold">▲ %76 Yükseliş</span>
              </div>
              <div className="flex justify-between">
                <span>ETH/USDT Trend:</span>
                <span className="text-red-600 font-semibold">▼ %34 Düşüş</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Son güncelleme: 2 dk önce
              </div>
            </CardContent>
          </Card>
        )

      case 'portfolio-metrics':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">📊 Portföy Metrikleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-blue-600">$50,000</div>
                  <div className="text-muted-foreground">Portföy</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">+$1,250</div>
                  <div className="text-muted-foreground">Günlük K/Z</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">68.5%</div>
                  <div className="text-muted-foreground">Başarı</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-600">3</div>
                  <div className="text-muted-foreground">Aktif</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'risk-alerts':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">⚠️ Risk Uyarıları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>Yüksek volatilite bekleniyor</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Grid stratejisi %5 zarar</span>
              </div>
            </CardContent>
          </Card>
        )

      case 'market-signals':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">📡 Piyasa Sinyalleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span>RSI(14) - BTC:</span>
                <Badge variant="outline" className="text-green-600">Alım 72</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>MACD - ETH:</span>
                <Badge variant="outline" className="text-red-600">Satım</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>EMA Kesişim:</span>
                <Badge variant="outline" className="text-blue-600">Nötr</Badge>
              </div>
            </CardContent>
          </Card>
        )

      case 'economic-calendar':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">📅 Ekonomik Takvim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                <div>
                  <div className="font-semibold">Fed Faiz Kararı</div>
                  <div className="text-muted-foreground">15:30</div>
                </div>
                <Badge className="bg-red-500">Yüksek</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <div>
                  <div className="font-semibold">CPI Verisi</div>
                  <div className="text-muted-foreground">Yarın 16:00</div>
                </div>
                <Badge className="bg-yellow-500">Orta</Badge>
              </div>
            </CardContent>
          </Card>
        )

      case 'trading-chart':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                📈 Trading Grafiği
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={selectedSymbol}
                    onChange={(e) => setSelectedSymbol(e.target.value)}
                    className="text-xs px-2 py-1 border rounded w-32"
                    placeholder="BINANCE:BTCUSDT"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-1">
              <TradingViewWidget symbol={selectedSymbol} height="100%" />
            </CardContent>
          </Card>
        )

      case 'news-feed':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">📰 Haber Akışı</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-2 border-l-2 border-green-500 bg-green-50">
                <div className="font-semibold">Bitcoin ETF Onayı Bekleniyor</div>
                <div className="text-muted-foreground">5 dk önce • CoinDesk</div>
              </div>
              <div className="p-2 border-l-2 border-blue-500 bg-blue-50">
                <div className="font-semibold">Ethereum 2.0 Güncellemesi</div>
                <div className="text-muted-foreground">12 dk önce • CoinTelegraph</div>
              </div>
            </CardContent>
          </Card>
        )

      case 'recent-trades':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">🔄 Son İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <div>
                  <div className="font-semibold text-green-600">ALIM - BTC/USDT</div>
                  <div className="text-muted-foreground">0.025 BTC • Grid Bot</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">$1,087.50</div>
                  <div className="text-muted-foreground">2 dk önce</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <div>
                  <div className="font-semibold text-red-600">SATIM - ETH/USDT</div>
                  <div className="text-muted-foreground">0.8 ETH • Scalper</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">$1,920.00</div>
                  <div className="text-muted-foreground">8 dk önce</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return (
          <Card className={commonClass}>
            <CardContent className="flex items-center justify-center h-full">
              <span className="text-muted-foreground">Widget: {key}</span>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className={`w-full h-full ${className}`}>
      {/* Düzenleme kontrol çubuğu */}
      <div className="flex items-center justify-between mb-4 p-2 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
            className="flex items-center gap-2"
          >
            {isEditMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {isEditMode ? 'Düzenleme Modu' : 'Düzenle'}
          </Button>
          
          {isEditMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetLayout}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Sıfırla
            </Button>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {isEditMode ? 'Bileşenleri sürükleyip boyutlandırabilirsiniz' : 'Düzenlemek için Düzenle butonuna tıklayın'}
        </div>
      </div>

      {/* Sürüklenebilir grid layout */}
      <ResponsiveGridLayout
        className={`layout dashboard-grid ${isEditMode ? 'edit-mode' : ''}`}
        layouts={layouts}
        onLayoutChange={handleLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        compactType="vertical"
        preventCollision={false}
        margin={[8, 8]}
        containerPadding={[0, 0]}
      >
        {Object.keys(defaultLayouts.lg).map((_, index) => {
          const item = defaultLayouts.lg[index]
          return (
            <div key={item.i} className="bg-background rounded-lg shadow-sm border">
              {renderWidget(item.i)}
            </div>
          )
        })}
      </ResponsiveGridLayout>
    </div>
  )
}