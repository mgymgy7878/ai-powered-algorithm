import { EconomicEvent, EconomicCalendarConfig } from '@/types/economic'

interface EconomicApiResponse {
  success: boolean
  events: EconomicEvent[]
  lastUpdate: string
  error?: string
}

class EconomicCalendarService {
  private config: EconomicCalendarConfig = {
    currencies: ['USD', 'EUR', 'TRY'],
    impacts: ['medium', 'high'],
    dateRange: {
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    autoRefresh: true,
    refreshInterval: 30
  }

  setConfig(config: EconomicCalendarConfig) {
    this.config = config
  }

  // Demo veriler - gerçek API entegrasyonu için burası değiştirilmeli
  async getEconomicEvents(): Promise<EconomicApiResponse> {
    try {
      // Simüle edilmiş yüklenme süresi
      await new Promise(resolve => setTimeout(resolve, 1000))

      const today = new Date()
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      const dayAfter = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)

      const mockEvents: EconomicEvent[] = [
        {
          id: '1',
          date: today.toISOString().split('T')[0],
          time: '16:30',
          ulke: 'ABD',
          olay: 'İşsizlik Başvuruları',
          etki: 'medium',
          previous: '220K',
          forecast: '215K',
          actual: '210K',
          impact: 'medium',
          currency: 'USD'
        },
        {
          id: '2',
          date: today.toISOString().split('T')[0],
          time: '22:00',
          ulke: 'ABD',
          olay: 'Fed Faiz Kararı',
          etki: 'high',
          previous: '5.25%',
          forecast: '5.50%',
          actual: '',
          impact: 'high',
          currency: 'USD'
        },
        {
          id: '3',
          date: tomorrow.toISOString().split('T')[0],
          time: '11:00',
          ulke: 'Avrupa',
          olay: 'ECB Toplantısı',
          etki: 'high',
          previous: '4.00%',
          forecast: '4.25%',
          actual: '',
          impact: 'high',
          currency: 'EUR'
        },
        {
          id: '4',
          date: tomorrow.toISOString().split('T')[0],
          time: '14:00',
          ulke: 'Türkiye',
          olay: 'TCMB Faiz Kararı',
          etki: 'high',
          previous: '45.00%',
          forecast: '40.00%',
          actual: '',
          impact: 'high',
          currency: 'TRY'
        },
        {
          id: '5',
          date: dayAfter.toISOString().split('T')[0],
          time: '16:30',
          ulke: 'ABD',
          olay: 'NFP İstihdam Verisi',
          etki: 'high',
          previous: '150K',
          forecast: '180K',
          actual: '',
          impact: 'high',
          currency: 'USD'
        },
        {
          id: '6',
          date: today.toISOString().split('T')[0],
          time: '14:30',
          ulke: 'ABD',
          olay: 'Tüketici Fiyat Endeksi (CPI)',
          etki: 'high',
          previous: '3.2%',
          forecast: '3.1%',
          actual: '3.4%',
          impact: 'high',
          currency: 'USD'
        },
        {
          id: '7',
          date: tomorrow.toISOString().split('T')[0],
          time: '10:00',
          ulke: 'Avrupa',
          olay: 'Almanya GDP',
          etki: 'medium',
          previous: '0.2%',
          forecast: '0.3%',
          actual: '',
          impact: 'medium',
          currency: 'EUR'
        }
      ]

      // Konfigürasyona göre filtrele
      const filteredEvents = mockEvents.filter(event => {
        const currencyMatch = this.config.currencies.includes(event.currency)
        const impactMatch = this.config.impacts.includes(event.etki)
        const dateMatch = new Date(event.date) >= this.config.dateRange.from &&
                          new Date(event.date) <= this.config.dateRange.to
        
        return currencyMatch && impactMatch && dateMatch
      })

      return {
        success: true,
        events: filteredEvents,
        lastUpdate: new Date().toISOString(),
        error: undefined
      }
    } catch (error) {
      return {
        success: false,
        events: [],
        lastUpdate: '',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      }
    }
  }

  // Bugün yüksek etkili olayları getir
  async getTodayHighImpactEvents(): Promise<EconomicEvent[]> {
    try {
      const response = await this.getEconomicEvents()
      if (!response.success) return []
      
      const today = new Date().toISOString().split('T')[0]
      return response.events.filter(event => 
        event.date === today && event.etki === 'high'
      )
    } catch (error) {
      console.error('Bugünkü yüksek etkili olaylar alınırken hata:', error)
      return []
    }
  }

  // Gelecek 24 saat yüksek etkili olayları getir
  async getUpcomingHighImpactEvents(): Promise<EconomicEvent[]> {
    try {
      const response = await this.getEconomicEvents()
      if (!response.success) return []
      
      const now = new Date()
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      
      return response.events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate >= now && eventDate <= next24Hours && event.etki === 'high'
      })
    } catch (error) {
      console.error('Gelecek 24 saatteki yüksek etkili olaylar alınırken hata:', error)
      return []
    }
  }

  // Gerçek API entegrasyonu için bu fonksiyonlar kullanılabilir
  async fetchFromInvestingDotCom(): Promise<EconomicEvent[]> {
    // Investing.com API entegrasyonu
    return []
  }

  async fetchFromForexFactory(): Promise<EconomicEvent[]> {
    // ForexFactory API entegrasyonu
    return []
  }

  async fetchFromFinancialModelingPrep(): Promise<EconomicEvent[]> {
    // Financial Modeling Prep API entegrasyonu
    return []
  }
}

export const economicCalendarService = new EconomicCalendarService()