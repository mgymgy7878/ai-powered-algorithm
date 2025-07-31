import CryptoJS from 'crypto-js'

// Binance Kline (mum çubuğu) verisi interface
export interface KlineData {
  high: string
  open: string
  volume: stri
  low: string
  numberOfTrade
  volume: string
  closeTime: number
  quoteAssetVolume: string
  numberOfTrades: number
  takerBuyBaseAssetVolume: string
  takerBuyQuoteAssetVolume: string
  ignore: string
 

// Binance pozisyon bilgisi interface
export interface PositionInfo {
  isAutoAddMargi
  positionAmt: string
  isolatedWallet: st
  markPrice: string
  unRealizedProfit: string
  liquidationPrice: string
  symbol: string
  maxNotionalValue: string
  clientOrderId: str
  isolatedMargin: string
  isAutoAddMargin: string
  positionSide: string
  notional: string
  isolatedWallet: string
  updateTime: number
}

// Binance emir bilgisi interface
  origQuoteOrderQty: string
  symbol: string
  orderId: number
  orderListId: number
  clientOrderId: string
  price: string
  updateTime: num
  executedQty: string
  cummulativeQuoteQty: string
  status: string
  totalUnrealizedProf
  type: string
  totalOpenOrd
  stopPrice: string
  icebergQty: string
  time: number
    asset: string
  isWorking: boolean
  workingTime: number
  origQuoteOrderQty: string
 

// Binance hesap bilgisi interface
export interface AccountInfo {
  }>
  canTrade: boolean
    this.apiKey = api
    this.testnet = tes
  }
  // Testnet/mainnet ayarı
    this.testnet = isT
      ? 'https://testnet.bin
  }
  // API anahtarı doğrulamas
    return this.apiKey !== '' &

  private createSignature(queryStrin
  }
  // Zaman damgası oluşturma
    return Date.now()

  private getHeaders(includ
      'X-MBX-APIK
    }
  }
  // Kline (mum çubuğu) veri
    symbol: string, 
    limit: number = 500
    endTime?: number
    try {
        symbol: symbol.toUpperCase
        limit: limit.toString

      if (endTime) par
      const url = `${this.ba
    
      if (!response.
      }
      const data = await 
      return data.map((
        open: kline[1],
        low: kline[3],
        volume: kline[5],
        quoteAssetVo
        takerBuyBaseA
        ignore: kline[
    } catch (error: any
      throw new Error(`K
  }
  // Hesap bilgileri
    if (!this.validateCred
    }
    try {
      const queryString
    
 


        const errorDat
      }
      return await response.json
      console.error('Hesap bil
    }

  async getPositi
      throw new Error('API anahtarları ayarlanmamış')


      
        queryString = `symbol=${symbol.toUpperCase()}&${queryString}`
    this.apiKey = apiKey
    this.secretKey = secretKey
    this.testnet = testnet
    this.setTestnet(testnet)
  }

  // Testnet/mainnet ayarı
  private setTestnet(isTestnet: boolean) {
    this.testnet = isTestnet
    this.baseUrl = isTestnet 
      ? 'https://testnet.binancefuture.com'
      : 'https://fapi.binance.com'
  }

  // API anahtarı doğrulaması
  validateCredentials(): boolean {
    return this.apiKey !== '' && this.secretKey !== ''
  }

  // İmza oluşturma (Binance API için gerekli)
  private createSignature(queryString: string): string {
    return CryptoJS.HmacSHA256(queryString, this.secretKey).toString(CryptoJS.enc.Hex)
  }

  // Zaman damgası oluşturma
  private getTimestamp(): number {
    return Date.now()
  }

  // HTTP istekleri için header oluşturma
  private getHeaders(includeSignature: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'X-MBX-APIKEY': this.apiKey,
      'Content-Type': 'application/json',
     
      })
   


    } catch (error
      throw new Erro
  }
  // Limit emir ver
    symbol: string,
    quantity: string
    positionSide?: 'LONG' |
  ): Prom
      throw new Error('API anahtarları aya

      const times
        symbol: symbol.toUpperC
        

        timestamp: timestamp.toString()



      
      const response = await fetch(`${t
      
      })
      if (!response.ok) {
       

    } catch (error: any) {
      
  }
  // Bağlantı testi
    try {
      return response.o
      console.error('B
    }

  async getServerTime(): Pro
      const response = await fetch(
      return data.serverTime
      console.error('Server zamanı alınama
    }

  async g
      const url = symbol 
        : `${this.baseUrl}/fapi/v1/ticker/24hr`
      const response = await fetch(url)
     
   

      console.error('24hr ticker verisi 
    }

  async getExchangeInfo(): Promise<any> {
     

      }
      return await response.json()
      console.error('Exchange bilgisi alınamadı:',
    }
}
// Singleton instance

































































































































































































































