import CryptoJS from 'crypto-js'

  openTime: number
  high: string
  openTime: number
  open: string
  high: string
  low: string
}
// Binance emir 
  orderId: number
  status: string
  price: string
  origQty: string
  cumQuote: string
  type: string
}

// Binance emir bilgisi interface
export interface OrderInfo {
  orderId: number
  symbol: string
  status: string
  clientOrderId: string
  price: string
  avgPrice: string
  origQty: string
  executedQty: string
  cumQuote: string
  timeInForce: string
  type: string
  reduceOnly: boolean
// Pozisyon bilgisi inte
  symbol: stri
  entryPrice: string
  unRealizedProfit:
  leverage: string
  marginType: string
  isAutoAddMargin:
  notional: string
 

export interface Ticker24hr {
  priceChange: string
  weightedAvgPric
  lastPrice: string
  bidPrice: string
  askPrice: string
  openPrice: string
  lowPrice: string
  quoteVolume: string
  closeTime: number
  lastId: number
}
class BinanceService {
  private secretKey: string = ''
  private baseUrl: string = 'http
  // API anahtarlarını ve
    this.apiKey = apiKey
    this.testnet = isTestne
      ? 'https:
  }
 

// Pozisyon bilgisi interface
export interface PositionInfo {
  symbol: string
  positionAmt: string
  entryPrice: string
  markPrice: string
  unRealizedProfit: string
  liquidationPrice: string
  leverage: string
  maxNotionalValue: string
  marginType: string
  isolatedMargin: string
  isAutoAddMargin: string
  positionSide: string
  notional: string
  isolatedWallet: string
  updateTime: number
}

// 24 saatlik ticker bilgisi interface
export interface Ticker24hr {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  firstId: number
  lastId: number
  count: number
}

class BinanceService {
  private apiKey: string = ''
  private secretKey: string = ''
  private testnet: boolean = true
  private baseUrl: string = 'https://testnet.binancefuture.com'

  // API anahtarlarını ve ayarları belirleme
  setCredentials(apiKey: string, secretKey: string, isTestnet: boolean = true) {
    this.apiKey = apiKey
    this.secretKey = secretKey
    this.testnet = isTestnet
    this.baseUrl = isTestnet 
      ? 'https://testnet.binancefuture.com'
      : 'https://fapi.binance.com'
   

  // API anahtarları doğrulama
  private validateCredentials(): boolean {
    return !!(this.apiKey && this.secretKey)
  }

  // Zaman damgası oluşturma
  private getTimestamp(): number {
    return Date.now()
  }

  // Pozisyon bilgi
  private createSignature(query: string): string {
    return CryptoJS.HmacSHA256(query, this.secretKey).toString()
   

  // HTTP başlıkları oluşturma
  private getHeaders(includeApiKey: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    if (includeApiKey) {
      headers['X-MBX-APIKEY'] = this.apiKey
    }

    return headers
  }

  // Kline (mum çubuğu) verilerini getirme
  async getKlineData(
      throw new Err
    interval: string = '1m',
    limit: number = 100,
    startTime?: number,
    symbol: string,
  ): Promise<KlineData[]> {
    posit
      const params: any = {
        symbol: symbol.toUpperCase(),
        interval,
        limit: Math.min(limit, 1500) // API limit
      }

      if (startTime) params.startTime = startTime
      if (endTime) params.endTime = endTime

      const queryString = new URLSearchParams(params).toString()
      const url = `${this.baseUrl}/fapi/v1/klines?${queryString}`

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return data.map((kline: any[]): KlineData => ({
        openTime: kline[0],
        open: kline[1],
        high: kline[2],
        low: kline[3],
        close: kline[4],
        volume: kline[5],
        closeTime: kline[6],
        quoteAssetVolume: kline[7],
        numberOfTrades: kline[8],
        takerBuyBaseAssetVolume: kline[9],
        takerBuyQuoteAssetVolume: kline[10],
        ignore: kline[11]
    }
    } catch (error: any) {
      console.error('Kline verisi alınırken hata:', error)
      throw new Error(`Kline verisi alınamadı: ${error.message}`)
     
  }

  // Pozisyon bilgilerini getirme
  async getPositionRisk(symbol?: string): Promise<PositionInfo[]> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      let queryString = `timestamp=${timestamp}`
      
      if (symbol) {
        queryString = `symbol=${symbol.toUpperCase()}&${queryString}`
      }

        headers: this.getHeaders(true)

      
      }
      return await res
      console.error('Hesap bilgileri a
    }

// Singleton instance































































































































































































































