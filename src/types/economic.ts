// Economic Calendar types for the AI Trading Platform

export interface EconomicEvent {
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

export interface EconomicCalendarConfig {
  currencies: string[]
  impacts: ('low' | 'medium' | 'high')[]
  dateRange: {
    from: Date
    to: Date
  }
  autoRefresh: boolean
  refreshInterval: number // minutes
  showNotifications: boolean
}

export interface EconomicAlert {
  id: string
  eventId: string
  type: 'before' | 'after' | 'deviation'
  minutes?: number // for 'before' type
  threshold?: number // for 'deviation' type (percentage)
  enabled: boolean
  created: Date
}

export interface EconomicNotification {
  id: string
  eventId: string
  message: string
  type: 'info' | 'warning' | 'critical'
  timestamp: Date
  read: boolean
}