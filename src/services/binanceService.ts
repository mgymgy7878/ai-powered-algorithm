import CryptoJS from 'crypto-js'

// Kline (mum verisi) bilgisi interface
export interface KlineData {
  openTime: number           // Açılış zamanı
  open: string              // Açılış fiyatı
  high: string              // En yüksek fiyat
  low: string               // En düşük fiyat
  close: string             // Kapanış fiyatı
  volume: string            // İşlem hacmi
  closeTime: number         // Kapanış zamanı
  quoteAssetVolume: string  // Quote varlık hacmi
  numberOfTrades: number    // İşlem sayısı
  takerBuyBaseAssetVolume: string   // Taker alım base varlık hacmi
  takerBuyQuoteAssetVolume: string  // Taker alım quote varlık hacmi
  ignore: string            // Göz ardı edilecek alan
}

// Binance emri interface
export interface BinanceOrder {
  orderId: number           // Emir ID
  symbol: string           // Sembol (çift)
  status: string           // Emir durumu
  clientOrderId: string    // İstemci emir ID
  price: string            // Fiyat
  avgPrice: string         // Ortalama fiyat
  origQty: string          // Orijinal miktar
  executedQty: string      // Gerçekleştirilen miktar
  cumQuote: string         // Kümülatif quote
  timeInForce: string      // Geçerlilik süresi
  type: string             // Emir tipi
  reduceOnly: boolean      // Sadece azaltma
  closePosition: boolean   // Pozisyon kapatma
  side: string             // Alım/Satım
  positionSide: string     // Pozisyon tarafı
  stopPrice: string        // Stop fiyatı
  workingType: string      // Çalışma tipi
  priceProtect: boolean    // Fiyat koruması
  origType: string         // Orijinal tip
  updateTime: number       // Güncelleme zamanı
}

// Pozisyon bilgisi interface
export interface PositionInfo {
  symbol: string              // Sembol
  positionAmt: string         // Pozisyon miktarı
  entryPrice: string          // Giriş fiyatı
  markPrice: string           // İşaret fiyatı
  unRealizedProfit: string    // Gerçekleşmemiş kar/zarar
  liquidationPrice: string    // Tasfiye fiyatı
  leverage: string            // Kaldıraç
  maxNotionalValue: string    // Maksimum nominal değer
  marginType: string          // Marj tipi
  isolatedMargin: string      // İzole marj
  isAutoAddMargin: string     // Otomatik marj ekleme
  positionSide: string        // Pozisyon tarafı
  notional: string            // Nominal değer
  isolatedWallet: string      // İzole cüzdan
  updateTime: number          // Güncelleme zamanı
}

// 24 saatlik ticker bilgisi interface
export interface Ticker24hr {
  symbol: string              // Sembol
  priceChange: string         // Fiyat değişimi
  priceChangePercent: string  // Fiyat değişim yüzdesi
  weightedAvgPrice: string    // Ağırlıklı ortalama fiyat
  prevClosePrice: string      // Önceki kapanış fiyatı
  lastPrice: string           // Son fiyat
  lastQty: string             // Son miktar
  bidPrice: string            // Alış fiyatı
  bidQty: string              // Alış miktarı
  askPrice: string            // Satış fiyatı
  askQty: string              // Satış miktarı
  openPrice: string           // Açılış fiyatı
  highPrice: string           // En yüksek fiyat
  lowPrice: string            // En düşük fiyat
  volume: string              // Hacim
  quoteVolume: string         // Quote hacmi
  openTime: number            // Açılış zamanı
  closeTime: number           // Kapanış zamanı
  firstId: number             // İlk işlem ID
  lastId: number              // Son işlem ID
  count: number               // İşlem sayısı
}

