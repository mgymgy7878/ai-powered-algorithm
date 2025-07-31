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
 

  executedQty: string      
export interface BinanceOrder {
  timeInForce: string      // Geçerlilik sü
  orderId: number          // Emir ID
  workingTime: number      // Çalışma zamanı
  clientOrderId: string    // İstemci emir ID
  avgPrice: string         // Ortalama fiy
  price: string            // Fiyat
  reduceOnly?: boolean     // Sadece azaltma
  executedQty: string      // Gerçekleştirilen miktar
  stopPrice?: string       // Stop fiyatı
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

  origType?: string        // Orijinal tip
 

  canWithdraw: boolean       //
export interface PositionInfo {
  symbol: string             // Sembol
  positionAmt: string        // Pozisyon miktarı
  totalOpenOrderInitialMargin: string // Top
  markPrice: string          // İşaret fiyatı
  unRealizedProfit: string   // Gerçekleşmemiş kar/zarar
  liquidationPrice: string   // Tasfiye fiyatı

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
  count: number               
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
  // Kimlik doğrulama kontrol
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

}

// Sembol bilgisi interface'i
    symbol: string,
  symbol: string
    startTime?:
  change24h: number
    try {
  low24h: number
        interval,
}

class BinanceService {

  private secretKey: string = ''
  private baseUrl: string = 'https://testnet.binancefuture.com'

      }
  setCredentials(apiKey: string, secretKey: string, isTestnet: boolean = true) {
      
    this.secretKey = secretKey
        open: kline[1],
      ? 'https://testnet.binancefuture.com'
        close: kline[4],
  }

  // Kimlik doğrulama kontrolü
  private validateCredentials(): boolean {
    return !!(this.apiKey && this.secretKey)
  }

  }
  private getTimestamp(): number {
  async getPositionIn
  }

  // İmza oluşturma
      const timestamp = this.getTimestamp()
    return CryptoJS.HmacSHA256(query, this.secretKey).toString()
   

      
  private getHeaders(signed: boolean = false): Record<string, string> {

      'Content-Type': 'application/x-www-form-urlencoded'
     

      if (!response.ok) {
      headers['X-MBX-APIKEY'] = this.apiKey


      throw new Er
  }

  // Kline (mum) verilerini getirme
    try {
    symbol: string,
        url += `?symbo
    limit: number = 500,
      const response = 
    endTime?: number
        throw new Error(`HT
    try {
      const params: any = {
        symbol: symbol.toUpperCase(),
        interval,
        limit


      if (startTime) params.startTime = startTime
      if (endTime) params.endTime = endTime

      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`${this.baseUrl}/fapi/v1/klines?${queryString}`)
      
      const response = aw
        throw new Error(`HTTP error! status: ${response.status}`)
      }

        throw new Error(`HTTP error! sta
      
      return await response.json()
        openTime: kline[0],
    }
        high: kline[2],
  // Yeni emir verme
        close: kline[4],
    side: 'BUY' | 'SELL',
        closeTime: kline[6],
    price?: string,
        numberOfTrades: kline[8],
    activationPrice?: string,
        takerBuyQuoteAssetVolume: kline[10],
    if (!this.validateCre
      }))

      throw new Error(`Kline verisi alınamadı: ${error.message}`)
     
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
        

      throw new Error(`Po
  }





































































































































































































































