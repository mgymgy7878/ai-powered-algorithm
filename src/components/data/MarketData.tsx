import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  RefreshCw,
  Calendar,
  Clock,
  Database
} from '@phosphor-icons/react'
import { binanceService } from '../../services/binanceService'
import { APISettings } from '../../types/api'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { safeMarketData } from '../../utils/safeAccess'

interface MarketDataProps {
  symbol?: string
}

export function MarketData({ symbol = 'BTCUSDT' }: MarketDataProps) {
  const [apiSettings] = useKV<APISettings>('api-settings', {
    openai: { apiKey: '', model: 'gpt-4', enabled: true },
    anthropic: { apiKey: '', model: 'claude-3-sonnet', enabled: false },
    binance: { apiKey: '', secretKey: '', testnet: true, enabled: false }
  })

  const [marketData, setMarketData] = useState<any>(null)
  const [klineData, setKlineData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    if (apiSettings?.binance?.enabled && apiSettings?.binance?.apiKey && apiSettings?.binance?.secretKey) {
      binanceService.setCredentials(
        apiSettings.binance.apiKey,
        apiSettings.binance.secretKey,
        apiSettings.binance.testnet ?? true
      )
    }
  }, [apiSettings?.binance])

  const fetchMarketData = async () => {
    if (!apiSettings.binance?.enabled) {
      toast.error('Binance API ayarları yapılandırılmamış')
      return
    }

    if (!apiSettings.binance?.apiKey || !apiSettings.binance?.secretKey) {
      toast.error('Binance API anahtarları eksik')
      return
    }

    setLoading(true)
    try {
      // Fiyat verilerini al
      const prices = await binanceService.getSymbolPrices()
      
      // Güvenli erişim kontrolü ekle - 'symbol' özelliği için
      if (prices && Array.isArray(prices)) {
        const targetSymbol = prices.find(p => p && p.symbol && p.symbol === symbol)
        
        if (targetSymbol) {
          // Güvenli piyasa verisi formatla
          setMarketData(safeMarketData(targetSymbol))
        } else {
          toast.error(`${symbol} sembolü bulunamadı`)
        }
      } else {
        toast.error('Piyasa verileri alınamadı veya geçersiz format')
      }

      // Kline verilerini al (son 100 saatlik)
      const klines = await binanceService.getKlineData(symbol, '1h', 100)
      if (klines && Array.isArray(klines)) {
        setKlineData(klines)
      }
      
      setLastUpdate(new Date())
      toast.success('Piyasa verileri güncellendi')
    } catch (error) {
      console.error('Market data fetch error:', error)
      toast.error(`Veri alınamadı: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    } finally {
      setLoading(false)
    }
  }

  const downloadKlineData = () => {
    if (klineData.length === 0) {
      toast.error('İndirilecek veri yok')
      return
    }

    const csvContent = [
      'Timestamp,Open,High,Low,Close,Volume',
      ...klineData.map(k => 
        `${new Date(k.openTime).toISOString()},${k.open},${k.high},${k.low},${k.close},${k.volume}`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${symbol}_kline_data_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Veriler CSV olarak indirildi')
  }

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(numPrice)) return '0.00'
    
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(numPrice)
  }

  const formatPercent = (percent: number | string) => {
    const numPercent = typeof percent === 'string' ? parseFloat(percent) : percent
    if (isNaN(numPercent)) return '0.00%'
    
    return `${numPercent > 0 ? '+' : ''}${numPercent.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Piyasa Verileri - {symbol}</h3>
        <div className="flex gap-2">
          <Button
            onClick={fetchMarketData}
            disabled={loading || !apiSettings.binance.enabled}
            variant="outline"
            size="sm"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Yenile
          </Button>
          
          <Button
            onClick={downloadKlineData}
            disabled={klineData.length === 0}
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            İndir (CSV)
          </Button>
        </div>
      </div>

      {!apiSettings.binance.enabled && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <p className="text-sm text-orange-800">
              Piyasa verilerini görüntülemek için Binance API ayarlarını yaılandırın.
            </p>
          </CardContent>
        </Card>
      )}

      {marketData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Güncel Fiyat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${formatPrice(marketData.price)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                24s Değişim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold flex items-center gap-1 ${
                marketData.change24h >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {marketData.change24h >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                {formatPercent(marketData.change24h)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                24s Yüksek/Düşük
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-sm text-green-600">
                  Yüksek: ${formatPrice(marketData.high24h)}
                </div>
                <div className="text-sm text-red-600">
                  Düşük: ${formatPrice(marketData.low24h)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                24s Hacim
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {new Intl.NumberFormat('tr-TR', {
                  notation: 'compact',
                  maximumFractionDigits: 2
                }).format(marketData.volume24h)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {klineData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Grafik Verileri ({klineData.length} Mum)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Zaman Aralığı: 1 Saat
                </div>
                {lastUpdate && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Son Güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Son 5 Mum Verisi</h4>
                <div className="grid gap-2">
                  {klineData.slice(-5).reverse().map((kline, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded border">
                      <div className="text-sm">
                        {new Date(kline.openTime).toLocaleString('tr-TR')}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span>A: {parseFloat(kline.open).toFixed(2)}</span>
                        <span className="text-green-600">Y: {parseFloat(kline.high).toFixed(2)}</span>
                        <span className="text-red-600">D: {parseFloat(kline.low).toFixed(2)}</span>
                        <span>K: {parseFloat(kline.close).toFixed(2)}</span>
                      </div>
                      <Badge variant="outline">
                        {new Intl.NumberFormat('tr-TR', { 
                          notation: 'compact' 
                        }).format(parseFloat(kline.volume))}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                A: Açılış, Y: Yüksek, D: Düşük, K: Kapanış fiyatları
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}