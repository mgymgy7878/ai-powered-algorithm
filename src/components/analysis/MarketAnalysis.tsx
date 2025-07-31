import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Search, Cpu, AlertTriangle, CheckCircle } from 'lucide-react'

interface MarketInsight {
  id: string
  type: 'bullish' | 'bearish' | 'neutral' | 'warning'
  title: string
  description: string
  confidence: number
  timeframe: string
  relevantPairs: string[]
  actionable: boolean
}

interface MarketCondition {
  pair: string
  trend: 'bullish' | 'bearish' | 'sideways'
  volatility: 'low' | 'medium' | 'high'
  volume: 'low' | 'medium' | 'high'
  momentum: number
  support: number
  resistance: number
  currentPrice: number
}

export function MarketAnalysis() {
  const [marketInsights] = useKV<MarketInsight[]>('market-insights', [
    {
      id: '1',
      type: 'bullish',
      title: 'Strong Institutional Buying Detected',
      description: 'Large volume accumulation patterns observed across major exchanges for BTC/USDT. Historical data suggests potential breakout above $44,000 resistance.',
      confidence: 85,
      timeframe: '4H - 1D',
      relevantPairs: ['BTC/USDT', 'ETH/USDT'],
      actionable: true
    },
    {
      id: '2',
      type: 'warning',
      title: 'Increased Market Correlation',
      description: 'Altcoin correlation with BTC has increased to 0.92, indicating potential systemic risk during volatility spikes.',
      confidence: 78,
      timeframe: '1D',
      relevantPairs: ['ETH/USDT', 'SOL/USDT', 'ADA/USDT'],
      actionable: true
    },
    {
      id: '3',
      type: 'neutral',
      title: 'Range-Bound Trading Expected',
      description: 'Technical indicators suggest continued sideways movement for ETH/USDT between $2,550 and $2,720 support/resistance levels.',
      confidence: 72,
      timeframe: '1H - 4H',
      relevantPairs: ['ETH/USDT'],
      actionable: false
    }
  ])

  const [marketConditions] = useKV<MarketCondition[]>('market-conditions', [
    {
      pair: 'BTC/USDT',
      trend: 'bullish',
      volatility: 'medium',
      volume: 'high',
      momentum: 0.65,
      support: 42800,
      resistance: 44200,
      currentPrice: 43250
    },
    {
      pair: 'ETH/USDT',
      trend: 'sideways',
      volatility: 'low',
      volume: 'medium',
      momentum: 0.15,
      support: 2550,
      resistance: 2720,
      currentPrice: 2650
    },
    {
      pair: 'SOL/USDT',
      trend: 'bearish',
      volatility: 'high',
      volume: 'low',
      momentum: -0.35,
      support: 95,
      resistance: 105,
      currentPrice: 98.75
    }
  ])

  const getInsightIcon = (type: MarketInsight['type']) => {
    switch (type) {
      case 'bullish': return <CheckCircle className="h-5 w-5 text-accent" />
      case 'bearish': return <AlertTriangle className="h-5 w-5 text-destructive" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-destructive" />
      default: return <Cpu className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getInsightColor = (type: MarketInsight['type']) => {
    switch (type) {
      case 'bullish': return 'border-accent/20 bg-accent/5'
      case 'bearish': return 'border-destructive/20 bg-destructive/5'
      case 'warning': return 'border-destructive/20 bg-destructive/5'
      default: return 'border-border bg-muted/30'
    }
  }

  const getTrendColor = (trend: MarketCondition['trend']) => {
    switch (trend) {
      case 'bullish': return 'text-accent'
      case 'bearish': return 'text-destructive'
      default: return 'text-muted-foreground'
    }
  }

  const getVolatilityColor = (volatility: string) => {
    switch (volatility) {
      case 'high': return 'text-destructive'
      case 'medium': return 'text-primary'
      default: return 'text-accent'
    }
  }

  const formatCurrency = (value: number | undefined) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value ?? 0)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">AI Market Analysis</h2>
          <p className="text-muted-foreground">Real-time market insights and trading opportunities powered by AI</p>
        </div>
        <Button>
          <Search className="h-4 w-4 mr-2" />
          Deep Analysis
        </Button>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">Bullish</div>
            <div className="text-sm text-muted-foreground">Confidence: 78%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Volatility Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Medium</div>
            <div className="text-sm text-muted-foreground">Increasing</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <div className="text-sm text-muted-foreground">4 Bullish, 2 Bearish, 1 Neutral</div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            AI Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketInsights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {insight.timeframe}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {insight.relevantPairs.map((pair) => (
                          <Badge key={pair} variant="secondary" className="text-xs">
                            {pair}
                          </Badge>
                        ))}
                      </div>
                      {insight.actionable && (
                        <Button variant="outline" size="sm">
                          Generate Strategy
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Current Market Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketConditions.map((condition) => (
              <div key={condition.pair} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{condition.pair}</h4>
                    <div className="text-2xl font-bold">{formatCurrency(condition.currentPrice)}</div>
                  </div>
                  <div className="text-right">
                    <Badge className={getTrendColor(condition.trend)}>
                      {condition.trend.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Trend</div>
                    <div className={`font-medium ${getTrendColor(condition.trend)}`}>
                      {condition.trend}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Volatility</div>
                    <div className={`font-medium ${getVolatilityColor(condition.volatility)}`}>
                      {condition.volatility}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Volume</div>
                    <div className="font-medium">{condition.volume}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Support</div>
                    <div className="font-medium">{formatCurrency(condition.support)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Resistance</div>
                    <div className="font-medium">{formatCurrency(condition.resistance)}</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Momentum</span>
                    <span className={(condition.momentum ?? 0) >= 0 ? 'text-accent' : 'text-destructive'}>
                      {(condition.momentum ?? 0) >= 0 ? '+' : ''}{((condition.momentum ?? 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${(condition.momentum ?? 0) >= 0 ? 'bg-accent' : 'bg-destructive'}`}
                      style={{ width: `${Math.min(Math.abs(condition.momentum ?? 0) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategy Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Strategy Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-accent">Momentum Strategy for BTC/USDT</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Strong buying momentum suggests trend continuation. Consider long positions with tight stops.
                  </p>
                </div>
                <Button size="sm">
                  <Cpu className="h-4 w-4 mr-1" />
                  Generate
                </Button>
              </div>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-primary">Range Trading for ETH/USDT</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clear support/resistance levels. Mean reversion strategy optimal for current conditions.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Cpu className="h-4 w-4 mr-1" />
                  Generate
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}