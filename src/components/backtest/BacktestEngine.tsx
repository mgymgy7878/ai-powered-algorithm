import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'
import { ChartBarIcon, PlayIcon, CogIcon } from '@heroicons/react/24/outline'

interface BacktestResult {
  id: string
  strategyId: string
  strategyName: string
  timeframe: string
  startDate: string
  endDate: string
  results: {
    totalReturn: number
    winRate: number
    sharpeRatio: number
    maxDrawdown: number
    totalTrades: number
    profitFactor: number
  }
  runDate: string
}

export function BacktestEngine() {
  const [strategies] = useKV('trading-strategies', [])
  const [backtestResults, setBacktestResults] = useKV<BacktestResult[]>('backtest-results', [])
  
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [timeframe, setTimeframe] = useState('1h')
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-12-31')
  const [initialCapital, setInitialCapital] = useState('10000')
  const [isRunning, setIsRunning] = useState(false)

  const runBacktest = async () => {
    if (!selectedStrategy) {
      toast.error('Please select a strategy to backtest')
      return
    }

    setIsRunning(true)
    
    try {
      // Simulate backtest execution
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const strategy = strategies.find(s => s.id === selectedStrategy)
      if (!strategy) return

      const results: BacktestResult = {
        id: Date.now().toString(),
        strategyId: selectedStrategy,
        strategyName: strategy.name,
        timeframe,
        startDate,
        endDate,
        results: {
          totalReturn: Math.random() * 40 - 10, // -10% to +30%
          winRate: Math.random() * 30 + 50, // 50% to 80%
          sharpeRatio: Math.random() * 2 + 0.5, // 0.5 to 2.5
          maxDrawdown: Math.random() * 15 + 5, // 5% to 20%
          totalTrades: Math.floor(Math.random() * 500 + 100), // 100 to 600
          profitFactor: Math.random() * 1.5 + 1, // 1.0 to 2.5
        },
        runDate: new Date().toISOString()
      }
      
      setBacktestResults(current => [results, ...current])
      toast.success('Backtest completed successfully!')
      
    } catch (error) {
      toast.error('Backtest failed. Please try again.')
    } finally {
      setIsRunning(false)
    }
  }

  const formatPercentage = (value: number | undefined) => `${(value ?? 0).toFixed(2)}%`
  const formatNumber = (value: number | undefined) => (value ?? 0).toFixed(2)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Backtesting Engine</h2>
          <p className="text-muted-foreground">Test strategy performance on historical data</p>
        </div>
      </div>

      {/* Backtest Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CogIcon className="h-5 w-5" />
            Backtest Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Strategy</Label>
              <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map((strategy) => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Initial Capital</Label>
              <Input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                placeholder="10000"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={runBacktest} 
            disabled={isRunning || !selectedStrategy}
            className="w-full"
          >
            {isRunning ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Running Backtest...
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4 mr-2" />
                Run Backtest
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Backtest Results */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Backtest Results ({backtestResults.length})</h3>
        
        {backtestResults.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ChartBarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No backtest results yet</h3>
              <p className="text-muted-foreground">Run your first backtest to see performance metrics</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {backtestResults.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {result.strategyName}
                        <Badge variant="outline">{result.timeframe}</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {result.startDate} to {result.endDate} • Run on {new Date(result.runDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        Optimize
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className={`text-lg font-semibold ${(result.results.totalReturn ?? 0) >= 0 ? 'text-accent' : 'text-destructive'}`}>
                        {formatPercentage(result.results.totalReturn)}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Return</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-accent">
                        {formatPercentage(result.results.winRate)}
                      </div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-primary">
                        {formatNumber(result.results.sharpeRatio)}
                      </div>
                      <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-destructive">
                        -{formatPercentage(result.results.maxDrawdown)}
                      </div>
                      <div className="text-xs text-muted-foreground">Max Drawdown</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold">
                        {result.results.totalTrades ?? 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Trades</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-semibold text-primary">
                        {formatNumber(result.results.profitFactor)}
                      </div>
                      <div className="text-xs text-muted-foreground">Profit Factor</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}