import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CpuChipIcon, PlayIcon } from '@heroicons/react/24/outline'

interface PortfolioMetrics {
  totalValue: number
  dailyPnL: number
  totalPnL: number
  winRate: number
  activeStrategies: number
}

export function Dashboard() {
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Trading Dashboard</h2>
          <p className="text-muted-foreground">Real-time portfolio overview and trading activity</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <CpuChipIcon className="h-4 w-4 mr-2" />
            Generate Strategy
          </Button>
          <Button size="sm">
            <PlayIcon className="h-4 w-4 mr-2" />
            Start Trading
          </Button>
        </div>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolioMetrics.totalValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`text-2xl font-bold ${portfolioMetrics.dailyPnL >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {formatCurrency(portfolioMetrics.dailyPnL)}
              </div>
              {portfolioMetrics.dailyPnL >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-accent" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-destructive" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${portfolioMetrics.totalPnL >= 0 ? 'text-accent' : 'text-destructive'}`}>
              {formatCurrency(portfolioMetrics.totalPnL)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(portfolioMetrics.winRate)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{portfolioMetrics.activeStrategies}</div>
              <div className="h-2 w-2 bg-accent rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTrades.map((trade) => (
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
          </div>
        </CardContent>
      </Card>

      {/* AI Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CpuChipIcon className="h-5 w-5" />
            AI Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-accent rounded-full mt-2"></div>
                <div>
                  <div className="font-medium text-accent">Bullish Signal Detected</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    BTC showing strong momentum with RSI oversold recovery. Consider increasing position size for momentum strategies.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-muted-foreground rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Market Volatility Alert</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    ETH volatility increased by 15% in the last 4 hours. Risk management protocols activated for scalping strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}