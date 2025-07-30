import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { PlayIcon, PauseIcon, StopIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface LiveStrategy {
  id: string
  name: string
  status: 'running' | 'paused' | 'stopped'
  pnl: number
  trades: number
  winRate: number
  riskLevel: 'low' | 'medium' | 'high'
  allocatedCapital: number
  lastSignal?: string
  lastTradeTime?: string
}

export function LiveTrading() {
  const [strategies] = useKV('trading-strategies', [])
  const [liveStrategies, setLiveStrategies] = useKV<LiveStrategy[]>('live-strategies', [
    {
      id: '1',
      name: 'RSI Mean Reversion',
      status: 'running',
      pnl: 1250.50,
      trades: 15,
      winRate: 73.3,
      riskLevel: 'low',
      allocatedCapital: 5000,
      lastSignal: 'BUY BTC/USDT',
      lastTradeTime: '2024-01-15T10:45:23Z'
    },
    {
      id: '2',
      name: 'Momentum Breakout',
      status: 'paused',
      pnl: -325.75,
      trades: 8,
      winRate: 62.5,
      riskLevel: 'medium',
      allocatedCapital: 3000,
      lastSignal: 'SELL ETH/USDT',
      lastTradeTime: '2024-01-15T09:30:15Z'
    }
  ])

  const [autoTrading, setAutoTrading] = useKV('auto-trading-enabled', true)
  const [riskManagement, setRiskManagement] = useKV('risk-management-enabled', true)

  const startStrategy = (strategyId: string) => {
    setLiveStrategies(current =>
      current.map(s =>
        s.id === strategyId ? { ...s, status: 'running' as const } : s
      )
    )
    toast.success('Strategy started')
  }

  const pauseStrategy = (strategyId: string) => {
    setLiveStrategies(current =>
      current.map(s =>
        s.id === strategyId ? { ...s, status: 'paused' as const } : s
      )
    )
    toast.success('Strategy paused')
  }

  const stopStrategy = (strategyId: string) => {
    setLiveStrategies(current =>
      current.map(s =>
        s.id === strategyId ? { ...s, status: 'stopped' as const } : s
      )
    )
    toast.success('Strategy stopped')
  }

  const getStatusColor = (status: LiveStrategy['status']) => {
    switch (status) {
      case 'running': return 'bg-accent text-accent-foreground'
      case 'paused': return 'bg-destructive text-destructive-foreground'
      case 'stopped': return 'bg-secondary text-secondary-foreground'
    }
  }

  const getRiskColor = (risk: LiveStrategy['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-accent'
      case 'medium': return 'text-primary'
      case 'high': return 'text-destructive'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Live Trading</h2>
          <p className="text-muted-foreground">Manage active trading strategies and monitor real-time performance</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={autoTrading ? "default" : "outline"} className="px-3 py-1">
            {autoTrading ? 'Auto Trading ON' : 'Auto Trading OFF'}
          </Badge>
        </div>
      </div>

      {/* Trading Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-trading">Auto Trading</Label>
                <p className="text-sm text-muted-foreground">
                  Allow AI to automatically start and stop strategies based on market conditions
                </p>
              </div>
              <Switch
                id="auto-trading"
                checked={autoTrading}
                onCheckedChange={setAutoTrading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="risk-management">Risk Management</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic position sizing and circuit breakers
                </p>
              </div>
              <Switch
                id="risk-management"
                checked={riskManagement}
                onCheckedChange={setRiskManagement}
              />
            </div>
          </div>
          
          {!riskManagement && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-destructive" />
              <span className="text-sm text-destructive">
                Risk management is disabled. This may lead to significant losses.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Strategies */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Active Strategies ({liveStrategies.length})</h3>
        
        {liveStrategies.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <PlayIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No active strategies</h3>
              <p className="text-muted-foreground">Deploy tested strategies to start live trading</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {liveStrategies.map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {strategy.name}
                        <Badge className={getStatusColor(strategy.status)}>
                          {strategy.status}
                        </Badge>
                        <Badge variant="outline" className={getRiskColor(strategy.riskLevel)}>
                          {strategy.riskLevel} risk
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Capital: {formatCurrency(strategy.allocatedCapital)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {strategy.status !== 'running' ? (
                        <Button
                          size="sm"
                          onClick={() => startStrategy(strategy.id)}
                        >
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => pauseStrategy(strategy.id)}
                        >
                          <PauseIcon className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => stopStrategy(strategy.id)}
                      >
                        <StopIcon className="h-4 w-4 mr-1" />
                        Stop
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className={`text-lg font-semibold ${strategy.pnl >= 0 ? 'text-accent' : 'text-destructive'}`}>
                        {strategy.pnl >= 0 ? '+' : ''}{formatCurrency(strategy.pnl)}
                      </div>
                      <div className="text-xs text-muted-foreground">P&L</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold">
                        {strategy.trades}
                      </div>
                      <div className="text-xs text-muted-foreground">Trades</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-accent">
                        {strategy.winRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-primary">
                        {((strategy.pnl / strategy.allocatedCapital) * 100).toFixed(2)}%
                      </div>
                      <div className="text-xs text-muted-foreground">ROI</div>
                    </div>
                  </div>
                  
                  {strategy.lastSignal && (
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-primary">Last Signal</div>
                          <div className="text-sm text-muted-foreground">{strategy.lastSignal}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            {strategy.lastTradeTime && new Date(strategy.lastTradeTime).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Market Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>AI Market Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-accent rounded-full animate-pulse"></div>
                <span className="font-medium text-accent">Optimal Market Conditions</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                High volatility detected in BTC/USDT. RSI Mean Reversion strategy performing optimally.
              </p>
            </div>
            
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />
                <span className="font-medium text-destructive">Risk Alert</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Momentum Breakout strategy showing increased drawdown. Consider reducing position size.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}