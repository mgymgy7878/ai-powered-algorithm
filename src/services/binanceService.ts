import CryptoJS from 'crypto-js'

// Kline (mum) veri interface'i
export interface KlineData {
  openTime: number           // Açılış zamanı
  open: string              // Açılış fiyatı
  high: string              // En yüksek fiyat
  low: string               // En düşük fiyat
  close: string             // Kapanış fiyatı
  volume: string            // Hacim
  closeTime: number         // Kapanış zamanı
  quoteAssetVolume: string  // Quote asset hacmi
  numberOfTrades: number    // İşlem sayısı
  takerBuyBaseAssetVolume: string // Taker buy base asset hacmi
  takerBuyQuoteAssetVolume: string // Taker buy quote asset hacmi
  ignore: string            // Görmezden gel
}

// Binance emri interface'i
export interface BinanceOrder {
  orderId: number           // Emir ID
  symbol: string            // Sembol
  status: string            // Durum
  clientOrderId: string     // İstemci emir ID
  price: string             // Fiyat
  avgPrice: string          // Ortalama fiyat
  origQty: string           // Orijinal miktar
  executedQty: string       // Gerçekleştirilen miktar
  cummulativeQuoteQty: string // Kümülatif quote miktarı
  timeInForce: string       // Geçerlilik süresi
  type: string              // Tip
  reduceOnly: boolean       // Sadece azaltma
  closePosition: boolean    // Pozisyon kapatma
  side: string              // Alım/Satım
  positionSide: string      // Pozisyon tarafı
  stopPrice: string         // Stop fiyatı
  workingType: string       // Çalışma tipi
  priceProtect: boolean     // Fiyat koruması
  origType: string          // Orijinal tip
  time: number              // Zaman
  updateTime: number        // Güncelleme zamanı
}

// Pozisyon bilgisi interface'i
export interface PositionInfo {
  symbol: string             // Sembol
  positionAmt: string        // Pozisyon miktarı
  entryPrice: string         // Giriş fiyatı
  markPrice: string          // İşaret fiyatı
  unRealizedProfit: string   // Gerçekleşmemiş kar/zarar
  liquidationPrice: string   // Tasfiye fiyatı
  leverage: string           // Kaldıraç
  maxNotionalValue: string   // Maksimum nominal değer
  marginType: string         // Marj tipi
  isolatedMargin: string     // İzole marj
  isAutoAddMargin: string    // Otomatik marj ekleme
  positionSide: string       // Pozisyon tarafı
  notional: string           // Nominal
  isolatedWallet: string     // İzole cüzdan
  updateTime: number         // Güncelleme zamanı
}

// Hesap bilgisi interface'i
export interface AccountInfo {
  feeTier: number            // Ücret katmanı
  canTrade: boolean          // İşlem yapabilir mi
  canDeposit: boolean        // Para yatırabilir mi
  canWithdraw: boolean       // Para çekebilir mi
  updateTime: number         // Güncelleme zamanı
  totalInitialMargin: string // Toplam başlangıç marjı
  totalMaintMargin: string   // Toplam bakım marjı
  totalWalletBalance: string // Toplam cüzdan bakiyesi
  totalUnrealizedProfit: string // Toplam gerçekleşmemiş kar/zarar
  totalMarginBalance: string // Toplam marj bakiyesi
  totalPositionInitialMargin: string // Toplam pozisyon başlangıç marjı
  totalOpenOrderInitialMargin: string // Toplam açık emir başlangıç marjı
  totalCrossWalletBalance: string // Toplam çapraz cüzdan bakiyesi
  totalCrossUnPnl: string    // Toplam çapraz gerçekleşmemiş kar/zarar
  availableBalance: string   // Kullanılabilir bakiye
  maxWithdrawAmount: string  // Maksimum çekim miktarı
  assets: Array<{
    asset: string            // Varlık
    walletBalance: string    // Cüzdan bakiyesi
    unrealizedProfit: string // Gerçekleşmemiş kar/zarar
    marginBalance: string    // Marj bakiyesi
    maintMargin: string      // Bakım marjı
    initialMargin: string    // Başlangıç marjı
    positionInitialMargin: string // Pozisyon başlangıç marjı
    openOrderInitialMargin: string // Açık emir başlangıç marjı
    crossWalletBalance: string // Çapraz cüzdan bakiyesi
    crossUnPnl: string       // Çapraz gerçekleşmemiş kar/zarar
    availableBalance: string // Kullanılabilir bakiye
    maxWithdrawAmount: string // Maksimum çekim miktarı
    marginAvailable: boolean // Marj kullanılabilir mi
    updateTime: number       // Güncelleme zamanı
  }>
  positions: PositionInfo[]  // Pozisyonlar
}

class BinanceService {
  private apiKey: string = ''
  private secretKey: string = ''
  private baseUrl: string = ''

  constructor() {
    this.baseUrl = 'https://testnet.binancefuture.com' // Varsayılan testnet
  }

