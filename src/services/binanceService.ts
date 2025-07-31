import CryptoJS from 'crypto-js'

// Binance Kline (mum çubuğu) verisi interface
export interface KlineData {
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
  positionSide: 
 

// Binance emir bilgisi interface
  symbol: string
  orderListId: n
  price: string
  executedQty: strin
  status: string
  type: string
  stopPrice: string
  time: number
  isWorking: boolean
  origQuoteOrderQty:

export interface AccountI
  canTrade: boolean
  canWithdraw: boo
  totalInitialMargin: st
  totalWalletBalance
 

  totalCrossUnPnl: string
  maxWithdrawAmount: string
  positions: any

export interface Tick
  priceChange: string
  weightedAvgPr
  lastPrice: stri
  bidPrice: string
  askPrice: string
  openPrice: str
  lowPrice: string
  quoteVolume:
  closeTime: n
  lastId: number
}
class BinanceS
  private secretKey:
  private testnet: b
  // API anahtarların
    this.apiKey = apiKey
 

  // Testnet/mainnet ayarı
    this.testnet = isTestnet
      ? 'https://
  }
  // API anahtarı doğ
    return this.apiKey

  private createSignature(qu
  }
  // Zaman damgası oluşturma
    return Date.now()

  private getHeaders(includeSignatur
      'X-MBX-APIKEY': this.apiKey,
    }
  }
  // Kline (mum çubuğu) ve
    symbol: string, 
    limit: numb
    endTime?: numb
 

        limit: limit.toString()

      if (endTim
      const url = `${
      
        throw new Error(`H
      
      return data.m
        openTime:
        high: klin
        close: k
        closeTime:
        numberOf
        takerBuyQuo
      }))
      console.erro
    }

  async getAccount
      throw new Err

      const time
      const sig
 

      })
      if (!response.ok) {
        throw new Error(`API Hat

    } catch (error: any) {

  }
  // Pozisyon bilgilerini getirme
    if (!this.validateCr
    }
    try {
      let queryString = `tim
  }

      const signature = th
      
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error(`API Hatas


  // API anahtarı doğrulaması
  validateCredentials(): boolean {
    return this.apiKey !== '' && this.secretKey !== ''
  /

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

  }
  async placeMarketOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: string,
    positionSide?: 'LONG' | 'SHORT'
      const response = aw
    if (!this.validateCredentials()) {
        throw new Error(`HTTP error! status: ${respon
    }

    try {
      const timestamp = this.getTimestamp()
      const params: any = {
        symbol: symbol.toUpperCase(),
        side,
    try {
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
      

      console.error('Semb
        const errorData = await response.json()
        throw new Error(`Emir Hatası: ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Emir verilirken hata:', error)
      throw new Error(`Emir verilemedi: ${error.message}`)
    }
   


  async placeLimitOrder(
      results.forEa
    side: 'BUY' | 'SELL',

    price: string,
    positionSide?: 'LONG' | 'SHORT'
  ): Promise<OrderInfo> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
// Si


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