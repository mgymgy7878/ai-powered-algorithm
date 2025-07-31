import CryptoJS from 'crypto-js'

// Binance Kline (mum çubuğu) verisi interface
export interface KlineData {
  symbol: string
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteAssetVolume: string
  numberOfTrades: number
  takerBuyBaseAssetVolume: string
  takerBuyQuoteAssetVolume: string
  ignore: string
}

// Binance pozisyon bilgisi interface
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

// Binance emir bilgisi interface
export interface OrderInfo {
  symbol: string
  orderId: number
  orderListId: number
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: string
  timeInForce: string
  type: string
  side: string
  stopPrice: string
  icebergQty: string
  time: number
  updateTime: number
  isWorking: boolean
  workingTime: number
  origQuoteOrderQty: string
}

// Binance hesap bilgisi interface
export interface AccountInfo {
  feeTier: number
  canTrade: boolean
  canDeposit: boolean
  canWithdraw: boolean
  updateTime: number
  totalInitialMargin: string
  totalMaintMargin: string
  totalWalletBalance: string
  totalUnrealizedProfit: string
  totalMarginBalance: string
  totalPositionInitialMargin: string
  totalOpenOrderInitialMargin: string
  totalCrossWalletBalance: string
  totalCrossUnPnl: string
  availableBalance: string
  maxWithdrawAmount: string
  assets: any[]
  positions: any[]
}

