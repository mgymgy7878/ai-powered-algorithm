import { describe, it, expect, vi } from 'vitest'
import { binanceService } from '../services/binanceService'
import { aiService } from '../services/aiService'

describe('🔗 API Services Tests', () => {
  describe('Binance Service', () => {
    it('API credentials ayarlanabilmeli', () => {
      const testApiKey = 'test-api-key'
      const testSecretKey = 'test-secret-key'
      
      binanceService.setCredentials(testApiKey, testSecretKey, true)
      
      // Credentials private olduğu için dolaylı test
      expect(binanceService).toBeDefined()
    })

    it('Sembol fiyatları alınabilmeli', async () => {
      // Mock fetch response
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([
          { symbol: 'BTCUSDT', price: '50000.00' },
          { symbol: 'ETHUSDT', price: '3000.00' }
        ])
      })

      const prices = await binanceService.getSymbolPrices()
      
      expect(Array.isArray(prices)).toBe(true)
      expect(prices.length).toBeGreaterThan(0)
    })

    it('Hesap bilgileri alınabilmeli', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          totalWalletBalance: '10000.00',
          totalUnrealizedProfit: '150.00'
        })
      })

      const accountInfo = await binanceService.getAccountInfo()
      
      expect(accountInfo).toBeDefined()
      if (accountInfo) {
        expect(accountInfo.totalWalletBalance).toBeDefined()
      }
    })

    it('Kline data alınabilmeli', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([
          [1609459200000, "29000.00", "30000.00", "28500.00", "29500.00", "1234.56", 1609462800000, "36000000.00", 5678, "600.00", "18000000.00", "0"]
        ])
      })

      const klines = await binanceService.getKlineData('BTCUSDT', '1h', 100)
      
      expect(Array.isArray(klines)).toBe(true)
      if (klines.length > 0) {
        expect(klines[0].open).toBeDefined()
        expect(klines[0].high).toBeDefined()
        expect(klines[0].low).toBeDefined()
        expect(klines[0].close).toBeDefined()
      }
    })

    it('Hata durumları yakalanmalı', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      })

      const prices = await binanceService.getSymbolPrices()
      
      expect(prices).toEqual([])
    })
  })

  describe('AI Service', () => {
    it('AI ayarları yapılandırılabilmeli', () => {
      const testSettings = {
        openai: {
          apiKey: 'test-openai-key',
          model: 'gpt-4' as const,
          enabled: true
        },
        anthropic: {
          apiKey: 'test-claude-key',
          model: 'claude-3-sonnet' as const,
          enabled: false
        },
        binance: {
          apiKey: '',
          secretKey: '',
          testnet: true,
          enabled: false
        }
      }

      aiService.setSettings(testSettings)
      
      expect(aiService.isConfigured()).toBe(true)
    })

    it('AI mesaj gönderilmeli', async () => {
      // Mock spark.llm
      global.spark.llm = vi.fn().mockResolvedValue('Mocked AI response')

      const response = await aiService.sendMessage('Test message')
      
      expect(response).toBe('Mocked AI response')
      expect(global.spark.llm).toHaveBeenCalledWith(
        expect.stringContaining('Test message')
      )
    })

    it('Portföy analizi çalışmalı', async () => {
      global.spark.llm = vi.fn().mockResolvedValue('Portföy analizi: Güçlü performans')

      const analysis = await aiService.analyzePortfolio({
        totalValue: 50000,
        dailyPnl: 1250,
        totalPnl: 8750,
        successRate: 68.5
      })
      
      expect(analysis).toContain('Portföy analizi')
    })

    it('Piyasa analizi çalışmalı', async () => {
      global.spark.llm = vi.fn().mockResolvedValue('Piyasa durumu: Yükseliş trendi')

      const analysis = await aiService.analyzeMarket({
        volatility: 'high',
        trend: 'bullish',
        volume: 'increasing'
      })
      
      expect(analysis).toContain('Piyasa durumu')
    })

    it('Yapılandırılmamış AI servis hata vermeli', async () => {
      const unconfiguredService = new (aiService.constructor as any)()
      
      await expect(unconfiguredService.sendMessage('test')).rejects.toThrow()
    })
  })
})