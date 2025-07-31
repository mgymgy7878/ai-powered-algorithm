import CryptoJS from 'crypto-js'

  openTime: number           //
  high: string              
  close: string             // Kapanış fiyatı
  closeTime: number         // Kapanış zaman
  numberOfTrades: number    // İşlem sayısı
  takerBuyQuoteAssetVolume: string // Taker b
  close: string             // Kapanış fiyatı
  volume: string            // Hacim
  closeTime: number         // Kapanış zamanı
  quoteAssetVolume: string  // Quote asset hacmi
  numberOfTrades: number    // İşlem sayısı
  takerBuyBaseAssetVolume: string // Taker buy base asset hacmi
  takerBuyQuoteAssetVolume: string // Taker buy quote asset hacmi
  ignore: string            // Görmezden gel
 

  workingType: string      
  origType: string          // 
  updateTime: number        // Güncell

export interface PositionInfo {
  positionAmt: string        // Pozisyon mikta
  markPrice: string          // İşar
  liquidationPrice: string   // Tasfiye fiyat
  maxNotionalValue: string   // Maksimum nomin
  isolatedMargin: string     // İzole marj
  positionSide: string       // Pozisyon tarafı
  isolatedWallet: string     // İzole cüzdan
}
// Hesap bilgisi interface'i
  feeTier: number            // Ücret katmanı
  canDeposit: boolean        // Para yatı
  updateTime: number         // Güncelleme zam
  totalMaintMargin: string   // Toplam bak
  totalUnrealizedProfit: string // Toplam g
  totalPositionInitialMargin: string // Topla
  totalCrossWalletBalance: string // Toplam
  availableBalance: string   // Kull
  assets: Array<{
 

    initialMargin: string    //
    openOrderInitialMargin: str
    crossUnPnl: string       // Çapraz
    maxWithdrawAmount: string // Maksimum çekim 
    updateTime: number       // Güncelleme z
  positions: PositionInfo[]  // Pozisyonlar

  private apiKey: string = ''
  private baseUrl: string = ''
  constructor() {
  }
  // API kimlik bilgilerini ayarlama
    this.apiKey = apiKey
    this.baseUrl = isTestnet
      : 'https://fapi.binance.com'

  private validateCredentials(): boolean {
 

    return Date.now()

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
  // Hesap bilgilerini getir
    if (!this.validateCredentials()) {
    }
   


        method: 'GET',
      })
   

      return await resp
      console.error('Hesap bilgile
    }


    side: 'BUY' | '
    quantity: string,
    timeInForce?: string,
   

    callbackRate?: string
    if (!this.validateCredentials()) {
    }
    try {
     

        timestamp

     

      if (stopPric
   

      const signature = this.

        method: 'PO
        body: finalQuery

        const errorData
      }
      return await response
      con
    }

  async testConne
      const response = awai
    } c

  }
  // API anahtarı testi

    }
    try {
      

        method: 'GET',
      }

      console.error('API anahtarı testi 
    }
}
// Singleton instance oluşturma













































































































































































