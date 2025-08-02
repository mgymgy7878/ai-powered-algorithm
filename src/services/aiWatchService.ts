import { useState, useEffect } from 'react'
import { aiService } from './aiService'
import { binanceService } from './binanceService'

export interface MarketData {
  symbol: string
  price: number
  change24h: number
  volume: string
  prediction?: {
    direction: 'up' | 'down' | 'neutral'
    confidence: number
    reason: string
  }
}

export interface TechnicalSignal {
  type: 'buy' | 'sell' | 'neutral'
  indicator: string
  symbol: string
  strength: number
  description: string
}

export interface RiskAlert {
  level: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  timestamp: Date
}

export interface NewsItem {
  id: string
  title: string
  source: string
  timestamp: Date
  sentiment: 'positive' | 'negative' | 'neutral'
  impact: 'low' | 'medium' | 'high'
}

export interface EconomicEvent {
  id: string
  title: string
  country: string
  time: Date
  importance: 'low' | 'medium' | 'high'
  forecast?: string
  actual?: string
}

class AIWatchService {
  private static instance: AIWatchService
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private subscribers: Map<string, ((data: any) => void)[]> = new Map()

  public static getInstance(): AIWatchService {
    if (!AIWatchService.instance) {
      AIWatchService.instance = new AIWatchService()
    }
    return AIWatchService.instance
  }

  // Abone olma sistemi
  subscribe(module: string, callback: (data: any) => void) {
    if (!this.subscribers.has(module)) {
      this.subscribers.set(module, [])
    }
    this.subscribers.get(module)!.push(callback)
  }

  unsubscribe(module: string, callback: (data: any) => void) {
    const subs = this.subscribers.get(module)
    if (subs) {
      const index = subs.indexOf(callback)
      if (index > -1) {
        subs.splice(index, 1)
      }
    }
  }

  private notify(module: string, data: any) {
    const subs = this.subscribers.get(module)
    if (subs) {
      subs.forEach(callback => callback(data))
    }
  }

  // Watchlist takibi - her 15 saniyede bir (daha sık)
  startWatchlistTracking(symbols: string[]) {
    this.stopModule('watchlist')
    
    const interval = setInterval(async () => {
      try {
        const marketData: MarketData[] = []
        
        for (const symbol of symbols) {
          try {
            // Binance'den fiyat verisi al
            const priceData = await binanceService.getSymbolPrice(symbol)
            if (priceData) {
              marketData.push({
                symbol,
                price: parseFloat(priceData.price),
                change24h: Math.random() * 10 - 5, // Demo veri
                volume: (Math.random() * 1000000).toFixed(0),
                prediction: await this.generatePrediction(symbol, parseFloat(priceData.price))
              })
            }
          } catch (error) {
            console.warn(`Symbol ${symbol} verisi alınamadı:`, error)
          }
        }
        
        this.notify('watchlist', marketData)
      } catch (error) {
        console.error('Watchlist tracking error:', error)
      }
    }, 15000)
    
    this.intervals.set('watchlist', interval)
  }

  // AI tahmin modülü - her 10 saniyede bir (daha sık)
  startPredictionTracking(symbols: string[]) {
    this.stopModule('prediction')
    
    const interval = setInterval(async () => {
      try {
        const predictions = []
        
        for (const symbol of symbols) {
          const prediction = await this.generatePrediction(symbol, Math.random() * 50000)
          predictions.push({
            symbol,
            ...prediction
          })
        }
        
        this.notify('prediction', predictions)
      } catch (error) {
        console.error('Prediction tracking error:', error)
      }
    }, 10000)
    
    this.intervals.set('prediction', interval)
  }

