/**
 * WebSocket Servisi - Gerçek zamanlı veri akışı için
 * Binance WebSocket API'sini kullanarak anlık fiyat ve market verilerini alır
 */

export interface MarketData {
  symbol: string
  price: string
  change: string
  changePercent: string
  volume: string
  high: string
  low: string
  timestamp: number
}

export interface KlineData {
  symbol: string
  openTime: number
  closeTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  trades: number
  isClosed: boolean
}

export interface OrderBookData {
  symbol: string
  bids: [string, string][] // [price, quantity]
  asks: [string, string][]
  timestamp: number
}

export interface TradeData {
  symbol: string
  price: string
  quantity: string
  time: number
  isBuyerMaker: boolean
}

type WebSocketCallback = (data: any) => void

class WebSocketService {
  private connections: Map<string, WebSocket> = new Map()
  private callbacks: Map<string, WebSocketCallback[]> = new Map()
  private reconnectAttempts: Map<string, number> = new Map()
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  /**
   * Belirli bir sembole ait 24sa fiyat değişim verilerini dinle
   */
  subscribeToTicker(symbol: string, callback: (data: MarketData) => void) {
    const stream = `${symbol.toLowerCase()}@ticker`
    const url = `wss://stream.binance.com:9443/ws/${stream}`
    
    this.connect(stream, url, (rawData) => {
      try {
        const data = JSON.parse(rawData)
        const marketData: MarketData = {
          symbol: data.s,
          price: data.c,
          change: data.P,
          changePercent: data.P,
          volume: data.v,
          high: data.h,
          low: data.l,
          timestamp: data.E
        }
        callback(marketData)
      } catch (error) {
        console.error('Ticker data parse error:', error)
      }
    })
  }

  /**
   * Mum (Kline) verilerini dinle - grafikler için
   */
  subscribeToKline(symbol: string, interval: string, callback: (data: KlineData) => void) {
    const stream = `${symbol.toLowerCase()}@kline_${interval}`
    const url = `wss://stream.binance.com:9443/ws/${stream}`
    
    this.connect(stream, url, (rawData) => {
      try {
        const data = JSON.parse(rawData)
        const klineData: KlineData = {
          symbol: data.k.s,
          openTime: data.k.t,
          closeTime: data.k.T,
          open: data.k.o,
          high: data.k.h,
          low: data.k.l,
          close: data.k.c,
          volume: data.k.v,
          trades: data.k.n,
          isClosed: data.k.x
        }
        callback(klineData)
      } catch (error) {
        console.error('Kline data parse error:', error)
      }
    })
  }

  /**
   * Derinlik (Order Book) verilerini dinle
   */
  subscribeToDepth(symbol: string, callback: (data: OrderBookData) => void) {
    const stream = `${symbol.toLowerCase()}@depth10@100ms`
    const url = `wss://stream.binance.com:9443/ws/${stream}`
    
    this.connect(stream, url, (rawData) => {
      try {
        const data = JSON.parse(rawData)
        const depthData: OrderBookData = {
          symbol: data.s,
          bids: data.bids,
          asks: data.asks,
          timestamp: Date.now()
        }
        callback(depthData)
      } catch (error) {
        console.error('Depth data parse error:', error)
      }
    })
  }

  /**
   * Anlık işlem verilerini dinle
   */
  subscribeToTrades(symbol: string, callback: (data: TradeData) => void) {
    const stream = `${symbol.toLowerCase()}@trade`
    const url = `wss://stream.binance.com:9443/ws/${stream}`
    
    this.connect(stream, url, (rawData) => {
      try {
        const data = JSON.parse(rawData)
        const tradeData: TradeData = {
          symbol: data.s,
          price: data.p,
          quantity: data.q,
          time: data.T,
          isBuyerMaker: data.m
        }
        callback(tradeData)
      } catch (error) {
        console.error('Trade data parse error:', error)
      }
    })
  }

