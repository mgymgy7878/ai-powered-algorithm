import CryptoJS from 'crypto-js'

// Kline (mum grafiği) verisi interface'i
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

// Binance emir verisi interface'i
export interface OrderData {
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
  closePosition: boolean
  side: string
  positionSide: string
  stopPrice: string
  workingType: string
  priceProtect: boolean
  origType: string
  updateTime: number
}

// Pozisyon bilgisi interface'i
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

// Sembol fiyat bilgisi interface'i  
export interface SymbolPrice {
  symbol: string
  price: string
  priceChangePercent: string
  prevClosePrice: string
  lastQty: string
  bidPrice: string
  askPrice: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  openTime: number
  count: number
}

// Hesap bilgisi interface'i
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
  assets: Array<{
    asset: string
    walletBalance: string
    unrealizedProfit: string
    marginBalance: string
    maintMargin: string
    initialMargin: string
    positionInitialMargin: string
    openOrderInitialMargin: string
    crossWalletBalance: string
    crossUnPnl: string
    availableBalance: string
    maxWithdrawAmount: string
    marginAvailable: boolean
    updateTime: number
  }>
  positions?: PositionInfo[]
}

// Binance servis sınıfı
class BinanceService {
  private baseUrl: string = 'https://testnet.binancefuture.com'
  private apiKey: string = ''
  private secretKey: string = ''

  // API kimlik bilgilerini ayarlama
  setCredentials(apiKey: string, secretKey: string, isTestnet: boolean = true) {
    this.apiKey = apiKey
    this.secretKey = secretKey
    this.baseUrl = isTestnet 
      ? 'https://testnet.binancefuture.com'
      : 'https://fapi.binance.com'
  }

  // Kimlik bilgilerini doğrula
  hasCredentials(): boolean {
    return !!(this.apiKey && this.secretKey)
  }

  // Zaman damgası getir
  private getTimestamp(): number {
    return Date.now()
  }

  // İmza oluştur
  private createSignature(queryString: string): string {
    return CryptoJS.HmacSHA256(queryString, this.secretKey).toString()
  }

  // Hesap bilgilerini getir
  async getAccountInfo(): Promise<AccountInfo | null> {
    try {
      if (!this.hasCredentials()) {
        throw new Error('API kimlik bilgileri ayarlanmamış')
      }

      const timestamp = this.getTimestamp()
      const queryString = `timestamp=${timestamp}`
      const signature = this.createSignature(queryString)
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v2/account?${finalQuery}`, {
        method: 'GET',
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Hesap bilgileri alınırken hata:', error)
      return null
    }
  }

  // Sembol fiyatlarını getir (24hr ticker statistics)
  async getSymbolPrices(): Promise<SymbolPrice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/ticker/24hr`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Sembol fiyatları alınırken hata:', error)
      return []
    }
  }

  // Kline verilerini getir (candlestick data)
  async getKlineData(
    symbol: string, 
    interval: string, 
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

      if (startTime) {
        params.append('startTime', startTime.toString())
      }
      if (endTime) {  
        params.append('endTime', endTime.toString())
      }

      const response = await fetch(`${this.baseUrl}/fapi/v1/klines?${params}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const rawData = await response.json()
      
      // Raw kline data'yı KlineData formatına çevir
      return rawData.map((kline: any[]) => ({
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
      console.error('Kline verisi alınırken hata:', error)
      return []
    }
  }

  // Test bağlantısı
  async testConnection(): Promise<boolean> {
    try {
      if (!this.hasCredentials()) {
        // Kimlik bilgileri yoksa sadece public endpoint test et
        const response = await fetch(`${this.baseUrl}/fapi/v1/ping`)
        return response.ok
      }

      // Kimlik bilgileri varsa hesap bilgilerini test et
      const accountInfo = await this.getAccountInfo()
      return accountInfo !== null
    } catch (error) {
      console.error('Bağlantı testi hatası:', error)
      return false
    }
  }
}

// Singleton instance oluşturma
export const binanceService = new BinanceService()