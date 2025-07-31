import CryptoJS from 'crypto-js'

// Kline (mum) veri interface'i
export interface KlineData {
  openTime: number           // Açılış zamanı
  open: string              // Açılış fiyatı
  high: string              // En yüksek fiyat
  low: string               // En düşük fiyat
  numberOfTrades: number    // İşlem sayısı
  volume: string            // Hacim
  closeTime: number         // Kapanış zamanı
  quoteAssetVolume: string  // Quote asset hacmi
// Binance emri interface'i
  takerBuyBaseAssetVolume: string // Taker buy base asset hacmi
  takerBuyQuoteAssetVolume: string // Taker buy quote asset hacmi
  ignore: string            // Görmezden gel
 

  avgPrice: string         
export interface BinanceOrder {
  timeInForce: string      // Geçerli
  clientOrderId: string    // İstemci emir ID
  stopPrice?: string       // Stop f
  status: string           // Durum
  origQty: string          // Orijinal miktar
  executedQty: string      // Gerçekleştirilen miktar
  workingType?: string     // Çalış
  avgPrice: string         // Ortalama fiyat
}
  side: string             // Alım/Satım
  timeInForce: string      // Geçerlilik süresi
  updateTime: number       // Güncelleme zamanı
  workingTime: number      // Çalışma zamanı
  stopPrice?: string       // Stop fiyatı
  activatePrice?: string   // Aktivasyon fiyatı
  priceRate?: string       // Fiyat oranı
  reduceOnly?: boolean     // Sadece azaltma
  closePosition?: boolean  // Pozisyon kapatma
  positionSide?: string    // Pozisyon tarafı
  workingType?: string     // Çalışma tipi
  origType?: string        // Orijinal tip
  selfTradePreventionMode: string // Kendi kendine trade önleme modu


  feeTier: number            //
export interface PositionInfo {
  symbol: string             // Sembol
  positionAmt: string        // Pozisyon miktarı
  totalUnrealizedProfit: string // Toplam ge
  markPrice: string          // İşaret fiyatı
  unRealizedProfit: string   // Gerçekleşmemiş kar/zarar
  liquidationPrice: string   // Tasfiye fiyatı
  leverage: string           // Kaldıraç
  maxNotionalValue: string   // Maksimum nominal değer

  isolatedMargin: string     // İzole marj
  isAutoAddMargin: string    // Otomatik marj ekleme
  positionSide: string       // Pozisyon tarafı
  notional: string           // Nominal değer
  isolatedWallet: string     // İzole cüzdan
  updateTime: number         // Güncelleme zamanı
  totalOpenOrderInitialMargin: string // Toplam açık emir başlangıç marjı
 

  closeTime: number         
export interface AccountInfo {
  feeTier: number            // Ücret kademesi
  canTrade: boolean          // Trade yapabilir mi
  canDeposit: boolean        // Para yatırabilir mi
  canWithdraw: boolean       // Para çekebilir mi
  updateTime: number         // Güncelleme zamanı
  totalWalletBalance: string // Toplam cüzdan bakiyesi
  totalUnrealizedProfit: string // Toplam gerçekleşmemiş kar/zarar
  totalMarginBalance: string // Toplam marj bakiyesi
  totalPositionInitialMargin: string // Toplam pozisyon başlangıç marjı
  totalOpenOrderInitialMargin: string // Toplam açık emir başlangıç marjı
  totalCrossWalletBalance: string // Toplam cross cüzdan bakiyesi
  totalCrossUnPnl: string    // Toplam cross gerçekleşmemiş kar/zarar
  availableBalance: string   // Kullanılabilir bakiye
  maxWithdrawAmount: string  // Maksimum çekim miktarı
 

