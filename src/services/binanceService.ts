import CryptoJS from 'crypto-js'

// Binance Kline (mum çubuğu) verisi interface
export interface KlineData {
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
  multiAssetsMargin: boolean
  tradeGroupId: number
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
  assets: Array<{
    asset: string
    walletBalance: string
    unrealizedProfit: string
    marginBalance: string
    maintMargin: string
    initialMargin: string
    positionInitialMargin: string
    openOrderInitialMargin: string
    maxWithdrawAmount: string
    crossWalletBalance: string
    crossUnPnl: string
    availableBalance: string
  }>
  positions: Array<{
    symbol: string
    initialMargin: string
    maintMargin: string
    unrealizedProfit: string
    positionInitialMargin: string
    openOrderInitialMargin: string
    leverage: string
    isolated: boolean
    entryPrice: string
    maxNotional: string
    positionSide: string
    positionAmt: string
    notional: string
    isolatedWallet: string
    updateTime: number
    bidNotional: string
    askNotional: string
  }>
}

// Binance Futures API servisi
class BinanceService {
  private apiKey: string = ''
  private secretKey: string = ''
  private baseUrl: string = ''
  private testnet: boolean = true

  constructor() {
    this.setTestnet(true) // Varsayılan olarak testnet aktif
  }

  // API anahtarlarını ayarla
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

  // Kline (mum çubuğu) verilerini al
  async getKlines(
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

      const url = `${this.baseUrl}/fapi/v1/klines?${params}`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Binance API error: ${response.status} ${response.statusText}`)
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
      }))
    } catch (error: any) {
      console.error('Kline verisi alınamadı:', error)
      throw new Error(`Kline verisi alınamadı: ${error.message}`)
    }
  }

  // Hesap bilgilerini al (imzalı istek)
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
        headers: this.getHeaders(true)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Binance API error: ${response.status} - ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Hesap bilgisi alınamadı:', error)
      throw new Error(`Hesap bilgisi alınamadı: ${error.message}`)
    }
  }

  // Pozisyon bilgilerini al
  async getPositions(symbol?: string): Promise<PositionInfo[]> {
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
        headers: this.getHeaders(true)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Binance API error: ${response.status} - ${errorData.msg || response.statusText}`)
      }

      const data = await response.json()
      
      return data.map((pos: any): PositionInfo => ({
        symbol: pos.symbol,
        positionAmt: pos.positionAmt,
        entryPrice: pos.entryPrice,
        markPrice: pos.markPrice,
        unRealizedProfit: pos.unRealizedProfit,
        liquidationPrice: pos.liquidationPrice,
        leverage: pos.leverage,
        maxNotionalValue: pos.maxNotionalValue,
        marginType: pos.marginType,
        isolatedMargin: pos.isolatedMargin,
        isAutoAddMargin: pos.isAutoAddMargin,
        positionSide: pos.positionSide,
        notional: pos.notional,
        isolatedWallet: pos.isolatedWallet,
        updateTime: pos.updateTime
      }))
    } catch (error: any) {
      console.error('Pozisyon bilgisi alınamadı:', error)
      throw new Error(`Pozisyon bilgisi alınamadı: ${error.message}`)
    }
  }

  // Market emir ver
  async placeMarketOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: string,
    positionSide?: 'LONG' | 'SHORT' | 'BOTH'
  ): Promise<OrderInfo> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      const params = {
        symbol: symbol.toUpperCase(),
        side,
        type: 'MARKET',
        quantity,
        timestamp: timestamp.toString()
      }

      if (positionSide) {
        Object.assign(params, { positionSide })
      }

      const queryString = new URLSearchParams(params).toString()
      const signature = this.createSignature(queryString)
      
      const response = await fetch(`${this.baseUrl}/fapi/v1/order`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: `${queryString}&signature=${signature}`
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Emir verilemedi: ${response.status} - ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Emir verilemedi:', error)
      throw new Error(`Emir verilemedi: ${error.message}`)
    }
  }

  // Limit emir ver
  async placeLimitOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: string,
    price: string,
    positionSide?: 'LONG' | 'SHORT' | 'BOTH',
    timeInForce: string = 'GTC'
  ): Promise<OrderInfo> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      const params = {
        symbol: symbol.toUpperCase(),
        side,
        type: 'LIMIT',
        quantity,
        price,
        timeInForce,
        timestamp: timestamp.toString()
      }

      if (positionSide) {
        Object.assign(params, { positionSide })
      }

      const queryString = new URLSearchParams(params).toString()
      const signature = this.createSignature(queryString)
      
      const response = await fetch(`${this.baseUrl}/fapi/v1/order`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: `${queryString}&signature=${signature}`
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Limit emir verilemedi: ${response.status} - ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Limit emir verilemedi:', error)
      throw new Error(`Limit emir verilemedi: ${error.message}`)
    }
  }

  // Bağlantı testi
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/ping`)
      return response.ok
    } catch (error) {
      console.error('Binance bağlantı testi başarısız:', error)
      return false
    }
  }

  // Server zamanını al
  async getServerTime(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/time`)
      const data = await response.json()
      return data.serverTime
    } catch (error) {
      console.error('Server zamanı alınamadı:', error)
      throw new Error('Server zamanı alınamadı')
    }
  }

  // 24 saatlik ticker verisi al
  async get24hrTicker(symbol?: string): Promise<any> {
    try {
      const url = symbol 
        ? `${this.baseUrl}/fapi/v1/ticker/24hr?symbol=${symbol.toUpperCase()}`
        : `${this.baseUrl}/fapi/v1/ticker/24hr`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Ticker verisi alınamadı: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('24hr ticker verisi alınamadı:', error)
      throw new Error(`24hr ticker verisi alınamadı: ${error.message}`)
    }
  }

  // Symbol bilgilerini al
  async getExchangeInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/exchangeInfo`)
      
      if (!response.ok) {
        throw new Error(`Exchange bilgisi alınamadı: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Exchange bilgisi alınamadı:', error)
      throw new Error(`Exchange bilgisi alınamadı: ${error.message}`)
    }
  }
}

// Singleton instance
export const binanceService = new BinanceService()