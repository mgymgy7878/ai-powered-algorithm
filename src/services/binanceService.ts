import CryptoJS from 'crypto-js'

// Kline (mum grafiği) verisi interface'i
export interface KlineData {
  close: string                 // Kapanış fiyat
  closeTime: number             // Kapanış zaman
  numberOfTrades: number        // İşlem sayısı
  takerBuyQuoteAssetVolume: string   // Taker alı
  close: string                 // Kapanış fiyatı
  volume: string                // Hacim
  closeTime: number             // Kapanış zamanı
  quoteAssetVolume: string      // Quote varlık hacmi
  numberOfTrades: number        // İşlem sayısı
  takerBuyBaseAssetVolume: string    // Taker alım base varlık hacmi
  takerBuyQuoteAssetVolume: string   // Taker alım quote varlık hacmi
  ignore: string                // Yoksay
 

  priceProtect: boolean   
  updateTime: number        

export interface PositionInfo {
  positionAmt: string           // Pozis
  markPrice: string             // Mark fiyat
  liquidationPrice: string      // Tasfi
  maxNotionalValue: string      // Maksimum nomina
  isolatedMargin: string        // İzole marj
  positionSide: string          // Pozisyon tarafı
  isolatedWallet: string        // İzole cüzdan
}
// Sembol fiyat bilgisi interface'i  
  symbol: string                // Sembol
  side: string                  // Taraf (BUY/SELL)
  positionSide: string          // Pozisyon tarafı
  stopPrice: string             // Stop fiyat
  workingType: string           // Çalışma tipi
  priceProtect: boolean         // Fiyat koruma
  origType: string              // Orijinal tip
  updateTime: number            // Güncelleme zamanı
}

// Pozisyon bilgisi interface'i
export interface PositionInfo {
  symbol: string                // Sembol
  positionAmt: string           // Pozisyon miktarı
  entryPrice: string            // Giriş fiyatı
  markPrice: string             // Mark fiyat
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

// Sembol fiyat bilgisi interface'i  
export interface SymbolPrice {
  symbol: string                // Sembol
  price: string                 // Fiyat
  priceChangePercent: string    // Fiyat değişim yüzdesi
  prevClosePrice: string        // Önceki kapanış fiyatı
    asset: string               // Varlık
  lastQty: string               // Son miktar
  bidPrice: string              // Alış fiyatı
  askPrice: string              // Satış fiyatı
  openPrice: string             // Açılış fiyatı
  highPrice: string             // En yüksek fiyat
  lowPrice: string              // En düşük fiyat
  volume: string                // Hacim
    marginAvailable: boolean    // Marj kullan
  openTime: number              // Açılış zamanı
}
  count: number                 // İşlem sayısı
c

// Hesap bilgisi interface'i
export interface AccountInfo {
  feeTier: number               // Ücret seviyesi
  canTrade: boolean             // İşlem yapabilir
  canDeposit: boolean           // Para yatırabilir
  canWithdraw: boolean          // Para çekebilir
  updateTime: number            // Güncelleme zamanı
  totalInitialMargin: string    // Toplam başlangıç marjı
  totalMaintMargin: string      // Toplam bakım marjı
  totalWalletBalance: string    // Toplam cüzdan bakiyesi
  totalUnrealizedProfit: string // Toplam gerçekleşmemiş kar/zarar
  totalMarginBalance: string    // Toplam marj bakiyesi
  totalPositionInitialMargin: string // Toplam pozisyon başlangıç marjı
  totalOpenOrderInitialMargin: string // Toplam açık emir başlangıç marjı
  totalCrossWalletBalance: string // Toplam çapraz cüzdan bakiyesi
  totalCrossUnPnl: string       // Toplam çapraz gerçekleşmemiş kar/zarar
  availableBalance: string      // Kullanılabilir bakiye
  maxWithdrawAmount: string     // Maksimum çekim miktarı
  async getAccoun
    asset: string               // Varlık
    }
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
    marginAvailable: boolean    // Marj kullanılabilir
    updateTime: number          // Güncelleme zamanı
  }>
 

// Binance servis sınıfı
class BinanceService {
  private baseUrl: string = 'https://testnet.binancefuture.com'
  private apiKey: string = ''
    type: string,

  // API kimlik bilgilerini ayarlama
  setCredentials(apiKey: string, secretKey: string, isTestnet: boolean = true) {
  ): Promise<OrderData |
    this.secretKey = secretKey
    }
      ? 'https://testnet.binancefuture.com'
      const timestamp = this.getTi
  }

  // Kimlik bilgilerini doğrula
      if (callbackRate) queryString += `&c
    return !!(this.apiKey && this.secretKey)
   

        method: 'PO
  private getTimestamp(): number {
          'Content-Ty


  // İmza oluştur
  private createSignature(queryString: string): string {
    return CryptoJS.HmacSHA256(queryString, this.secretKey).toString()
  }

      console.error('Emir ve
  async getAccountInfo(): Promise<AccountInfo | null> {
  }
      throw new Error('API kimlik bilgileri ayarlanmamış')
  asy

      ret
      const timestamp = this.getTimestamp()
      const queryString = `timestamp=${timestamp}`
      const signature = this.createSignature(queryString)
      const finalQuery = `${queryString}&signature=${signature}`

      const response = await fetch(`${this.baseUrl}/fapi/v2/account?${finalQuery}`, {
        method: 'GET',

          'X-MBX-APIKEY': this.apiKey,
      cons
      })

    } catch (error) {
    } catch (error) {
      r

  // Sembol fiyatlarını getir (24h
    try {

        throw new

   

  }

export const binanc























































































































































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