  // Teknik sinyal takibi - her 15 saniyede bir
  startTechnicalSignalsTracking(symbols: string[]) {
    this.stopModule('signals')
    
    const interval = setInterval(async () => {
      try {
        const signals: TechnicalSignal[] = []
        
        for (const symbol of symbols) {
          // Demo sinyal üretimi
          const signalTypes = ['RSI', 'MACD', 'EMA', 'Bollinger Bands']
          const types: ('buy' | 'sell' | 'neutral')[] = ['buy', 'sell', 'neutral']
          
          signals.push({
            type: types[Math.floor(Math.random() * types.length)],
            indicator: signalTypes[Math.floor(Math.random() * signalTypes.length)],
            symbol,
            strength: Math.random() * 100,
            description: await this.generateSignalDescription(symbol)
          })
        }
        
        this.notify('signals', signals)
      } catch (error) {
        console.error('Technical signals tracking error:', error)
      }
    }, 15000)
    
    this.intervals.set('signals', interval)
  }

  // Risk uyarı takibi - her 30 saniyede bir
  startRiskAlertsTracking() {
    this.stopModule('risk')
    
    const interval = setInterval(async () => {
      try {
        const alerts: RiskAlert[] = []
        
        // Demo risk uyarıları
        const riskScenarios = [
          { level: 'medium' as const, title: 'Yüksek Pozisyon Riski', description: 'BTC pozisyonu portföyün %65ını oluşturuyor' },
          { level: 'high' as const, title: 'Volatilite Uyarısı', description: 'Son 24 saatte %15 oynaklık artışı' },
          { level: 'low' as const, title: 'Likidite Kontrolü', description: 'Acil durum fonu %12 seviyesinde' },
          { level: 'critical' as const, title: 'Margin Uyarısı', description: 'Margin kullanımı %85e ulaştı' }
        ]
        
        // Random bir uyarı seç
        if (Math.random() > 0.6) {
          const scenario = riskScenarios[Math.floor(Math.random() * riskScenarios.length)]
          alerts.push({
            ...scenario,
            timestamp: new Date()
          })
        }
        
        this.notify('risk', alerts)
      } catch (error) {
        console.error('Risk alerts tracking error:', error)
      }
    }, 30000)
    
    this.intervals.set('risk', interval)
  }

  // Haber takibi - her 45 saniyede bir
  startNewsTracking() {
    this.stopModule('news')
    
    const interval = setInterval(async () => {
      try {
        const news: NewsItem[] = []
        
        // Demo haberler
        const demoNews = [
          'Bitcoin ETF onayı için SEC toplantısı',
          'Ethereum 2.0 güncelleme tarihi açıklandı',
          'Tesla Bitcoin satışı hakkında açıklama yaptı',
          'Binance yeni altcoin listesi duyurdu',
          'Fed faiz kararı kripto piyasalarını etkiledi',
          'DeFi protokollerinde hacim artışı görülüyor'
        ]
        
        const randomNews = demoNews[Math.floor(Math.random() * demoNews.length)]
        const sentiment = await this.analyzeNewsSentiment(randomNews)
        
        news.push({
          id: Date.now().toString(),
          title: randomNews,
          source: ['CoinDesk', 'CoinTelegraph', 'Binance News', 'CryptoSlate'][Math.floor(Math.random() * 4)],
          timestamp: new Date(),
          sentiment,
          impact: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
        })
        
        this.notify('news', news)
      } catch (error) {
        console.error('News tracking error:', error)
      }
    }, 45000)
    
    this.intervals.set('news', interval)
  }

