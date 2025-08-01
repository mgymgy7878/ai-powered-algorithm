// Ekonomik Takvim Tipleri
export interface EconomicEvent {
  id: string
  date: string
  time: string
  currency: string
  impact: 'low' | 'medium' | 'high'
  event: string
  actual?: string
  forecast?: string
  previous?: string
  country: string
  // Türkçe alanlar
  olay: string
  ulke: string
  etki: 'düşük' | 'orta' | 'yüksek'
  aciklama?: string
}

export interface EconomicCalendarConfig {
  currencies: string[] // USD, EUR, GBP, TRY
  impacts: ('low' | 'medium' | 'high')[]
  dateRange: {
    from: Date
    to: Date
  }
  autoRefresh: boolean
  refreshInterval: number // dakika
}

export interface EconomicAlert {
  id: string
  eventId: string
  alertType: 'before' | 'after' | 'changed'
  minutesBefore?: number
  enabled: boolean
  message: string
  actions?: {
    pauseStrategies?: boolean
    sendNotification?: boolean
    executeStrategy?: string
  }
}

export interface EconomicCalendarResponse {
  success: boolean
  events: EconomicEvent[]
  lastUpdate: string
  error?: string
}