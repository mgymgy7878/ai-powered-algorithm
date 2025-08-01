import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { AlertTriangle, Calendar, Clock, TrendingUp, RefreshCw, Settings, Bell } from '@phosphor-icons/react'
import { economicCalendarService } from '@/services/economicCalendarService'
import { EconomicEvent, EconomicCalendarConfig, EconomicAlert } from '@/types/economic'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

export function EconomicCalendar() {
  const [events, setEvents] = useState<EconomicEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [config, setConfig] = useKV<EconomicCalendarConfig>('economic-calendar-config', {
    currencies: ['USD', 'EUR', 'TRY'],
    impacts: ['medium', 'high'],
    dateRange: {
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    autoRefresh: true,
    refreshInterval: 30
  })
  const [alerts, setAlerts] = useKV<EconomicAlert[]>('economic-alerts', [])

  useEffect(() => {
    fetchEvents()
    
    // Auto refresh
    let interval: NodeJS.Timeout
    if (config.autoRefresh) {
      interval = setInterval(fetchEvents, config.refreshInterval * 60 * 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [config])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      economicCalendarService.setConfig(config)
      const result = await economicCalendarService.getEconomicEvents()
      
      if (result.success) {
        setEvents(result.events)
        setLastUpdate(result.lastUpdate)
        toast.success(`${result.events.length} ekonomik olay güncellendi`)
      } else {
        toast.error(result.error || 'Veri alınamadı')
      }
    } catch (error) {
      console.error('Ekonomik takvim hatası:', error)
      toast.error('Ekonomik takvim güncellenemedi')
    } finally {
      setLoading(false)
    }
  }

  const getImpactColor = (impact: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getImpactIcon = (impact: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'high': return <AlertTriangle className="w-4 h-4" />
      case 'medium': return <TrendingUp className="w-4 h-4" />
      case 'low': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredEvents = events.filter(event => 
    !selectedDate || event.date === selectedDate
  )

  const todayHighImpact = events.filter(event => 
    event.date === new Date().toISOString().split('T')[0] && 
    event.impact === 'high'
  )

  const upcomingHighImpact = events.filter(event => {
    const eventDate = new Date(event.date)
    const today = new Date()
    const next24h = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    return eventDate >= today && eventDate <= next24h && event.impact === 'high'
  })

  const updateConfig = (updates: Partial<EconomicCalendarConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const addAlert = (eventId: string) => {
    const newAlert: EconomicAlert = {
      id: Date.now().toString(),
      eventId,
      alertType: 'before',
      minutesBefore: 30,
      enabled: true,
      message: 'Önemli ekonomik olay yaklaşıyor',
      actions: {
        pauseStrategies: true,
        sendNotification: true
      }
    }
    setAlerts(prev => [...prev, newAlert])
    toast.success('Uyarı eklendi')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ekonomik Takvim</h1>
          <p className="text-muted-foreground">
            Piyasayı etkileyebilecek önemli ekonomik olayları takip edin
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={fetchEvents} 
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Son güncelleme: {new Date(lastUpdate).toLocaleTimeString('tr-TR')}
            </span>
          )}
        </div>
      </div>

      {/* Hızlı Özet */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bugün Yüksek Etki</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {todayHighImpact.length}
            </div>
            <p className="text-xs text-muted-foreground">kritik olay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sonraki 24 Saat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {upcomingHighImpact.length}
            </div>
            <p className="text-xs text-muted-foreground">yaklaşan olay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Olay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.length}
            </div>
            <p className="text-xs text-muted-foreground">bu hafta</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">
            <Calendar className="w-4 h-4 mr-2" />
            Takvim
          </TabsTrigger>
          <TabsTrigger value="alerts">
            <Bell className="w-4 h-4 mr-2" />
            Uyarılar
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Ayarlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          {/* Filtreler */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Tarih:</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-36"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Para Birimi:</label>
              <Select 
                value={config.currencies.join(',')} 
                onValueChange={(value) => updateConfig({ currencies: value.split(',') })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD,EUR,TRY">Ana Para Birimleri</SelectItem>
                  <SelectItem value="USD">Sadece USD</SelectItem>
                  <SelectItem value="EUR">Sadece EUR</SelectItem>
                  <SelectItem value="TRY">Sadece TRY</SelectItem>
                  <SelectItem value="USD,EUR,GBP,TRY,JPY">Tümü</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Etki Seviyesi:</label>
              <Select 
                value={config.impacts.join(',')} 
                onValueChange={(value) => updateConfig({ impacts: value.split(',') as any })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Sadece Yüksek</SelectItem>
                  <SelectItem value="medium,high">Orta + Yüksek</SelectItem>
                  <SelectItem value="low,medium,high">Tümü</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Olay Listesi */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate ? 
                  `${new Date(selectedDate).toLocaleDateString('tr-TR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} Olayları` 
                  : 'Tüm Olaylar'
                }
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filteredEvents.length} olay)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Seçilen kriterlere uygun olay bulunamadı
                    </div>
                  ) : (
                    filteredEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            {getImpactIcon(event.impact)}
                            <Badge variant={getImpactColor(event.impact) as any}>
                              {event.etki}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </div>
                          
                          <Badge variant="outline" className="text-xs">
                            {event.currency}
                          </Badge>
                        </div>

                        <div className="flex-1 mx-4">
                          <div className="font-medium">{event.olay}</div>
                          <div className="text-sm text-muted-foreground">{event.ulke}</div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          {event.previous && (
                            <div className="text-center">
                              <div className="text-muted-foreground">Önceki</div>
                              <div className="font-medium">{event.previous}</div>
                            </div>
                          )}
                          {event.forecast && (
                            <div className="text-center">
                              <div className="text-muted-foreground">Tahmin</div>
                              <div className="font-medium">{event.forecast}</div>
                            </div>
                          )}
                          {event.actual && (
                            <div className="text-center">
                              <div className="text-muted-foreground">Fiili</div>
                              <div className="font-medium text-primary">{event.actual}</div>
                            </div>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addAlert(event.id)}
                          className="ml-2"
                        >
                          <Bell className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Olay Uyarıları</CardTitle>
              <p className="text-sm text-muted-foreground">
                Önemli ekonomik olaylar için otomatik uyarı ve akisyonlar ayarlayın
              </p>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {alerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Henüz uyarı eklenmemiş
                    </div>
                  ) : (
                    alerts.map((alert) => {
                      const event = events.find(e => e.id === alert.eventId)
                      return (
                        <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{event?.olay || 'Olay bulunamadı'}</div>
                            <div className="text-sm text-muted-foreground">
                              {alert.minutesBefore} dakika öncesinde uyar
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch 
                              checked={alert.enabled}
                              onCheckedChange={(checked) => {
                                setAlerts(prev => prev.map(a => 
                                  a.id === alert.id ? { ...a, enabled: checked } : a
                                ))
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setAlerts(prev => prev.filter(a => a.id !== alert.id))
                                toast.success('Uyarı silindi')
                              }}
                            >
                              Sil
                            </Button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Takvim Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Otomatik Yenileme</label>
                  <p className="text-xs text-muted-foreground">
                    Veriler otomatik olarak güncellensin
                  </p>
                </div>
                <Switch
                  checked={config.autoRefresh}
                  onCheckedChange={(checked) => updateConfig({ autoRefresh: checked })}
                />
              </div>

              {config.autoRefresh && (
                <div>
                  <label className="text-sm font-medium">Yenileme Aralığı (dakika)</label>
                  <Input
                    type="number"
                    value={config.refreshInterval}
                    onChange={(e) => updateConfig({ refreshInterval: parseInt(e.target.value) || 30 })}
                    min="5"
                    max="120"
                    className="w-24 mt-1"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Varsayılan Para Birimleri</label>
                <div className="mt-2 space-y-2">
                  {['USD', 'EUR', 'GBP', 'TRY', 'JPY'].map(currency => (
                    <div key={currency} className="flex items-center gap-2">
                      <Switch
                        checked={config.currencies.includes(currency)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateConfig({ currencies: [...config.currencies, currency] })
                          } else {
                            updateConfig({ currencies: config.currencies.filter(c => c !== currency) })
                          }
                        }}
                      />
                      <span className="text-sm">{currency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}