import CryptoJS from 'crypto-js'

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

export interface AccountInfo {
  accountType: string
  totalInitialMargin: string
  totalMaintMargin: string
  totalWalletBalance: string
  totalUnrealizedProfit: string
  totalMarginBalance: string
  totalPositionInitialMargin: string
  totalOpenOrderInitialMargin: string
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
    markPrice: string
    positionSide: string
    positionAmt: string
    notional: string
    isolatedWallet: string
    updateTime: number
  }>
}

export interface SymbolPrice {
  symbol: string
  price: string
}

export interface Order {
  orderId: number
  symbol: string
  status: string
  clientOrderId: string
  price: string
  avgPrice: string
  origQty: string
  executedQty: string
  cumQty: string
  cumQuote: string
  timeInForce: string
  type: string
  reduceOnly: boolean
  closePosition: boolean
  side: string
  positionSide: string
  stopPrice: string
  workingType: string
  priceProtect: boolean
  origType: string
  time: number
  updateTime: number
}

class BinanceService {
  private apiKey: string = ''
  private secretKey: string = ''
  private baseUrl: string = ''
  private isTestnet: boolean = true

  // API anahtarlarını ayarla
  setCredentials(apiKey: string, secretKey: string, testnet: boolean = true) {
    this.apiKey = apiKey
    this.secretKey = secretKey
    this.isTestnet = testnet
    this.baseUrl = this.getBaseUrl()
  }

  // Base URL'i belirle
  private getBaseUrl(): string {
    return this.isTestnet 
      ? 'https://testnet.binancefuture.com'
      : 'https://fapi.binance.com'
  }

  // İmza oluştur
  private createSignature(queryString: string): string {
    return CryptoJS.HmacSHA256(queryString, this.secretKey).toString()
  }

