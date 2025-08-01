export interface EconomicEvent {
  id: string
  date: string
  time: string
  ulke: string // country -> ulke (Türkçe arayüz için)
  olay: string // event -> olay  
  etki: 'low' | 'medium' | 'high' // importance -> etki
  previous?: string
  forecast?: string
  actual?: string
  impact: 'low' | 'medium' | 'high'
  currency: string
}

export interface EconomicCalendarConfig {
  currencies: string[]
  impacts: ('low' | 'medium' | 'high')[]
  dateRange: {
    from: Date
    to: Date
  }
  autoRefresh: boolean
  refreshInterval: number
}

export interface EconomicAlert {
  id: string
  eventId: string
  alertType: 'before' | 'after'
  minutesBefore: number
  enabled: boolean
  message: string
  actions: {
    pauseStrategies: boolean
    sendNotification: boolean
  }
}

export interface EconomicCalendarProps {
  className?: string
}