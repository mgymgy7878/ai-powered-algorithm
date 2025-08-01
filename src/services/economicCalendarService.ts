import { EconomicEvent, EconomicCalendarConfig, EconomicCalendarResponse } from '@/types/economic'

class EconomicCalendarService {
  private apiUrl: string = 'https://api.forexfactory.com/ff_calendar_thisweek.json'
  private fallbackApiUrl: string = 'https://api.investing.com/api/financialdata/economiccalendar'
  private config: EconomicCalendarConfig = {
    currencies: ['USD', 'EUR', 'GBP', 'TRY'],
    impacts: ['medium', 'high'],
    dateRange: {
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 gün
    },
    autoRefresh: true,
    refreshInterval: 30 // 30 dakika
  }

  // Forex Factory API - ücretsiz ancak CORS sorunu olabilir  
  async fetchFromForexFactory(): Promise<EconomicEvent[]> {
    try {
      // CORS proxy kullanarak
      const proxyUrl = 'https://api.allorigins.win/raw?url='
      const response = await fetch(proxyUrl + encodeURIComponent(this.apiUrl))
      const data = await response.json()
      
      return this.parseForexFactoryData(data)
    } catch (error) {
      console.error('Forex Factory API hatası:', error)
      return []
    }
  }

  // Investing.com API alternatifi
  async fetchFromInvesting(): Promise<EconomicEvent[]> {
    try {
      const params = new URLSearchParams({
        dateFrom: this.formatDate(this.config.dateRange.from),
        dateTo: this.formatDate(this.config.dateRange.to),
        countries: '5,17,25,37', // USA, Eurozone, UK, Turkey
        categories: '1,2,3,4,5', // Tüm kategoriler
        importance: '2,3' // Orta ve yüksek önem
      })

      const response = await fetch(`${this.fallbackApiUrl}?${params}`)
      const data = await response.json()
      
      return this.parseInvestingData(data)
    } catch (error) {
      console.error('Investing.com API hatası:', error)
      return this.getMockData() // Mock veri döndür
    }
  }

  // Ana veri çekme fonksiyonu
  async getEconomicEvents(): Promise<EconomicCalendarResponse> {
    try {
      let events: EconomicEvent[] = []
      
      // Önce Forex Factory'yi dene
      events = await this.fetchFromForexFactory()
      
      // Başarısızsa Investing.com'u dene
      if (events.length === 0) {
        events = await this.fetchFromInvesting()
      }

      // Filtreleme uygula
      events = this.filterEvents(events)

      return {
        success: true,
        events,
        lastUpdate: new Date().toISOString()
      }
    } catch (error) {
      console.error('Ekonomik takvim hatası:', error)
      return {
        success: false,
        events: this.getMockData(),
        lastUpdate: new Date().toISOString(),
        error: 'Veri alınamadı, örnek veriler gösteriliyor'
      }
    }
  }

  // Forex Factory verilerini parse et
  private parseForexFactoryData(data: any[]): EconomicEvent[] {
    return data.map((item, index) => ({
      id: `ff_${index}`,
      date: item.date,
      time: item.time,
      currency: item.currency,
      impact: this.mapImpact(item.impact),
      event: item.title,
      actual: item.actual,
      forecast: item.forecast,
      previous: item.previous,
      country: this.mapCountry(item.currency),
      olay: this.translateEvent(item.title),
      ulke: this.translateCountry(item.currency),
      etki: this.translateImpact(item.impact),
      aciklama: item.detail
    }))
  }

  // Investing.com verilerini parse et
  private parseInvestingData(data: any): EconomicEvent[] {
    if (!data.data) return []
    
    return data.data.map((item: any, index: number) => ({
      id: `inv_${item.event_id || index}`,
      date: item.date,
      time: item.time,
      currency: item.currency,
      impact: this.mapImpact(item.importance),
      event: item.name,
      actual: item.actual,
      forecast: item.forecast,
      previous: item.previous,
      country: item.country,
      olay: this.translateEvent(item.name),
      ulke: this.translateCountry(item.country),
      etki: this.translateImpact(item.importance),
      aciklama: item.comment
    }))
  }

  // Olayları filtrele
  private filterEvents(events: EconomicEvent[]): EconomicEvent[] {
    return events.filter(event => {
      // Para birimi filtresi
      if (!this.config.currencies.includes(event.currency)) {
        return false
      }

      // Etki seviyesi filtresi
      if (!this.config.impacts.includes(event.impact)) {
        return false
      }

      // Tarih aralığı filtresi
      const eventDate = new Date(event.date)
      return eventDate >= this.config.dateRange.from && 
             eventDate <= this.config.dateRange.to
    })
  }

