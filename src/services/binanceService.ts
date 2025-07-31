import CryptoJS from 'crypto-js'

// Kline (Mum) verisi interface'i
export interface KlineData {
  openTime: number              // Açılış zamanı
  open: string                  // Açılış fiyatı
  high: string                  // En yüksek fiyat
  low: string                   // En düşük fiyat
}
// Emir verisi interface'i
  orderId: number               // Emir ID
  status: string                // Durum
  price: string                 // Fiyat
  origQty: string               // Orijinal miktar
  cumQuote: string              // Kümülatif quote
  type: string                  // Tip
 

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

  feeTier: number              
export interface PositionInfo {
  symbol: string                // Sembol
  positionAmt: string           // Pozisyon miktarı
  totalMaintMargin: string      // Toplam bakım
  markPrice: string             // İşaret fiyatı
  unRealizedProfit: string      // Gerçekleşmemiş kar/zarar
  liquidationPrice: string      // Tasfiye fiyatı
  totalCrossWalletBalance: string       // 
  maxNotionalValue: string      // Maksimum nominal değer
  maxWithdrawAmount: string     // Maksimum 
  isolatedMargin: string        // İzole marj
    walletBalance: string       // Cüzdan bakiyesi
  positionSide: string          // Pozisyon tarafı
    maintMargin: string         // Bakım m
  isolatedWallet: string        // İzole cüzdan
    openOrderInitialMargin: string      // Açık emir
}

// Hesap bilgisi interface'i
    updateTime: number        
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
  maxWithdrawAmount: string,    // Maksimum çekim miktarı
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
     
  positions: PositionInfo[]     // Pozisyonlar
 

        },
  private apiKey: string = ''
      if (!response.ok) {
  private baseUrl: string = ''

  constructor() {
    this.baseUrl = 'https://testnet.binancefuture.com' // Varsayılan testnet
  }

  // API kimlik bilgilerini ayarlama
  setCredentials(apiKey: string, secretKey: string, isTestnet: boolean = true) {
    this.apiKey = apiKey
    type: string,
    this.baseUrl = isTestnet 
      ? 'https://testnet.binancefuture.com'
      : 'https://fapi.binance.com'
  )

    }
  private validateCredentials(): boolean {
    return !!(this.apiKey && this.secretKey)
   

  // Timestamp üret
  private getTimestamp(): number {
    return Date.now()
  }

        method: '
  private createSignature(queryString: string): string {
    return CryptoJS.HmacSHA256(queryString, this.secretKey).toString()
  }

  // Hesap bilgilerini getir
  async getAccountInfo(): Promise<AccountInfo | null> {
    if (!this.validateCredentials()) {
      throw new Error('API kimlik bilgileri ayarlanmamış')
    }

    try {
  }
      const queryString = `timestamp=${timestamp}`
  async testConnection(): Promise<boolean> {
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v2/account?${finalQuery}`, {
      return false
        headers: {

        },
    if (


        throw new Error(`HTTP error! status: ${response.status}`)
      c

      const response = await fetch
    } catch (error) {
      console.error('Hesap bilgileri alınırken hata:', error)
      return null

  }

  // Emir ver
  }
    symbol: string,
  async getKlineData(
    type: string,
    limit: number = 5
    price?: string,
  ): Promise<KlineData[]>
    stopPrice?: string,
      
  ): Promise<OrderData | null> {

      throw new Error('API kimlik bilgileri ayarlanmamış')
     


      const timestamp = this.getTimestamp()
      let queryString = `symbol=${symbol}&side=${side}&type=${type}&quantity=${quantity}&timestamp=${timestamp}`

        open: item[1],
      if (timeInForce) queryString += `&timeInForce=${timeInForce}`
      if (stopPrice) queryString += `&stopPrice=${stopPrice}`
      if (callbackRate) queryString += `&callbackRate=${callbackRate}`

      const signature = this.createSignature(queryString)
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v1/order`, {
        method: 'POST',
    }
          'X-MBX-APIKEY': this.apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: finalQuery,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Emir hatası: ${errorData.msg || response.statusText}`)
      c

      return await response.json()
    } catch (error) {
      console.error('Emir verirken hata:', error)
      return null

  }

  // Bağlantı testi
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/fapi/v1/ping`)
      return response.ok
  }
      console.error('Bağlantı testi hatası:', error)
// Singleton insta
    }



  async testApiKey(): Promise<boolean> {
    if (!this.validateCredentials()) {
      return false



      const timestamp = this.getTimestamp()
      const queryString = `timestamp=${timestamp}`
      const signature = this.createSignature(queryString)

      const response = await fetch(`${this.baseUrl}/fapi/v2/account?${queryString}&signature=${signature}`, {

        headers: {

        },


      return response.ok
    } catch (error) {
      console.error('API anahtarı testi hatası:', error)
      return false

  }

  // Kline verilerini getir

    symbol: string,
    interval: string,
    limit: number = 500,
    startTime?: number,
    endTime?: number
  ): Promise<KlineData[]> {
    try {
      let queryString = `symbol=${symbol}&interval=${interval}&limit=${limit}`
      

      if (endTime) queryString += `&endTime=${endTime}`

      const response = await fetch(`${this.baseUrl}/fapi/v1/klines?${queryString}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const rawData = await response.json()
      
      // Raw array verisini KlineData nesnesine dönüştür

        openTime: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        volume: item[5],
        closeTime: item[6],

        numberOfTrades: item[8],

        takerBuyQuoteAssetVolume: item[10],

      }))

      console.error('Kline verileri alınırken hata:', error)
      return []
    }


  // Pozisyonları getir
  async getPositions(symbol?: string): Promise<PositionInfo[]> {
    if (!this.validateCredentials()) {
      throw new Error('API kimlik bilgileri ayarlanmamış')



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


// Singleton instance oluşturma
export const binanceService = new BinanceService()