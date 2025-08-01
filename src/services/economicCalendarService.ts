// Ekonomik Takvim Servisi
// Bu servis yüksek etkili ekonomik olayları sağlar

export interface EconomicEvent {
  id: string
  date: string
  time: string
  olay: string
  currency: string
  etki: 'Düşük' | 'Orta' | 'Yüksek'
  onceki?: string
  tahmin?: string
  gercek?: string
}

class EconomicCalendarService {
  // Mock veri - gerçek uygulamada API'den gelecek
  private mockEvents: EconomicEvent[] = [
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      time: '15:30',
      olay: 'Fed Faiz Kararı',
      currency: 'USD',
      etki: 'Yüksek',
      onceki: '5.50%',
      tahmin: '5.50%'
    },
    {
      id: '2',
      date: new Date().toISOString().split('T')[0],
      time: '16:00',
      olay: 'İşsizlik Başvuruları',
      currency: 'USD',
      etki: 'Yüksek',
      onceki: '220K',
      tahmin: '215K'
    },
    {
      id: '3',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00',
      olay: 'Enflasyon Verisi (TÜFE)',
      currency: 'EUR',
      etki: 'Yüksek',
      onceki: '2.9%',
      tahmin: '2.7%'
    },
    {
      id: '4',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '14:30',
      olay: 'İmalat PMI',
      currency: 'GBP',
      etki: 'Orta',
      onceki: '45.2',
      tahmin: '46.0'
    }
  ]

  /**
   * Bugünkü yüksek etkili ekonomik olayları getirir
   */
  async getTodayHighImpactEvents(): Promise<EconomicEvent[]> {
    await this.simulateApiDelay()
    
    const today = new Date().toISOString().split('T')[0]
    return this.mockEvents.filter(event => 
      event.date === today && event.etki === 'Yüksek'
    )
  }

  /**
   * Gelecek 24 saatteki yüksek etkili olayları getirir
   */
  async getUpcomingHighImpactEvents(): Promise<EconomicEvent[]> {
    await this.simulateApiDelay()
    
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    return this.mockEvents.filter(event => 
      event.date === tomorrow && event.etki === 'Yüksek'
    )
  }

  /**
   * Bu haftaki tüm ekonomik olayları getirir
   */
  async getWeeklyEvents(): Promise<EconomicEvent[]> {
    await this.simulateApiDelay()
    
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6))
    
    return this.mockEvents.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= startOfWeek && eventDate <= endOfWeek
    })
  }

  /**
   * Belirli bir para birimine ait olayları getirir
   */
  async getEventsByCurrency(currency: string): Promise<EconomicEvent[]> {
    await this.simulateApiDelay()
    
    return this.mockEvents.filter(event => 
      event.currency.toLowerCase() === currency.toLowerCase()
    )
  }

  /**
   * Sadece yüksek etkili olayları getirir
   */
  async getHighImpactEvents(): Promise<EconomicEvent[]> {
    await this.simulateApiDelay()
    
    return this.mockEvents.filter(event => event.etki === 'Yüksek')
  }

  /**
   * API çağrısı simülasyonu için gecikme
   */
  private async simulateApiDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Yeni ekonomik olay ekle (test amaçlı)
   */
  addEvent(event: Omit<EconomicEvent, 'id'>): void {
    const newEvent: EconomicEvent = {
      ...event,
      id: Date.now().toString()
    }
    this.mockEvents.push(newEvent)
  }

  /**
   * Tüm olayları getirir
   */
  async getAllEvents(): Promise<EconomicEvent[]> {
    await this.simulateApiDelay()
    return [...this.mockEvents]
  }
}

export const economicCalendarService = new EconomicCalendarService()