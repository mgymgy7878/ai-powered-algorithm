import CryptoJS from 'crypto-js'

  symbol: string
  open: string
  low: string
  volume: string
  quoteAssetVo
  takerBuyBase
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

// Binance emir bilgisi interface
export interface OrderInfo {
  orderId: number
  closePosition:
  status: string
  stopPrice: string
  price: string
  origType: string
  origQty: string
}
  cumQuote: string
export interface Acco
  type: string
  reduceOnly: boolean
  closePosition: boolean
  side: string
  positionSide: string
  stopPrice: string
  workingType: string
  totalOpenOrderInitial
  origType: string
  availableBal
  updateTime: number
 

// Binance hesap bilgisi interface
export interface AccountInfo {
  feeTier: number
  canTrade: boolean
  unRealizedProfit: s
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
 

// Pozisyon bilgisi interface
export interface PositionInfo {
  symbol: string
  positionAmt: string
  firstId: number
  markPrice: string
  unRealizedProfit: string
  liquidationPrice: string
  private apiKey: 
  maxNotionalValue: string
  private baseUrl: s
  isolatedMargin: string
  isAutoAddMargin: string
  positionSide: string
  notional: string
  isolatedWallet: string
      : 'https://fap
}

// 24 saatlik ticker bilgisi interface
export interface Ticker24hr {
  symbol: string
  private createSigna
  priceChangePercent: string

  prevClosePrice: string
  lastPrice: string
  lastQty: string
  // HTTP istekler
  bidQty: string
      'X-MBX-APIKE
  askQty: string
    return headers
  highPrice: string
  // Kline (mum çu
  volume: string
    interval: string 
  openTime: number
    endTime?: numbe
  firstId: number
      const para
  count: number
 

      if (startTime) p
  private apiKey: string = ''
      const url = `${this.baseUr
  private testnet: boolean = true
  private baseUrl: string = 'https://testnet.binancefuture.com'

  // API anahtarlarını ve ayarları belirleme
  setCredentials(apiKey: string, secretKey: string, isTestnet: boolean = true) {
        symbol,
    this.secretKey = secretKey
    this.testnet = isTestnet
    this.baseUrl = isTestnet 
      ? 'https://testnet.binancefuture.com'
      : 'https://fapi.binance.com'
  a


    } catch (error: any) {
      throw new Error(`Pozisyon bilgileri alınamadı: $
  }

    symbol: string,
    quantity: string,
  ): Promise<OrderInfo> {
   

      const timestamp = this
        symbol: symbol.toUpperCase
        type: 'MARKET
   

        params.positionSide = positionSid

      const signature = this.creat
      const response = await fetch
        headers: this.getHeaders(true),
     
      if (!respons
   

    } catch (error: any) {
      throw new Error
  }
  // Limit emir verme
    symbol: string,
    quantity: string,
    positionSide?: '
    if (!this.validateCrede
    }
    try {
      const params: any = {
        side,
        quantity,
        

      if (positionSide) {
      }
      

        method: 'POST',
      

        const errorData = await response.json()
      }
      
      console.error('Limit emir verilirk
    }

  async testConnection(): P
      const response = 
    } catch (error) {
      return false
  }
  // Server zamanını geti
    try {
      const data = await response.j
    } catch (error) {
      throw error
  }
  // 24 saatlik ticker ve
    try {
        ? `${this.baseUrl}


     


      throw error
  }
  // Exchange bilgilerini getirme
    try {
     

    } cat
      throw error
  }
  // Çoklu zaman dilimi için kline verisi getirme
    sy
    limit: number = 100
    const result: Record<string, KlineDat
    try {
        const data = await this.getKli
      })

      results.forEach(({ 
      })
      return result
      c

}
// Singleton instance













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


  async placeMarketOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: string,
    positionSide?: 'LONG' | 'SHORT'

    if (!this.validateCredentials()) {

    }

    try {
      const timestamp = this.getTimestamp()
      const params: any = {
        symbol: symbol.toUpperCase(),
        side,

        quantity,
        timestamp: timestamp.toString()
      }

      if (positionSide) {
        params.positionSide = positionSide
      }

      const queryString = new URLSearchParams(params).toString()
      const signature = this.createSignature(queryString)
      

        method: 'POST',
        headers: this.getHeaders(true),
        body: `${queryString}&signature=${signature}`



        const errorData = await response.json()
        throw new Error(`Emir Hatası: ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Emir verilirken hata:', error)
      throw new Error(`Emir verilemedi: ${error.message}`)
    }



  async placeLimitOrder(

    side: 'BUY' | 'SELL',

    price: string,
    positionSide?: 'LONG' | 'SHORT'
  ): Promise<OrderInfo> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')



      const timestamp = this.getTimestamp()
      const params: any = {
        symbol: symbol.toUpperCase(),

        type: 'LIMIT',

        price,
        timeInForce: 'GTC',
        timestamp: timestamp.toString()


      if (positionSide) {
        params.positionSide = positionSide
      }


      const signature = this.createSignature(queryString)

      const response = await fetch(`${this.baseUrl}/fapi/v1/order`, {
        method: 'POST',
        headers: this.getHeaders(true),

      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Emir Hatası: ${errorData.msg || response.statusText}`)



    } catch (error: any) {
      console.error('Limit emir verilirken hata:', error)
      throw new Error(`Limit emir verilemedi: ${error.message}`)

  }

  // Bağlantı testi

    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/ping`)
      return response.ok

      console.error('Bağlantı testi başarısız:', error)

    }


  // Server zamanını getirme
  async getServerTime(): Promise<number> {

      const response = await fetch(`${this.baseUrl}/fapi/v1/time`)
      const data = await response.json()
      return data.serverTime

      console.error('Server zamanı alınamadı:', error)

    }



  async get24hrTicker(symbol?: string): Promise<Ticker24hr | Ticker24hr[]> {

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

  // Exchange bilgilerini getirme
  async getExchangeInfo(): Promise<any> {

      const response = await fetch(`${this.baseUrl}/fapi/v1/exchangeInfo`)

        throw new Error(`HTTP error! status: ${response.status}`)

      return await response.json()
    } catch (error) {
      console.error('Exchange bilgisi alınamadı:', error)
      throw error



  // Çoklu zaman dilimi için kline verisi getirme
  async getMultiTimeframeData(

    intervals: string[] = ['1m', '5m', '15m', '1h', '4h', '1d'],

  ): Promise<Record<string, KlineData[]>> {
    const result: Record<string, KlineData[]> = {}
    

      const promises = intervals.map(async (interval) => {
        const data = await this.getKlineData(symbol, interval, limit)
        return { interval, data }


      const results = await Promise.all(promises)
      
      results.forEach(({ interval, data }) => {
        result[interval] = data
      })


    } catch (error) {
      console.error('Çoklu zaman dilimi verisi alınırken hata:', error)
      throw error

  }


// Singleton instance
export const binanceService = new BinanceService()