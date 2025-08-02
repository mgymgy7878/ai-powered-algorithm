import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Activity, Triangle, Square, Circle } from 'lucide-react'

interface TechnicalSignal {
  id: string
  type: 'formation' | 'indicator'
  name: string
  symbol: string
  signal: 'bullish' | 'bearish' | 'neutral'
  strength: number
  description: string
  icon: React.ReactNode
  timeframe: string
}

export function TechnicalSignalsPanel() {
  const [signals, setSignals] = useState<TechnicalSignal[]>([
    {
      id: '1',
      type: 'formation',
      name: 'Doji',
      symbol: 'BTCUSDT',
      signal: 'neutral',
      strength: 75,
      description: 'Doji formasyonu - kararsızlık işareti',
      icon: <Circle className="h-3 w-3" />,
      timeframe: '1H'
    },
    {
      id: '2',
      type: 'formation',
      name: 'Hammer',
      symbol: 'ETHUSDT',
      signal: 'bullish',
      strength: 68,
      description: 'Hammer pattern - güçlü yükseliş sinyali',
      icon: <Triangle className="h-3 w-3" />,
      timeframe: '4H'
    },
    {
      id: '3',
      type: 'indicator',
      name: 'RSI Oversold',
      symbol: 'BNBUSDT',
      signal: 'bullish',
      strength: 82,
      description: 'RSI aşırı satım bölgesinden çıkış',
      icon: <Activity className="h-3 w-3" />,
      timeframe: '15M'
    },
    {
      id: '4',
      type: 'indicator',
      name: 'MACD Cross',
      symbol: 'ADAUSDT',
      signal: 'bullish',
      strength: 71,
      description: 'MACD sinyal hattını yukarı kesti',
      icon: <Square className="h-3 w-3" />,
      timeframe: '1H'
    },
    {
      id: '5',
      type: 'indicator',
      name: 'EMA Golden Cross',
      symbol: 'BTCUSDT',
      signal: 'bullish',
      strength: 89,
      description: 'EMA 50 EMA 200\'ü yukarı kesti',
      icon: <Activity className="h-3 w-3" />,
      timeframe: '4H'
    }
  ])

  // Sinyalleri periyodik güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev => prev.map(signal => ({
        ...signal,
        strength: Math.max(40, Math.min(95, signal.strength + (Math.random() - 0.5) * 8))
      })))
    }, 12000)

    return () => clearInterval(interval)
  }, [])

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return 'text-green-600'
      case 'bearish':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  const getSignalBg = (signal: string) => {
    switch (signal) {
      case 'bullish':
        return 'bg-green-100'
      case 'bearish':
        return 'bg-red-100'
      default:
        return 'bg-yellow-100'
    }
  }

  const getStrengthColor = (strength: number) => {
    if (strength >= 75) return 'text-green-600'
    if (strength >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4" />
          Teknik Sinyal & Formasyon
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {signals.map((signal) => (
            <div key={signal.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 flex-1">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center ${getSignalBg(signal.signal)}`}>
                  <span className={getSignalColor(signal.signal)}>
                    {signal.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs truncate">{signal.name}</span>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 flex-shrink-0">
                      {signal.symbol}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {signal.description}
                  </p>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0 ml-2">
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-[10px] px-1 py-0">
                    {signal.timeframe}
                  </Badge>
                </div>
                <div className={`text-xs font-semibold ${getStrengthColor(signal.strength)}`}>
                  %{signal.strength}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}