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
  orderId: number          // Emir ID
  clientOrderId: string    // İstemci emir ID
  symbol: string           // Sembol
  status: string           // Durum
  origQty: string          // Orijinal miktar
  executedQty: string      // Gerçekleştirilen miktar
  price: string            // Fiyat
  avgPrice: string         // Ortalama fiyat
  type: string             // Emir tipi
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
  notional: string           // Nominal değer
  isolatedWallet: string     // İzole cüzdan
  updateTime: number         // Güncelleme zamanı
  totalOpenOrderInitialMargin: string // Toplam açık emir başlangıç marjı
}

// Hesap bilgisi interface'i
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
}

// 24 saatlik ticker bilgisi interface'i
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
  quoteVolume: string         // Quote hacmi
  openTime: number            // Açılış zamanı
  closeTime: number           // Kapanış zamanı
  firstId: number             // İlk ID
  lastId: number              // Son ID
  count: number               // İşlem sayısı
}

// Sembol bilgisi interface'i
export interface SymbolInfo {
  symbol: string
  price: number
  change24h: number
  high24h: number
  low24h: number
  volume24h: number
}

class BinanceService {
  private apiKey: string = ''
  private secretKey: string = ''
  private baseUrl: string = 'https://testnet.binancefuture.com'

  // Kimlik bilgilerini ayarlama
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
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    if (signed) {
      headers['X-MBX-APIKEY'] = this.apiKey
    }

    return headers
  }

  // Kline (mum) verilerini getirme
  async getKlineData(
    symbol: string,
    interval: string = '1m',
    limit: number = 500,
    startTime?: number,
    endTime?: number
  ): Promise<KlineData[]> {
    try {
      const params: any = {
        symbol: symbol.toUpperCase(),
        interval,
        limit
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
      throw new Error(`Kline verisi alınamadı: ${error.message}`)
    }
  }

  // Pozisyon bilgilerini getirme
  async getPositionInformation(symbol?: string): Promise<PositionInfo[]> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      let queryString = `timestamp=${timestamp}`
      
      if (symbol) {
        queryString += `&symbol=${symbol.toUpperCase()}`
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
      throw new Error(`Pozisyon bilgisi alınamadı: ${error.message}`)
    }
  }

  // Yeni emir verme
  async placeOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    type: string = 'MARKET',
    quantity?: string,
    price?: string,
    stopPrice?: string,
    activationPrice?: string,
    callbackRate?: string
  ): Promise<BinanceOrder> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      const params: any = {
        symbol: symbol.toUpperCase(),
        side,
        type,
        timestamp
      }

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
      }

      return await response.json()
    } catch (error: any) {
      throw new Error(`Emir verilemedi: ${error.message}`)
    }
  }

  // Hesap bilgisi getirme
  async getAccountInfo(): Promise<AccountInfo> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      const queryString = `timestamp=${timestamp}`
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
      throw new Error(`Hesap bilgisi alınamadı: ${error.message}`)
    }
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

  // Bağlantı testi
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/ping`)
      return response.ok
    } catch (error) {
      return false
    }
  }

  // API bağlantı testi (kimlik doğrulama ile)
  async testApiConnection(): Promise<boolean> {
    if (!this.validateCredentials()) {
      return false
    }

    try {
      const timestamp = this.getTimestamp()
      const queryString = `timestamp=${timestamp}`
      const signature = this.createSignature(queryString)
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v2/account?${finalQuery}`, {
        method: 'GET',
        headers: this.getHeaders(true)
      })

      return response.ok
    } catch (error) {
      return false
    }
  }
}

export const binanceService = new BinanceService()