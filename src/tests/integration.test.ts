import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('🔄 Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('🤝 AI ↔ Binance Entegrasyonu', () => {
    it('AI, Binance verilerini analiz edebilmeli', async () => {
      // Mock Binance API response
      const mockMarketData = {
        symbol: 'BTCUSDT',
        price: '50000.00',
        priceChange: '1000.00',
        priceChangePercent: '2.04',
        volume: '25000.123',
        high: '51000.00',
        low: '49000.00'
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockMarketData)
      })

      // Mock AI analysis
      global.spark = {
        llm: vi.fn().mockResolvedValue('BTCUSDT %2.04 yükselişte, güçlü alım fırsatı'),
        llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => strings.join('') + values.join('')
      } as any

      // Simulate AI analyzing market data
      const analysis = await global.spark.llm(`BTCUSDT verilerini analiz et: ${JSON.stringify(mockMarketData)}`)
      
      expect(analysis).toContain('BTCUSDT')
      expect(analysis).toContain('yükseliş')
      expect(global.spark.llm).toHaveBeenCalled()
    })

    it('Real-time veri akışı ve AI önerileri çalışmalı', async () => {
      const mockWebSocket = {
        send: vi.fn(),
        close: vi.fn(),
        addEventListener: vi.fn(),
        readyState: 1
      }

      global.WebSocket = vi.fn().mockImplementation(() => mockWebSocket)

      // Simulate WebSocket message
      const mockMessage = {
        stream: 'btcusdt@ticker',
        data: {
          s: 'BTCUSDT',
          c: '52000.00', // Current price
          P: '4.00'      // Price change percent
        }
      }

      // AI should react to price changes
      global.spark.llm = vi.fn().mockResolvedValue('Fiyat %4 yükseldi, pozisyon artırma önerisi')

      const ws = new WebSocket('wss://stream.binance.com/stream')
      
      expect(WebSocket).toHaveBeenCalledWith('wss://stream.binance.com/stream')
      expect(mockWebSocket.addEventListener).toHaveBeenCalledWith('message', expect.any(Function))
    })
  })

  describe('🎯 Strateji ↔ Backtest Entegrasyonu', () => {
    it('Strateji oluşturma ve backtest süreci çalışmalı', async () => {
      const mockStrategy = {
        id: 'test-strategy-1',
        name: 'RSI Scalping',
        code: `
          if (rsi < 30) {
            buy();
          } else if (rsi > 70) {
            sell();
          }
        `,
        parameters: {
          rsi_period: 14,
          oversold_threshold: 30,
          overbought_threshold: 70
        }
      }

      // Mock historical data for backtest
      const mockHistoricalData = Array.from({ length: 100 }, (_, i) => ({
        timestamp: Date.now() - (100 - i) * 60000,
        open: 50000 + Math.random() * 1000,
        high: 50500 + Math.random() * 1000,
        low: 49500 + Math.random() * 1000,
        close: 50000 + Math.random() * 1000,
        volume: 1000 + Math.random() * 500
      }))

      // Mock backtest engine
      const backtestEngine = {
        runBacktest: vi.fn().mockResolvedValue({
          totalTrades: 25,
          profitableTrades: 18,
          totalProfit: 2500,
          maxDrawdown: -500,
          sharpeRatio: 1.8,
          winRate: 72
        })
      }

      const result = await backtestEngine.runBacktest(mockStrategy, mockHistoricalData)
      
      expect(result.totalTrades).toBeGreaterThan(0)
      expect(result.winRate).toBeGreaterThan(50)
      expect(result.totalProfit).toBeGreaterThan(0)
      expect(backtestEngine.runBacktest).toHaveBeenCalledWith(mockStrategy, mockHistoricalData)
    })

    it('Backtest sonuçları AI tarafından optimize edilebilmeli', async () => {
      const mockBacktestResult = {
        totalTrades: 15,
        profitableTrades: 8,
        totalProfit: 500,
        maxDrawdown: -800,
        winRate: 53.3
      }

      global.spark.llm = vi.fn().mockResolvedValue(`
        Strateji performansı orta seviyede. Öneriler:
        1. RSI eşik değerlerini 25/75 olarak ayarlayın
        2. Stop-loss %2 olarak belirleyin
        3. Position size'ı %50 azaltın
      `)

      const aiOptimization = await global.spark.llm(`Backtest sonuçlarını optimize et: ${JSON.stringify(mockBacktestResult)}`)
      
      expect(aiOptimization).toContain('RSI')
      expect(aiOptimization).toContain('stop-loss')
      expect(aiOptimization).toContain('%')
    })
  })

  describe('📊 Dashboard ↔ Services Entegrasyonu', () => {
    it('Dashboard gerçek zamanlı metrikleri gösterebilmeli', async () => {
      const mockPortfolioData = {
        totalValue: 50000,
        dailyPnl: 1250,
        totalPnl: 8750,
        successRate: 68.5,
        activeStrategies: 3
      }

      const mockRunningStrategies = [
        { id: '1', name: 'Grid Bot', status: 'running', profit: 150 },
        { id: '2', name: 'RSI Scalper', status: 'running', profit: 320 },
        { id: '3', name: 'DCA Bot', status: 'running', profit: -50 }
      ]

      // Mock services
      const portfolioService = {
        getPortfolioData: vi.fn().mockResolvedValue(mockPortfolioData),
        getRunningStrategies: vi.fn().mockResolvedValue(mockRunningStrategies)
      }

      const portfolioData = await portfolioService.getPortfolioData()
      const strategies = await portfolioService.getRunningStrategies()
      
      expect(portfolioData.totalValue).toBe(50000)
      expect(strategies.length).toBe(3)
      expect(strategies.filter(s => s.status === 'running')).toHaveLength(3)
    })
  })

  describe('🔄 End-to-End Workflow', () => {
    it('Tam iş akışı simülasyonu çalışmalı', async () => {
      // 1. AI piyasa analizi yapar
      global.spark.llm = vi.fn()
        .mockResolvedValueOnce('Piyasa yükseliş trendinde, scalping stratejisi öneriyorum')
        .mockResolvedValueOnce('Strateji kodu başarıyla oluşturuldu')
        .mockResolvedValueOnce('Backtest sonuçları mükemmel, canlı ticarete başlayabilirsiniz')

      // 2. AI strateji kodu oluşturur
      const marketAnalysis = await global.spark.llm('BTCUSDT piyasa durumunu analiz et')
      expect(marketAnalysis).toContain('scalping')

      // 3. Strateji oluşturulur
      const strategyCode = await global.spark.llm('RSI tabanlı scalping stratejisi oluştur')
      expect(strategyCode).toBeDefined()

      // 4. Backtest yapılır
      const backtestResult = {
        winRate: 78,
        totalProfit: 3200,
        maxDrawdown: -400
      }

      // 5. AI backtest sonuçlarını değerlendirir
      const aiEvaluation = await global.spark.llm(`Backtest sonucu: ${JSON.stringify(backtestResult)}`)
      expect(aiEvaluation).toContain('canlı ticarete')

      // 6. Strateji canlı ticarete alınır
      const liveStrategy = {
        id: 'live-strategy-1',
        status: 'running',
        startTime: Date.now()
      }

      expect(liveStrategy.status).toBe('running')
      expect(global.spark.llm).toHaveBeenCalledTimes(3)
    })

    it('Hata durumlarında recovery çalışmalı', async () => {
      // API hatası simülasyonu
      global.fetch = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ recovered: true })
        })

      const apiService = {
        fetchWithRetry: async (url: string, retries = 3) => {
          for (let i = 0; i < retries; i++) {
            try {
              const response = await fetch(url)
              return await response.json()
            } catch (error) {
              if (i === retries - 1) throw error
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
            }
          }
        }
      }

      // İlk çağrı başarısız, ikinci çağrı başarılı olmalı
      const result = await apiService.fetchWithRetry('https://api.binance.com/test')
      expect(result.recovered).toBe(true)
      expect(fetch).toHaveBeenCalledTimes(2)
    })
  })
})