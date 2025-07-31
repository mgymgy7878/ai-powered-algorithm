import { UTCTimestamp, CandlestickData } from 'lightweight-charts'

export interface BinanceKline {
  symbol: string
  interval: string
  openTime: number
  closeTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  quoteAssetVolume: string
  numberOfTrades: number
}

export interface HistoricalDataRequest {
  symbol: string
  interval: '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '6h' | '8h' | '12h' | '1d' | '3d' | '1w' | '1M'
  startTime?: number
  endTime?: number
  limit?: number
}

class DataService {
  private baseUrl = 'https://api.binance.com/api/v3'
  private testnetUrl = 'https://testnet.binance.vision/api/v3'
  private cache = new Map<string, { data: any, timestamp: number }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 dakika

  private getUrl(useTestnet = false) {
    return useTestnet ? this.testnetUrl : this.baseUrl
  }

  private getCacheKey(symbol: string, interval: string, startTime?: number, endTime?: number) {
    return `${symbol}_${interval}_${startTime || 'all'}_${endTime || 'now'}`
  }

  async fetchHistoricalData(request: HistoricalDataRequest, useTestnet = false): Promise<CandlestickData[]> {
    const cacheKey = this.getCacheKey(
      request.symbol, 
      request.interval, 
      request.startTime, 
      request.endTime
    )

    // Cache kontrolü
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    try {
      const params = new URLSearchParams({
        symbol: request.symbol,
        interval: request.interval,
        limit: (request.limit || 1000).toString()
      })

      if (request.startTime) {
        params.append('startTime', request.startTime.toString())
      }
      if (request.endTime) {
        params.append('endTime', request.endTime.toString())
      }

      const url = `${this.getUrl(useTestnet)}/klines?${params}`
      console.log('Fetching data from:', url)

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }

      const rawData = await response.json()
      
      if (!Array.isArray(rawData)) {
        throw new Error('Invalid response format from Binance API')
      }

      const candlestickData: CandlestickData[] = rawData.map((kline: any[]) => ({
        time: Math.floor(kline[0] / 1000) as UTCTimestamp, // Binance uses milliseconds, LightweightCharts uses seconds
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4])
      }))
      
      // Veriyi cache'e kaydet
      this.cache.set(cacheKey, {
        data: candlestickData,
        timestamp: Date.now()
      })

      console.log(`Fetched ${candlestickData.length} candles for ${request.symbol}`)
      return candlestickData

    } catch (error) {
      console.error('Error fetching historical data:', error)
      throw new Error(`Veri alınamadı: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`)
    }
  }

  async fetchVolumeData(request: HistoricalDataRequest, useTestnet = false): Promise<Array<{ time: UTCTimestamp; value: number; color?: string }>> {
    try {
      const params = new URLSearchParams({
        symbol: request.symbol,
        interval: request.interval,
        limit: (request.limit || 1000).toString()
      })

      if (request.startTime) {
        params.append('startTime', request.startTime.toString())
      }
      if (request.endTime) {
        params.append('endTime', request.endTime.toString())
      }

      const url = `${this.getUrl(useTestnet)}/klines?${params}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const rawData = await response.json()
      
      return rawData.map((kline: any[]) => ({
        time: Math.floor(kline[0] / 1000) as UTCTimestamp,
        value: parseFloat(kline[5]), // Volume
        color: parseFloat(kline[4]) >= parseFloat(kline[1]) ? '#26a69a' : '#ef5350' // green if close >= open
      }))

    } catch (error) {
      console.error('Error fetching volume data:', error)
      return []
    }
  }

  // Popüler coin çiftlerini getir
  getPopularSymbols(): string[] {
    return [
      'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT',
      'SOLUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'MATICUSDT',
      'LINKUSDT', 'ATOMUSDT', 'LTCUSDT', 'UNIUSDT', 'BCHUSDT',
      'FILUSDT', 'TRXUSDT', 'ETCUSDT', 'XLMUSDT', 'VETUSDT'
    ]
  }

  // Zaman aralığı yardımcıları
  getTimeRange(days: number): { startTime: number; endTime: number } {
    const endTime = Date.now()
    const startTime = endTime - (days * 24 * 60 * 60 * 1000)
    return { startTime, endTime }
  }

  // Interval'ı milisaniyeye çevir
  intervalToMs(interval: string): number {
    const intervals: Record<string, number> = {
      '1m': 60 * 1000,
      '3m': 3 * 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '30m': 30 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '2h': 2 * 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '8h': 8 * 60 * 60 * 1000,
      '12h': 12 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '3d': 3 * 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000,
      '1M': 30 * 24 * 60 * 60 * 1000
    }
    return intervals[interval] || 60 * 60 * 1000
  }

  // Cache temizleme
  clearCache() {
    this.cache.clear()
  }

  // Cache boyutunu kontrol et
  getCacheSize(): number {
    return this.cache.size
  }
}

export const dataService = new DataService()