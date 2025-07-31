import CryptoJS from 'crypt


  private baseUrl: str
  private isTestnet: boolean 
  setCredentials(apiKey: string,
    this.secretKey = secretKey
  }
  private getBaseUrl(): string {

  private createSignature(queryString: string): string {
  }
    this.secretKey = secretKey
    method: 'GET' | 'POST' |
  }

  private getBaseUrl(): string {
      params.timestamp = timestamp


  private createSignature(queryString: string): string {
    }
    if (requiresAuth) {
        throw new Error('B
      .digest('hex')
   

    }
    const response = 
      headers,

      const error = await respons
  ): Promise<any> {
    return response.json()
    const timestamp = Date.now()
  as
      await this.makeRe
    } catch (error) {
     

  // Hesap bilgilerini al
    try {

          asset: asset.asset,
      'Content-Type': 'application/json',
     

      }
      throw new Error(`Hesap bilgileri alına
  }
  // 24
    tr
    } catch (error) {
    }

  async getSymbolPrices(): Pr
      const [tickerData, priceData]
     

        priceData.map((item: any) => [i
      method,
        symbol
    })

        timestamp: Date
    } catch (error) {
    }


    interval: string = '1m
  }

  // Test bağlantısı
        interval,
    try {
      if (startTime) params.startTime = start


        openTime: kline[0],
        high: klin
    }
   

        takerBuyQuoteAsse
    } catch (error) {
    }

  getWebSocket
      ? 'wss://stream.binancefuture.com'
    return `${wsBaseUrl}/ws`

  async getExchangeInfo(): Promise<an
      return
      throw new Error(`Exchange bilgileri alınamadı:
  }
  // Aktif pozisyonları al
    try {
      r
    } catch (error) {
  }
    }
   

      throw new Error(`Açı
  }
  // Mark
      const [tickerData, priceData] = await Promise.all([
    quantity: number,
        this.makeRequest('/fapi/v1/ticker/price')
      co

        quantity: quantity.toSt
      }
      r

  }
  // Limit emir ver
    symbol: string,
    quantity: number,
    timeInForce: 'GTC' | 'IOC' | 'FOK' = 'GTC
    try {
        symbol: symbol.toUpperCase(),
        type: 'LIMIT',
        p
      }
      return await this.makeRequest('/fapi/v1/order', 'POST
     
  }

    try {
  async getKlineData(
      }
    interval: string = '1m',
      throw new Error(`E
  }
  // Tüm açık emirle
    try {
        s

    } catch (error) {
    }

  async

      
        throw new Error('Kapatılacak pozisy

      const side = parseFloat(position.positionAmt) > 0 ? 'SELL' : 'BUY'

      throw new Error(`Pozisyon kapatılama
        openTime: kline[0],
  // Kaldıraç ayarla
    try {
        symbol: symbol
      }
      return await this.m
        closeTime: kline[6],
  }
  // Margin tipini ayarla
    try {
        symbol: symbol.toUpperCase(),
      }
      return await th
      throw new Error(`Margin tipi ayarlanamadı: ${error}`)
  }
  /

        symbol: symbol.toUpperCase
  getWebSocketUrl(): string {
      return await this.makeRequest('
      throw new Error(`İşlem geçmişi alı
  }
    return `${wsBaseUrl}/ws`
   


  async getExchangeInfo(): Promise<any> {
      ret
      throw new Error(`Gelir geçmişi alınamadı: ${error}`)
  }


  }



    try {





  }



    try {





  }


