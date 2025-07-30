import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'
import { CpuChipIcon, PlayIcon, TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'

interface TradingStrategy {
  id: string
  name: string
  description: string
  code: string
  parameters: Record<string, number>
  status: 'draft' | 'tested' | 'live' | 'paused'
  createdAt: string
  performance?: {
    winRate: number
    totalReturn: number
    sharpeRatio: number
  }
}

export function StrategyGenerator() {
  const [strategies, setStrategies] = useKV<TradingStrategy[]>('trading-strategies', [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [strategyPrompt, setStrategyPrompt] = useState('')
  const [strategyName, setStrategyName] = useState('')

  const generateStrategy = async () => {
    if (!strategyPrompt.trim() || !strategyName.trim()) {
      toast.error('Please provide both strategy name and description')
      return
    }

    setIsGenerating(true)
    
    try {
      // Simulate AI strategy generation
      const prompt = spark.llmPrompt`
        Generate a complete trading strategy based on this description: ${strategyPrompt}
        
        The strategy should include:
        1. Entry conditions with specific technical indicators
        2. Exit conditions with stop loss and take profit
        3. Risk management rules
        4. Position sizing logic
        
        Return the strategy as executable trading code with clear parameters that can be optimized.
        Focus on creating a realistic, backtestable strategy that uses common technical indicators.
      `
      
      const generatedCode = await spark.llm(prompt)
      
      const newStrategy: TradingStrategy = {
        id: Date.now().toString(),
        name: strategyName,
        description: strategyPrompt,
        code: generatedCode,
        parameters: {
          rsiPeriod: 14,
          rsiOverbought: 70,
          rsiOversold: 30,
          stopLossPercent: 2,
          takeProfitPercent: 4,
          positionSize: 0.1
        },
        status: 'draft',
        createdAt: new Date().toISOString()
      }
      
      setStrategies(current => [...current, newStrategy])
      setStrategyPrompt('')
      setStrategyName('')
      toast.success('Strategy generated successfully!')
      
    } catch (error) {
      toast.error('Failed to generate strategy. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const deleteStrategy = (id: string) => {
    setStrategies(current => current.filter(s => s.id !== id))
    toast.success('Strategy deleted')
  }

  const duplicateStrategy = (strategy: TradingStrategy) => {
    const duplicated: TradingStrategy = {
      ...strategy,
      id: Date.now().toString(),
      name: strategy.name + ' (Copy)',
      status: 'draft',
      createdAt: new Date().toISOString()
    }
    setStrategies(current => [...current, duplicated])
    toast.success('Strategy duplicated')
  }

  const getStatusColor = (status: TradingStrategy['status']) => {
    switch (status) {
      case 'live': return 'bg-accent text-accent-foreground'
      case 'tested': return 'bg-primary text-primary-foreground'
      case 'paused': return 'bg-destructive text-destructive-foreground'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Strategy Generator</h2>
          <p className="text-muted-foreground">Create AI-powered trading strategies from natural language</p>
        </div>
      </div>

      {/* Strategy Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CpuChipIcon className="h-5 w-5" />
            Generate New Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strategy-name">Strategy Name</Label>
            <Input
              id="strategy-name"
              placeholder="e.g., RSI Mean Reversion, Bollinger Band Breakout"
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="strategy-prompt">Strategy Description</Label>
            <Textarea
              id="strategy-prompt"
              placeholder="Describe your trading idea in natural language. For example: 'Create a momentum strategy that buys when RSI crosses above 30 and price breaks above 20-period moving average, with 2% stop loss and 4% take profit.'"
              rows={4}
              value={strategyPrompt}
              onChange={(e) => setStrategyPrompt(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={generateStrategy} 
            disabled={isGenerating || !strategyPrompt.trim() || !strategyName.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                Generating Strategy...
              </>
            ) : (
              <>
                <CpuChipIcon className="h-4 w-4 mr-2" />
                Generate Strategy
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Strategies List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Your Strategies ({strategies.length})</h3>
        
        {strategies.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CpuChipIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No strategies yet</h3>
              <p className="text-muted-foreground">Generate your first AI-powered trading strategy above</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {strategies.map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {strategy.name}
                        <Badge className={getStatusColor(strategy.status)}>
                          {strategy.status}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(strategy.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateStrategy(strategy)}
                      >
                        <DocumentDuplicateIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteStrategy(strategy.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{strategy.description}</p>
                  
                  {strategy.performance && (
                    <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-accent">
                          {strategy.performance.winRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-accent">
                          {strategy.performance.totalReturn.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Total Return</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-accent">
                          {strategy.performance.sharpeRatio.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Code
                    </Button>
                    <Button variant="outline" size="sm">
                      Backtest
                    </Button>
                    {strategy.status === 'tested' && (
                      <Button size="sm">
                        <PlayIcon className="h-4 w-4 mr-1" />
                        Go Live
                      </Button>
                    )}
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