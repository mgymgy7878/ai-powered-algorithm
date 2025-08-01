export interface EconomicEvent {
  id: string
  date: string
  time: string
  olay: string
  currency: string
  etki: 'Düşük' | 'Orta' | 'Yüksek'
  onceki?: string
  beklenen?: string
  gercek?: string
}

class EconomicCalendarService {
  private static instance: EconomicCalendarService
  private events: EconomicEvent[] = []

  private constructor() {
    this.initializeDemoData()
  }

  static getInstance(): EconomicCalendarService {
    if (!EconomicCalendarService.instance) {
      EconomicCalendarService.instance = new EconomicCalendarService()
    }
    return EconomicCalendarService.instance
  }

  private initializeDemoData() {
    // Demo ekonomik takvim verileri - gerçek entegrasyon için değiştirilecek
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    this.events = [
      {
        id: '1',
        date: today.toISOString().split('T')[0],
        time: '15:30',
        olay: 'ABD İstihdam Dışı Tarım İstihdamı (NFP)',
        currency: 'USD',
        etki: 'Yüksek',
        onceki: '150K',
        beklenen: '180K',
        gercek: ''
      },
      {
        id: '2',
        date: today.toISOString().split('T')[0],
        time: '14:15',
        olay: 'Avrupa Merkez Bankası Faiz Kararı',
        currency: 'EUR',
        etki: 'Yüksek',
        onceki: '4.50%',
        beklenen: '4.25%',
        gercek: ''
      },
      {
        id: '3',
        date: tomorrow.toISOString().split('T')[0],
        time: '16:00',
        olay: 'ABD Tüketici Fiyat Endeksi (CPI)',
        currency: 'USD',
        etki: 'Yüksek',
        onceki: '3.2%',
        beklenen: '3.1%',
        gercek: ''
      },
      {
        id: '4',
        date: tomorrow.toISOString().split('T')[0],
        time: '13:45',
        olay: 'İngiltere GSYİH (QoQ)',
        currency: 'GBP',
        etki: 'Yüksek',
        onceki: '0.6%',
        beklenen: '0.4%',
        gercek: ''
      }
    ]
  }

  async getTodayHighImpactEvents(): Promise<EconomicEvent[]> {
    const today = new Date().toISOString().split('T')[0]
    return this.events.filter(event => 
      event.date === today && event.etki === 'Yüksek'
    )
  }

  async getUpcomingHighImpactEvents(): Promise<EconomicEvent[]> {
    const now = new Date()
    const next24Hours = new Date(now)
    next24Hours.setHours(next24Hours.getHours() + 24)

    return this.events.filter(event => {
      const eventDate = new Date(`${event.date}T${event.time}:00`)
      return eventDate >= now && eventDate <= next24Hours && event.etki === 'Yüksek'
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00`)
      const dateB = new Date(`${b.date}T${b.time}:00`)
      return dateA.getTime() - dateB.getTime()
    })
  }

  async getAllEvents(): Promise<EconomicEvent[]> {
    return [...this.events].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00`)
      const dateB = new Date(`${b.date}T${b.time}:00`)
      return dateA.getTime() - dateB.getTime()
    })
  }

  async getEventsByDate(date: string): Promise<EconomicEvent[]> {
    return this.events.filter(event => event.date === date)
  }

  async getEventsByCurrency(currency: string): Promise<EconomicEvent[]> {
    return this.events.filter(event => event.currency === currency)
  }

  async addEvent(event: Omit<EconomicEvent, 'id'>): Promise<EconomicEvent> {
    const newEvent: EconomicEvent = {
      ...event,
      id: Date.now().toString()
    }
    this.events.push(newEvent)
    return newEvent
  }

  async updateEvent(id: string, updates: Partial<EconomicEvent>): Promise<EconomicEvent | null> {
    const index = this.events.findIndex(event => event.id === id)
    if (index === -1) return null

    this.events[index] = { ...this.events[index], ...updates }
    return this.events[index]
  }

  async deleteEvent(id: string): Promise<boolean> {
    const index = this.events.findIndex(event => event.id === id)
    if (index === -1) return false

    this.events.splice(index, 1)
    return true
  }

  // Gerçek API entegrasyonu için placeholder metodlar
  async fetchFromExternalAPI(): Promise<EconomicEvent[]> {
    // Burada gerçek ekonomik takvim API'ından veri çekilecek
    // Örnek: ForexFactory, Investing.com, Financial Modeling Prep vs.
    console.log('Economic calendar: External API integration not implemented yet')
    return this.events
  }

  async refreshData(): Promise<void> {
    try {
      // Gerçek implementasyonda burada external API'dan yeni veriler çekilecek
      const freshData = await this.fetchFromExternalAPI()
      this.events = freshData
      console.log('Economic calendar data refreshed')
    } catch (error) {
      console.error('Failed to refresh economic calendar data:', error)
    }
  }
}

export const economicCalendarService = EconomicCalendarService.getInstance()