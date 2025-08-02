import React, { useState, useCallback } from 'react'
import GridLayout, { Layout } from 'react-grid-layout'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Activity, RotateCcw } from 'lucide-react'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

// Varsayılan layout tanımı
const defaultLayout: Layout[] = [
  { i: 'ai-prediction', x: 0, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
  { i: 'portfolio', x: 4, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
  { i: 'risk-alerts', x: 8, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
  { i: 'market-signals', x: 0, y: 3, w: 6, h: 3, minW: 4, minH: 2 },
  { i: 'news-feed', x: 6, y: 3, w: 6, h: 3, minW: 4, minH: 2 },
  { i: 'trading-chart', x: 0, y: 6, w: 12, h: 4, minW: 8, minH: 3 }
]

interface DashboardWidgetProps {
  title: string
  children: React.ReactNode
  className?: string
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, children, className = '' }) => (
  <Card className={`h-full ${className}`}>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pb-2">
      {children}
    </CardContent>
  </Card>
)

// AI Tahmin Widget'ı
const AIPredictionWidget = () => (
  <DashboardWidget title="📈 AI Tahmin Paneli">
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">BTCUSDT</span>
        <Badge variant="outline" className="text-green-600">
          <TrendingUp className="w-3 h-3 mr-1" />
          Yükseliş %78
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">ETHUSDT</span>
        <Badge variant="outline" className="text-red-600">
          <TrendingDown className="w-3 h-3 mr-1" />
          Düşüş %65
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Piyasa volatilitesi artıyor. Grid botlar için uygun zaman.
      </p>
    </div>
  </DashboardWidget>
)

// Portföy Widget'ı
const PortfolioWidget = () => (
  <DashboardWidget title="💰 Portföy Özeti">
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs">Toplam Değer</span>
        <span className="font-semibold">$50,125.80</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs">Günlük K/Z</span>
        <span className="text-green-600 font-semibold">+$1,250.50</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs">Başarı Oranı</span>
        <span className="font-semibold">68.5%</span>
      </div>
    </div>
  </DashboardWidget>
)

// Risk Uyarıları Widget'ı
const RiskAlertsWidget = () => (
  <DashboardWidget title="⚠️ Risk Uyarıları">
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
        <div>
          <p className="text-xs font-medium">Yüksek Volatilite</p>
          <p className="text-xs text-muted-foreground">BTC'de %15 dalgalanma bekleniyor</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <DollarSign className="w-4 h-4 text-red-500 mt-0.5" />
        <div>
          <p className="text-xs font-medium">Marj Kullanımı</p>
          <p className="text-xs text-muted-foreground">%85 marj kullanımı - dikkat!</p>
        </div>
      </div>
    </div>
  </DashboardWidget>
)

// Piyasa Sinyalleri Widget'ı
const MarketSignalsWidget = () => (
  <DashboardWidget title="📊 Piyasa Sinyalleri">
    <div className="grid grid-cols-2 gap-2">
      <div className="text-center p-2 bg-green-50 rounded">
        <Activity className="w-4 h-4 mx-auto text-green-600" />
        <p className="text-xs font-medium">RSI Oversold</p>
        <p className="text-xs text-muted-foreground">ETHUSDT</p>
      </div>
      <div className="text-center p-2 bg-blue-50 rounded">
        <TrendingUp className="w-4 h-4 mx-auto text-blue-600" />
        <p className="text-xs font-medium">MACD Cross</p>
        <p className="text-xs text-muted-foreground">BTCUSDT</p>
      </div>
    </div>
  </DashboardWidget>
)

// Haber Akışı Widget'ı
const NewsFeedWidget = () => (
  <DashboardWidget title="📰 Canlı Haber Akışı">
    <div className="space-y-2">
      <div className="border-l-2 border-green-500 pl-2">
        <p className="text-xs font-medium">Bitcoin ETF onayı yaklaşıyor</p>
        <p className="text-xs text-muted-foreground">2 saat önce • CoinDesk</p>
      </div>
      <div className="border-l-2 border-blue-500 pl-2">
        <p className="text-xs font-medium">Ethereum güncelleme tarihi açıklandı</p>
        <p className="text-xs text-muted-foreground">4 saat önce • CoinTelegraph</p>
      </div>
    </div>
  </DashboardWidget>
)

// Trading Chart Widget'ı
const TradingChartWidget = () => (
  <DashboardWidget title="📈 Trading Grafiği">
    <div className="flex items-center justify-center h-full bg-gray-50 rounded">
      <div className="text-center">
        <Activity className="w-8 h-8 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-muted-foreground">TradingView Grafik Alanı</p>
        <p className="text-xs text-muted-foreground">Bu alanda canlı grafik gösterilecek</p>
      </div>
    </div>
  </DashboardWidget>
)

const TestDragDrop: React.FC = () => {
  // Layout'u KV store'da saklıyoruz
  const [layout, setLayout] = useKV<Layout[]>('dashboard-layout', defaultLayout)
  const [isDragging, setIsDragging] = useState(false)

  // Layout değişikliklerini kaydet
  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    setLayout(newLayout)
  }, [setLayout])

  // Layout'u varsayılana sıfırla
  const resetLayout = () => {
    setLayout(defaultLayout)
  }

  // Widget render fonksiyonu
  const renderWidget = (key: string) => {
    switch (key) {
      case 'ai-prediction':
        return <AIPredictionWidget />
      case 'portfolio':
        return <PortfolioWidget />
      case 'risk-alerts':
        return <RiskAlertsWidget />
      case 'market-signals':
        return <MarketSignalsWidget />
      case 'news-feed':
        return <NewsFeedWidget />
      case 'trading-chart':
        return <TradingChartWidget />
      default:
        return <div>Bilinmeyen widget</div>
    }
  }

  return (
    <div className="p-4 h-screen bg-background">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">🎛️ Dashboard Düzenleyici</h1>
          <p className="text-sm text-muted-foreground">
            Widget'ları sürükleyip yeniden boyutlandırın. Layout otomatik kaydedilir.
          </p>
        </div>
        <Button 
          onClick={resetLayout}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Varsayılana Sıfırla
        </Button>
      </div>

      {/* Status */}
      {isDragging && (
        <div className="mb-2">
          <Badge variant="secondary">Sürükleniyor...</Badge>
        </div>
      )}

      {/* Grid Layout */}
      <div className="relative">
        <GridLayout
          className="layout"
          layout={layout || defaultLayout}
          cols={12}
          rowHeight={60}
          width={1200}
          isResizable={true}
          isDraggable={true}
          onLayoutChange={handleLayoutChange}
          onDragStart={() => setIsDragging(true)}
          onDragStop={() => setIsDragging(false)}
          margin={[8, 8]}
          containerPadding={[0, 0]}
          useCSSTransforms={true}
        >
          {(layout || defaultLayout).map((item) => (
            <div key={item.i} className="cursor-move">
              {renderWidget(item.i)}
            </div>
          ))}
        </GridLayout>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <h3 className="text-sm font-medium mb-2">Kullanım Talimatları:</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Widget'ları fare ile sürükleyerek konumunu değiştirin</li>
          <li>• Widget'ların sağ alt köşesinden sürükleyerek boyutunu değiştirin</li>
          <li>• Tüm değişiklikler otomatik olarak kaydedilir</li>
          <li>• "Varsayılana Sıfırla" butonu ile orijinal düzene dönebilirsiniz</li>
        </ul>
      </div>
    </div>
  )
}

export default TestDragDrop