  /**
   * Çoklu sembol için toplu veri akışı
   */
  subscribeToMultipleTickers(symbols: string[], callback: (data: MarketData) => void) {
    const streams = symbols.map(s => `${s.toLowerCase()}@ticker`).join('/')
    const url = `wss://stream.binance.com:9443/stream?streams=${streams}`
    
    this.connect('multi-ticker', url, (rawData) => {
      try {
        const response = JSON.parse(rawData)
        if (response.data) {
          const data = response.data
          const marketData: MarketData = {
            symbol: data.s,
            price: data.c,
            change: data.P,
            changePercent: data.P,
            volume: data.v,
            high: data.h,
            low: data.l,
            timestamp: data.E
          }
          callback(marketData)
        }
      } catch (error) {
        console.error('Multi-ticker data parse error:', error)
      }
    })
  }

  /**
   * WebSocket bağlantısı kur
   */
  private connect(streamId: string, url: string, callback: WebSocketCallback) {
    // Mevcut bağlantıyı kapat
    this.disconnect(streamId)

    try {
      const ws = new WebSocket(url)
      
      ws.onopen = () => {
        console.log(`WebSocket bağlantısı açıldı: ${streamId}`)
        this.reconnectAttempts.set(streamId, 0)
        
        // Global bildirim gönder
        if ((window as any).pushNotification) {
          ;(window as any).pushNotification(`📡 ${streamId} veri akışı başlatıldı`, 'success')
        }
      }

      ws.onmessage = (event) => {
        callback(event.data)
      }

      ws.onerror = (error) => {
        console.error(`WebSocket hatası (${streamId}):`, error)
        if ((window as any).pushNotification) {
          ;(window as any).pushNotification(`❌ ${streamId} bağlantı hatası`, 'error')
        }
      }

      ws.onclose = (event) => {
        console.log(`WebSocket kapatıldı (${streamId}):`, event.code, event.reason)
        
        // Otomatik yeniden bağlanma
        if (event.code !== 1000) { // 1000 = normal kapanma
          this.handleReconnect(streamId, url, callback)
        }
      }

      this.connections.set(streamId, ws)
      
      // Callback'i kaydet
      if (!this.callbacks.has(streamId)) {
        this.callbacks.set(streamId, [])
      }
      this.callbacks.get(streamId)?.push(callback)

    } catch (error) {
      console.error(`WebSocket bağlantı hatası (${streamId}):`, error)
    }
  }

  /**
   * Yeniden bağlanma işlemi
   */
  private handleReconnect(streamId: string, url: string, callback: WebSocketCallback) {
    const attempts = this.reconnectAttempts.get(streamId) || 0
    
    if (attempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, attempts) // Exponential backoff
      
      console.log(`${streamId} için ${delay}ms sonra yeniden bağlanma denemesi (${attempts + 1}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.reconnectAttempts.set(streamId, attempts + 1)
        this.connect(streamId, url, callback)
      }, delay)
    } else {
      console.error(`${streamId} için maksimum yeniden bağlanma denemesi aşıldı`)
      if ((window as any).pushNotification) {
        ;(window as any).pushNotification(`🔴 ${streamId} bağlantısı başarısız`, 'error')
      }
    }
  }

  /**
   * Belirli bir akışı durdur
   */
  disconnect(streamId: string) {
    const ws = this.connections.get(streamId)
    if (ws) {
      ws.close(1000, 'Manuel kapatma')
      this.connections.delete(streamId)
      this.callbacks.delete(streamId)
      this.reconnectAttempts.delete(streamId)
      console.log(`${streamId} bağlantısı kapatıldı`)
    }
  }

  /**
   * Tüm bağlantıları kapat
   */
  disconnectAll() {
    for (const [streamId, ws] of this.connections) {
      ws.close(1000, 'Tümünü kapat')
      console.log(`${streamId} bağlantısı kapatıldı`)
    }
    
    this.connections.clear()
    this.callbacks.clear()
    this.reconnectAttempts.clear()
  }

  /**
   * Bağlantı durumunu kontrol et
   */
  getConnectionStatus(streamId: string): string {
    const ws = this.connections.get(streamId)
    if (!ws) return 'Bağlı değil'
    
    switch (ws.readyState) {
      case WebSocket.CONNECTING: return 'Bağlanıyor'
      case WebSocket.OPEN: return 'Bağlı'
      case WebSocket.CLOSING: return 'Kapanıyor'
      case WebSocket.CLOSED: return 'Kapalı'
      default: return 'Bilinmiyor'
    }
  }

  /**
   * Aktif bağlantıları listele
   */
  getActiveConnections(): string[] {
    return Array.from(this.connections.keys())
  }
}

export const websocketService = new WebSocketService()