// Hesap bilgisi interface
export interface AccountInfo {
  feeTier: number             // Ücret katmanı
  canTrade: boolean           // İşlem yapabilir mi
  canDeposit: boolean         // Para yatırabilir mi
  canWithdraw: boolean        // Para çekebilir mi
  updateTime: number          // Güncelleme zamanı
  totalWalletBalance: string  // Toplam cüzdan bakiyesi
  totalUnrealizedProfit: string // Toplam gerçekleşmemiş kar
  totalMarginBalance: string  // Toplam marj bakiyesi
  totalPositionInitialMargin: string // Toplam pozisyon başlangıç marjı
  totalOpenOrderInitialMargin: string // Toplam açık emir başlangıç marjı
  totalCrossWalletBalance: string // Toplam çapraz cüzdan bakiyesi
  totalCrossUnPnl: string     // Toplam çapraz gerçekleşmemiş kar/zarar
  availableBalance: string    // Kullanılabilir bakiye
  maxWithdrawAmount: string   // Maksimum çekim miktarı
  assets: Array<{
    asset: string             // Varlık
    walletBalance: string     // Cüzdan bakiyesi
    unrealizedProfit: string  // Gerçekleşmemiş kar
    marginBalance: string     // Marj bakiyesi
    maintMargin: string       // Bakım marjı
    initialMargin: string     // Başlangıç marjı
    positionInitialMargin: string // Pozisyon başlangıç marjı
    openOrderInitialMargin: string // Açık emir başlangıç marjı
    crossWalletBalance: string // Çapraz cüzdan bakiyesi
    crossUnPnl: string        // Çapraz gerçekleşmemiş kar/zarar
    availableBalance: string  // Kullanılabilir bakiye
    maxWithdrawAmount: string // Maksimum çekim miktarı
    marginAvailable: boolean  // Marj kullanılabilir
    updateTime: number        // Güncelleme zamanı
  }>
  positions: PositionInfo[]   // Pozisyonlar
}

class BinanceService {
  private apiKey: string = ''
  private secretKey: string = ''
  private testnet: boolean = true
  private baseUrl: string = 'https://testnet.binancefuture.com'

  // API anahtarlarını ve ayarları belirleme
  setCredentials(apiKey: string, secretKey: string, isTestnet: boolean = true) {
    this.apiKey = apiKey
    this.secretKey = secretKey
    this.testnet = isTestnet
    this.baseUrl = isTestnet 
      ? 'https://testnet.binancefuture.com'
      : 'https://fapi.binance.com'
  }

  // API anahtarları doğrulama
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
  private getHeaders(includeApiKey: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    if (includeApiKey) {
      headers['X-MBX-APIKEY'] = this.apiKey
    }

    return headers
  }

  // Kline (mum çubuğu) verilerini getirme
  async getKlineData(
    symbol: string,
    interval: string = '1m',
    limit: number = 100,
    startTime?: number,
    endTime?: number
  ): Promise<KlineData[]> {
    try {
      const params: any = {
        symbol: symbol.toUpperCase(),
        interval,
        limit: Math.min(limit, 1500) // API limiti
      }

      if (startTime) params.startTime = startTime
      if (endTime) params.endTime = endTime

      const queryString = new URLSearchParams(params).toString()
      const url = `${this.baseUrl}/fapi/v1/klines?${queryString}`

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP hatası! durum: ${response.status}`)
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
      console.error('Kline verisi alınırken hata:', error)
      throw new Error(`Kline verisi alınamadı: ${error.message}`)
    }
  }

  // Pozisyon bilgilerini getirme
  async getPositionRisk(symbol?: string): Promise<PositionInfo[]> {
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
        throw new Error(`HTTP hatası! durum: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Pozisyon bilgileri alınırken hata:', error)
      throw new Error(`Pozisyon bilgileri alınamadı: ${error.message}`)
    }
  }

  // 24 saatlik ticker verilerini getirme
  async get24hrTicker(symbol?: string): Promise<Ticker24hr[]> {
    try {
      let url = `${this.baseUrl}/fapi/v1/ticker/24hr`
      
      if (symbol) {
        url += `?symbol=${symbol.toUpperCase()}`
      }

      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP hatası! durum: ${response.status}`)
      }

      const data = await response.json()
      return Array.isArray(data) ? data : [data]
    } catch (error: any) {
      console.error('24hr ticker verisi alınırken hata:', error)
      throw new Error(`24hr ticker verisi alınamadı: ${error.message}`)
    }
  }

  // Hesap bilgilerini getirme
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
        throw new Error(`HTTP hatası! durum: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Hesap bilgileri alınırken hata:', error)
      throw new Error(`Hesap bilgileri alınamadı: ${error.message}`)
    }
  }

