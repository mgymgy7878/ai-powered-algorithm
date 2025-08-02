import { useEffect } from 'react'
import { TradingAssistant } from '../ai/TradingAssistant'
import { NotificationCenter } from '../ui/NotificationCenter'
import { useActivity } from '../../contexts/ActivityContext'

// Import all dashboard modules
import { WatchlistPanel } from './modules/WatchlistPanel'
import { AIPredictionPanel } from './modules/AIPredictionPanel'
import { TechnicalSignalsPanel } from './modules/TechnicalSignalsPanel'
import { RiskAlertsPanel } from './modules/RiskAlertsPanel'
import { NewsPanel } from './modules/NewsPanel'
import { EconomicCalendarPanel } from './modules/EconomicCalendarPanel'
import { StrategyPerformancePanel } from './modules/StrategyPerformancePanel'
import { PortfolioAllocationPanel } from './modules/PortfolioAllocationPanel'
import { RecentTradesPanel } from './modules/RecentTradesPanel'
import { QuickActionsPanel } from './modules/QuickActionsPanel'

export function Dashboard() {
  const { activities, addActivity } = useActivity()
  
  // Demo bildirimler sistemi
  useEffect(() => {
    const sendInitialNotification = () => {
      if (typeof (window as any).pushNotification === 'function') {
        (window as any).pushNotification('🚀 AI Trading Platformu aktif! Tüm sistemler çalışıyor.', 'success')
      } else {
        console.warn('pushNotification fonksiyonu henüz hazır değil')
      }
    }

    setTimeout(sendInitialNotification, 3000)

    const interval = setInterval(() => {
      if (typeof (window as any).pushNotification === 'function') {
        const demoNotifications = [
          { message: '📊 BTCUSDT için güçlü alım sinyali tespit edildi.', type: 'info' },
          { message: '🤖 Grid Bot stratejisi pozisyon güncelledi.', type: 'success' },
          { message: '⚠️ Yüksek volatilite bekleniyor - pozisyonları gözden geçirin.', type: 'warning' },
          { message: '🎯 ETHUSDT için RSI aşırı satım sinyali.', type: 'info' }
        ]
        
        const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)]
        ;(window as any).pushNotification(randomNotification.message, randomNotification.type)
      }
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  // Ana metrikler - kompakt görünüm
  const mainMetrics = [
    { label: "Portföy Değeri", value: "$50,000.00", color: "text-blue-700" },
    { label: "Günlük K/Z", value: "$1,250.50", color: "text-green-600" },
    { label: "Toplam K/Z", value: "$8,750.25", color: "text-green-600" },
    { label: "Başarı Oranı", value: "68.50%", color: "text-blue-600" },
    { label: "Aktif Stratejiler", value: "3", color: "text-primary" }
  ]

  return (
    <div className="relative min-h-screen bg-background">
      {/* Üst Panel - Metrikler ve Bildirim Merkezi */}
      <div className="absolute top-2 left-14 right-4 z-40 flex items-center gap-1 overflow-hidden">
        {/* Kompakt metrik kutuları */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {mainMetrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-muted/60 rounded-md px-2 py-1 text-[10px] min-w-[90px] text-center shadow-sm border border-border/20"
            >
              <p className="text-muted-foreground font-medium leading-tight truncate" title={metric.label}>
                {metric.label}
              </p>
              <p className={`font-semibold text-xs ${metric.color} leading-tight truncate`} title={metric.value}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {/* Bildirim Merkezi - Genişletilmiş */}
        <div className="flex-1 ml-2 z-50 min-w-0">
          <NotificationCenter />
        </div>
      </div>
      
      {/* AI Trading Yöneticisi - Sağ üst köşe */}
      <div className="absolute top-10 right-4 w-[280px] z-40">
        <TradingAssistant />
      </div>
      
      {/* Ana İçerik Grid Sistemi - Yüksek yoğunluklu modüler tasarım */}
      <div className="pl-4 pr-[300px] pt-12 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 mt-2">
          
          {/* Satır 1: Temel Piyasa Bilgileri */}
          <div className="lg:col-span-1">
            <WatchlistPanel />
          </div>
          
          <div className="lg:col-span-1">
            <AIPredictionPanel />
          </div>
          
          <div className="lg:col-span-1 xl:col-span-1">
            <TechnicalSignalsPanel />
          </div>
          
          {/* Satır 2: Risk ve Haberler */}
          <div className="lg:col-span-1">
            <RiskAlertsPanel />
          </div>
          
          <div className="lg:col-span-1">
            <NewsPanel />
          </div>
          
          <div className="lg:col-span-1 xl:col-span-1">
            <EconomicCalendarPanel />
          </div>
          
          {/* Satır 3: Performans ve Portföy */}
          <div className="lg:col-span-1">
            <StrategyPerformancePanel />
          </div>
          
          <div className="lg:col-span-1">
            <PortfolioAllocationPanel />
          </div>
          
          <div className="lg:col-span-1 xl:col-span-1">
            <RecentTradesPanel />
          </div>
          
          {/* Satır 4: Hızlı Eylemler - Tam genişlik */}
          <div className="lg:col-span-2 xl:col-span-3">
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Hızlı Erişim</h3>
              <QuickActionsPanel />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}