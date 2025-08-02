import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Clock, ArrowUpRight, ArrowDownRight, Bot } from 'lucide-react'

interface TradeEntry {
  id: string
  timestamp: Date
  symbol: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  strategy: string
  pnl?: number
  status: 'completed' | 'pending' | 'cancelled'
}

export function RecentTradesPanel() {
  const [trades, setTrades] = useState<TradeEntry[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      symbol: 'BTCUSDT',
      type: 'sell',
      amount: 0.025,
      price: 43285.50,
      strategy: 'Grid Bot',
      pnl: 12.45,
      status: 'completed'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      symbol: 'ETHUSDT',
      type: 'buy',
      amount: 0.5,
      price: 2643.25,
      strategy: 'RSI Scalper',
      status: 'completed'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      symbol: 'BNBUSDT',
      type: 'sell',
      amount: 2.0,
      price: 312.80,
      strategy: 'Trend Follower',
      pnl: -5.25,
      status: 'completed'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 23 * 60 * 1000),
      symbol: 'ADAUSDT',
      type: 'buy',
      amount: 1000,
      price: 0.4825,
      strategy: 'DCA Bot',
      status: 'completed'
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      symbol: 'BTCUSDT',
      type: 'buy',
      amount: 0.025,
      price: 43150.00,
      strategy: 'Grid Bot',
      status: 'completed'
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 42 * 60 * 1000),
      symbol: 'ETHUSDT',
      type: 'sell',
      amount: 0.5,
      price: 2658.75,
      strategy: 'RSI Scalper',
      pnl: 7.75,
      status: 'completed'
    },
    {
      id: '7',
      timestamp: new Date(Date.now() - 58 * 60 * 1000),
      symbol: 'SOLUSDT',
      type: 'buy',
      amount: 5.0,
      price: 85.25,
      strategy: 'Momentum',
      status: 'pending'
    }
  ])

  // Yeni işlemleri periyodik olarak ekle
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT']
        const strategies = ['Grid Bot', 'RSI Scalper', 'Trend Follower', 'DCA Bot', 'Momentum']
        const types = ['buy', 'sell'] as const
        
        const newTrade: TradeEntry = {
          id: Date.now().toString(),
          timestamp: new Date(),
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          type: types[Math.floor(Math.random() * types.length)],
          amount: Math.random() * 2,
          price: 40000 + Math.random() * 10000,
          strategy: strategies[Math.floor(Math.random() * strategies.length)],
          pnl: Math.random() > 0.5 ? (Math.random() * 20 - 10) : undefined,
          status: 'completed'
        }
        
        setTrades(prev => [newTrade, ...prev.slice(0, 9)]) // En fazla 10 işlem tut
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  const formatTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60))
    if (minutes < 1) return 'Az önce'
    if (minutes < 60) return `${minutes}dk önce`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}sa önce`
    const days = Math.floor(hours / 24)
    return `${days}g önce`
  }

  const formatAmount = (amount: number, symbol: string) => {
    // Sembole göre decimal ayarla
    if (symbol.includes('BTC')) return amount.toFixed(3)
    if (symbol.includes('ETH')) return amount.toFixed(2)
    if (symbol.includes('USDT') && amount < 1) return amount.toFixed(4)
    return amount.toFixed(1)
  }

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(4)
    if (price < 100) return price.toFixed(2)
    return price.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getPnlColor = (pnl?: number) => {
    if (!pnl) return 'text-muted-foreground'
    return pnl >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Son İşlemler Günlüğü
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-[350px] overflow-y-auto">
          {trades.map((trade, index) => (
            <div key={trade.id} className="relative">
              {/* Timeline çizgisi */}
              {index < trades.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
              )}
              
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                {/* Timeline dot ve ikon */}
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    trade.type === 'buy' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {trade.type === 'buy' ? (
                      <ArrowDownRight className="h-3 w-3 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                </div>
                
                {/* İşlem detayları */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs">
                        {trade.type.toUpperCase()} {trade.symbol}
                      </span>
                      <Badge variant="outline" className={`text-[10px] px-1 py-0 ${getStatusColor(trade.status)}`}>
                        {trade.status.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTimeAgo(trade.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[11px] text-muted-foreground">
                      {formatAmount(trade.amount, trade.symbol)} @ ${formatPrice(trade.price)}
                    </div>
                    {trade.pnl && (
                      <div className={`text-[11px] font-semibold ${getPnlColor(trade.pnl)}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Bot className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">
                      {trade.strategy}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Özet istatistikler */}
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-1 bg-muted/50 rounded">
              <p className="text-[9px] text-muted-foreground">Bugün</p>
              <p className="text-[11px] font-semibold">24 işlem</p>
            </div>
            <div className="p-1 bg-muted/50 rounded">
              <p className="text-[9px] text-muted-foreground">Başarılı</p>
              <p className="text-[11px] font-semibold text-green-600">83%</p>
            </div>
            <div className="p-1 bg-muted/50 rounded">
              <p className="text-[9px] text-muted-foreground">Hacim</p>
              <p className="text-[11px] font-semibold">$12.4K</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}