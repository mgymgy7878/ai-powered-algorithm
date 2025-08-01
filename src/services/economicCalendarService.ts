export interface EconomicEvent {
  id: string
  date: string
  time: string
  olay: string
  currency: string
  etki: 'Yüksek' | 'Orta' | 'Düşük'
  onceki?: string
  beklenti?: string
  gercek?: string
}

class EconomicCalendarService {
  
  // Mock veri - gerçek bir ekonomik takvim API'si ile değiştirilebilir
  private getMockEvents(): EconomicEvent[] {
    return [
      {
        id: '1',
        date: new Date().toLocaleDateString('tr-TR'),
        time: '14:30',
        olay: 'ABD İstihdam Verileri',
        currency: 'USD',
        etki: 'Yüksek',
        onceki: '3.7%',
        beklenti: '3.6%'
      },
      {
        id: '2',
        date: new Date().toLocaleDateString('tr-TR'),
        time: '16:00',
        olay: 'Fed Faiz Kararı',
        currency: 'USD',
        etki: 'Yüksek',
        onceki: '5.25%',
        beklenti: '5.50%'
      },
      {
        id: '3',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        time: '09:00',
        olay: 'ECB Enflasyon Verisi',
        currency: 'EUR',
        etki: 'Yüksek',
        onceki: '2.9%',
        beklenti: '3.1%'
      },
      {
        id: '4',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        time: '11:30',
        olay: 'İngiltere GSYİH',
        currency: 'GBP',
        etki: 'Orta',
        onceki: '0.2%',
        beklenti: '0.3%'
      }
    ]
  }
  
  async getTodayHighImpactEvents(): Promise<EconomicEvent[]> {
    // Gerçek implementasyon için ekonomik takvim API'si kullanılabilir
    const allEvents = this.getMockEvents()
    const today = new Date().toLocaleDateString('tr-TR')
    
    return allEvents.filter(event => 
      event.date === today && event.etki === 'Yüksek'
    )
  }
  
  async getUpcomingHighImpactEvents(): Promise<EconomicEvent[]> {
    const allEvents = this.getMockEvents()
    const today = new Date()
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    
    return allEvents.filter(event => {
      const eventDate = new Date(event.date.split('.').reverse().join('-'))
      return eventDate >= today && eventDate <= tomorrow && event.etki === 'Yüksek'
    })
  }
  
  async getAllEvents(): Promise<EconomicEvent[]> {
    return this.getMockEvents()
  }
  
  async getEventsByDate(date: string): Promise<EconomicEvent[]> {
    const allEvents = this.getMockEvents()
    return allEvents.filter(event => event.date === date)
  }
  
  async getEventsByCurrency(currency: string): Promise<EconomicEvent[]> {
    const allEvents = this.getMockEvents()
    return allEvents.filter(event => event.currency === currency)
  }

  // Gerçek API entegrasyonu için örnek fonksiyon
  async fetchRealTimeEvents(): Promise<EconomicEvent[]> {
    try {
      // Örnek: ForexFactory, Investing.com veya benzeri bir API çağrısı
      // const response = await fetch('https://api.forexfactory.com/calendar', { ... })
      // const data = await response.json()
      // return this.parseAPIResponse(data)
      
      // Şimdilik mock data döndür
      return this.getMockEvents()
    } catch (error) {
      console.error('Ekonomik takvim API hatası:', error)
      return []
    }
  }
}

export const economicCalendarService = new EconomicCalendarService()