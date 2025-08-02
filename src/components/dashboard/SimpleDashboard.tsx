import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Bot, 
  AlertTriangle,
  Target,
  Bell,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export const SimpleDashboard: React.FC = () => {
  // Basit statik veriler
  const portfolioData = {
    totalValue: 50000,
    dailyPnl: 1250.50,
    totalPnl: 8750.25,
    winRate: 68.5,
    activeStrategies: 3
  }

  // Bildirim verisi
  const notifications = [
    "BTCUSDT için güçlü trend sinyali tespit edildi.",
    "Yüksek volatilite bekleniyor - pozisyonları gözden geçirin.",
    "AI Trading Platformu aktif! Tüm sistemler çalışıyor."
  ]

  // Sidebar toggle event handler
  useEffect(() => {
    const handleSidebarToggleRequest = () => {
      // Sidebar toggle event'ini tetikle
      const event = new CustomEvent('sidebar-toggle')
      window.dispatchEvent(event)
    }

    window.addEventListener('sidebar-toggle-request', handleSidebarToggleRequest)
    
    return () => {
      window.removeEventListener('sidebar-toggle-request', handleSidebarToggleRequest)
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Menü Gizle Butonu ve Üst Kartlar */}
      <div className="flex items-center p-2 space-x-2 border-b">
        {/* Menü toggle butonu - sol üstte */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0"
          onClick={() => {
            const event = new CustomEvent('sidebar-toggle-request')
            window.dispatchEvent(event)
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Üst metrik kartları - sola yaslanmış */}
        <div className="flex space-x-2 flex-1">
          <Card className="min-w-[120px] h-16">
            <CardContent className="p-2 flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">Portföy Değeri</p>
                <p className="text-sm font-bold text-blue-600 truncate">
                  ${portfolioData.totalValue.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-[120px] h-16">
            <CardContent className="p-2 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">Günlük K/Z</p>
                <p className="text-sm font-bold text-green-600 truncate">
                  +${portfolioData.dailyPnl.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-[120px] h-16">
            <CardContent className="p-2 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">Toplam K/Z</p>
                <p className="text-sm font-bold text-green-600 truncate">
                  +${portfolioData.totalPnl.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-[120px] h-16">
            <CardContent className="p-2 flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">Başarı Oranı</p>
                <p className="text-sm font-bold text-blue-600 truncate">
                  {portfolioData.winRate}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-[120px] h-16">
            <CardContent className="p-2 flex items-center space-x-2">
              <Bot className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">Aktif Stratejiler</p>
                <p className="text-sm font-bold text-green-600 truncate">
                  {portfolioData.activeStrategies}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bildirim kutusu - sağda */}
        <Card className="w-72 h-16 flex-shrink-0">
          <CardContent className="p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <Bell className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Son Bildirim</p>
                <p className="text-xs font-medium truncate">
                  {notifications[0]}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="ml-2 flex-shrink-0">+{notifications.length - 1}</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Ana içerik alanı */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sol panel - Modül kartları */}
        <div className="w-80 p-4 border-r overflow-y-auto space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bot className="w-4 h-4" />
                AI Tahmin
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">BTCUSDT</span>
                  <Badge className="bg-green-100 text-green-700">▲ %76 Yükseliş</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Güçlü alım sinyali tespit edildi. Momentum pozitif.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4" />
                Risk Uyarısı
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Genel Risk</span>
                  <Badge className="bg-yellow-100 text-yellow-700">Orta</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  3 pozisyon aktif olarak izleniyor.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4" />
                Sistem Durumu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Motor</span>
                  <Badge className="bg-green-100 text-green-700">✅ Aktif</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tüm sistemler normal çalışıyor.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BarChart3 className="w-4 h-4" />
                Portföy Performansı
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bu Ay</span>
                  <Badge className="bg-green-100 text-green-700">+12.3%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Son 30 günde güçlü performans.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grafik alanı */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">BTCUSDT Grafik</CardTitle>
                <div className="flex items-center space-x-2">
                  <select className="text-sm border rounded px-2 py-1">
                    <option value="1m">1m</option>
                    <option value="5m">5m</option>
                    <option value="15m">15m</option>
                    <option value="1h">1h</option>
                    <option value="4h">4h</option>
                    <option value="1d">1d</option>
                  </select>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="h-full bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Grafik yükleniyor...</p>
                  <p className="text-xs text-muted-foreground mt-2">TradingView entegrasyonu yakında</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ panel - AI Trading Yöneticisi */}
        <div className="w-80 border-l flex flex-col">
          {/* AI Trading Yöneticisi */}
          <div className="flex-1 p-4">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">AI Trading Yöneticisi</CardTitle>
                  <Button size="sm" variant="ghost">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="bg-muted rounded-lg p-4 flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">AI Asistanı</p>
                    <p className="text-xs text-muted-foreground">Hazır olmaya devam ediyor...</p>
                  </div>
                </div>
                <div className="mt-4 flex">
                  <input 
                    type="text" 
                    placeholder="AI'a mesaj yaz..." 
                    className="flex-1 text-sm border rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button size="sm" className="rounded-l-none">
                    →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alt panel - Bildirimler */}
          <div className="p-4 border-t">
            <Card className="h-32">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Bildirimler
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {notifications.slice(0, 3).map((notification, index) => (
                    <div key={index} className="text-xs text-muted-foreground p-1 bg-muted rounded">
                      {notification}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}