import CryptoJS from 'crypto-js'

// Kline (Mum) verisi interface'i
export interface KlineData {
  openTime: number              // Açılış zamanı
  open: string                  // Açılış fiyatı
  high: string                  // En yüksek fiyat
  low: string                   // En düşük fiyat
  close: string                 // Kapanış fiyatı
  volume: string                // Hacim
  closeTime: number             // Kapanış zamanı
  quoteAssetVolume: string      // Quote varlık hacmi
  numberOfTrades: number        // İşlem sayısı
  takerBuyBaseAssetVolume: string    // Taker alım base varlık hacmi
  takerBuyQuoteAssetVolume: string   // Taker alım quote varlık hacmi
  ignore: string                // Yoksay
}

// Emir verisi interface'i
export interface OrderData {
  orderId: number               // Emir ID
  symbol: string                // Sembol
  status: string                // Durum
  clientOrderId: string         // Müşteri emir ID
  price: string                 // Fiyat
  avgPrice: string              // Ortalama fiyat
  origQty: string               // Orijinal miktar
  executedQty: string           // Gerçekleştirilen miktar
  cumQuote: string              // Kümülatif quote
  timeInForce: string           // Geçerlilik süresi
  type: string                  // Tip
  reduceOnly: boolean           // Sadece azalt
  closePosition: boolean        // Pozisyonu kapat
  side: string                  // Taraf
  positionSide: string          // Pozisyon tarafı
  stopPrice: string             // Stop fiyatı
  workingType: string           // Çalışma tipi
  priceProtect: boolean         // Fiyat koruması
  origType: string              // Orijinal tip
  updateTime: number            // Güncelleme zamanı
}

// Pozisyon bilgisi interface'i
export interface PositionInfo {
  symbol: string                // Sembol
  positionAmt: string           // Pozisyon miktarı
  entryPrice: string            // Giriş fiyatı
  markPrice: string             // İşaret fiyatı
  unRealizedProfit: string      // Gerçekleşmemiş kar/zarar
  liquidationPrice: string      // Tasfiye fiyatı
  leverage: string              // Kaldıraç
  maxNotionalValue: string      // Maksimum nominal değer
  marginType: string            // Marj tipi
  isolatedMargin: string        // İzole marj
  isAutoAddMargin: string       // Otomatik marj ekleme
  positionSide: string          // Pozisyon tarafı
  notional: string              // Nominal
  isolatedWallet: string        // İzole cüzdan
  updateTime: number            // Güncelleme zamanı
}

// Sembol fiyatlarını getir (24hr ticker statistics)
export interface SymbolPrice {
  symbol: string
  price: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  askPrice: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  firstId: number
  lastId: number
  count: number
}
export interface AccountInfo {
  feeTier: number               // Ücret katmanı
  canTrade: boolean             // İşlem yapabilir mi
  canDeposit: boolean           // Para yatırabilir mi
  canWithdraw: boolean          // Para çekebilir mi
  updateTime: number            // Güncelleme zamanı
  totalInitialMargin: string    // Toplam başlangıç marjı
  totalMaintMargin: string      // Toplam bakım marjı
  totalWalletBalance: string    // Toplam cüzdan bakiyesi
  totalUnrealizedProfit: string // Toplam gerçekleşmemiş kar/zarar
  totalMarginBalance: string    // Toplam marj bakiyesi
  totalPositionInitialMargin: string    // Toplam pozisyon başlangıç marjı
  totalOpenOrderInitialMargin: string   // Toplam açık emir başlangıç marjı
  totalCrossWalletBalance: string       // Toplam çapraz cüzdan bakiyesi
  totalCrossUnPnl: string       // Toplam çapraz gerçekleşmemiş kar/zarar
  availableBalance: string      // Kullanılabilir bakiye
  maxWithdrawAmount: string     // Maksimum çekim miktarı
  assets: Array<{
    asset: string               // Varlık
    walletBalance: string       // Cüzdan bakiyesi
    unrealizedProfit: string    // Gerçekleşmemiş kar/zarar
    marginBalance: string       // Marj bakiyesi
    maintMargin: string         // Bakım marjı
    initialMargin: string       // Başlangıç marjı
    positionInitialMargin: string       // Pozisyon başlangıç marjı
    openOrderInitialMargin: string      // Açık emir başlangıç marjı
    crossWalletBalance: string  // Çapraz cüzdan bakiyesi
    crossUnPnl: string          // Çapraz gerçekleşmemiş kar/zarar
    availableBalance: string    // Kullanılabilir bakiye
    maxWithdrawAmount: string   // Maksimum çekim miktarı
    marginAvailable: boolean    // Marj kullanılabilir mi
    updateTime: number          // Güncelleme zamanı
  }>
  positions: PositionInfo[]     // Pozisyonlar
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

