// Ekonomik takvim servisi - AI Trading Yöneticisi için
export interface EconomicEvent {
  id: string
  date: string
  time: string
  currency: string
  olay: string // Event name in Turkish
  etki: 'Düşük' | 'Orta' | 'Yüksek' // Impact level
  beklenen?: string // Expected value
  onceki?: string // Previous value
  gercek?: string // Actual value
}

// API compatible interface
export interface EconomicEventAPI {
  id: string
  date: string
  time: string
  currency: string
  event: string
  impact: 'low' | 'medium' | 'high'
  forecast?: string
  previous?: string
  actual?: string
  country?: string
  category?: string
}

class EconomicCalendarService {
  private mockEvents: EconomicEvent[] = [
    {
      id: '1',
      date: new Date().toLocaleDateString('tr-TR'),
      time: '14:30',
      currency: 'USD',
      olay: 'Fed Faiz Kararı',
      etki: 'Yüksek',
      beklenen: '5.50%',
      onceki: '5.25%'
    },
    {
      id: '2',
      date: new Date().toLocaleDateString('tr-TR'),
      time: '16:00',
      currency: 'USD', 
      olay: 'İşsizlik Başvuruları',
      etki: 'Orta',
      beklenen: '220K',
      onceki: '215K'
    },
    {
      id: '3',
      date: new Date(Date.now() + 24*60*60*1000).toLocaleDateString('tr-TR'),
      time: '10:00',
      currency: 'EUR',
      olay: 'ECB Toplantısı',
      etki: 'Yüksek',
      beklenen: '4.25%',
      onceki: '4.00%'
    },
    {
      id: '4',
      date: new Date(Date.now() + 12*60*60*1000).toLocaleDateString('tr-TR'),
      time: '22:30',
      currency: 'USD',
      olay: 'Tüketici Fiyat Endeksi (CPI)',
      etki: 'Yüksek',
      beklenen: '3.2%',
      onceki: '3.0%'
    }
  ]

  private config: any = {}

  setConfig(config: any) {
    this.config = config
  }

  /**
   * Bugünkü yüksek etkili ekonomik olayları getir
   */
  async getTodayHighImpactEvents(): Promise<EconomicEvent[]> {
    const today = new Date().toLocaleDateString('tr-TR')
    return this.mockEvents.filter(event => 
      event.date === today && event.etki === 'Yüksek'
    )
  }

  /**
   * Gelecek 24 saatteki yüksek etkili olayları getir
   */
  async getUpcomingHighImpactEvents(): Promise<EconomicEvent[]> {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24*60*60*1000)
    
    return this.mockEvents.filter(event => {
      const eventDate = new Date(event.date.split('.').reverse().join('-'))
      return eventDate >= now && eventDate <= tomorrow && event.etki === 'Yüksek'
    })
  }

  /**
   * Tüm ekonomik olayları getir (haftalık)
   */
  async getWeeklyEvents(): Promise<EconomicEvent[]> {
    // Gerçek implementasyonda bu bir API çağrısı olacak
    return this.mockEvents
  }

  /**
   * Belirli bir para biriminin olaylarını getir
   */
  async getEventsByCurrency(currency: string): Promise<EconomicEvent[]> {
    return this.mockEvents.filter(event => 
      event.currency.toUpperCase() === currency.toUpperCase()
    )
  }

  /**
   * Olay etkisine göre filtrele
   */
  async getEventsByImpact(impact: 'Düşük' | 'Orta' | 'Yüksek'): Promise<EconomicEvent[]> {
    return this.mockEvents.filter(event => event.etki === impact)
  }

  /**
   * API compatible event fetcher - for EconomicCalendar component
   */
  async fetchEvents(): Promise<EconomicEventAPI[]> {
    // Convert Turkish events to API format
    return this.mockEvents.map(event => ({
      id: event.id,
      date: event.date,
      time: event.time,
      currency: event.currency,
      event: event.olay,
      impact: event.etki === 'Yüksek' ? 'high' : event.etki === 'Orta' ? 'medium' : 'low',
      forecast: event.beklenen,
      previous: event.onceki,
      actual: event.gercek,
      country: event.currency === 'USD' ? 'US' : event.currency === 'EUR' ? 'EU' : 'TR',
      category: 'monetary-policy'
    }))
  }
}

export const economicCalendarService = new EconomicCalendarService()