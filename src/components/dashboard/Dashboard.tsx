import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CpuChipIcon, PlayIcon } from '@heroicons/react/24/outline'
import { Gear, TestTube, Database } from '@phosphor-icons/react'
import { AIConfiguration } from '../ai/AIConfiguration'
import { AITestPanel } from '../ai/AITestPanel'
import { MarketData } from '../data/MarketData'
import { TradingAssistant } from '../ai/TradingAssistant'

interface PortfolioMetrics {
  totalValue: number
  dailyPnL: number
  totalPnL: number
  winRate: number
  activeStrategies: number
}

export function Dashboard() {
  const [showAIConfig, setShowAIConfig] = useState(false)
  const [showAITest, setShowAITest] = useState(false)
  const [showMarketData, setShowMarketData] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
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
  
  const [portfolioMetrics] = useKV<PortfolioMetrics>('portfolio-metrics', {
    totalValue: 50000,
    dailyPnL: 1250.50,
    totalPnL: 8750.25,
    winRate: 68.5,
    activeStrategies: 3
  })
  
  const [recentTrades] = useKV('recent-trades', [
    { id: 1, pair: 'BTC/USDT', side: 'BUY', amount: 0.15, price: 43250, pnl: 325.50, time: '10:45:23' },
    { id: 2, pair: 'ETH/USDT', side: 'SELL', amount: 2.5, price: 2650, pnl: -125.25, time: '10:32:15' },
    { id: 3, pair: 'SOL/USDT', side: 'BUY', amount: 25, price: 98.50, pnl: 245.75, time: '10:18:42' }
  ])

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
  const contentPadding = isSidebarOpen ? 'pl-16 pr-[380px]' : 'pl-16 pr-[380px]'

  return (
    <div className="relative p-6 space-y-6">
      {/* Yapay Zeka Trading Yöneticisi - Sağ üst köşede sabit */}
      <div className="absolute top-4 right-4 w-[360px] max-h-[500px] bg-background border rounded-lg shadow-md p-4 overflow-auto z-50">
        <TradingAssistant />
      </div>

      <div className={`flex items-center justify-between ${contentPadding}`}>
        <div>
          <h2 className="text-3xl font-bold">Anasayfa</h2>
          <p className="text-muted-foreground">AI destekli trading yönetimi ve portföy genel görünümü</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowMarketData(true)}>
            <Database className="h-4 w-4 mr-2" />
            Piyasa Verileri
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowAITest(true)}>
            <TestTube className="h-4 w-4 mr-2" />
            AI Test
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowAIConfig(true)}>
            <Gear className="h-4 w-4 mr-2" />
            AI Ayarları
          </Button>
          <Button variant="outline" size="sm">
            <CpuChipIcon className="h-4 w-4 mr-2" />
            Strateji Üret
          </Button>
          <Button size="sm">
            <PlayIcon className="h-4 w-4 mr-2" />
            Trading Başlat
          </Button>
        </div>
      </div>

      {/* Portfolio Metrics - Küçük yatay kutular */}
      <div className={`${contentPadding}`}>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-col px-3 py-2 bg-muted rounded-md shadow-sm text-xs min-w-[140px]">
            <span className="text-muted-foreground">Portföy Değeri</span>
            <span className="font-bold text-sm text-primary">{formatCurrency(portfolioMetrics.totalValue)}</span>
          </div>
          
          <div className="flex flex-col px-3 py-2 bg-muted rounded-md shadow-sm text-xs min-w-[140px]">
            <span className="text-muted-foreground">Günlük K/Z</span>
            <div className="flex items-center gap-1">
              <span className={`font-bold text-sm ${portfolioMetrics.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(portfolioMetrics.dailyPnL)}
              </span>
              {portfolioMetrics.dailyPnL >= 0 ? (
                <ArrowTrendingUpIcon className="h-3 w-3 text-green-600" />
              ) : (
                <ArrowTrendingDownIcon className="h-3 w-3 text-red-600" />
              )}
            </div>
          </div>
          
          <div className="flex flex-col px-3 py-2 bg-muted rounded-md shadow-sm text-xs min-w-[140px]">
            <span className="text-muted-foreground">Toplam K/Z</span>
            <span className={`font-bold text-sm ${portfolioMetrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(portfolioMetrics.totalPnL)}
            </span>
          </div>
          
          <div className="flex flex-col px-3 py-2 bg-muted rounded-md shadow-sm text-xs min-w-[140px]">
            <span className="text-muted-foreground">Başarı Oranı</span>
            <span className="font-bold text-sm text-blue-600">{formatPercentage(portfolioMetrics.winRate)}</span>
          </div>
          
          <div className="flex flex-col px-3 py-2 bg-muted rounded-md shadow-sm text-xs min-w-[140px]">
            <span className="text-muted-foreground">Aktif Stratejiler</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-green-500">{portfolioMetrics.activeStrategies}</span>
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className={contentPadding}>
        <Card>
        <CardHeader>
          <CardTitle>Son İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Son 2 işlemi güvenli şekilde göster */}
            {(recentTrades || []).slice(0, 2).map((trade) => (
              <div key={trade.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant={trade.side === 'BUY' ? 'default' : 'secondary'}>
                    {trade.side}
                  </Badge>
                  <div>
                    <div className="font-medium">{trade.pair}</div>
                    <div className="text-sm text-muted-foreground">
                      {trade.amount} @ {formatCurrency(trade.price)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${trade.pnl >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                  </div>
                  <div className="text-sm text-muted-foreground">{trade.time}</div>
                </div>
              </div>
            ))}
            {/* Eğer hiç işlem yoksa boş durum mesajı göster */}
            {(!recentTrades || recentTrades.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Henüz işlem bulunmuyor</p>
                <p className="text-sm">İlk işleminizi gerçekleştirdiğinizde burada görünecektir</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Market Data Dialog */}
      <Dialog open={showMarketData} onOpenChange={setShowMarketData}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Canlı Piyasa Verileri</DialogTitle>
          </DialogHeader>
          <MarketData />
        </DialogContent>
      </Dialog>

      {/* AI Configuration Dialog */}
      <Dialog open={showAIConfig} onOpenChange={setShowAIConfig}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Konfigürasyonu</DialogTitle>
          </DialogHeader>
          <AIConfiguration onClose={() => setShowAIConfig(false)} />
        </DialogContent>
      </Dialog>

      {/* AI Test Dialog */}
      <Dialog open={showAITest} onOpenChange={setShowAITest}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI API Test</DialogTitle>
          </DialogHeader>
          <AITestPanel />
        </DialogContent>
      </Dialog>
    </div>
  )
}