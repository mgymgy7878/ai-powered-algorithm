import CryptoJS from 'crypto-js'

export interface KlineData {
  openTime: number
  volume: stri
  quoteAssetVo
  takerBuyBas
  ignore: strin
  volume: string
  closeTime: number
  quoteAssetVolume: string
  numberOfTrades: number
  takerBuyBaseAssetVolume: string
  takerBuyQuoteAssetVolume: string
  ignore: string
}

    positionInitialMargin: str
  }>
    symbol: string
    maintMargin: string
    positionInitialMargin: s
    leverage: string
    entryPrice: string
    positionSide: string
    notional: string
    updateTime: number
}
export interface 
  price: string

  orderId: number
  status: string
  price: string
    positionInitialMargin: string
    openOrderInitialMargin: string
  }>
  positions: Array<{
    symbol: string
    initialMargin: string
    maintMargin: string
    unrealizedProfit: string
    positionInitialMargin: string
    openOrderInitialMargin: string
    leverage: string
    isolated: boolean
    entryPrice: string
    markPrice: string
    positionSide: string
    positionAmt: string
    notional: string
    isolatedWallet: string
    updateTime: number
  }>
}

export interface SymbolPrice {
  symbol: string
  price: string
}

export interface Order {
  orderId: number
  symbol: string
  status: string
  clientOrderId: string
  price: string
  avgPrice: string

      headers['X-MBX-

      const respon
        headers,

        const error =
      }
      return r
      console.error('B
    }

  async testConnection(
      await this.m
    } catch (e
      return false
 

    try {
      return {
        assets: data.assets.map(
          walletBalance: asset
          marginBalance: asset.marg

          openOrderInitialMar
      }
      console.error('Hes
    }

  async getSymbolPrices(): Promise<S
   


        symbol: item.symbol,
      }))
      console.error('Sembol fiyatları alına
    }


    interval: str
    startTime?: number,
  ): Promise<KlineData[]> {
   

      }
      if (startTime) params.


        openTime: kline[0],
        high: kline[2],
        close: klin
        closeTime: kline[6],
        numberOfTrades: kline[8],
     

      console.error('Kline veril
    }

  get

    return `${wsBaseUrl}/ws`


      return await this.makeRequest('/fapi/v1/exchangeInfo', 'GET', {}, false)

    }

  asy

    } catch (error) {
      throw new Error(`Pozisyonlar alınamad
  }

    try {
      if (symbol) params.symbol = symbol.
      return aw
      console.er
    }

  async placeMarketOrder(
    side: 'BUY' | 'SELL',
    positionSide: 'BOTH' | 'LONG' | 'SHORT' = 'BOTH'
    try

        type: 'MARKET',
        positionSide,
      }
      return awai
     
   

  async placeLimitOr
    side: 'BUY' | 'SELL',
    price
    timeInForce: 'GTC' | 'IOC' | 'FOK' = 'GTC'
    try {
        symbol: symbo
        type: 'LIMIT',
        price: pri
     
   

      console.error('Limi
    }

  async cancelAllOrders(symbol?: string): Promise<any> {
      const pa
      }

    } catch (error) {
      throw new Error(`Emirler iptal edilemed
  }
  // Pozisyonu kapat
    try {
      const position = positions.find(pos => 
      if (!position || parseFloat(position.positionAmt) === 0
      }
      const

    } catch (error) {
      throw new Error(`Pozisyon kapatılamadı: ${error}`)
  }
  // 
   

        timestamp: Date.now()

    } cat
      throw new Error(`Kaldıraç ayarlanamadı: ${error}`)
  }
  // Margin tipini ayarla
    try 

        timestamp: Date.now()

    } catch (error) {
      thr
  }
  // İşlem geçmişini al
    try {
     
   

    } catch (error) {
      throw new Error
  }
  // Gelir geçmişini al
    try {
        limit,
      }
      if (incomeType) param
      ret
      console.error('Gelir geçmişi alınamad
    }
}
// Singleton 































































































































































































































