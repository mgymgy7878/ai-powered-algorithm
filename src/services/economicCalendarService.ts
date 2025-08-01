// Ekonomik Takvim Servisi - AI Trading Yöneticisi için
interface EconomicEvent {
  id: string
  date: string // YYYY-MM-DD formatında
  time: string // HH:MM formatında
  currency: string // USD, EUR, GBP, TRY vb.
  olay: string // Olay açıklaması
  etki: 'Yüksek' | 'Orta' | 'Düşük' // Piyasa etkisi
  onceki?: string // Önceki değer
  tahmin?: string // Beklenen değer
  gercek?: string // Gerçekleşen değer (sonradan güncellenir)
}

class EconomicCalendarService {
  private events: EconomicEvent[] = []

  constructor() {
    // Örnek ekonomik olaylar - gerçek uygulamada API'dan gelecek
    this.loadMockEvents()
  }

  private loadMockEvents() {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0]
    
    // Bugünkü mock olaylar
    this.events = [
      {
        id: '1',
        date: formatDate(today),
        time: '15:30',
        currency: 'USD',
        olay: 'Fed Faiz Kararı',
        etki: 'Yüksek',
        onceki: '5.25%',
        tahmin: '5.50%'
      },
      {
        id: '2',
        date: formatDate(today),
        time: '16:00',
        currency: 'USD',
        olay: 'İşsizlik Başvuruları',
        etki: 'Orta',
        onceki: '220K',
        tahmin: '225K'
      },
      {
        id: '3',
        date: formatDate(today),
        time: '14:00',
        currency: 'EUR',
        olay: 'ECB Başkanı Konuşması',
        etki: 'Yüksek'
      },
      // Yarınki olaylar
      {
        id: '4',
        date: formatDate(tomorrow),
        time: '08:30',
        currency: 'USD',
        olay: 'İstihdam Dışı Maaş Bordroları (NFP)',
        etki: 'Yüksek',
        onceki: '150K',
        tahmin: '180K'
      },
      {
        id: '5',
        date: formatDate(tomorrow),
        time: '10:00',
        currency: 'EUR',
        olay: 'GSYİH Büyüme Oranı',
        etki: 'Yüksek',
        onceki: '0.4%',
        tahmin: '0.5%'
      },
      {
        id: '6',
        date: formatDate(tomorrow),
        time: '13:30',
        currency: 'GBP',
        olay: 'İngiltere Enflasyon Verisi',
        etki: 'Yüksek',
        onceki: '4.2%',
        tahmin: '4.0%'
      }
    ]
  }

  // Bugünkü yüksek etkili olayları getir
  async getTodayHighImpactEvents(): Promise<EconomicEvent[]> {
    const today = new Date().toISOString().split('T')[0]
    
    return this.events.filter(event => 
      event.date === today && event.etki === 'Yüksek'
    ).sort((a, b) => a.time.localeCompare(b.time))
  }

  // Gelecek 24 saatteki yüksek etkili olayları getir
  async getUpcomingHighImpactEvents(): Promise<EconomicEvent[]> {
    const now = new Date()
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    const todayDate = now.toISOString().split('T')[0]
    const tomorrowDate = next24Hours.toISOString().split('T')[0]
    
    return this.events.filter(event => {
      const eventDate = event.date
      
      // Bugünkü olayları kontrol et (henüz geçmemiş olanlar)
      if (eventDate === todayDate) {
        const currentTime = now.getHours() * 60 + now.getMinutes()
        const [eventHour, eventMinute] = event.time.split(':').map(Number)
        const eventTimeMinutes = eventHour * 60 + eventMinute
        
        return eventTimeMinutes > currentTime && event.etki === 'Yüksek'
      }
      
      // Yarınki yüksek etkili olaylar
      return eventDate === tomorrowDate && event.etki === 'Yüksek'
    }).sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      return a.time.localeCompare(b.time)
    })
  }

  // Tüm ekonomik olayları getir (tarih aralığına göre)
  async getEventsByDateRange(startDate: string, endDate: string): Promise<EconomicEvent[]> {
    return this.events.filter(event => 
      event.date >= startDate && event.date <= endDate
    ).sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      return a.time.localeCompare(b.time)
    })
  }

  // Belirli para birimine ait olayları getir
  async getEventsByCurrency(currency: string): Promise<EconomicEvent[]> {
    return this.events.filter(event => 
      event.currency === currency
    ).sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date)
      }
      return a.time.localeCompare(b.time)
    })
  }

  // Gerçek uygulamada bu fonksiyonlar external API'lerden veri çekecek
  // Örnek: Investing.com API, ForexFactory API, Alpha Vantage vb.
  
  async refreshEventsFromAPI(): Promise<void> {
    try {
      // Gerçek API implementasyonu burada olacak
      console.log('Ekonomik takvim verileri güncelleniyor...')
      
      // Mock implementation - gerçekte API'dan veri çekilecek
      this.loadMockEvents()
      
      console.log('Ekonomik takvim başarıyla güncellendi')
    } catch (error) {
      console.error('Ekonomik takvim güncelleme hatası:', error)
      throw error
    }
  }

  // Piyasa volatilitesi tahmin fonksiyonu
  async getVolatilityForecast(): Promise<{ level: 'Düşük' | 'Orta' | 'Yüksek', reason: string }> {
    const todayEvents = await this.getTodayHighImpactEvents()
    const upcomingEvents = await this.getUpcomingHighImpactEvents()
    
    const totalHighImpactEvents = todayEvents.length + upcomingEvents.length
    
    if (totalHighImpactEvents >= 3) {
      return {
        level: 'Yüksek',
        reason: `${totalHighImpactEvents} adet yüksek etkili ekonomik olay yaklaşıyor. Piyasalarda artmış volatilite bekleniyor.`
      }
    } else if (totalHighImpactEvents >= 1) {
      return {
        level: 'Orta',
        reason: `${totalHighImpactEvents} adet yüksek etkili ekonomik olay var. Orta seviye volatilite beklentisi.`
      }
    } else {
      return {
        level: 'Düşük',
        reason: 'Yakın zamanda yüksek etkili ekonomik olay bulunmuyor. Düşük volatilite ortamı bekleniyor.'
      }
    }
  }

  // Strateji önerisi fonksiyonu
  async getStrategyRecommendation(): Promise<{
    recommendation: string,
    reasoning: string,
    actions: string[]
  }> {
    const volatilityForecast = await this.getVolatilityForecast()
    const todayEvents = await this.getTodayHighImpactEvents()
    
    switch (volatilityForecast.level) {
      case 'Yüksek':
        return {
          recommendation: 'Yüksek Volatilite Stratejisi',
          reasoning: 'Yaklaşan yüksek etkili ekonomik olaylar nedeniyle artmış volatilite bekleniyor.',
          actions: [
            'Grid bot stratejilerini durdurun',
            'Scalping ve momentum stratejilerini aktifleştirin',
            'Stop-loss seviyelerini daraltın',
            'Pozisyon boyutlarını %50 azaltın',
            'Haber sonrası ilk 15 dakika ekstra dikkatli olun'
          ]
        }
      
      case 'Orta':
        return {
          recommendation: 'Dengeli Strateji Yaklaşımı',
          reasoning: 'Orta seviye volatilite beklentisi ile dengeli bir yaklaşım öneriliyor.',
          actions: [
            'Mevcut grid botlarını ayarlarını kontrol edin',
            'Range trading stratejileri değerlendirin',
            'ATR bazlı stop-loss kullanın',
            'Pozisyon boyutlarını normal seviyede tutun'
          ]
        }
      
      case 'Düşük':
        return {
          recommendation: 'Düşük Volatilite Stratejisi',
          reasoning: 'Sakin piyasa ortamında range ve grid stratejileri ideal.',
          actions: [
            'Grid bot stratejilerini aktifleştirin',
            'Range trading botlarını çalıştırın',
            'Carry trade pozisyonları düşünün',
            'Uzun vadeli trend takip stratejileri uygulayın',
            'Pozisyon boyutlarını artırabilirsiniz'
          ]
        }
      
      default:
        return {
          recommendation: 'Standart Strateji',
          reasoning: 'Genel piyasa koşulları için standart yaklaşım.',
          actions: [
            'Mevcut stratejileri koruyun',
            'Piyasa koşullarını yakından takip edin'
          ]
        }
    }
  }
}

// Singleton instance
export const economicCalendarService = new EconomicCalendarService()

// Type exports
export type { EconomicEvent }