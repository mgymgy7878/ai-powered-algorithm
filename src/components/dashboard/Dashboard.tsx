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
    activeStrategies: 3
  })

  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value ?? 0)
  }

  const formatPercentage = (value: number | undefined) => {
    return `${(value ?? 0).toFixed(2)}%`
  }

  // Sidebar durumuna göre dinamik padding hesapla
  const contentPadding = 'pl-2 pr-[300px]'

  return (
    <div className="relative p-2 space-y-2">
      {/* Bildirim Merkezi - AI panelinin üst kısmında */}
      <div className="absolute top-1 right-4 w-[280px] z-50">
        <NotificationCenter />
      </div>

      {/* Yapay Zeka Trading Yöneticisi - Sağ üst köşede sabit */}
      <div className="absolute top-14 right-4 w-[280px] z-20">
        <TradingAssistant />
      </div>

      {/* Portfolio Metrics - Kompakt yatay dizilim */}
      <div className={`${contentPadding} pt-0`}>
        <div className="flex flex-wrap items-center justify-start gap-1 w-full">
          <div className="bg-muted rounded-md px-2 py-1 text-[11px] min-w-[110px] flex flex-col">
            <span className="text-muted-foreground">Portföy Değeri</span>
            <span className="font-semibold text-sm text-primary">{formatCurrency(portfolioMetrics.totalValue)}</span>
          </div>
          
          <div className="bg-muted rounded-md px-2 py-1 text-[11px] min-w-[110px] flex flex-col">
            <span className="text-muted-foreground">Günlük K/Z</span>
            <div className="flex items-center gap-1">
              <span className={`font-semibold text-sm ${portfolioMetrics.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(portfolioMetrics.dailyPnL)}
              </span>
              {portfolioMetrics.dailyPnL >= 0 ? (
                <TrendingUp className="h-2 w-2 text-green-600" />
              ) : (
                <TrendingDown className="h-2 w-2 text-red-600" />
              )}
            </div>
          </div>
          
          <div className="bg-muted rounded-md px-2 py-1 text-[11px] min-w-[110px] flex flex-col">
            <span className="text-muted-foreground">Toplam K/Z</span>
            <span className={`font-semibold text-sm ${portfolioMetrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(portfolioMetrics.totalPnL)}
            </span>
          </div>
          
          <div className="bg-muted rounded-md px-2 py-1 text-[11px] min-w-[110px] flex flex-col">
            <span className="text-muted-foreground">Başarı Oranı</span>
            <span className="font-semibold text-sm text-blue-600">{formatPercentage(portfolioMetrics.winRate)}</span>
          </div>
          
          <div className="bg-muted rounded-md px-2 py-1 text-[11px] min-w-[110px] flex flex-col">
            <span className="text-muted-foreground">Aktif Stratejiler</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-green-500">{portfolioMetrics.activeStrategies}</span>
              <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik Alanı */}
      <div className={`${contentPadding}`}>
        {/* Hızlı İstatistikler - Kompakt yatay dizilim */}
        <div className="flex flex-wrap items-center justify-start gap-1 w-full mt-2">
          <div className="bg-muted rounded-md px-2 py-1 text-[11px] min-w-[110px] flex flex-col">
            <span className="text-muted-foreground">Aktif İşlemler</span>
            <span className="font-semibold text-sm text-foreground">12</span>
          </div>

          <div className="bg-muted rounded-md px-2 py-1 text-[11px] min-w-[110px] flex flex-col">
            <span className="text-muted-foreground">Toplam İşlem</span>
            <span className="font-semibold text-sm text-foreground">1,247</span>
          </div>

          <div className="bg-muted rounded-md px-2 py-1 text-[11px] min-w-[110px] flex flex-col">
            <span className="text-muted-foreground">Ortalama Getiri</span>
            <span className="font-semibold text-sm text-green-600">+2.4%</span>
          </div>

          <div className="bg-muted rounded-md px-2 py-1 text-[11px] min-w-[110px] flex flex-col">
            <span className="text-muted-foreground">Max Drawdown</span>
            <span className="font-semibold text-sm text-red-600">-5.2%</span>
          </div>
        </div>

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
      </div>
    </div>
  )
}