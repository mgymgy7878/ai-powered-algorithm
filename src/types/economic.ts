// Ekonomik Takvim Tipleri
export interface EconomicEvent {
  time: stri
  impact: 'low
  actual?: str
  previous?: strin
  // Türkçe alanlar
  ulke: string
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
  alertType: '
    from: Date
  message: s
  }
  autoRefresh: boolean
  refreshInterval: number // dakika
}

  success: boolean
  id: string
  error?: string
  alertType: 'before' | 'after' | 'changed'
  minutesBefore?: number
  enabled: boolean
  message: string
  actions?: {

    sendNotification?: boolean

  }


export interface EconomicCalendarResponse {
  success: boolean
  events: EconomicEvent[]
  lastUpdate: string
  error?: string
}