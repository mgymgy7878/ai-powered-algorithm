import CryptoJS from 'crypto-js'

  openTime: number           // Açılış 
  high: string              
  openTime: number           // Açılış zamanı
  open: string              // Açılış fiyatı
  high: string              // En yüksek fiyat
  low: string               // En düşük fiyat
  numberOfTrades: number    // İşlem sayısı
  volume: string            // Hacim
  closeTime: number         // Kapanış zamanı
  quoteAssetVolume: string  // Quote asset hacmi
// Binance emri interface
  takerBuyBaseAssetVolume: string // Taker buy base asset hacmi
  takerBuyQuoteAssetVolume: string // Taker buy quote asset hacmi
  ignore: string            // Görmezden gel
 

  executedQty: string    
export interface BinanceOrder {
  type: string             // Emir tip
  symbol: string           // Sembol (çift)
  side: string             // Alım/Satım
  clientOrderId: string    // İstemci emir ID
  workingType: string      // Çalış
  avgPrice: string         // Ortalama fiyat
  updateTime: number       // Güncelleme zama
  executedQty: string      // Gerçekleştirilen miktar
// Pozisyon bilgisi interface
  timeInForce: string      // Geçerlilik süresi
  positionAmt: string        // Pozisyo
  reduceOnly: boolean      // Sadece azaltma
  closePosition: boolean   // Pozisyon kapatma
  side: string             // Alım/Satım
  positionSide: string     // Pozisyon tarafı
  stopPrice: string        // Stop fiyatı
  workingType: string      // Çalışma tipi
  priceProtect: boolean    // Fiyat koruması
  origType: string         // Orijinal tip
  updateTime: number       // Güncelleme zamanı


  symbol: string             
export interface PositionInfo {
  weightedAvgPrice: string    // Ağırl
  positionAmt: string        // Pozisyon miktarı
  lastQty: string             // Son miktar
  markPrice: string          // İşaret fiyatı
  unRealizedProfit: string   // Gerçekleşmemiş kar/zarar
  liquidationPrice: string   // Tasfiye fiyatı
  volume: string              // Hacim
  maxNotionalValue: string   // Maksimum nominal değer
  closeTime: number           // Kapanış 
  isolatedMargin: string     // İzole marj
  count: number               // İşlem sayısı
  positionSide: string       // Pozisyon tarafı
// Hesap bilgisi interface
  isolatedWallet: string     // İzole cüzdan
  updateTime: number         // Güncelleme zamanı
}

// 24 saatlik ticker bilgisi interface
  totalWalletBalance: string 
  symbol: string              // Sembol
  volume24h: number

  private apiKey: string = ''
  private baseUrl: string = 'https://testnet.binancefu
  // API anahtarlarını ayarlama
    this.apiKey = apiKey
    this.baseUrl = isTestnet 
      : 'https://fapi.binance.com'

  private validateCredentials(): boolean {
  }
  // Zaman damgası oluşturma
    return Date.now()

  private createSignature(query: string): strin
  }
  // HTTP başlıkları oluşturma
    const headers: Record<string, string> = {
 

    return headers

  async getKlineData(
    interval: string, 
    startTime?: number,
  ): Promise<KlineData[]> {
      const params: any = {
        interval,
      }
      if (endTime) params.endTime = endTime
      const queryString = new URLSearchParams(params).toString()
      
      if (!response.ok) {
      }
      const data = await response.json()
        openTime: kline[0],
        high: kline[2],
        close: kline[4],
        closeTime
        numberOfT
        takerBuyQuoteAsse
      }))
      throw new Error(`Kl
  }
  // Pozisyon bilgilerini
    if (!this.validateCredentials
    }
    try {
      let queryString 
        queryString += `&sym
      
      queryString += `&signa
      const response =
    

 

    } catch (error: any
      throw new Error(`Pozisy
  }
  // 24 saatlik
    try {
      if (symbol)
      }
      const respons
 

      return Array.isA
      throw new Error(`24hr t
  }
  // Hesap bilgilerini getirme

    }
    try {
      const queryString 

        method: 'GET',
      })
      if (!response.ok) {
   

      throw new Error(`Hesap bilgisi alınamadı: 
  }
  // Yeni emir verme
   

    price?: string,
    stopPrice?: string,
    workingType?: str
   

    try {
      const params: any = {
        side,
   

      if (price) params.price 
      if (stopPrice) params.stopPrice = stopPrice
      if (workingType) params.workingType = w
      const queryString = new URLSearchP

        method: 'POST',
        body: `${queryString}&signature=${s

        const erro
   

      throw new Error(`Emir verme başarısız: ${error.
  }
  // Emir iptal etme
    if (!this.validate
    }
    try {
      const params =
        orderId: orderId.to
      }
      const queryString = n

        method: '
        body:

        const errorData = await response.json()
      }

      console.error('Emir iptal etme hatası:', error)
    }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const response = await fetch(`${this.baseUrl}/f
        throw new Error('Se
      const data = awai
    } catch (error) {
    }

  async testApiKeys(): Pr
      return false

      await this.getAccountInform
    } catch (error) {
    }

  async g
      const tickers = awai
        symbol: ticker.symbol,
     
   

      throw new Error(`Sembol lis
  }
  // Pozisyonu kapatma
    if (!this.validateCredentials()) {
    }

      con
      if (!position) {
      }
      const side = 

       
      
        undefined,
      )

  }

export const binanceService = new Bina



























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