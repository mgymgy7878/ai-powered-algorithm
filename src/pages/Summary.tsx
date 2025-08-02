import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

export default function Summary() {
  // Mock data for demonstration
  const summaryData = {
    portfolioValue: 50000.00,
    dailyPnL: 1250.50,
    totalPnL: 8750.25,
    winRate: 68.5,
    activeStrategies: 3,
    totalTrades: 1247,
    activeTrades: 12,
    maxDrawdown: -5.2,
    systemStatus: 'Aktif',
    riskLevel: 'Orta'
  }

  const recentPerformance = [
    { period: 'Son 1 Saat', pnl: +150.25, change: +0.3 },
    { period: 'Son 24 Saat', pnl: +1250.50, change: +2.5 },
    { period: 'Son 7 Gün', pnl: +3420.75, change: +6.8 },
    { period: 'Son 30 Gün', pnl: +8750.25, change: +17.5 }
  ]

  const strategySummary = [
    { name: 'Grid Bot BTCUSDT', status: 'Aktif', pnl: +2450.30, trades: 89 },
    { name: 'RSI Scalper ETHUSDT', status: 'Aktif', pnl: +1820.15, trades: 156 },
    { name: 'MA Cross ADAUSDT', status: 'Duraklatıldı', pnl: +480.80, trades: 34 }
  ]

  const riskMetrics = [
    { name: 'Portföy Riski', value: 32, max: 100, status: 'Orta' },
    { name: 'Likidite Riski', value: 15, max: 100, status: 'Düşük' },
    { name: 'Piyasa Riski', value: 58, max: 100, status: 'Yüksek' }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📊 Trading Özeti</h1>
          <p className="text-muted-foreground mt-1">
            Portföy performansı ve sistem durumu genel görünümü
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sistem Aktif
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Son Güncelleme: 14:35
          </Badge>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portföy Değeri</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryData.portfolioValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Toplam yatırım değeri
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Günlük K/Z</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +${summaryData.dailyPnL.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{((summaryData.dailyPnL / summaryData.portfolioValue) * 100).toFixed(2)}% günlük
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Başarı Oranı</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.winRate}%</div>
            <p className="text-xs text-muted-foreground">
              {summaryData.totalTrades} işlemden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Stratejiler</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.activeStrategies}</div>
            <p className="text-xs text-muted-foreground">
              {summaryData.activeTrades} açık pozisyon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Performans Özeti</CardTitle>
          <CardDescription>Farklı zaman dilimlerinde kar/zarar durumu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentPerformance.map((item, index) => (
              <div key={index} className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.period}</span>
                  {item.pnl > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className={`text-lg font-bold ${item.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.pnl > 0 ? '+' : ''}${item.pnl.toLocaleString()}
                </div>
                <div className={`text-xs ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change > 0 ? '+' : ''}{item.change}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategy Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Strateji Durumu</CardTitle>
            <CardDescription>Aktif stratejilerin performans özeti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strategySummary.map((strategy, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{strategy.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {strategy.trades} işlem
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <div className={`font-bold ${strategy.pnl > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {strategy.pnl > 0 ? '+' : ''}${strategy.pnl.toLocaleString()}
                    </div>
                  </div>
                  <Badge variant={strategy.status === 'Aktif' ? 'default' : 'secondary'}>
                    {strategy.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Değerlendirmesi</CardTitle>
            <CardDescription>Portföy risk seviyesi analizi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    <Badge 
                      variant="outline" 
                      className={
                        metric.status === 'Düşük' ? 'bg-green-50 text-green-700 border-green-200' :
                        metric.status === 'Orta' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }
                    >
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="bg-muted h-2 rounded">
                    <div 
                      className="bg-primary h-2 rounded"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.value}% / {metric.max}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Sistem Uyarıları ve Öneriler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Yüksek Volatilite Uyarısı</div>
                <div className="text-sm text-yellow-700">
                  BTCUSDT çiftinde anormal volatilite tespit edildi. Grid bot parametrelerini gözden geçirin.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">AI Önerisi</div>
                <div className="text-sm text-blue-700">
                  Portföy dengesini korumak için ETHUSDT pozisyonunu %15 artırmayı düşünün.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}