  // Yeni emir verme
  async newOrder(
    symbol: string,
    side: 'BUY' | 'SELL',
    type: 'LIMIT' | 'MARKET' | 'STOP' | 'STOP_MARKET' | 'TAKE_PROFIT' | 'TAKE_PROFIT_MARKET',
    quantity: string,
    price?: string,
    timeInForce?: 'GTC' | 'IOC' | 'FOK' | 'GTX',
    reduceOnly?: boolean,
    newClientOrderId?: string,
    stopPrice?: string,
    closePosition?: boolean,
    activationPrice?: string,
    callbackRate?: string,
    workingType?: 'MARK_PRICE' | 'CONTRACT_PRICE',
    priceProtect?: boolean
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

      // İsteğe bağlı parametreler
      if (price) params.price = price
      if (timeInForce) params.timeInForce = timeInForce
      if (reduceOnly !== undefined) params.reduceOnly = reduceOnly
      if (newClientOrderId) params.newClientOrderId = newClientOrderId
      if (stopPrice) params.stopPrice = stopPrice
      if (closePosition !== undefined) params.closePosition = closePosition
      if (activationPrice) params.activationPrice = activationPrice
      if (callbackRate) params.callbackRate = callbackRate
      if (workingType) params.workingType = workingType
      if (priceProtect !== undefined) params.priceProtect = priceProtect

      const queryString = new URLSearchParams(params).toString()
      const signature = this.createSignature(queryString)
      const url = `${this.baseUrl}/fapi/v1/order`

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: `${queryString}&signature=${signature}`
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Emir hatası: ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Emir verirken hata:', error)
      throw new Error(`Emir verilemedi: ${error.message}`)
    }
  }

  // Emri iptal etme
  async cancelOrder(symbol: string, orderId?: number, origClientOrderId?: string): Promise<BinanceOrder> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    if (!orderId && !origClientOrderId) {
      throw new Error('orderId veya origClientOrderId belirtilmeli')
    }

    try {
      const timestamp = this.getTimestamp()
      const params: any = {
        symbol: symbol.toUpperCase(),
        timestamp
      }

      if (orderId) params.orderId = orderId
      if (origClientOrderId) params.origClientOrderId = origClientOrderId

      const queryString = new URLSearchParams(params).toString()
      const signature = this.createSignature(queryString)
      const url = `${this.baseUrl}/fapi/v1/order`

      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders(true),
        body: `${queryString}&signature=${signature}`
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Emir iptal hatası: ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error('Emir iptal edilirken hata:', error)
      throw new Error(`Emir iptal edilemedi: ${error.message}`)
    }
  }

  // Bağlantı testi
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/ping`)
      return response.ok
    } catch (error) {
      console.error('Bağlantı testi hatası:', error)
      return false
    }
  }

  // Server zamanını getirme
  async getServerTime(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/time`)
      if (!response.ok) {
        throw new Error(`HTTP hatası! durum: ${response.status}`)
      }
      const data = await response.json()
      return data.serverTime
    } catch (error: any) {
      console.error('Server zamanı alınırken hata:', error)
      throw new Error(`Server zamanı alınamadı: ${error.message}`)
    }
  }

  // API anahtarı geçerliliğini test etme
  async testApiKeys(): Promise<boolean> {
    if (!this.validateCredentials()) {
      return false
    }

    try {
      await this.getAccountInfo()
      return true
    } catch (error) {
      console.error('API anahtarı testi hatası:', error)
      return false
    }
  }

  // Sembol fiyatlarını getirme
  async getSymbolPrices(): Promise<Array<{
    symbol: string;
    price: number;
    change24h: number;
    high24h: number;
    low24h: number;
    volume24h: number;
  }>> {
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
      console.error('Sembol fiyatları alınırken hata:', error)
      throw new Error(`Sembol fiyatları alınamadı: ${error.message}`)
    }
  }

  // Pozisyonu kapatma
  async closePosition(symbol: string): Promise<BinanceOrder | null> {
    if (!this.validateCredentials()) {
      throw new Error('API anahtarları ayarlanmamış')
    }

    try {
      // Önce pozisyon bilgilerini al
      const positions = await this.getPositionRisk(symbol)
      const position = positions.find(p => p.symbol === symbol.toUpperCase())
      
      if (!position || parseFloat(position.positionAmt) === 0) {
        console.log(`${symbol} için açık pozisyon bulunamadı`)
        return null
      }

      const positionAmt = parseFloat(position.positionAmt)
      const side = positionAmt > 0 ? 'SELL' : 'BUY'
      const quantity = Math.abs(positionAmt).toString()

      // Market emriyle pozisyonu kapat
      return await this.newOrder(
        symbol,
        side,
        'MARKET',
        quantity,
        undefined, // price - market emri için gerekli değil
        undefined, // timeInForce
        true // reduceOnly - pozisyonu kapatmak için
      )
    } catch (error: any) {
      console.error('Pozisyon kapatılırken hata:', error)
      throw new Error(`Pozisyon kapatılamadı: ${error.message}`)
    }
  }
}

// Singleton instance
export const binanceService = new BinanceService()