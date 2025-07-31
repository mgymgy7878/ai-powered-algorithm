import CryptoJS from 'crypto-js'

  openTime: number              /
  high: string              
  openTime: number              // Açılış zamanı
  open: string                  // Açılış fiyatı
  high: string                  // En yüksek fiyat
  low: string                   // En düşük fiyat
  close: string                 // Kapanış fiyatı
  volume: string                // Hacim
  closeTime: number             // Kapanış zamanı
  quoteAssetVolume: string      // Quote varlık hacmi
// Emir verisi interface'i
  takerBuyBaseAssetVolume: string    // Taker alım base varlık hacmi
  takerBuyQuoteAssetVolume: string   // Taker alım quote varlık hacmi
  ignore: string                // Yoksay
 

  workingType: string     
  origType: string          
}
// Pozisyon bilgisi interface'i
  symbol: string                // Sembo
  entryPrice: string            // Giriş fiyatı
  unRealizedProfit: string      // Gerçe
  leverage: string              // Kaldıraç
  marginType: string            // Marj tipi
  isAutoAddMargin: string       // Otomatik marj ekleme
  notional: string              // Nominal
  updateTime: number            // Güncelleme zamanı

export interface SymbolPrice {
  price: string
  priceChangePercent: string
  prevClosePrice: string
  lastQty: string
  askPrice: string
  highPrice: string
  volume: string
  openTime: number
 

export interface AccountInfo {
  canTrade: boolean            
  canWithdraw: boolean          // Para ç
  totalInitialMargin: string    // Toplam başlangıç
  totalWalletBalance: string    // Toplam cüzda
  totalMarginBalance: string    // Toplam marj b
  totalOpenOrderInitialMargin: string   // Toplam açık emir
  totalCrossUnPnl: string       // Toplam çapraz 
  maxWithdrawAmount: string     // Maksimum
    asset: string               // Varlık
    unrealizedProfit: string    // Gerçekleş
    maintMargin: string         // Bakım marj
    positionInitialMargin: string       // Pozisyon baş
    crossWalletBalance: string  // Çapraz cüzdan b
    availableBalance: string    // Kullanı
    marginAvailable: boolean    // Marj kullanı
  }>
}

  private secretKey: string = ''

    this.baseUrl

  setCredentials(apiK
    this.secretKey = secretK
      ? 'https://testnet.b
  }
  // Kimlik bilgile
    return !!(thi

  private getTimes
  }
  // İmza oluştur
    return CryptoJ

  async getAccountInf
      throw new Er

      const times
      const sign

 
          'X-MBX-APIKEY': this
      })
      if (!response.ok) {
      }
      return await response.json()
      console.error('Hesap bilgileri alınırken hata:
    }

  async placeOrder(
    side: string,
    quantity: string,
    timeInForce?: string,
    callbackRate?: string
    if (!this.validateCredentials()) {
    }
    try {
      let queryString = `symbol=${symbol}&side=${side}&ty
      if (price) 
      if (stopPrice) queryString += `&sto

      const finalQuery = `${queryString}&signature=${signat
      const response = await fetch(`${this.baseU
        headers: {
          'Content-Type': 'application/x-www-form-
        body: finalQuery,

        const errorData = await response.json()
      }
      return await response.json()
      console.error('Emir verirken hata:', error)
    }

  as
      const response = await fetch(`${this.bas
 

  }
  // API anahtarı testi
    if (!this.validateCredential
    }

      const query

   

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

    } catch (error) {
      console.error('Bağlantı testi hatası:', error)
      return false

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

    symbol: string,

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
      
      // Raw array verisini KlineData nesnesine dönüştür - güvenli erişim ile
      return rawData.map((item: any[]) => ({
        openTime: item?.[0] || 0,
        open: item?.[1] || '0',
        high: item?.[2] || '0',
        low: item?.[3] || '0',
        close: item?.[4] || '0',
        volume: item?.[5] || '0',
        closeTime: item?.[6] || 0,

        numberOfTrades: item?.[8] || 0,

        takerBuyQuoteAssetVolume: item?.[10] || '0',
        ignore: item?.[11] || '0'
      }))
    } catch (error) {
      console.error('Kline verileri alınırken hata:', error)

    }



  async getPositions(symbol?: string): Promise<PositionInfo[]> {

      throw new Error('API kimlik bilgileri ayarlanmamış')


    try {
      const timestamp = this.getTimestamp()
      let queryString = `timestamp=${timestamp}`
      
      if (symbol) queryString += `&symbol=${symbol}`
      
      const signature = this.createSignature(queryString)
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v2/positionRisk?${finalQuery}`, {

        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)


      const positions = await response.json()
      // Sadece açık pozisyonları filtrele
      return positions.filter((pos: PositionInfo) => parseFloat(pos.positionAmt) !== 0)
    } catch (error) {
      console.error('Pozisyonlar alınırken hata:', error)
      return []
    }
  }

  // Sembol fiyatlarını getir (24hr ticker statistics)

    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/ticker/24hr`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)


      return await response.json()
    } catch (error) {
      console.error('Sembol fiyatları alınırken hata:', error)
      return []

  }


// Singleton instance oluşturma
export const binanceService = new BinanceService()