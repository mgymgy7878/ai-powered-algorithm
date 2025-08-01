// Aktivite izleme servisi - gerçek zamanlı trading olaylarını takip eder
export class ActivityMonitorService {
  private static instance: ActivityMonitorService | null = null
  private listeners: ((message: string, type: 'success' | 'info' | 'warning' | 'error') => void)[] = []
  private isMonitoring = false
  private marketSimulation: any = null

  static getInstance(): ActivityMonitorService {
    if (!ActivityMonitorService.instance) {
      ActivityMonitorService.instance = new ActivityMonitorService()
    }
    return ActivityMonitorService.instance
  }

  // Aktivite dinleyici ekle
  addListener(callback: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void) {
    this.listeners.push(callback)
  }

  // Aktivite dinleyici kaldır
  removeListener(callback: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback)
  }

  // Bildirim gönder
  private notify(message: string, type: 'success' | 'info' | 'warning' | 'error') {
    this.listeners.forEach(listener => {
      try {
        listener(message, type)
      } catch (error) {
        console.error('Activity listener error:', error)
      }
    })
  }

  // Piyasa simülasyonunu başlat
  startMarketSimulation() {
    if (this.isMonitoring) return

    this.isMonitoring = true
    
    // Gerçek zamanlı piyasa olayları simülasyonu
    const marketEvents = [
      { message: 'BTCUSDT fiyat hareketi: +2.3%', type: 'info' as const, weight: 20 },
      { message: 'ETHUSDT trend kırılması tespit edildi', type: 'warning' as const, weight: 15 },
      { message: 'Grid Bot ADAUSDT +$85 kâr elde etti', type: 'success' as const, weight: 25 },
      { message: 'RSI Scalper yeni pozisyona girdi', type: 'info' as const, weight: 30 },
      { message: 'Stop-loss tetiklendi: DOTUSDT', type: 'warning' as const, weight: 10 },
      { message: 'AI pilot volatilite artışı tespit etti', type: 'warning' as const, weight: 8 },
      { message: 'Momentum stratejisi 3 pozisyon açtı', type: 'success' as const, weight: 20 },
      { message: 'MACD sinyali: SOLUSDT satış önerisi', type: 'info' as const, weight: 18 },
      { message: 'Binance API bağlantısı yenilendi', type: 'info' as const, weight: 5 },
      { message: 'Portföy hedefine %85 ulaştı', type: 'success' as const, weight: 12 }
    ]

    const economicEvents = [
      { message: 'Fed faiz kararı yaklaşıyor - pozisyonlar kapatıldı', type: 'warning' as const, weight: 3 },
      { message: 'Haber akışı: Bitcoin ETF onayı beklentisi', type: 'info' as const, weight: 4 },
      { message: 'Yüksek volatilite uyarısı: NFP verisi açıklandı', type: 'warning' as const, weight: 2 },
      { message: 'Piyasa sakinleşti - grid botlar aktifleştirildi', type: 'success' as const, weight: 6 }
    ]

    const allEvents = [...marketEvents, ...economicEvents]

    this.marketSimulation = setInterval(() => {
      // Ağırlıklı rastgele seçim
      const totalWeight = allEvents.reduce((sum, event) => sum + event.weight, 0)
      let random = Math.random() * totalWeight
      
      for (const event of allEvents) {
        random -= event.weight
        if (random <= 0) {
          this.notify(event.message, event.type)
          break
        }
      }
    }, Math.random() * 45000 + 15000) // 15-60 saniye arası
  }

  // Piyasa simülasyonunu durdur
  stopMarketSimulation() {
    if (this.marketSimulation) {
      clearInterval(this.marketSimulation)
      this.marketSimulation = null
    }
    this.isMonitoring = false
  }

  // Strateji olayı bildir
  notifyStrategyEvent(strategyName: string, action: 'started' | 'stopped' | 'paused' | 'profit' | 'loss', details?: string) {
    const actionMap = {
      started: { message: `${strategyName} stratejisi başlatıldı`, type: 'success' as const },
      stopped: { message: `${strategyName} stratejisi durduruldu`, type: 'warning' as const },
      paused: { message: `${strategyName} stratejisi duraklatıldı`, type: 'info' as const },
      profit: { message: `${strategyName} kâr elde etti${details ? ': ' + details : ''}`, type: 'success' as const },
      loss: { message: `${strategyName} zararda${details ? ': ' + details : ''}`, type: 'warning' as const }
    }

    const event = actionMap[action]
    this.notify(event.message, event.type)
  }

  // Trade sinyali bildir
  notifyTradeSignal(symbol: string, action: 'buy' | 'sell', price?: number, quantity?: number) {
    const actionText = action === 'buy' ? 'Alım' : 'Satış'
    const priceText = price ? ` $${price.toFixed(2)}` : ''
    const quantityText = quantity ? ` (${quantity.toFixed(4)}` : ''
    
    this.notify(
      `${actionText} sinyali: ${symbol}${priceText}${quantityText}${quantity ? ')' : ''}`,
      action === 'buy' ? 'success' : 'info'
    )
  }

  // AI önerisi bildir
  notifyAIRecommendation(recommendation: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    const priorityMap = {
      low: 'info' as const,
      medium: 'warning' as const,
      high: 'error' as const
    }

    this.notify(`AI Önerisi: ${recommendation}`, priorityMap[priority])
  }

  // Risk uyarısı bildir
  notifyRiskAlert(message: string, severity: 'medium' | 'high' | 'critical' = 'medium') {
    const severityMap = {
      medium: 'warning' as const,
      high: 'warning' as const,
      critical: 'error' as const
    }

    this.notify(`⚠️ Risk Uyarısı: ${message}`, severityMap[severity])
  }

  // Piyasa uyarısı bildir
  notifyMarketAlert(symbol: string, change: number, timeframe: string = '1h') {
    const changeText = change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`
    const severity = Math.abs(change) > 5 ? 'warning' : 'info'
    
    this.notify(
      `Piyasa hareketi: ${symbol} ${timeframe} ${changeText}`,
      severity as 'warning' | 'info'
    )
  }
}

// Singleton instance export
export const activityMonitor = ActivityMonitorService.getInstance()