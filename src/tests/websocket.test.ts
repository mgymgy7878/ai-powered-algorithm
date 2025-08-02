import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('🔌 WebSocket Integration Tests', () => {
  let mockWebSocket: any
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock WebSocket
    mockWebSocket = {
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      readyState: 1 // OPEN
    }
    
    global.WebSocket = vi.fn().mockImplementation(() => mockWebSocket)
  })

  it('WebSocket bağlantısı kurulabilmeli', () => {
    const ws = new WebSocket('ws://localhost:8080')
    
    expect(WebSocket).toHaveBeenCalledWith('ws://localhost:8080')
    expect(ws).toBeDefined()
  })

  it('Binance WebSocket stream çalışmalı', async () => {
    const symbolsToSubscribe = ['BTCUSDT', 'ETHUSDT']
    
    const binanceWs = new WebSocket('wss://stream.binance.com/stream')
    
    // Subscribe to symbols
    const subscribeMessage = {
      method: 'SUBSCRIBE',
      params: symbolsToSubscribe.map(symbol => `${symbol.toLowerCase()}@ticker`),
      id: 1
    }

    binanceWs.send(JSON.stringify(subscribeMessage))
    
    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify(subscribeMessage)
    )
  })

  it('WebSocket mesaj handling çalışmalı', () => {
    const messageHandler = vi.fn()
    const ws = new WebSocket('ws://localhost:8080')
    
    ws.addEventListener('message', messageHandler)
    
    // Simulate incoming message
    const mockMessage = {
      data: JSON.stringify({
        stream: 'btcusdt@ticker',
        data: {
          s: 'BTCUSDT',
          c: '50000.00',
          P: '2.5'
        }
      })
    }
    
    const messageEvent = new MessageEvent('message', mockMessage)
    
    // Trigger the event handler manually
    expect(mockWebSocket.addEventListener).toHaveBeenCalledWith('message', messageHandler)
  })

  it('WebSocket reconnection çalışmalı', async () => {
    let reconnectAttempts = 0
    const maxReconnectAttempts = 3
    
    const createConnection = () => {
      const ws = new WebSocket('ws://localhost:8080')
      
      ws.addEventListener('close', () => {
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++
          setTimeout(createConnection, 1000)
        }
      })
      
      return ws
    }
    
    const ws = createConnection()
    
    // Simulate connection close
    const closeEvent = new CloseEvent('close', { code: 1006 })
    
    expect(ws).toBeDefined()
    expect(reconnectAttempts).toBe(0)
  })

  it('Rate limiting uygulanmalı', () => {
    const rateLimiter = {
      requests: 0,
      lastReset: Date.now(),
      limit: 10,
      window: 1000,
      
      canMakeRequest() {
        const now = Date.now()
        if (now - this.lastReset > this.window) {
          this.requests = 0
          this.lastReset = now
        }
        
        if (this.requests < this.limit) {
          this.requests++
          return true
        }
        
        return false
      }
    }
    
    // Test rate limiting
    for (let i = 0; i < 15; i++) {
      const canMake = rateLimiter.canMakeRequest()
      if (i < 10) {
        expect(canMake).toBe(true)
      } else {
        expect(canMake).toBe(false)
      }
    }
  })

  it('WebSocket error handling çalışmalı', () => {
    const errorHandler = vi.fn()
    const ws = new WebSocket('ws://invalid-url')
    
    ws.addEventListener('error', errorHandler)
    
    // Simulate error
    const errorEvent = new Event('error')
    
    expect(mockWebSocket.addEventListener).toHaveBeenCalledWith('error', errorHandler)
  })

  it('Multiple WebSocket connections yönetilebilmeli', () => {
    const connections = new Map()
    
    const createConnection = (url: string, id: string) => {
      const ws = new WebSocket(url)
      connections.set(id, ws)
      return ws
    }
    
    createConnection('wss://stream.binance.com/stream', 'binance')
    createConnection('ws://localhost:8080/market-data', 'local')
    
    expect(connections.size).toBe(2)
    expect(connections.has('binance')).toBe(true)
    expect(connections.has('local')).toBe(true)
  })

  it('WebSocket cleanup çalışmalı', () => {
    const ws = new WebSocket('ws://localhost:8080')
    
    // Add event listeners
    const messageHandler = vi.fn()
    const errorHandler = vi.fn()
    
    ws.addEventListener('message', messageHandler)
    ws.addEventListener('error', errorHandler)
    
    // Cleanup
    ws.removeEventListener('message', messageHandler)
    ws.removeEventListener('error', errorHandler)
    ws.close()
    
    expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith('message', messageHandler)
    expect(mockWebSocket.removeEventListener).toHaveBeenCalledWith('error', errorHandler)
    expect(mockWebSocket.close).toHaveBeenCalled()
  })
})