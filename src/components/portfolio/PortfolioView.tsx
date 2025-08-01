import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { PieChart, TrendingUp, TrendingDown } from 'lucide-react'

interface Position {
  symbol: string
  side: 'long' | 'short'
  size: number
  entryPrice: number
  currentPrice: number
  pnl: number
  pnlPercent: number
}

interface PortfolioData {
  totalValue: number
  availableBalance: number
  totalPnL: number
  totalPnLPercent: number
  positions: Position[]
}

export function PortfolioView() {
  const [portfolioData] = useKV<PortfolioData>('portfolio-data', {
    totalValue: 52450.75,
    availableBalance: 15230.25,
    totalPnL: 2450.75,
    totalPnLPercent: 4.9,
    positions: [
      {
        symbol: 'BTC/USDT',
        side: 'long',
        size: 0.5,
        entryPrice: 42800,
        currentPrice: 43250,
        pnl: 225.00,
        pnlPercent: 1.05
      },
      {
        symbol: 'ETH/USDT',
        side: 'long',
        size: 5.2,
        entryPrice: 2580,
        currentPrice: 2650,
        pnl: 364.00,
        pnlPercent: 2.71
      },
      {
        symbol: 'SOL/USDT',
        side: 'short',
        size: 50,
        entryPrice: 102.50,
        currentPrice: 98.75,
        pnl: 187.50,
        pnlPercent: 3.66
      }
    ]
  })

  const [allocationData] = useKV('portfolio-allocation', [
    { name: 'Active Strategies', value: 37220.50, percentage: 71 },
    { name: 'Available Cash', value: 15230.25, percentage: 29 }
  ])

  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value ?? 0)
  }

  const formatPercentage = (value: number | undefined) => `${(value ?? 0).toFixed(2)}%`

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Portfolio Overview</h2>
          <p className="text-muted-foreground">Monitor your trading portfolio performance and positions</p>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="flex flex-wrap gap-2 items-center">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(portfolioData.totalValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(portfolioData.availableBalance)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`text-3xl font-bold ${portfolioData.totalPnL >= 0 ? 'text-accent' : 'text-destructive'}`}>
                {portfolioData.totalPnL >= 0 ? '+' : ''}{formatCurrency(portfolioData.totalPnL)}
              </div>
              {portfolioData.totalPnL >= 0 ? (
                <TrendingUp className="h-5 w-5 text-accent" />
              ) : (
                <TrendingDown className="h-5 w-5 text-destructive" />
              )}
            </div>
            <div className={`text-sm ${portfolioData.totalPnLPercent >= 0 ? 'text-accent' : 'text-destructive'}`}>
              {portfolioData.totalPnLPercent >= 0 ? '+' : ''}{formatPercentage(portfolioData.totalPnLPercent)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{portfolioData.positions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Allocation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Portfolio Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allocationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: index === 0 ? 'oklch(0.45 0.15 240)' : 'oklch(0.55 0.15 140)' }}
                  ></div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(item.value)}</div>
                  <div className="text-sm text-muted-foreground">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Current Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolioData.positions.length === 0 ? (
            <div className="py-12 text-center">
              <PieChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No open positions</h3>
              <p className="text-muted-foreground">Your active trading positions will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {portfolioData.positions.map((position, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-semibold text-lg">{position?.symbol || 'Bilinmeyen Sembol'}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={position.side === 'long' ? 'default' : 'secondary'}>
                          {position.side.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Size: {position.size}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Entry Price</div>
                    <div className="font-medium">{formatCurrency(position.entryPrice)}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Current Price</div>
                    <div className="font-medium">{formatCurrency(position.currentPrice)}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold text-lg ${position.pnl >= 0 ? 'text-accent' : 'text-destructive'}`}>
                      {position.pnl >= 0 ? '+' : ''}{formatCurrency(position.pnl)}
                    </div>
                    <div className={`text-sm ${position.pnlPercent >= 0 ? 'text-accent' : 'text-destructive'}`}>
                      {position.pnlPercent >= 0 ? '+' : ''}{formatPercentage(position.pnlPercent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Best Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="font-semibold">SOL/USDT Short</div>
              <div className="text-2xl font-bold text-accent">+3.66%</div>
              <div className="text-sm text-muted-foreground">+$187.50</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Beta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">0.85</div>
              <div className="text-sm text-muted-foreground">vs BTC correlation</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">Medium</div>
              <div className="text-sm text-muted-foreground">Balanced risk profile</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}