  // API kimlik bilgilerini ayarlama
  setCredentials(apiKey: string, secretKey: string, isTestnet: boolean = true) {
    this.apiKey = apiKey
    this.secretKey = secretKey
    this.baseUrl = isTestnet
      ? 'https://testnet.binancefuture.com'
      : 'https://fapi.binance.com'
  }

  // Kimlik doğrulama kontrolü
  private validateCredentials(): boolean {
    return !!(this.apiKey && this.secretKey)
  }

  // Zaman damgası alma
  private getTimestamp(): number {
    return Date.now()
  }

  // İmza oluşturma
  private createSignature(query: string): string {
    return CryptoJS.HmacSHA256(query, this.secretKey).toString()
  }

  // HTTP başlıkları oluşturma
  private getHeaders(signed: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    if (signed) {
      headers['X-MBX-APIKEY'] = this.apiKey
    }

    return headers
  }

  // Kline verilerini getirme
  async getKlineData(
    symbol: string,
    interval: string = '1m',
    limit?: number,
    startTime?: number,
    endTime?: number
  ): Promise<KlineData[]> {
    try {
      const params: any = {
        symbol,
        interval,
        limit: limit || 500
      }

      if (startTime) params.startTime = startTime
      if (endTime) params.endTime = endTime

      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`${this.baseUrl}/fapi/v1/klines?${queryString}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      return data.map((kline: any[]) => ({
        openTime: parseInt(kline[0]),
        open: kline[1],
        high: kline[2],
        low: kline[3],
        close: kline[4],
        volume: kline[5],
        closeTime: parseInt(kline[6]),
        quoteAssetVolume: kline[7],
        numberOfTrades: parseInt(kline[8]),
        takerBuyBaseAssetVolume: kline[9],
        takerBuyQuoteAssetVolume: kline[10],
        ignore: kline[11]
      }))
    } catch (error: any) {
      console.error('Kline verilerini alma hatası:', error)
      throw new Error(`Kline verilerini alma hatası: ${error.message}`)
    }
  }

  // Pozisyon bilgilerini getirme
  async getPositionInformation(symbol?: string): Promise<PositionInfo[]> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış!')
    }

    try {
      let queryString = `timestamp=${this.getTimestamp()}`
      
      if (symbol) {
        queryString += `&symbol=${symbol}`
      }
      
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
      console.error('Pozisyon bilgilerini alma hatası:', error)
      throw new Error(`Pozisyon bilgilerini alma hatası: ${error.message}`)
    }
  }

  // Hesap bilgilerini getirme
  async getAccountInformation(): Promise<AccountInfo> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış!')
    }

    try {
      const queryString = `timestamp=${this.getTimestamp()}`
      const signature = this.createSignature(queryString)
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v2/account?${finalQuery}`, {
        method: 'GET',
        headers: this.getHeaders(true)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Hesap bilgilerini alma hatası:', error)
      throw new Error(`Hesap bilgilerini alma hatası: ${error.message}`)
    }
  }

  // Emir verme
  async placeOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    type: string,
    quantity: string,
    price?: string,
    timeInForce?: string,
    reduceOnly?: boolean,
    positionSide?: string,
    stopPrice?: string,
    closePosition?: boolean,
    activationPrice?: string,
    callbackRate?: string
  ): Promise<BinanceOrder> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış!')
    }

    try {
      const params: any = {
        symbol,
        side,
        type,
        quantity,
        timestamp: this.getTimestamp()
      }

      // Opsiyonel parametreler
      if (price) params.price = price
      if (timeInForce) params.timeInForce = timeInForce
      if (reduceOnly !== undefined) params.reduceOnly = reduceOnly
      if (positionSide) params.positionSide = positionSide
      if (stopPrice) params.stopPrice = stopPrice
      if (closePosition !== undefined) params.closePosition = closePosition
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
        const errorData = await response.json()
        throw new Error(`Emir verme hatası: ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Emir verme hatası:', error)
      throw new Error(`Emir verme hatası: ${error.message}`)
    }
  }

  // Bağlantı testi
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/ping`)
      return response.ok
    } catch (error) {
      console.error('Binance bağlantı testi hatası:', error)
      return false
    }
  }

  // API anahtarı testi
  async testApiKey(): Promise<boolean> {
    if (!this.validateCredentials()) {
      return false
    }

    try {
      const timestamp = this.getTimestamp()
      const queryString = `timestamp=${timestamp}`
      const signature = this.createSignature(queryString)

      const response = await fetch(`${this.baseUrl}/fapi/v2/account?${queryString}&signature=${signature}`, {
        method: 'GET',
        headers: this.getHeaders(true)
      })

      return response.ok
    } catch (error) {
      console.error('API anahtarı testi hatası:', error)
      return false
    }
  }
}

// Singleton instance oluşturma
export const binanceService = new BinanceService()