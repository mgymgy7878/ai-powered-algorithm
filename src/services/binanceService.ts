import CryptoJS from 'crypto-js'

// Kline (mum verisi) bilgisi interface
export interface KlineData {
  openTime: number           // Açılış zamanı
  open: string              // Açılış fiyatı
  high: string              // En yüksek fiyat
  low: string               // En düşük fiyat
}
// Binance emri interface
  orderId: number           // Emir ID
  status: string           // Emir durumu
  price: string            // Fiyat
  origQty: string          // Orijinal miktar
  cumQuote: string         // Kümülatif quote
  type: string             // Emir tipi
 

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

  symbol: string             
export interface PositionInfo {
  weightedAvgPrice: string    // Ağırlı
  positionAmt: string         // Pozisyon miktarı
  lastQty: string             // Son miktar
  markPrice: string           // İşaret fiyatı
  unRealizedProfit: string    // Gerçekleşmemiş kar/zarar
  liquidationPrice: string    // Tasfiye fiyatı
  highPrice: string           // En yükse
  maxNotionalValue: string    // Maksimum nominal değer
  quoteVolume: string         // Quote hac
  isolatedMargin: string      // İzole marj
  firstId: number             // İlk işlem ID
  positionSide: string        // Pozisyon tarafı
  notional: string            // Nominal değer
  isolatedWallet: string      // İzole cüzdan
  updateTime: number          // Güncelleme zamanı
}

// 24 saatlik ticker bilgisi interface
  totalWalletBalance: string 
  symbol: string              // Sembol
  setCredentials(apiKey: string, secretKey: str
    this.secretKey = secretKey
    this.baseUrl = isTestnet 
      : 'https://fapi.binance.com'

  private validateCredentials(): boolean {
  }
  // Zaman damgası oluşturma
    return Date.now()

  private createSignature(query: string): stri
  }
  // HTTP başlıkları oluşturma
    const headers: Record<string, stri
    }
    if (includeApiKey) {
    }
    return headers

  async getKlineData(
 

  ): Promise<KlineData[]> 
      const params: any = {
        interval,
      }
      if (startTime) params.startTime = startTime

      const url = `${this.baseUrl}/fapi/v1/klines?
      const response = await fetch(url)
      if (!response.ok) {
      }
      const data = await response.json()
      return data.map((kline: any[]): KlineData => ({
        open: kline[1],
        low: kline[3],
        volume: kline[5],
        quoteAssetVolume: kline[7],
        takerBuyB
        ignore: kline[11]
    } catch (error: any) {
      throw new Error(`Kline verisi alınamadı: ${er
  }
  // Pozisyon bilgilerini getirme
    if (!this.validateCredentials()) {
    }
    try {
      let queryString = `timestamp=${timestamp}`
      if (symbol) {
      }
      const signature = this.createSignature(queryStrin

        method: 'GET',
    
      if (!response.ok) {
 

      console.error('P
    }

  async get24hrTicker(symbol?: st
      let url = `${this.baseUrl}/fapi/v1/ticker/24hr`

      }
      const response = await fetch(url)
      if (!response.ok) 
      }
      const data = await res
    } catch (error: any) {
      throw new Error(`24hr ticker verisi a
  }
  /

    }
    try {
      const queryString = `timestamp=${times
   

        headers: this.getHea

        throw new Err


      throw new Err
  }
  // Yeni emir verme
   

    price?: string,
    reduceOnly?: boolean,
    stopPrice?: string,
    activationPrice?: string,
    w

      throw new Error('A

     

        type,
   

      if (price) params.price = price
      if (reduceOnly 
      if (stopPrice
      if (activationPrice) p
      if (workingType) p

      const signatur

        m
        body: `${queryStrin

        const err
      }
      r

    }


      throw new Error('API anahtarları ayarlanmamış')



      
        symbol: symbol.to
      }
      i

      const signature = this.createSigna

        method: 'DELETE',
        body: `${queryStrin

        const errorData
      }
      return await respo
      console.error('Emir
    }

  async testConnection(): Promise
      const response = await fetch(`${this
    } catch (error) {
      return false
  }
  // Server zamanını getir
    try {
      if (!response.ok) {
     
   

    }

  async testApiKeys(): Promise<boolean
      return false


    } cat
      return false
  }
  // S
    symbol: string;
    change24h: number;
    low

      const tickers = await this.get24hrTicker()
      return tickers.map(ticker => ({

        high24h: parseFloat(ticker.highPr
        volume24h: par
    } catch (error: any) {
      th

  // Pozisyonu kapatma
    if (!this.validateCredentials()) {
    }

      const positions = await this
      
        console.log(`${symbol} için açık pozisyon bulunamadı`)
      }
     
   

        symbol,
        'MARKET',
        u
        true // reduceOnly - pozisyonu kapatmak için
    } 
      throw new Err
  }


































































































































































































