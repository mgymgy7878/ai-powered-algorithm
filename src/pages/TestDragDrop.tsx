import React, { useState, useCallback } from 'react'
import { Responsive, WidthProvider, Layout } from 'react-grid-layout'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Lock, 
  Unlock, 
  RotateCcw, 
  DollarSign, 
  TrendingUp, 
  Bot, 
  AlertTriangle,
  Activity,
  Calendar,
  Newspaper,
  PieChart
} from 'lucide-react'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import '../components/dashboard/dashboard-grid.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

// Test için basit layout yapılandırması
const testLayout = {
  lg: [
    { i: 'portfolio', x: 0, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'ai-prediction', x: 4, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'risk-alerts', x: 8, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
    { i: 'market-signals', x: 0, y: 3, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'news-feed', x: 6, y: 3, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'trading-chart', x: 0, y: 7, w: 12, h: 6, minW: 8, minH: 4 }
  ]
}

export default function TestDragDrop() {
  const [layouts, setLayouts] = useKV('test-dashboard-layouts', testLayout)
  const [isEditMode, setIsEditMode] = useState(true) // Test için başlangıçta açık
  const [isDragging, setIsDragging] = useState(false)

  const handleLayoutChange = useCallback((layout: Layout[], allLayouts: any) => {
    if (isEditMode) {
      setLayouts(allLayouts)
    }
  }, [isEditMode, setLayouts])

  const resetLayout = useCallback(() => {
    setLayouts(testLayout)
  }, [setLayouts])

  const renderWidget = (key: string) => {
    const commonClass = "h-full w-full"
    
    switch (key) {
      case 'portfolio':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Portföy Metrikleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-blue-600">$50,000</div>
                  <div className="text-muted-foreground">Toplam</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">+$1,250</div>
                  <div className="text-muted-foreground">Günlük</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'ai-prediction':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bot className="w-4 h-4" />
                AI Tahminleri
                <Badge variant="outline" className="text-xs">GPT-4</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>BTC/USDT:</span>
                <span className="text-green-600 font-semibold">▲ %76</span>
              </div>
              <div className="flex justify-between">
                <span>ETH/USDT:</span>
                <span className="text-red-600 font-semibold">▼ %34</span>
              </div>
            </CardContent>
          </Card>
        )

      case 'risk-alerts':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Risk Uyarıları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>Yüksek volatilite</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>Margin %85</span>
              </div>
            </CardContent>
          </Card>
        )

      case 'market-signals':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Piyasa Sinyalleri
              </CardTitle>
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
            </CardContent>
          </Card>
        )

      case 'news-feed':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                Canlı Haberler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-2 border-l-2 border-green-500 bg-green-50">
                <div className="font-semibold">Bitcoin ETF Onayı</div>
                <div className="text-muted-foreground">5 dk önce</div>
              </div>
              <div className="p-2 border-l-2 border-blue-500 bg-blue-50">
                <div className="font-semibold">Fed Faiz Kararı</div>
                <div className="text-muted-foreground">1 saat önce</div>
              </div>
            </CardContent>
          </Card>
        )

      case 'trading-chart':
        return (
          <Card className={commonClass}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Trading Grafiği (Demo)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <div className="text-lg font-semibold">📈</div>
                <div className="text-sm">Grafik burada görünecek</div>
                <div className="text-xs">Sürükle & boyutlandır</div>
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
    <div className="w-full h-full p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">🔥 Sürükle & Bırak Test Sayfası</h1>
        <p className="text-muted-foreground">
          Bu sayfada dashboard bileşenlerini sürükleyip boyutlandırma özelliğini test edebilirsiniz.
        </p>
      </div>

      {/* Düzenleme kontrol çubuğu */}
      <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
        <div className="flex items-center gap-3">
          <Button
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditMode(!isEditMode)}
            className="flex items-center gap-2"
          >
            {isEditMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {isEditMode ? 'Düzenleme Aktif' : 'Düzenleme Kapalı'}
          </Button>
          
          {isEditMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetLayout}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Layout'u Sıfırla
            </Button>
          )}

          <div className="text-sm text-muted-foreground">
            {isDragging ? '🔥 Sürükleniyor...' : 
             isEditMode ? '✨ Kutuları fareyle sürükleyin ve köşelerden boyutlandırın' : 
             '🔒 Düzenle butonuna basarak sürükleme moduna geçin'}
          </div>
        </div>
      </div>

      {/* Test Talimatları */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Test Adımları:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Düzenleme modu aktif (yukarıdaki buton yeşil olmalı)</li>
            <li>Herhangi bir kutuyu fareyle tıklayıp sürükleyin</li>
            <li>Kutuların sağ-alt köşesindeki tutamaktan boyutlandırın</li>
            <li>Layout otomatik olarak kaydedilir (sayfa yenilense bile kalır)</li>
            <li>"Layout'u Sıfırla" ile varsayılan düzene dönebilirsiniz</li>
          </ol>
        </div>
      </div>

      {/* Sürüklenebilir grid layout */}
      <ResponsiveGridLayout
        className={`layout dashboard-grid ${isEditMode ? 'edit-mode' : ''}`}
        layouts={layouts}
        onLayoutChange={handleLayoutChange}
        onDragStart={() => setIsDragging(true)}
        onDragStop={() => setIsDragging(false)}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 8, sm: 6 }}
        rowHeight={60}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        compactType="vertical"
        preventCollision={false}
        margin={[8, 8]}
        containerPadding={[0, 0]}
      >
        {testLayout.lg.map((item) => {
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