// Binance 24hr ticker verisi interface
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
  private baseUrl: string = 'https://testnet.binancefuture.com'
  private testnet: boolean = true

  // API anahtarlarını ayarlama
  setCredentials(apiKey: string, secretKey: string, testnet: boolean = true) {
    this.apiKey = apiKey
    this.secretKey = secretKey
    this.testnet = testnet
    this.setTestnet(testnet)
  }

  // Testnet/mainnet ayarı
  private setTestnet(isTestnet: boolean) {
    this.testnet = isTestnet
    this.baseUrl = isTestnet 
      ? 'https://testnet.binancefuture.com'
      : 'https://fapi.binance.com'
  }

  // API anahtarı doğrulaması
  validateCredentials(): boolean {
    return this.apiKey !== '' && this.secretKey !== ''
  }

  // İmza oluşturma (Binance API için gerekli)
  private createSignature(queryString: string): string {
    return CryptoJS.HmacSHA256(queryString, this.secretKey).toString(CryptoJS.enc.Hex)
  }

  // Zaman damgası oluşturma
  private getTimestamp(): number {
    return Date.now()
  }

  // HTTP istekleri için header oluşturma
  private getHeaders(includeSignature: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'X-MBX-APIKEY': this.apiKey,
      'Content-Type': 'application/json',
    }
    return headers
  }

  // Kline (mum çubuğu) verilerini getirme
  async getKlineData(
    symbol: string, 
    interval: string = '1m', 
    limit: number = 500,
    startTime?: number,
    endTime?: number
  ): Promise<KlineData[]> {
    try {
      const params = new URLSearchParams({
        symbol: symbol.toUpperCase(),
        interval,
        limit: limit.toString()
      })

      if (startTime) params.append('startTime', startTime.toString())
      if (endTime) params.append('endTime', endTime.toString())
      
      const url = `${this.baseUrl}/fapi/v1/klines?${params.toString()}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data.map((kline: any[]): KlineData => ({
        symbol,
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
      }))
    } catch (error: any) {
      console.error('Kline verisi alınırken hata:', error)
      throw new Error(`Kline verisi alınamadı: ${error.message}`)
    }
  }

  // Hesap bilgileri getirme
  async getAccountInfo(): Promise<AccountInfo> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      const queryString = `timestamp=${timestamp}`
      const signature = this.createSignature(queryString)
      
      const url = `${this.baseUrl}/fapi/v2/account?${queryString}&signature=${signature}`
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(true)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API Hatası: ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Hesap bilgileri alınırken hata:', error)
      throw new Error(`Hesap bilgileri alınamadı: ${error.message}`)
    }
  }

  // Pozisyon bilgilerini getirme
  async getPositionInfo(symbol?: string): Promise<PositionInfo[]> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      let queryString = `timestamp=${timestamp}`
      
      if (symbol) {
        queryString = `symbol=${symbol.toUpperCase()}&${queryString}`
      }

      const signature = this.createSignature(queryString)
      const url = `${this.baseUrl}/fapi/v2/positionRisk?${queryString}&signature=${signature}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(true)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`API Hatası: ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Pozisyon bilgileri alınırken hata:', error)
      throw new Error(`Pozisyon bilgileri alınamadı: ${error.message}`)
    }
  }

  // Market emir verme
  async placeMarketOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: string,
    positionSide?: 'LONG' | 'SHORT'
  ): Promise<OrderInfo> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      const params: any = {
        symbol: symbol.toUpperCase(),
        side,
        type: 'MARKET',
        quantity,
        timestamp: timestamp.toString()
      }

      if (positionSide) {
        params.positionSide = positionSide
      }

      const queryString = new URLSearchParams(params).toString()
      const signature = this.createSignature(queryString)
      
      const response = await fetch(`${this.baseUrl}/fapi/v1/order`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: `${queryString}&signature=${signature}`
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Emir Hatası: ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Emir verilirken hata:', error)
      throw new Error(`Emir verilemedi: ${error.message}`)
    }
  }

  // Limit emir verme
  async placeLimitOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: string,
    price: string,
    positionSide?: 'LONG' | 'SHORT'
  ): Promise<OrderInfo> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      const params: any = {
        symbol: symbol.toUpperCase(),
        side,
        type: 'LIMIT',
        quantity,
        price,
        timeInForce: 'GTC',
        timestamp: timestamp.toString()
      }

      if (positionSide) {
        params.positionSide = positionSide
      }

      const queryString = new URLSearchParams(params).toString()
      const signature = this.createSignature(queryString)
      
      const response = await fetch(`${this.baseUrl}/fapi/v1/order`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: `${queryString}&signature=${signature}`
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Emir Hatası: ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Limit emir verilirken hata:', error)
      throw new Error(`Limit emir verilemedi: ${error.message}`)
    }
  }

  // Bağlantı testi
  async testConnectivity(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/ping`)
      return response.ok
    } catch (error) {
      console.error('Bağlantı testi başarısız:', error)
      return false
    }
  }

  // API anahtarları ile bağlantı testi (authenticated)
  async testConnection(): Promise<boolean> {
    if (!this.validateCredentials()) {
      return false
    }

    try {
      // Test authenticated endpoint
      const accountInfo = await this.getAccountInfo()
      return accountInfo !== null
    } catch (error) {
      console.error('API anahtarı testi başarısız:', error)
      return false
    }
  }

  // Server zamanını getirme
  async getServerTime(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/time`)
      const data = await response.json()
      return data.serverTime
    } catch (error) {
      console.error('Server zamanı alınamadı:', error)
      throw error
    }
  }

  // 24hr ticker verisi getirme
  async get24hrTicker(symbol?: string): Promise<Ticker24hr | Ticker24hr[]> {
    try {
      const url = symbol 
        ? `${this.baseUrl}/fapi/v1/ticker/24hr?symbol=${symbol.toUpperCase()}`
        : `${this.baseUrl}/fapi/v1/ticker/24hr`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('24hr ticker verisi alınamadı:', error)
      throw error
    }
  }

  // Exchange bilgilerini getirme
  async getExchangeInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/exchangeInfo`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Exchange bilgisi alınamadı:', error)
      throw error
    }
  }

  // Sembol fiyatlarını getirme
  async getSymbolPrices(symbol?: string): Promise<any> {
    try {
      const url = symbol 
        ? `${this.baseUrl}/fapi/v1/ticker/price?symbol=${symbol.toUpperCase()}`
        : `${this.baseUrl}/fapi/v1/ticker/price`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Sembol fiyatları alınamadı:', error)
      throw error
    }
  }

  // Çoklu zaman dilimi için kline verisi getirme
  async getMultiTimeframeData(
    symbol: string,
    intervals: string[] = ['1m', '5m', '15m', '1h', '4h', '1d'],
    limit: number = 100
  ): Promise<Record<string, KlineData[]>> {
    const result: Record<string, KlineData[]> = {}
    
    try {
      const promises = intervals.map(async (interval) => {
        const data = await this.getKlineData(symbol, interval, limit)
        return { interval, data }
      })

      const results = await Promise.all(promises)
      
      results.forEach(({ interval, data }) => {
        result[interval] = data
      })

      return result
    } catch (error) {
      console.error('Çoklu zaman dilimi verisi alınırken hata:', error)
      throw error
    }
  }
}

// Singleton instance
export const binanceService = new BinanceService()