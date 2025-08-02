import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { TrendingUp, TrendingDown, Eye } from 'lucide-react'

interface WatchlistItem {
  symbol: string
  name: string
  price: number
  change24h: number
  volume: number
  lastUpdate: Date
}

export function WatchlistPanel() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    {
      symbol: 'BTCUSDT',
      name: 'Bitcoin',
      price: 43285.50,
      change24h: 2.47,
      volume: 28450000000,
      lastUpdate: new Date()
    },
    {
      symbol: 'ETHUSDT',
      name: 'Ethereum',
      price: 2643.25,
      change24h: -1.23,
      volume: 15230000000,
      lastUpdate: new Date()
    },
    {
      symbol: 'BNBUSDT',
      name: 'BNB',
      price: 312.80,
      change24h: 0.85,
      volume: 1850000000,
      lastUpdate: new Date()
    },
    {
      symbol: 'ADAUSDT',
      name: 'Cardano',
      price: 0.4825,
      change24h: 4.12,
      volume: 485000000,
      lastUpdate: new Date()
    }
  ])

  // Simüle edilmiş canlı veri güncellemesi
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchlist(prev => prev.map(item => ({
        ...item,
        price: item.price * (1 + (Math.random() - 0.5) * 0.002), // ±0.1% rastgele değişim
        change24h: item.change24h + (Math.random() - 0.5) * 0.1,
        lastUpdate: new Date()
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(4)
    if (price < 100) return price.toFixed(2)
    return price.toFixed(2)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`
    return `${(volume / 1e3).toFixed(1)}K`
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Eye className="h-4 w-4" />
          İşlem Çifti Takip Listesi
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {watchlist.map((item) => (
            <div key={item.symbol} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs">{item.symbol}</span>
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    {item.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    Hacim: {formatVolume(item.volume)}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-xs">
                    ${formatPrice(item.price)}
                  </span>
                  {item.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                </div>
                <div className={`text-xs font-medium ${
                  item.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}