  // Ekonomik takvim takibi - her 120 saniyede bir
  startEconomicCalendarTracking() {
    this.stopModule('economic')
    
    const interval = setInterval(async () => {
      try {
        const events: EconomicEvent[] = []
        
        // Demo ekonomik olaylar
        const demoEvents = [
          { title: 'Fed Faiz Kararı', country: 'US', importance: 'high' as const },
          { title: 'Enflasyon Verisi', country: 'EU', importance: 'medium' as const },
          { title: 'İstihdam Raporu', country: 'US', importance: 'high' as const }
        ]
        
        const randomEvent = demoEvents[Math.floor(Math.random() * demoEvents.length)]
        
        events.push({
          id: Date.now().toString(),
          ...randomEvent,
          time: new Date(Date.now() + Math.random() * 86400000), // Gelecek 24 saat içinde
          forecast: '2.5%',
          actual: Math.random() > 0.5 ? '2.3%' : undefined
        })
        
        this.notify('economic', events)
      } catch (error) {
        console.error('Economic calendar tracking error:', error)
      }
    }, 120000)
    
    this.intervals.set('economic', interval)
  }

  // Yardımcı AI fonksiyonları
  private async generatePrediction(symbol: string, currentPrice: number) {
    try {
      const prompt = `${symbol} için kısa vadeli tahmin yap. Mevcut fiyat: ${currentPrice}. Sadece direction (up/down/neutral), confidence (0-100), ve reason döndür.`
      
      // Demo prediction - gerçek AI entegrasyonu için aiService kullanılabilir
      const directions: ('up' | 'down' | 'neutral')[] = ['up', 'down', 'neutral']
      const direction = directions[Math.floor(Math.random() * directions.length)]
      const confidence = Math.floor(Math.random() * 40) + 60 // 60-100 arası
      
      return {
        direction,
        confidence,
        reason: `Teknik analiz sonucu ${direction === 'up' ? 'yükseliş' : direction === 'down' ? 'düşüş' : 'yatay'} bekleniyor`
      }
    } catch (error) {
      return {
        direction: 'neutral' as const,
        confidence: 50,
        reason: 'Tahmin yapılamadı'
      }
    }
  }

  private async generateSignalDescription(symbol: string): Promise<string> {
    const descriptions = [
      `${symbol} için güçlü momentum sinyali`,
      `${symbol} destek seviyesini test ediyor`,
      `${symbol} direnç bölgesine yaklaştı`,
      `${symbol} hacim artışı ile destekleniyor`
    ]
    
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  private async analyzeNewsSentiment(newsTitle: string): Promise<'positive' | 'negative' | 'neutral'> {
    // Basit keyword analizi
    const positiveWords = ['onay', 'artış', 'başarı', 'güncelleme', 'liste']
    const negativeWords = ['düşüş', 'satış', 'risk', 'sorun', 'yasak']
    
    const lowerTitle = newsTitle.toLowerCase()
    
    if (positiveWords.some(word => lowerTitle.includes(word))) {
      return 'positive'
    } else if (negativeWords.some(word => lowerTitle.includes(word))) {
      return 'negative'
    }
    
    return 'neutral'
  }

  // Modül durdurma
  stopModule(module: string) {
    const interval = this.intervals.get(module)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(module)
    }
  }

  // Tüm takipleri durdur
  stopAll() {
    this.intervals.forEach((interval) => clearInterval(interval))
    this.intervals.clear()
  }
}

export const aiWatchService = AIWatchService.getInstance()

// React hook for using the service
export function useAIWatch() {
  const [isActive, setIsActive] = useState(false)

  const startWatching = (symbols: string[] = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT']) => {
    aiWatchService.startWatchlistTracking(symbols)
    aiWatchService.startPredictionTracking(symbols)
    aiWatchService.startTechnicalSignalsTracking(symbols)
    aiWatchService.startRiskAlertsTracking()
    aiWatchService.startNewsTracking()
    aiWatchService.startEconomicCalendarTracking()
    
    setIsActive(true)
  }

  const stopWatching = () => {
    aiWatchService.stopAll()
    setIsActive(false)
  }

  useEffect(() => {
    return () => {
      aiWatchService.stopAll()
    }
  }, [])

  return {
    isActive,
    startWatching,
    stopWatching,
    subscribe: aiWatchService.subscribe.bind(aiWatchService),
    unsubscribe: aiWatchService.unsubscribe.bind(aiWatchService)
  }
}