import CryptoJS from 'crypto-js'
import { BinanceMarketData, BinanceKlineData, BinanceAccountInfo } from '../types/api'

class BinanceService {
  private apiKey: string = ''
  private secretKey: string = ''
  private baseUrl: string = 'https://fapi.binance.com'
  private testnetUrl: string = 'https://testnet.binancefuture.com'
  private isTestnet: boolean = true

  setCredentials(apiKey: string, secretKey: string, testnet: boolean = true) {
    this.apiKey = apiKey
    this.secretKey = secretKey
    this.isTestnet = testnet
  }

  private getBaseUrl(): string {
    return this.isTestnet ? this.testnetUrl : this.baseUrl
  }

  private createSignature(queryString: string): string {
    return CryptoJS.HmacSHA256(queryString, this.secretKey).toString(CryptoJS.enc.Hex)
  }

  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    params: Record<string, any> = {},
    requiresAuth: boolean = false
  ): Promise<any> {
    const baseUrl = this.getBaseUrl()
    const timestamp = Date.now()
    
    if (requiresAuth) {
      params.timestamp = timestamp
    }

    const queryString = new URLSearchParams(params).toString()
    let url = `${baseUrl}${endpoint}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (requiresAuth) {
      if (!this.apiKey || !this.secretKey) {
        throw new Error('Binance API anahtarları yapılandırılmamış')
      }
      
      headers['X-MBX-APIKEY'] = this.apiKey
      const signature = this.createSignature(queryString)
      url = `${url}?${queryString}&signature=${signature}`
    } else if (queryString) {
      url = `${url}?${queryString}`
    }

    const response = await fetch(url, {
      method,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.msg || `Binance API hatası: ${response.status}`)
    }

    return response.json()
  }

  // Test bağlantısı
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/fapi/v1/ping')
      return true
    } catch (error) {
      console.error('Binance bağlantı testi başarısız:', error)
      return false
    }
  }

  // Hesap bilgilerini al
  async getAccountInfo(): Promise<BinanceAccountInfo> {
    try {
      const data = await this.makeRequest('/fapi/v2/account', 'GET', {}, true)
      return {
        balances: data.assets.map((asset: any) => ({
          asset: asset.asset,
          free: asset.availableBalance,
          locked: asset.initialMargin
        })),
        totalWalletBalance: data.totalWalletBalance,
        totalUnrealizedProfit: data.totalUnrealizedProfit,
        totalMarginBalance: data.totalMarginBalance,
        totalPositionInitialMargin: data.totalPositionInitialMargin
      }
    } catch (error) {
      throw new Error(`Hesap bilgileri alınamadı: ${error}`)
    }
  }

  // 24 saat ticker verilerini al
  async get24hrTicker(): Promise<any[]> {
    try {
      return await this.makeRequest('/fapi/v1/ticker/24hr')
    } catch (error) {
      throw new Error(`24h ticker verileri alınamadı: ${error}`)
    }
  }

  // Sembol fiyatlarını al
  async getSymbolPrices(): Promise<BinanceMarketData[]> {
    try {
      const [tickerData, priceData] = await Promise.all([
        this.makeRequest('/fapi/v1/ticker/24hr'),
        this.makeRequest('/fapi/v1/ticker/price')
      ])

      const priceMap = new Map(
        priceData.map((item: any) => [item.symbol, parseFloat(item.price)])
      )

      return tickerData.map((ticker: any) => ({
        symbol: ticker.symbol,
        price: priceMap.get(ticker.symbol) || parseFloat(ticker.lastPrice),
        change24h: parseFloat(ticker.priceChangePercent),
        volume24h: parseFloat(ticker.volume),
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice),
        timestamp: Date.now()
      }))
    } catch (error) {
      throw new Error(`Fiyat verileri alınamadı: ${error}`)
    }
  }

  // Kline (mum) verilerini al
  async getKlineData(
    symbol: string,
    interval: string = '1m',
    limit: number = 500,
    startTime?: number,
    endTime?: number
  ): Promise<BinanceKlineData[]> {
    try {
      const params: any = {
        symbol: symbol.toUpperCase(),
        interval,
        limit
      }

      if (startTime) params.startTime = startTime
      if (endTime) params.endTime = endTime

      const data = await this.makeRequest('/fapi/v1/klines', 'GET', params)

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
        takerBuyQuoteAssetVolume: kline[10]
      }))
    } catch (error) {
      throw new Error(`Kline verileri alınamadı: ${error}`)
    }
  }

  // WebSocket bağlantısı için URL
  getWebSocketUrl(): string {
    const wsBaseUrl = this.isTestnet 
      ? 'wss://stream.binancefuture.com'
      : 'wss://fstream.binance.com'
    return `${wsBaseUrl}/ws`
  }

  // Sembol listesini al
  async getExchangeInfo(): Promise<any> {
    try {
      return await this.makeRequest('/fapi/v1/exchangeInfo')
    } catch (error) {
      throw new Error(`Exchange bilgileri alınamadı: ${error}`)
    }
  }

  // Aktif pozisyonları al
  async getPositions(): Promise<any[]> {
    try {
      const positions = await this.makeRequest('/fapi/v2/positionRisk', 'GET', {}, true)
      return positions.filter((pos: any) => parseFloat(pos.positionAmt) !== 0)
    } catch (error) {
      throw new Error(`Pozisyon bilgileri alınamadı: ${error}`)
    }
  }

  // Açık emirleri al
  async getOpenOrders(symbol?: string): Promise<any[]> {
    try {
      const params = symbol ? { symbol: symbol.toUpperCase() } : {}
      return await this.makeRequest('/fapi/v1/openOrders', 'GET', params, true)
    } catch (error) {
      throw new Error(`Açık emirler alınamadı: ${error}`)
    }
  }

  // Market emir ver
  async placeMarketOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: number,
    reduceOnly: boolean = false
  ): Promise<any> {
    try {
      const params = {
        symbol: symbol.toUpperCase(),
        side,
        type: 'MARKET',
        quantity: quantity.toString(),
        reduceOnly: reduceOnly.toString()
      }

      return await this.makeRequest('/fapi/v1/order', 'POST', params, true)
    } catch (error) {
      throw new Error(`Market emir verilemedi: ${error}`)
    }
  }

  // Limit emir ver
  async placeLimitOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: number,
    price: number,
    timeInForce: 'GTC' | 'IOC' | 'FOK' = 'GTC'
  ): Promise<any> {
    try {
      const params = {
        symbol: symbol.toUpperCase(),
        side,
        type: 'LIMIT',
        quantity: quantity.toString(),
        price: price.toString(),
        timeInForce
      }

      return await this.makeRequest('/fapi/v1/order', 'POST', params, true)
    } catch (error) {
      throw new Error(`Limit emir verilemedi: ${error}`)
    }
  }

  // Emri iptal et
  async cancelOrder(symbol: string, orderId: string): Promise<any> {
    try {
      const params = {
        symbol: symbol.toUpperCase(),
        orderId
      }

      return await this.makeRequest('/fapi/v1/order', 'DELETE', params, true)
    } catch (error) {
      throw new Error(`Emir iptal edilemedi: ${error}`)
    }
  }

  // Tüm açık emirleri iptal et
  async cancelAllOrders(symbol: string): Promise<any> {
    try {
      const params = {
        symbol: symbol.toUpperCase()
      }

      return await this.makeRequest('/fapi/v1/allOpenOrders', 'DELETE', params, true)
    } catch (error) {
      throw new Error(`Tüm emirler iptal edilemedi: ${error}`)
    }
  }

  // Posizyonu kapat
  async closePosition(symbol: string): Promise<any> {
    try {
      const positions = await this.getPositions()
      const position = positions.find(p => p.symbol === symbol.toUpperCase())
      
      if (!position || parseFloat(position.positionAmt) === 0) {
        throw new Error('Kapatılacak pozisyon bulunamadı')
      }

      const quantity = Math.abs(parseFloat(position.positionAmt))
      const side = parseFloat(position.positionAmt) > 0 ? 'SELL' : 'BUY'

      return await this.placeMarketOrder(symbol, side, quantity, true)
    } catch (error) {
      throw new Error(`Pozisyon kapatılamadı: ${error}`)
    }
  }

  // Kaldıraç ayarla
  async setLeverage(symbol: string, leverage: number): Promise<any> {
    try {
      const params = {
        symbol: symbol.toUpperCase(),
        leverage: leverage.toString()
      }

      return await this.makeRequest('/fapi/v1/leverage', 'POST', params, true)
    } catch (error) {
      throw new Error(`Kaldıraç ayarlanamadı: ${error}`)
    }
  }

  // Margin tipini ayarla
  async setMarginType(symbol: string, marginType: 'ISOLATED' | 'CROSSED'): Promise<any> {
    try {
      const params = {
        symbol: symbol.toUpperCase(),
        marginType
      }

      return await this.makeRequest('/fapi/v1/marginType', 'POST', params, true)
    } catch (error) {
      throw new Error(`Margin tipi ayarlanamadı: ${error}`)
    }
  }

  // İşlem geçmişini al
  async getTradeHistory(symbol: string, limit: number = 500): Promise<any[]> {
    try {
      const params = {
        symbol: symbol.toUpperCase(),
        limit: limit.toString()
      }

      return await this.makeRequest('/fapi/v1/userTrades', 'GET', params, true)
    } catch (error) {
      throw new Error(`İşlem geçmişi alınamadı: ${error}`)
    }
  }

  // Gelir geçmişini al
  async getIncomeHistory(symbol?: string, incomeType?: string, limit: number = 100): Promise<any[]> {
    try {
      const params: any = {
        limit: limit.toString()
      }

      if (symbol) params.symbol = symbol.toUpperCase()
      if (incomeType) params.incomeType = incomeType

      return await this.makeRequest('/fapi/v1/income', 'GET', params, true)
    } catch (error) {
      throw new Error(`Gelir geçmişi alınamadı: ${error}`)
    }
  }
}

export const binanceService = new BinanceService()