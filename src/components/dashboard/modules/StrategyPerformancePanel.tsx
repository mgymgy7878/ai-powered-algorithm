import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { BarChart, TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface StrategyPerformance {
  id: string
  name: string
  type: 'grid' | 'scalping' | 'trend' | 'arbitrage'
  status: 'active' | 'paused' | 'stopped'
  dailyPnl: number
  weeklyPnl: number
  totalPnl: number
  winRate: number
  totalTrades: number
  activeTrades: number
  lastTrade?: Date
}

export function StrategyPerformancePanel() {
  const [strategies, setStrategies] = useState<StrategyPerformance[]>([
    {
      id: '1',
      name: 'Grid Bot BTCUSDT',
      type: 'grid',
      status: 'active',
      dailyPnl: 124.50,
      weeklyPnl: 847.25,
      totalPnl: 2856.75,
      winRate: 68.5,
      totalTrades: 247,
      activeTrades: 3,
      lastTrade: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '2',
      name: 'RSI Scalper ETHUSDT',
      type: 'scalping',
      status: 'active',
      dailyPnl: 89.75,
      weeklyPnl: 456.80,
      totalPnl: 1234.25,
      winRate: 72.3,
      totalTrades: 89,
      activeTrades: 1,
      lastTrade: new Date(Date.now() - 12 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Trend Follower BNBUSDT',
      type: 'trend',
      status: 'paused',
      dailyPnl: -23.50,
      weeklyPnl: 156.25,
      totalPnl: 789.50,
      winRate: 59.8,
      totalTrades: 34,
      activeTrades: 0,
      lastTrade: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      id: '4',
      name: 'Arbitrage Bot',
      type: 'arbitrage',
      status: 'active',
      dailyPnl: 67.25,
      weeklyPnl: 234.75,
      totalPnl: 567.80,
      winRate: 85.2,
      totalTrades: 156,
      activeTrades: 2,
      lastTrade: new Date(Date.now() - 2 * 60 * 1000)
    }
  ])

  // Performans verilerini periyodik olarak güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      setStrategies(prev => prev.map(strategy => ({
        ...strategy,
        dailyPnl: strategy.dailyPnl + (Math.random() - 0.5) * 20,
        winRate: Math.max(40, Math.min(90, strategy.winRate + (Math.random() - 0.5) * 2)),
        totalTrades: strategy.status === 'active' ? strategy.totalTrades + Math.floor(Math.random() * 2) : strategy.totalTrades
      })))
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'paused':
        return 'text-yellow-600 bg-yellow-100'
      case 'stopped':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'grid':
        return <BarChart className="h-3 w-3" />
      case 'scalping':
        return <Activity className="h-3 w-3" />
      case 'trend':
        return <TrendingUp className="h-3 w-3" />
      case 'arbitrage':
        return <TrendingDown className="h-3 w-3" />
      default:
        return <BarChart className="h-3 w-3" />
    }
  }

  const formatPnl = (pnl: number) => {
    const sign = pnl >= 0 ? '+' : ''
    return `${sign}$${pnl.toFixed(2)}`
  }

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const formatTimeAgo = (timestamp?: Date) => {
    if (!timestamp) return '-'
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60))
    if (minutes < 1) return 'Az önce'
    if (minutes < 60) return `${minutes}dk önce`
    const hours = Math.floor(minutes / 60)
    return `${hours}sa önce`
  }

  // Stratejileri performansa göre sırala
  const sortedStrategies = [...strategies].sort((a, b) => b.dailyPnl - a.dailyPnl)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart className="h-4 w-4" />
          Strateji Performansı
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {sortedStrategies.map((strategy) => (
            <div key={strategy.id} className="p-2 bg-muted/50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <div className="h-6 w-6 bg-background rounded-full flex items-center justify-center">
                    {getTypeIcon(strategy.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-xs">{strategy.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-[10px] px-1 py-0 ${getStatusColor(strategy.status)}`}>
                        {strategy.status.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {strategy.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-xs font-semibold ${getPnlColor(strategy.dailyPnl)}`}>
                    {formatPnl(strategy.dailyPnl)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Günlük
                  </div>
                </div>
              </div>
              
              {/* Performans metrikleri */}
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="p-1 bg-background rounded">
                  <p className="text-[9px] text-muted-foreground">Haftalık</p>
                  <p className={`text-[10px] font-semibold ${getPnlColor(strategy.weeklyPnl)}`}>
                    {formatPnl(strategy.weeklyPnl)}
                  </p>
                </div>
                <div className="p-1 bg-background rounded">
                  <p className="text-[9px] text-muted-foreground">Başarı</p>
                  <p className="text-[10px] font-semibold text-blue-600">
                    %{strategy.winRate.toFixed(1)}
                  </p>
                </div>
                <div className="p-1 bg-background rounded">
                  <p className="text-[9px] text-muted-foreground">Toplam</p>
                  <p className="text-[10px] font-semibold">
                    {strategy.totalTrades}
                  </p>
                </div>
                <div className="p-1 bg-background rounded">
                  <p className="text-[9px] text-muted-foreground">Aktif</p>
                  <p className="text-[10px] font-semibold text-green-600">
                    {strategy.activeTrades}
                  </p>
                </div>
              </div>
              
              {/* Son işlem zamanı */}
              <div className="flex justify-between items-center mt-2 pt-1 border-t border-gray-200">
                <span className="text-[10px] text-muted-foreground">
                  Son işlem: {formatTimeAgo(strategy.lastTrade)}
                </span>
                <span className={`text-[10px] font-semibold ${getPnlColor(strategy.totalPnl)}`}>
                  Toplam: {formatPnl(strategy.totalPnl)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}