      : 'https://fapi.binance.com'
export interface TickerInfo {
  symbol: string              // Sembol
  priceChange: string         // Fiyat değişimi
  priceChangePercent: string  // Fiyat değişim yüzdesi
  weightedAvgPrice: string    // Ağırlıklı ortalama fiyat
  lastPrice: string           // Son fiyat
  lastQty: string             // Son miktar
  openPrice: string           // Açılış fiyatı
  highPrice: string           // En yüksek fiyat
  lowPrice: string            // En düşük fiyat
  volume: string              // Hacim
  // HTTP başlıkları oluşturma
  openTime: number            // Açılış zamanı
  closeTime: number           // Kapanış zamanı
  firstId: number             // İlk ID
    if (signed) {
  count: number               // İşlem sayısı



export interface SymbolInfo {
    symbol: stri
  price: number
    startTime?: num
  high24h: number
    try {
  volume24h: number
 


  private apiKey: string = ''

  private baseUrl: string = 'https://testnet.binancefuture.com'

  // Kimlik bilgilerini ayarlama
  setCredentials(apiKey: string, secretKey: string, isTestnet: boolean = true) {
    this.apiKey = apiKey
      
    this.baseUrl = isTestnet
        open: kline[1],
      : 'https://fapi.binance.com'
  }

  // Kimlik doğrulama kontrolü
  private validateCredentials(): boolean {
    return !!(this.apiKey && this.secretKey)
  }

  // Zaman damgası alma
  }
    return Date.now()
  a

    }
  private createSignature(query: string): string {
    return CryptoJS.HmacSHA256(query, this.secretKey).toString()
  }

  // HTTP başlıkları oluşturma
  private getHeaders(signed: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {

    }

    if (signed) {
      if (!response.ok) {
    }

    return headers
   


  async getKlineData(
    symbol: string,
    interval: string = '1m',
    quantity?: string,
    startTime?: number,
    endTime?: number
  ): Promise<KlineData[]> {
    try {
      const params: any = {

        interval,
      const p
      }

      if (startTime) params.startTime = startTime


      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`${this.baseUrl}/fapi/v1/klines?${queryString}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return data.map((kline: any[]) => ({
        throw new Error(`HT
        open: kline[1],
      return await resp
        low: kline[3],
    }
        volume: kline[5],
  // Hesap bilgisi getirme
        quoteAssetVolume: kline[7],
      throw new Error('API anahta
        takerBuyBaseAssetVolume: kline[9],
    try {
        ignore: kline[11]
      con
    } catch (error: any) {
      throw new Error(`Kline verisi alınamadı: ${error.message}`)
    }
   

  // Pozisyon bilgilerini getirme
  async getPositionInformation(symbol?: string): Promise<PositionInfo[]> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

  // 24 s
      const timestamp = this.getTimestamp()
      let queryString = `timestamp=${timestamp}`
      
      if (symbol) {
        queryString += `&symbol=${symbol.toUpperCase()}`
      i
      
      const signature = this.createSignature(queryString)
      queryString += `&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v2/positionRisk?${queryString}`, {
        method: 'GET',
        headers: this.getHeaders(true)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
  }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Pozisyon bilgisi alınamadı: ${error.message}`)
    }
   

  // Yeni emir verme
  async placeOrder(
        method: 'GE
    side: 'BUY' | 'SELL',

    quantity?: string,
      return false
    stopPrice?: string,
}
    callbackRate?: string

    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      const params: any = {
        symbol: symbol.toUpperCase(),
        side,

        timestamp


      if (quantity) params.quantity = quantity
      if (price) params.price = price
      if (stopPrice) params.stopPrice = stopPrice
      if (activationPrice) params.activationPrice = activationPrice
      if (callbackRate) params.callbackRate = callbackRate

      const queryString = new URLSearchParams(params).toString()
      const signature = this.createSignature(queryString)
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v1/order`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: finalQuery
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)



    } catch (error: any) {
      throw new Error(`Emir verilemedi: ${error.message}`)
    }
  }


  async getAccountInfo(): Promise<AccountInfo> {

      throw new Error('API anahtarları ayarlanmamış')



      const timestamp = this.getTimestamp()
      const queryString = `timestamp=${timestamp}`
      const signature = this.createSignature(queryString)
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v2/account?${finalQuery}`, {
        method: 'GET',

      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)


      return await response.json()
    } catch (error: any) {
      throw new Error(`Hesap bilgisi alınamadı: ${error.message}`)
    }


  // 24 saatlik ticker bilgisi getirme
  async getTicker24hr(symbol?: string): Promise<TickerInfo | TickerInfo[]> {
    try {
      const url = symbol 
        ? `${this.baseUrl}/fapi/v1/ticker/24hr?symbol=${symbol.toUpperCase()}`
        : `${this.baseUrl}/fapi/v1/ticker/24hr`

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Ticker bilgisi alınamadı: ${error.message}`)
    }
  }


  async testConnection(): Promise<boolean> {

      const response = await fetch(`${this.baseUrl}/fapi/v1/ping`)
      return response.ok
    } catch (error) {
      return false
    }
  }


  async testApiConnection(): Promise<boolean> {

      return false
    }


      const timestamp = this.getTimestamp()

      const signature = this.createSignature(queryString)
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v2/account?${finalQuery}`, {
        method: 'GET',

      })

      return response.ok
    } catch (error) {
      return false

  }


export const binanceService = new BinanceService()