  // Mock veri (API'lar çalışmazsa)
  private getMockData(): EconomicEvent[] {
    const today = new Date()
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    
    return [
      {
        id: 'mock_1',
        date: today.toISOString().split('T')[0],
        time: '16:30',
        currency: 'USD',
        impact: 'high',
        event: 'Federal Funds Rate Decision',
        forecast: '5.25%',
        previous: '5.00%',
        country: 'United States',
        olay: 'Fed Faiz Kararı',
        ulke: 'Amerika Birleşik Devletleri',
        etki: 'yüksek',
        aciklama: 'Merkez bankası faiz oranı kararı'
      },
      {
        id: 'mock_2',
        date: tomorrow.toISOString().split('T')[0],
        time: '14:00',
        currency: 'TRY',
        impact: 'high',
        event: 'CBRT Interest Rate Decision',
        forecast: '40.00%',
        previous: '42.50%',
        country: 'Turkey',
        olay: 'TCMB Faiz Kararı',
        ulke: 'Türkiye',
        etki: 'yüksek',
        aciklama: 'Türkiye Cumhuriyet Merkez Bankası faiz kararı'
      },
      {
        id: 'mock_3',
        date: today.toISOString().split('T')[0],
        time: '10:30',
        currency: 'EUR',
        impact: 'medium',
        event: 'German GDP Quarterly',
        forecast: '0.2%',
        previous: '0.1%',
        country: 'Germany',
        olay: 'Almanya GSYİH Çeyreklik',
        ulke: 'Almanya',
        etki: 'orta',
        aciklama: 'Üç aylık büyüme verileri'
      }
    ]
  }

  // Yardımcı fonksiyonlar
  private mapImpact(impact: string): 'low' | 'medium' | 'high' {
    if (typeof impact === 'number') {
      if (impact <= 1) return 'low'
      if (impact <= 2) return 'medium'
      return 'high'
    }
    
    switch (impact?.toLowerCase()) {
      case 'low': case 'düşük': case '1': return 'low'
      case 'medium': case 'orta': case '2': return 'medium'
      case 'high': case 'yüksek': case '3': return 'high'
      default: return 'medium'
    }
  }

  private mapCountry(currency: string): string {
    const countryMap: Record<string, string> = {
      'USD': 'United States',
      'EUR': 'Eurozone',
      'GBP': 'United Kingdom',
      'TRY': 'Turkey',
      'JPY': 'Japan',
      'CHF': 'Switzerland',
      'CAD': 'Canada',
      'AUD': 'Australia',
      'NZD': 'New Zealand'
    }
    return countryMap[currency] || currency
  }

  private translateEvent(event: string): string {
    const translations: Record<string, string> = {
      'Federal Funds Rate Decision': 'Fed Faiz Kararı',
      'Non-Farm Payrolls': 'Tarım Dışı İstihdam',
      'Unemployment Rate': 'İşsizlik Oranı',
      'GDP Quarterly': 'GSYİH Çeyreklik',
      'CPI Monthly': 'TÜFE Aylık',
      'Interest Rate Decision': 'Faiz Kararı',
      'Retail Sales': 'Perakende Satışlar',
      'Manufacturing PMI': 'İmalat PMI',
      'Services PMI': 'Hizmet PMI'
    }
    return translations[event] || event
  }

  private translateCountry(country: string): string {
    const translations: Record<string, string> = {
      'United States': 'Amerika Birleşik Devletleri',
      'Eurozone': 'Euro Bölgesi',
      'United Kingdom': 'Birleşik Krallık',
      'Turkey': 'Türkiye',
      'Germany': 'Almanya',
      'France': 'Fransa',
      'Japan': 'Japonya',
      'Switzerland': 'İsviçre',
      'Canada': 'Kanada',
      'Australia': 'Avustralya'
    }
    return translations[country] || country
  }

  private translateImpact(impact: string): 'düşük' | 'orta' | 'yüksek' {
    switch (this.mapImpact(impact)) {
      case 'low': return 'düşük'
      case 'medium': return 'orta'
      case 'high': return 'yüksek'
      default: return 'orta'
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  // Konfigürasyon güncellemeleri
  setConfig(config: Partial<EconomicCalendarConfig>): void {
    this.config = { ...this.config, ...config }
  }

  getConfig(): EconomicCalendarConfig {
    return { ...this.config }
  }

  // Bugünkü önemli olayları getir
  async getTodayHighImpactEvents(): Promise<EconomicEvent[]> {
    const result = await this.getEconomicEvents()
    const today = new Date().toISOString().split('T')[0]
    
    return result.events.filter(event => 
      event.date === today && event.impact === 'high'
    )
  }

  // Gelecek 24 saatteki önemli olayları getir
  async getUpcomingHighImpactEvents(): Promise<EconomicEvent[]> {
    const result = await this.getEconomicEvents()
    const now = new Date()
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    return result.events.filter(event => {
      const eventDateTime = new Date(`${event.date} ${event.time}`)
      return eventDateTime >= now && 
             eventDateTime <= next24h && 
             event.impact === 'high'
    })
  }
}

export const economicCalendarService = new EconomicCalendarService()