  // Kimlik bilgilerini doğrula
  private validateCredentials(): boolean {
    return !!(this.apiKey && this.secretKey)
  }

  // Timestamp üret
  private getTimestamp(): number {
    return Date.now()
  }

  // İmza oluştur
  private createSignature(queryString: string): string {
    return CryptoJS.HmacSHA256(queryString, this.secretKey).toString()
  }

  // Hesap bilgilerini getir
  async getAccountInfo(): Promise<AccountInfo | null> {
    if (!this.validateCredentials()) {
      throw new Error('API kimlik bilgileri ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      const queryString = `timestamp=${timestamp}`
      const signature = this.createSignature(queryString)
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v2/account?${finalQuery}`, {
        method: 'GET',
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
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

  // Emir ver
  async placeOrder(
    symbol: string,
    side: string,
    type: string,
    quantity: string,
    price?: string,
    timeInForce?: string,
    stopPrice?: string,
    callbackRate?: string
  ): Promise<OrderData | null> {
    if (!this.validateCredentials()) {
      throw new Error('API kimlik bilgileri ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      let queryString = `symbol=${symbol}&side=${side}&type=${type}&quantity=${quantity}&timestamp=${timestamp}`

      if (price) queryString += `&price=${price}`
      if (timeInForce) queryString += `&timeInForce=${timeInForce}`
      if (stopPrice) queryString += `&stopPrice=${stopPrice}`
      if (callbackRate) queryString += `&callbackRate=${callbackRate}`

      const signature = this.createSignature(queryString)
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v1/order`, {
        method: 'POST',
        headers: {
          'X-MBX-APIKEY': this.apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: finalQuery,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Emir hatası: ${errorData.msg || response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Emir verirken hata:', error)
      return null
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
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      })

      return response.ok
    } catch (error) {
      console.error('API anahtarı testi hatası:', error)
      return false
    }
  }

  // Kline verilerini getir
  async getKlineData(
    symbol: string,
    interval: string,
    limit: number = 500,
    startTime?: number,
    endTime?: number
  ): Promise<KlineData[]> {
    try {
      let queryString = `symbol=${symbol}&interval=${interval}&limit=${limit}`
      
      if (startTime) queryString += `&startTime=${startTime}`
      if (endTime) queryString += `&endTime=${endTime}`

      const response = await fetch(`${this.baseUrl}/fapi/v1/klines?${queryString}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const rawData = await response.json()
      
      // Raw array verisini KlineData nesnesine dönüştür
      return rawData.map((item: any[]) => ({
        openTime: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        volume: item[5],
        closeTime: item[6],
        quoteAssetVolume: item[7],
        numberOfTrades: item[8],
        takerBuyBaseAssetVolume: item[9],
        takerBuyQuoteAssetVolume: item[10],
        ignore: item[11]
      }))
    } catch (error) {
      console.error('Kline verileri alınırken hata:', error)
      return []
    }
  }

  // Pozisyonları getir
  async getPositions(symbol?: string): Promise<PositionInfo[]> {
    if (!this.validateCredentials()) {
      throw new Error('API kimlik bilgileri ayarlanmamış')
    }

    try {
      const timestamp = this.getTimestamp()
      let queryString = `timestamp=${timestamp}`
      
      if (symbol) queryString += `&symbol=${symbol}`
      
      const signature = this.createSignature(queryString)
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v2/positionRisk?${finalQuery}`, {
        method: 'GET',
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const positions = await response.json()
      // Sadece açık pozisyonları filtrele
      return positions.filter((pos: PositionInfo) => parseFloat(pos.positionAmt) !== 0)
    } catch (error) {
      console.error('Pozisyonlar alınırken hata:', error)
      return []
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
}

// Singleton instance oluşturma
export const binanceService = new BinanceService()