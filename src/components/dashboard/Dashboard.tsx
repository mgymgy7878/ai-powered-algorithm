import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { TrendingUp, TrendingDown, BarChart } from 'lucide-react'
import { TradingAssistant } from '../ai/TradingAssistant'
import { NotificationCenter } from '../ui/NotificationCenter'
import { useActivity } from '../../contexts/ActivityContext'

interface PortfolioMetrics {
  totalValue: number
  dailyPnL: number
  totalPnL: number
  winRate: number
  activeStrategies: number
  activeTrades: number
  totalTrades: number
  avgReturn: number
  maxDrawdown: number
}

export function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { activities, addActivity } = useActivity()
  
  // Sidebar durumu değişikliklerini dinle
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      setIsSidebarOpen(event.detail.isOpen)
    }
    
    window.addEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
    
    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle as EventListener)
    }
  }, [])
  
  // Otomatik demo bildirimler sistemi
  useEffect(() => {
    // Demo bildirimleri global pushNotification ile gönder
    const sendInitialNotification = () => {
      if ((window as any).pushNotification) {
        (window as any).pushNotification('AI Trading Platformu başarıyla başlatıldı. Tüm sistemler aktif.', 'success')
      }
    }

    // 2 saniye sonra başlat
    setTimeout(sendInitialNotification, 2000)

    // Periyodik demo bildirimler
    const interval = setInterval(() => {
      if ((window as any).pushNotification) {
        const demoNotifications = [
          { message: 'BTCUSDT için güçlü trend sinyali tespit edildi.', type: 'info' },
          { message: 'Grid Bot stratejisi pozisyon güncelledi.', type: 'success' },
          { message: 'Volatilite artışı tespit edildi.', type: 'warning' },
          { message: 'ETHUSDT için alım sinyali oluştu.', type: 'info' }
        ]
        
        const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)]
        ;(window as any).pushNotification(randomNotification.message, randomNotification.type)
      }
    }, 45000) // Her 45 saniyede bir

    return () => {
      clearInterval(interval)
    }
  }, [])
  
  const [portfolioMetrics] = useKV<PortfolioMetrics>('portfolio-metrics', {
    totalValue: 50000,
    dailyPnL: 1250.50,
    totalPnL: 8750.25,
    winRate: 68.5,
    activeStrategies: 3,
    activeTrades: 12,
    totalTrades: 1247,
    avgReturn: 2.4,
    maxDrawdown: -5.2
  })

  // Portfolio metrics için güvenli erişim - extra safety layer
  const safePortfolioMetrics = portfolioMetrics || {
    totalValue: 0,
    dailyPnL: 0,
    totalPnL: 0,
    winRate: 0,
    activeStrategies: 0,
    activeTrades: 0,
    totalTrades: 0,
    avgReturn: 0,
    maxDrawdown: 0
  }

  const formatCurrency = (value?: number | null) => {
    if (value === undefined || value === null || isNaN(Number(value))) {
      return '$0.00'
    }
    try {
      const numValue = Number(value)
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(numValue)
    } catch (error) {
      console.warn('Currency formatting error:', error)
      return `$${Number(value || 0).toFixed(2)}`
    }
  }

  const formatPercentage = (value?: number | null) => {
    if (value === undefined || value === null || isNaN(Number(value))) {
      return '0.00%'
    }
    try {
      const numValue = Number(value)
      return `${numValue.toFixed(2)}%`
    } catch (error) {
      console.warn('Percentage formatting error:', error)
      return '0.00%'
    }
  }

  // Tüm gösterge kutularını tek satırda göstermek için birleştir
  const allMetrics = [
    { label: "Portföy Değeri", value: formatCurrency(safePortfolioMetrics.totalValue), color: 'text-blue-700' },
    { label: "Günlük K/Z", value: formatCurrency(safePortfolioMetrics.dailyPnL), color: safePortfolioMetrics.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600' },
    { label: "Toplam K/Z", value: formatCurrency(safePortfolioMetrics.totalPnL), color: safePortfolioMetrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600' },
    { label: "Başarı Oranı", value: formatPercentage(safePortfolioMetrics.winRate), color: 'text-blue-700' },
    { label: "Aktif Stratejiler", value: (safePortfolioMetrics.activeStrategies ?? 0).toString(), color: 'text-green-600' },
    { label: "Aktif İşlemler", value: (safePortfolioMetrics.activeTrades ?? 0).toString(), color: 'text-blue-700' },
    { label: "Toplam İşlem", value: (safePortfolioMetrics.totalTrades ?? 0).toLocaleString(), color: 'text-blue-700' },
    { label: "Ortalama Getiri", value: `+${(safePortfolioMetrics.avgReturn ?? 0).toFixed(1)}%`, color: 'text-green-600' },
    { label: "Max Drawdown", value: `${(safePortfolioMetrics.maxDrawdown ?? 0).toFixed(1)}%`, color: 'text-red-600' }
  ]

  return (
    <div className="relative p-2 space-y-2">
      {/* Tüm Portföy Metrikleri - Tek satırda, menü ile bildirim arasında */}
      <div className="absolute top-3 left-[60px] right-[140px] z-40 px-2 flex items-center gap-2 justify-start max-w-[calc(100vw-220px)] overflow-hidden">
        {allMetrics.map((metric, index) => (
          <div key={index} className="bg-muted rounded-md px-3 py-2 text-center shadow-sm min-w-[120px] flex-shrink-0">
            <p className="text-[11px] text-muted-foreground truncate leading-tight">{metric.label}</p>
            <p className={`text-sm font-semibold ${metric.color} leading-tight`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Bildirim Merkezi - AI panelinin üst kısmında */}
      <div className="absolute top-1 right-4 w-[280px] z-50">
        <NotificationCenter />
      </div>
      {/* Yapay Zeka Trading Yöneticisi - Sağ üst köşede sabit */}
      <div className="absolute top-14 right-4 w-[280px] z-20">
        <TradingAssistant />
      </div>
      {/* Ana İçerik Alanı - Üstteki metrikler için boşluk bırak */}
      <div className="pl-2 pr-[300px] pt-12">
        {/* Ana Grafik ve Analiz Alanı */}
        <div className="grid grid-cols-1 gap-2 mt-3">
          {/* Portföy Performans Grafiği */}
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BarChart className="h-4 w-4" />
                Portföy Performansı
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground text-sm">Grafik yükleniyor...</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Strategies */}
        <Card className="mt-2">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">En İyi Performans Gösteren Stratejiler</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">Grid Bot BTCUSDT</p>
                    <p className="text-[10px] text-muted-foreground">Son 7 gün</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600 text-xs">+12.4%</p>
                  <Badge variant="secondary" className="text-[10px] px-1">
                    247 işlem
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">RSI Scalper ETHUSDT</p>
                    <p className="text-[10px] text-muted-foreground">Son 7 gün</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600 text-xs">+8.7%</p>
                  <Badge variant="secondary" className="text-[10px] px-1">
                    89 işlem
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">Moving Average Cross</p>
                    <p className="text-[10px] text-muted-foreground">Son 7 gün</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600 text-xs">+5.2%</p>
                  <Badge variant="secondary" className="text-[10px] px-1">
                    34 işlem
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Metrics bölümünü kaldır - artık üstte tek satırda gösteriliyor */}
      </div>
    </div>
  );
}