import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { TradingAssistant } from '../ai/TradingAssistant'

interface PortfolioMetrics {
  totalValue: number
  dailyPnL: number
  totalPnL: number
  winRate: number
  activeStrategies: number
}

export function Dashboard() {
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
      <div className="absolute top-16 right-4 w-[360px] z-50">
        <TradingAssistant />
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
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
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


    </div>
  )
}