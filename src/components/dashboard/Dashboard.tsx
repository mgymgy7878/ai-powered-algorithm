import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { TrendingUp, TrendingDown, BarChart } from 'lucide-react'
import { TradingAssistant } from '../ai/TradingAssistant'
import { NotificationCenter, addNotification } from '../ui/NotificationCenter'
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
  
  // Otomatik bildirimler için sayaç
  const [notificationTimer, setNotificationTimer] = useState(0)
  
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
  
  // Otomatik bildirim sistemi - gerçek piyasa olaylarını simüle eder
  useEffect(() => {
    // Demo bildirimler gönder
    setTimeout(() => {
      addNotification({
        message: 'AI Trading Platformu başarıyla başlatıldı. Tüm sistemler aktif.',
        type: 'success'
      })
    }, 1000)

    // Periyodik demo bildirimler
    const interval = setInterval(() => {
      const demoNotifications = [
        { message: 'BTCUSDT için güçlü trend sinyali tespit edildi.', type: 'info' as const },
        { message: 'Grid Bot stratejisi pozisyon güncelledi.', type: 'success' as const },
        { message: 'Volatilite artışı tespit edildi.', type: 'warning' as const },
        { message: 'ETHUSDT için alım sinyali oluştu.', type: 'info' as const }
      ]
      
      const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)]
      addNotification(randomNotification)
    }, 30000) // Her 30 saniyede bir

    return () => {
      clearInterval(interval)
    }
  }, [addActivity])
  
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
  const contentPadding = isSidebarOpen ? 'pl-16 pr-[390px]' : 'pl-16 pr-[390px]'

  return (
    <div className="relative p-6 space-y-6">
      {/* Yapay Zeka Trading Yöneticisi - Sağ üst köşede sabit */}
      <div className="absolute top-16 right-4 w-[360px] z-50">
        <TradingAssistant />
      </div>

      {/* Bildirim Merkezi - AI panelinin üst kısmında */}
      <div className="absolute top-4 right-4 z-50">
        <NotificationCenter />
      </div>

      {/* Test Bildirimleri Butonu (geliştirme amaçlı) */}
      <div className="absolute top-4 right-[100px] z-40">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => {
            // Test bildirimleri gönder
            addNotification({
              message: 'BTCUSDT için güçlü alım sinyali tespit edildi. RSI: 28, MACD pozitif kesişim.',
              type: 'success'
            })
            
            setTimeout(() => {
              addNotification({
                message: 'Grid Bot ETHUSDT stratejisi 145$ kar elde etti ve pozisyonları yeniden ayarlandı.',
                type: 'info'
              })
            }, 2000)
            
            setTimeout(() => {
              addNotification({
                message: 'Volatilite artıyor, pozisyon boyutlarını azaltmayı düşünün.',
                type: 'warning'
              })
            }, 4000)
          }}
        >
          Test Bildirimi
        </Button>
      </div>



      {/* Portfolio Metrics - Küçük yatay kutular */}
      <div className={`${contentPadding}`}>
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex flex-col px-2 py-1 bg-muted rounded-md shadow-sm text-xs min-w-[120px]">
            <span className="text-[10px] text-muted-foreground">Portföy Değeri</span>
            <span className="font-bold text-sm text-primary">{formatCurrency(portfolioMetrics.totalValue)}</span>
          </div>
          
          <div className="flex flex-col px-2 py-1 bg-muted rounded-md shadow-sm text-xs min-w-[120px]">
            <span className="text-[10px] text-muted-foreground">Günlük K/Z</span>
            <div className="flex items-center gap-1">
              <span className={`font-bold text-sm ${portfolioMetrics.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(portfolioMetrics.dailyPnL)}
              </span>
              {portfolioMetrics.dailyPnL >= 0 ? (
                <TrendingUp className="h-2 w-2 text-green-600" />
              ) : (
                <TrendingDown className="h-2 w-2 text-red-600" />
              )}
            </div>
          </div>
          
          <div className="flex flex-col px-2 py-1 bg-muted rounded-md shadow-sm text-xs min-w-[120px]">
            <span className="text-[10px] text-muted-foreground">Toplam K/Z</span>
            <span className={`font-bold text-sm ${portfolioMetrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(portfolioMetrics.totalPnL)}
            </span>
          </div>
          
          <div className="flex flex-col px-2 py-1 bg-muted rounded-md shadow-sm text-xs min-w-[120px]">
            <span className="text-[10px] text-muted-foreground">Başarı Oranı</span>
            <span className="font-bold text-sm text-blue-600">{formatPercentage(portfolioMetrics.winRate)}</span>
          </div>
          
          <div className="flex flex-col px-2 py-1 bg-muted rounded-md shadow-sm text-xs min-w-[120px]">
            <span className="text-[10px] text-muted-foreground">Aktif Stratejiler</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-green-500">{portfolioMetrics.activeStrategies}</span>
              <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik Alanı */}
      <div className={`${contentPadding}`}>
        
        {/* Hızlı İstatistikler - %50 küçültülmüş boyutlar */}
        <div className="flex flex-wrap items-center gap-1 mb-3">
          <div className="flex flex-col items-start justify-center px-2 py-1 min-w-[120px] bg-muted rounded-md text-xs leading-tight">
            <span className="text-[10px] text-muted-foreground">Aktif İşlemler</span>
            <span className="text-sm font-bold text-foreground">12</span>
          </div>

          <div className="flex flex-col items-start justify-center px-2 py-1 min-w-[120px] bg-muted rounded-md text-xs leading-tight">
            <span className="text-[10px] text-muted-foreground">Toplam İşlem</span>
            <span className="text-sm font-bold text-foreground">1,247</span>
          </div>

          <div className="flex flex-col items-start justify-center px-2 py-1 min-w-[120px] bg-muted rounded-md text-xs leading-tight">
            <span className="text-[10px] text-muted-foreground">Ortalama Getiri</span>
            <span className="text-sm font-bold text-green-600">+2.4%</span>
          </div>

          <div className="flex flex-col items-start justify-center px-2 py-1 min-w-[120px] bg-muted rounded-md text-xs leading-tight">
            <span className="text-[10px] text-muted-foreground">Max Drawdown</span>
            <span className="text-sm font-bold text-red-600">-5.2%</span>
          </div>
        </div>

        {/* Ana Grafik ve Analiz Alanı */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Portföy Performans Grafiği */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Portföy Performansı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground">Grafik yükleniyor...</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Strategies */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>En İyi Performans Gösteren Stratejiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Grid Bot BTCUSDT</p>
                    <p className="text-sm text-muted-foreground">Son 7 gün</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+12.4%</p>
                  <Badge variant="secondary" className="text-xs">
                    247 işlem
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">RSI Scalper ETHUSDT</p>
                    <p className="text-sm text-muted-foreground">Son 7 gün</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+8.7%</p>
                  <Badge variant="secondary" className="text-xs">
                    89 işlem
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Moving Average Cross</p>
                    <p className="text-sm text-muted-foreground">Son 7 gün</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+5.2%</p>
                  <Badge variant="secondary" className="text-xs">
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