import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Bot, 
  AlertTriangle,
  Target
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

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">AI Trading Dashboard</h1>
        <p className="text-muted-foreground">
          Algoritmik trading platformu kontrol paneli
        </p>
      </div>

      {/* Üst metrik kartları */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Portföy Değeri</p>
                <p className="text-lg font-bold text-blue-600">
                  ${portfolioData.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Günlük K/Z</p>
                <p className="text-lg font-bold text-green-600">
                  +${portfolioData.dailyPnl.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Toplam K/Z</p>
                <p className="text-lg font-bold text-green-600">
                  +${portfolioData.totalPnl.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs text-muted-foreground">Başarı Oranı</p>
                <p className="text-lg font-bold text-blue-600">
                  {portfolioData.winRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Aktif Stratejiler</p>
                <p className="text-lg font-bold text-green-600">
                  {portfolioData.activeStrategies}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* İkinci sıra kartlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Bot className="w-4 h-4" />
              AI Tahmin
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Risk Uyarısı
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4" />
              Sistem Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
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
      </div>

      {/* Placeholder için gelecek özellikler */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">🚀 Yakında Eklenecek Özellikler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• TradingView Grafik Entegrasyonu</p>
            <p>• Gelişmiş AI Trading Yöneticisi</p>
            <p>• Gerçek Zamanlı Bildirim Sistemi</p>
            <p>• Portföy Analiz Grafikleri</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}