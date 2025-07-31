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
  symbol: string           // Sembol (çift)
  orderId: number          // Emir ID
  orderListId: number      // Emir listesi ID
  clientOrderId: string    // İstemci emir ID
  transactTime: number     // İşlem zamanı
  price: string            // Fiyat
  origQty: string          // Orijinal miktar
  executedQty: string      // Gerçekleştirilen miktar
  cummulativeQuoteQty: string // Kümülatif quote miktarı
  status: string           // Durum
  timeInForce: string      // Geçerlilik süresi
  type: string             // Emir tipi
  side: string             // Alım/Satım
  workingTime: number      // Çalışma zamanı
  selfTradePreventionMode: string // Kendi kendine trade önleme modu
  updateTime: number       // Güncelleme zamanı
  avgPrice: string         // Ortalama fiyat
  activatePrice?: string   // Aktivasyon fiyatı
  priceRate?: string       // Fiyat oranı
  reduceOnly?: boolean     // Sadece azaltma
  closePosition?: boolean  // Pozisyon kapatma
  positionSide?: string    // Pozisyon tarafı
  stopPrice?: string       // Stop fiyatı
  workingType?: string     // Çalışma tipi
  priceProtect?: boolean   // Fiyat koruması
  origType?: string        // Orijinal tip
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

  // API anahtarlarını ayarlama
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

  // Zaman damgası oluşturma
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

    if (signed && this.apiKey) {
      headers['X-MBX-APIKEY'] = this.apiKey
    }

    return headers
  }

  // Kline (mum) verilerini getirme
  async getKlineData(
    symbol: string,
    interval: string, 
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

  // 24 saatlik ticker bilgilerini getirme
  async get24hrTicker(symbol?: string): Promise<TickerInfo[]> {
    try {
      let url = `${this.baseUrl}/fapi/v1/ticker/24hr`
      if (symbol) {
        url += `?symbol=${symbol.toUpperCase()}`
      }
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : [data]
    } catch (error: any) {
      throw new Error(`24hr ticker verisi alınamadı: ${error.message}`)
    }
  }

  // Hesap bilgilerini getirme
  async getAccountInformation(): Promise<AccountInfo> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      const queryString = `timestamp=${timestamp}`
      const signature = this.createSignature(queryString)

      const response = await fetch(`${this.baseUrl}/fapi/v2/account?${queryString}&signature=${signature}`, {
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

  // Yeni emir verme
  async placeOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    type: string,
    quantity: string,
    price?: string,
    reduceOnly?: boolean,
    stopPrice?: string,
    activationPrice?: string,
    workingType?: string
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
        quantity,
        timestamp
      }

      if (price) params.price = price
      if (reduceOnly) params.reduceOnly = reduceOnly
      if (stopPrice) params.stopPrice = stopPrice
      if (activationPrice) params.activationPrice = activationPrice
      if (workingType) params.workingType = workingType

      const queryString = new URLSearchParams(params).toString()
      const signature = this.createSignature(queryString)

      const response = await fetch(`${this.baseUrl}/fapi/v1/order`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: `${queryString}&signature=${signature}`
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Emir verilemedi: ${errorData.msg || response.statusText}`)
      }
      
      return await response.json()
    } catch (error: any) {
      throw new Error(`Emir verme başarısız: ${error.message}`)
    }
  }

  // Emir iptal etme
  async cancelOrder(symbol: string, orderId: number): Promise<BinanceOrder> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      const params = {
        symbol: symbol.toUpperCase(),
        orderId: orderId.toString(),
        timestamp: timestamp.toString()
      }

      const queryString = new URLSearchParams(params).toString()
      const signature = this.createSignature(queryString)

      const response = await fetch(`${this.baseUrl}/fapi/v1/order`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
        body: `${queryString}&signature=${signature}`
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Emir iptal edilemedi: ${errorData.msg || response.statusText}`)
      }
      
      return await response.json()
    } catch (error: any) {
      console.error('Emir iptal etme hatası:', error)
      throw new Error(`Emir iptal etme başarısız: ${error.message}`)
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

  // Server zamanını getir
  async getServerTime(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/time`)
      if (!response.ok) {
        throw new Error('Server zamanı alınamadı')
      }
      const data = await response.json()
      return data.serverTime
    } catch (error) {
      throw new Error('Server zamanı alınamadı')
    }
  }

  // API anahtarlarını test etme
  async testApiKeys(): Promise<boolean> {
    if (!this.validateCredentials()) {
      return false
    }

    try {
      await this.getAccountInformation()
      return true
    } catch (error) {
      return false
    }
  }

  // Sembol listesini getirme (basitleştirilmiş)
  async getSymbols(): Promise<SymbolInfo[]> {
    try {
      const tickers = await this.get24hrTicker()
      return tickers.map(ticker => ({
        symbol: ticker.symbol,
        price: parseFloat(ticker.lastPrice),
        change24h: parseFloat(ticker.priceChangePercent),
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice),
        volume24h: parseFloat(ticker.volume)
      }))
    } catch (error: any) {
      throw new Error(`Sembol listesi alınamadı: ${error.message}`)
    }
  }

  // Pozisyonu kapatma
  async closePosition(symbol: string): Promise<BinanceOrder> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      const positions = await this.getPositionInformation(symbol)
      const position = positions.find(p => p.symbol === symbol.toUpperCase() && parseFloat(p.positionAmt) !== 0)
      
      if (!position) {
        throw new Error(`${symbol} için açık pozisyon bulunamadı`)
      }

      const side = parseFloat(position.positionAmt) > 0 ? 'SELL' : 'BUY'
      const quantity = Math.abs(parseFloat(position.positionAmt)).toString()

      return await this.placeOrder(
        symbol,
        side,
        'MARKET',
        quantity,
        undefined,
        true // reduceOnly - pozisyonu kapatmak için
      )
    } catch (error: any) {
      throw new Error(`Pozisyon kapatma başarısız: ${error.message}`)
    }
  }
}

// Singleton instance oluşturma
export const binanceService = new BinanceService()