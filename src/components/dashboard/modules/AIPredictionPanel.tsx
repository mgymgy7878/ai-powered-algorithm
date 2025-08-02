import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Brain, TrendingUp, TrendingDown, Target } from 'lucide-react'

interface AIPrediction {
  symbol: string
  trend: 'up' | 'down' | 'sideways'
  confidence: number
  support: number
  resistance: number
  prediction: string
  timeframe: string
}

export function AIPredictionPanel() {
  const [predictions, setPredictions] = useState<AIPrediction[]>([
    {
      symbol: 'BTCUSDT',
      trend: 'up',
      confidence: 72,
      support: 42800,
      resistance: 45200,
      prediction: 'BTC için yükseliş tahmini güçlü. 45K direnci test edilebilir.',
      timeframe: '4H'
    },
    {
      symbol: 'ETHUSDT',
      trend: 'down',
      confidence: 65,
      support: 2580,
      resistance: 2720,
      prediction: 'ETH için düşüş riski mevcut. 2580 desteği kritik.',
      timeframe: '1H'
    },
    {
      symbol: 'BNBUSDT',
      trend: 'sideways',
      confidence: 58,
      support: 305,
      resistance: 320,
      prediction: 'BNB yatay seyir halinde. 305-320 aralığında işlem görüyor.',
      timeframe: '15M'
    }
  ])

  // AI tahminlerini periyodik güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      setPredictions(prev => prev.map(pred => ({
        ...pred,
        confidence: Math.max(45, Math.min(85, pred.confidence + (Math.random() - 0.5) * 5))
      })))
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <Target className="h-3 w-3 text-yellow-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-600'
    if (confidence >= 55) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Brain className="h-4 w-4" />
          AI Tahmin Paneli
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {predictions.map((pred) => (
            <div key={pred.symbol} className="p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs">{pred.symbol}</span>
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    {pred.timeframe}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(pred.trend)}
                  <span className={`text-xs font-medium ${getConfidenceColor(pred.confidence)}`}>
                    %{pred.confidence}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-center p-1 bg-background rounded">
                  <p className="text-[10px] text-muted-foreground">Destek</p>
                  <p className="text-xs font-semibold text-green-600">
                    ${pred.support.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-1 bg-background rounded">
                  <p className="text-[10px] text-muted-foreground">Direnç</p>
                  <p className="text-xs font-semibold text-red-600">
                    ${pred.resistance.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <p className="text-[11px] text-muted-foreground leading-tight">
                {pred.prediction}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}