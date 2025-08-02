import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Calendar, Clock, Flag, AlertCircle } from 'lucide-react'

interface EconomicEvent {
  id: string
  title: string
  country: string
  flag: string
  time: Date
  impact: 'high' | 'medium' | 'low'
  description: string
  previous?: string
  forecast?: string
  actual?: string
}

export function EconomicCalendarPanel() {
  const [events, setEvents] = useState<EconomicEvent[]>([
    {
      id: '1',
      title: 'Fed Faiz Kararı',
      country: 'ABD',
      flag: '🇺🇸',
      time: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 saat sonra
      impact: 'high',
      description: 'Federal Reserve faiz oranı kararı',
      previous: '5.25%',
      forecast: '5.50%'
    },
    {
      id: '2',
      title: 'CPI Enflasyon',
      country: 'ABD',
      flag: '🇺🇸',
      time: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 saat sonra
      impact: 'high',
      description: 'Tüketici Fiyat Endeksi',
      previous: '3.2%',
      forecast: '3.1%'
    },
    {
      id: '3',
      title: 'İşsizlik Başvuruları',
      country: 'ABD',
      flag: '🇺🇸',
      time: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 saat sonra
      impact: 'medium',
      description: 'Haftalık işsizlik başvuru sayısı',
      previous: '220K',
      forecast: '215K'
    },
    {
      id: '4',
      title: 'ECB Başkan Konuşması',
      country: 'AB',
      flag: '🇪🇺',
      time: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 saat sonra
      impact: 'medium',
      description: 'Avrupa Merkez Bankası Başkanı konuşması',
    },
    {
      id: '5',
      title: 'GDP Büyüme',
      country: 'Çin',
      flag: '🇨🇳',
      time: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 gün sonra
      impact: 'high',
      description: 'Çeyreklik GDP büyüme oranı',
      previous: '5.2%',
      forecast: '5.0%'
    }
  ])

  const [currentTime, setCurrentTime] = useState(new Date())

  // Zamanı her saniye güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'border-red-500 bg-red-50'
      case 'medium':
        return 'border-yellow-500 bg-yellow-50'
      default:
        return 'border-blue-500 bg-blue-50'
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge variant="destructive" className="text-[10px] px-1 py-0">YÜKSEK</Badge>
      case 'medium':
        return <Badge variant="secondary" className="text-[10px] px-1 py-0 bg-yellow-100">ORTA</Badge>
      default:
        return <Badge variant="outline" className="text-[10px] px-1 py-0">DÜŞÜK</Badge>
    }
  }

  const getTimeUntilEvent = (eventTime: Date) => {
    const diff = eventTime.getTime() - currentTime.getTime()
    
    if (diff <= 0) {
      return { text: 'Geçti', color: 'text-gray-500', urgent: false }
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    if (hours < 1) {
      return { 
        text: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, 
        color: 'text-red-600', 
        urgent: true 
      }
    } else if (hours < 24) {
      return { 
        text: `${hours}sa ${minutes}dk`, 
        color: 'text-yellow-600', 
        urgent: hours < 3 
      }
    } else {
      const days = Math.floor(hours / 24)
      return { 
        text: `${days}g ${hours % 24}sa`, 
        color: 'text-blue-600', 
        urgent: false 
      }
    }
  }

  const formatEventTime = (time: Date) => {
    return time.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  // Olayları zamana göre sırala
  const sortedEvents = [...events].sort((a, b) => a.time.getTime() - b.time.getTime())

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          Ekonomik Takvim
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 max-h-[320px] overflow-y-auto">
          {sortedEvents.map((event) => {
            const timeInfo = getTimeUntilEvent(event.time)
            
            return (
              <div key={event.id} className={`p-2 rounded-lg border ${getImpactColor(event.impact)}`}>
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg">{event.flag}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-xs leading-tight">
                        {event.title}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  {getImpactBadge(event.impact)}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">
                      {formatEventTime(event.time)}
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-1 ${timeInfo.urgent ? 'animate-pulse' : ''}`}>
                    {timeInfo.urgent && <AlertCircle className="h-3 w-3 text-red-500" />}
                    <span className={`text-xs font-semibold ${timeInfo.color}`}>
                      {timeInfo.text}
                    </span>
                  </div>
                </div>
                
                {/* Önceki ve beklenen değerler */}
                {(event.previous || event.forecast) && (
                  <div className="mt-2 pt-1 border-t border-gray-200">
                    <div className="flex justify-between text-[10px]">
                      {event.previous && (
                        <span className="text-muted-foreground">
                          Önceki: <span className="font-medium">{event.previous}</span>
                        </span>
                      )}
                      {event.forecast && (
                        <span className="text-muted-foreground">
                          Beklenen: <span className="font-medium">{event.forecast}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}