  // API isteği yap
  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    params: Record<string, any> = {},
    requiresAuth: boolean = true
  ): Promise<any> {
    if (requiresAuth && (!this.apiKey || !this.secretKey)) {
      throw new Error('Binance API anahtarları gerekli')
    }

    const timestamp = Date.now()
    if (requiresAuth) {
      params.timestamp = timestamp
    }

    const queryString = new URLSearchParams(params).toString()
    const signature = requiresAuth ? this.createSignature(queryString) : ''

    const url = `${this.baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}${signature ? `&signature=${signature}` : ''}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (requiresAuth) {
      headers['X-MBX-APIKEY'] = this.apiKey
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Binance API hatası: ${error}`)
      }

      return response.json()
    } catch (error) {
      console.error('Binance API isteği başarısız:', error)
      throw error
    }
  }

  // Test bağlantısı
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/fapi/v1/ping', 'GET', {}, false)
      return true
    } catch (error) {
      console.error('Binance bağlantı testi başarısız:', error)
      return false
    }
  }

  // Hesap bilgilerini al
  async getAccountInfo(): Promise<AccountInfo> {
    try {
      const data = await this.makeRequest('/fapi/v2/account')
      return {
        ...data,
        assets: data.assets.map((asset: any) => ({
          asset: asset.asset,
          walletBalance: asset.walletBalance,
          unrealizedProfit: asset.unrealizedProfit,
          marginBalance: asset.marginBalance,
          maintMargin: asset.maintMargin,
          initialMargin: asset.initialMargin,
          positionInitialMargin: asset.positionInitialMargin,
          openOrderInitialMargin: asset.openOrderInitialMargin,
        }))
      }
    } catch (error) {
      console.error('Hesap bilgileri alınamadı:', error)
      throw new Error(`Hesap bilgileri alınamadı: ${error}`)
    }
  }

  // 24 saatlik sembol fiyat istatistikleri
  async getSymbolPrices(): Promise<SymbolPrice[]> {
    try {
      const [tickerData, priceData] = await Promise.all([
        this.makeRequest('/fapi/v1/ticker/24hr', 'GET', {}, false),
        this.makeRequest('/fapi/v1/ticker/price', 'GET', {}, false)
      ])

      return priceData.map((item: any) => ({
        symbol: item.symbol,
        price: item.price
      }))
    } catch (error) {
      console.error('Sembol fiyatları alınamadı:', error)
      throw new Error(`Sembol fiyatları alınamadı: ${error}`)
    }
  }

  // Kline (mum) verilerini al
  async getKlineData(
    symbol: string,
    interval: string = '1m',
    limit: number = 500,
    startTime?: number,
    endTime?: number
  ): Promise<KlineData[]> {
    try {
      const params: Record<string, any> = {
        symbol: symbol.toUpperCase(),
        interval,
        limit
      }

      if (startTime) params.startTime = startTime
      if (endTime) params.endTime = endTime

      const data = await this.makeRequest('/fapi/v1/klines', 'GET', params, false)

      return data.map((kline: any[]) => ({
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
    } catch (error) {
      console.error('Kline verileri alınamadı:', error)
      throw new Error(`Kline verileri alınamadı: ${error}`)
    }
  }

  // WebSocket URL'ini al
  getWebSocketUrl(): string {
    const wsBaseUrl = this.isTestnet
      ? 'wss://stream.binancefuture.com'
      : 'wss://fstream.binance.com'
    return `${wsBaseUrl}/ws`
  }

  // Exchange bilgilerini al
  async getExchangeInfo(): Promise<any> {
    try {
      return await this.makeRequest('/fapi/v1/exchangeInfo', 'GET', {}, false)
    } catch (error) {
      console.error('Exchange bilgileri alınamadı:', error)
      throw new Error(`Exchange bilgileri alınamadı: ${error}`)
    }
  }

  // Aktif pozisyonları al
  async getPositions(): Promise<any[]> {
    try {
      const accountInfo = await this.getAccountInfo()
      return accountInfo.positions.filter(pos => parseFloat(pos.positionAmt) !== 0)
    } catch (error) {
      console.error('Pozisyonlar alınamadı:', error)
      throw new Error(`Pozisyonlar alınamadı: ${error}`)
    }
  }

  // Açık emirleri al
  async getOpenOrders(symbol?: string): Promise<Order[]> {
    try {
      const params: Record<string, any> = {}
      if (symbol) params.symbol = symbol.toUpperCase()

      return await this.makeRequest('/fapi/v1/openOrders', 'GET', params)
    } catch (error) {
      console.error('Açık emirler alınamadı:', error)
      throw new Error(`Açık emirler alınamadı: ${error}`)
    }
  }

  // Market emir ver
  async placeMarketOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: number,
    positionSide: 'BOTH' | 'LONG' | 'SHORT' = 'BOTH'
  ): Promise<Order> {
    try {
      const params = {
        symbol: symbol.toUpperCase(),
        side,
        type: 'MARKET',
        quantity: quantity.toString(),
        positionSide,
        timestamp: Date.now()
      }

      return await this.makeRequest('/fapi/v1/order', 'POST', params)
    } catch (error) {
      console.error('Market emir verilemedi:', error)
      throw new Error(`Market emir verilemedi: ${error}`)
    }
  }

  // Limit emir ver
  async placeLimitOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: number,
    price: number,
    positionSide: 'BOTH' | 'LONG' | 'SHORT' = 'BOTH',
    timeInForce: 'GTC' | 'IOC' | 'FOK' = 'GTC'
  ): Promise<Order> {
    try {
      const params = {
        symbol: symbol.toUpperCase(),
        side,
        type: 'LIMIT',
        quantity: quantity.toString(),
        price: price.toString(),
        positionSide,
        timeInForce,
        timestamp: Date.now()
      }

      return await this.makeRequest('/fapi/v1/order', 'POST', params)
    } catch (error) {
      console.error('Limit emir verilemedi:', error)
      throw new Error(`Limit emir verilemedi: ${error}`)
    }
  }

  // Tüm açık emirleri iptal et
  async cancelAllOrders(symbol?: string): Promise<any> {
    try {
      const params: Record<string, any> = {
        timestamp: Date.now()
      }
      if (symbol) params.symbol = symbol.toUpperCase()

      return await this.makeRequest('/fapi/v1/allOpenOrders', 'DELETE', params)
    } catch (error) {
      console.error('Emirler iptal edilemedi:', error)
      throw new Error(`Emirler iptal edilemedi: ${error}`)
    }
  }

  // Pozisyonu kapat
  async closePosition(symbol: string): Promise<Order | null> {
    try {
      const positions = await this.getPositions()
      const position = positions.find(pos => pos.symbol === symbol.toUpperCase())

      if (!position || parseFloat(position.positionAmt) === 0) {
        throw new Error('Kapatılacak pozisyon bulunamadı')
      }

      const side = parseFloat(position.positionAmt) > 0 ? 'SELL' : 'BUY'
      const quantity = Math.abs(parseFloat(position.positionAmt))

      return await this.placeMarketOrder(symbol, side, quantity)
    } catch (error) {
      console.error('Pozisyon kapatılamadı:', error)
      throw new Error(`Pozisyon kapatılamadı: ${error}`)
    }
  }

  // Kaldıraç ayarla
  async setLeverage(symbol: string, leverage: number): Promise<any> {
    try {
      const params = {
        symbol: symbol.toUpperCase(),
        leverage: leverage.toString(),
        timestamp: Date.now()
      }

      return await this.makeRequest('/fapi/v1/leverage', 'POST', params)
    } catch (error) {
      console.error('Kaldıraç ayarlanamadı:', error)
      throw new Error(`Kaldıraç ayarlanamadı: ${error}`)
    }
  }

  // Margin tipini ayarla
  async setMarginType(symbol: string, marginType: 'ISOLATED' | 'CROSSED'): Promise<any> {
    try {
      const params = {
        symbol: symbol.toUpperCase(),
        marginType,
        timestamp: Date.now()
      }

      return await this.makeRequest('/fapi/v1/marginType', 'POST', params)
    } catch (error) {
      console.error('Margin tipi ayarlanamadı:', error)
      throw new Error(`Margin tipi ayarlanamadı: ${error}`)
    }
  }

  // İşlem geçmişini al
  async getTradeHistory(symbol?: string, limit: number = 500): Promise<any[]> {
    try {
      const params: Record<string, any> = {
        limit,
        timestamp: Date.now()
      }
      if (symbol) params.symbol = symbol.toUpperCase()

      return await this.makeRequest('/fapi/v1/userTrades', 'GET', params)
    } catch (error) {
      console.error('İşlem geçmişi alınamadı:', error)
      throw new Error(`İşlem geçmişi alınamadı: ${error}`)
    }
  }

  // Gelir geçmişini al
  async getIncomeHistory(symbol?: string, incomeType?: string, limit: number = 100): Promise<any[]> {
    try {
      const params: Record<string, any> = {
        limit,
        timestamp: Date.now()
      }
      if (symbol) params.symbol = symbol.toUpperCase()
      if (incomeType) params.incomeType = incomeType

      return await this.makeRequest('/fapi/v1/income', 'GET', params)
    } catch (error) {
      console.error('Gelir geçmişi alınamadı:', error)
      throw new Error(`Gelir geçmişi alınamadı: ${error}`)
    }
  }
}

// Singleton instance oluştur
export const binanceService = new BinanceService()