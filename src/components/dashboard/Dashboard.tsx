import { useEffect, useState } from 'react'
import { TradingAssistant } from '../ai/TradingAssistant'
import { NotificationCenter } from '../ui/NotificationCenter'
import { useActivity } from '../../contexts/ActivityContext'
import { CompactModule } from './CompactModule'
import { useAIWatch, MarketData, TechnicalSignal, RiskAlert, NewsItem, EconomicEvent } from '../../services/aiWatchService'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  AlertTriangle, 
  Activity,
  Newspaper,
  Calendar,
  PieChart,
  History,
  Target
} from 'lucide-react'

export function Dashboard() {
  const { activities, addActivity } = useActivity()
  const { isActive, startWatching, stopWatching, subscribe, unsubscribe } = useAIWatch()
  
  // State for each module
  const [watchlistData, setWatchlistData] = useState<MarketData[]>([])
  const [predictionData, setPredictionData] = useState<any[]>([])
  const [signalsData, setSignalsData] = useState<TechnicalSignal[]>([])
  const [riskData, setRiskData] = useState<RiskAlert[]>([])
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [economicData, setEconomicData] = useState<EconomicEvent[]>([])
  
  // Selected module for detailed view
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  // Start AI watching on component mount
  useEffect(() => {
    startWatching(['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'BNBUSDT'])
    
    // Subscribe to data updates
    subscribe('watchlist', setWatchlistData)
    subscribe('prediction', setPredictionData)
    subscribe('signals', setSignalsData)
    subscribe('risk', setRiskData)
    subscribe('news', setNewsData)
    subscribe('economic', setEconomicData)
    
    return () => {
      stopWatching()
      unsubscribe('watchlist', setWatchlistData)
      unsubscribe('prediction', setPredictionData)
      unsubscribe('signals', setSignalsData)
      unsubscribe('risk', setRiskData)
      unsubscribe('news', setNewsData)
      unsubscribe('economic', setEconomicData)
    }
  }, [])
  
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

  // Get latest data for compact display
  const getWatchlistSummary = () => {
    if (watchlistData.length === 0) return { value: "Yükleniyor...", status: 'neutral' as const }
    
    const btc = watchlistData.find(item => item.symbol === 'BTCUSDT')
    if (btc) {
      return {
        value: `$${btc.price.toLocaleString()}`,
        subtitle: `${btc.change24h >= 0 ? '+' : ''}${btc.change24h.toFixed(2)}%`,
        status: btc.change24h >= 0 ? 'positive' as const : 'negative' as const
      }
    }
    
    return { value: "BTC Takip Ediliyor", status: 'neutral' as const }
  }

  const getPredictionSummary = () => {
    if (predictionData.length === 0) return { value: "AI Analiz Ediyor...", status: 'neutral' as const }
    
    const btcPred = predictionData.find(item => item.symbol === 'BTCUSDT')
    if (btcPred) {
      return {
        value: `${btcPred.direction === 'up' ? '▲' : btcPred.direction === 'down' ? '▼' : '→'} %${btcPred.confidence}`,
        subtitle: btcPred.reason,
        status: btcPred.direction === 'up' ? 'positive' as const : btcPred.direction === 'down' ? 'negative' as const : 'neutral' as const
      }
    }
    
    return { value: "AI Tahmin Hazırlanıyor", status: 'neutral' as const }
  }

  const getSignalsSummary = () => {
    if (signalsData.length === 0) return { value: "Sinyal Aranıyor...", status: 'neutral' as const }
    
    const latestSignal = signalsData[signalsData.length - 1]
    return {
      value: `${latestSignal.indicator} ${latestSignal.type.toUpperCase()}`,
      subtitle: `${latestSignal.symbol} - ${latestSignal.strength.toFixed(0)}%`,
      status: latestSignal.type === 'buy' ? 'positive' as const : latestSignal.type === 'sell' ? 'negative' as const : 'neutral' as const
    }
  }

  const getRiskSummary = () => {
    if (riskData.length === 0) return { value: "Risk Değerlendiriliyor", status: 'neutral' as const }
    
    const highestRisk = riskData.reduce((prev, current) => {
      const riskLevels = { low: 1, medium: 2, high: 3, critical: 4 }
      return riskLevels[current.level] > riskLevels[prev.level] ? current : prev
    })
    
    return {
      value: highestRisk.title,
      subtitle: `${highestRisk.level.toUpperCase()} - ${riskData.length} uyarı`,
      status: highestRisk.level === 'high' || highestRisk.level === 'critical' ? 'warning' as const : 'neutral' as const
    }
  }

  const getNewsSummary = () => {
    if (newsData.length === 0) return { value: "Haberler İzleniyor...", status: 'neutral' as const }
    
    const latestNews = newsData[newsData.length - 1]
    return {
      value: latestNews.title,
      subtitle: `${latestNews.source} - ${latestNews.sentiment}`,
      status: latestNews.sentiment === 'positive' ? 'positive' as const : latestNews.sentiment === 'negative' ? 'negative' as const : 'neutral' as const
    }
  }

  const getEconomicSummary = () => {
    if (economicData.length === 0) return { value: "Takvim Kontrol Ediliyor", status: 'neutral' as const }
    
    const nextEvent = economicData.find(event => event.time > new Date())
    if (nextEvent) {
      const hoursUntil = Math.ceil((nextEvent.time.getTime() - Date.now()) / (1000 * 60 * 60))
      return {
        value: nextEvent.title,
        subtitle: `${hoursUntil} saat sonra - ${nextEvent.country}`,
        status: nextEvent.importance === 'high' ? 'warning' as const : 'neutral' as const
      }
    }
    
    return { value: "Ekonomik Olaylar Takip Ediliyor", status: 'neutral' as const }
  }

  // Render detail panel content
  const renderDetailContent = (module: string) => {
    switch (module) {
      case 'watchlist':
        return (
          <div className="space-y-4">
            {watchlistData.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{item.symbol}</h4>
                    <p className="text-2xl font-bold">${item.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.change24h >= 0 ? "default" : "destructive"}>
                      {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">Vol: {item.volume}</p>
                  </div>
                </div>
                {item.prediction && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      {item.prediction.direction === 'up' ? <TrendingUp className="w-4 h-4 text-green-600" /> : 
                       item.prediction.direction === 'down' ? <TrendingDown className="w-4 h-4 text-red-600" /> : 
                       <Activity className="w-4 h-4 text-yellow-600" />}
                      <span className="text-sm font-medium">AI Tahmini: %{item.prediction.confidence}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.prediction.reason}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      
      case 'prediction':
        return (
          <div className="space-y-4">
            {predictionData.map((item, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  {item.direction === 'up' ? <TrendingUp className="w-5 h-5 text-green-600" /> : 
                   item.direction === 'down' ? <TrendingDown className="w-5 h-5 text-red-600" /> : 
                   <Activity className="w-5 h-5 text-yellow-600" />}
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.symbol}</h4>
                    <p className="text-sm text-muted-foreground">{item.reason}</p>
                  </div>
                  <Badge variant="outline">%{item.confidence}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )
      
      case 'signals':
        return (
          <div className="space-y-4">
            {signalsData.map((signal, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{signal.symbol}</h4>
                    <p className="text-sm text-muted-foreground">{signal.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={signal.type === 'buy' ? "default" : signal.type === 'sell' ? "destructive" : "secondary"}>
                      {signal.indicator} {signal.type.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">Güçlülük: %{signal.strength.toFixed(0)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      
      case 'risk':
        return (
          <div className="space-y-4">
            {riskData.map((alert, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.level === 'critical' ? 'text-red-600' :
                    alert.level === 'high' ? 'text-orange-600' :
                    alert.level === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-semibold">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">{alert.timestamp.toLocaleTimeString()}</p>
                  </div>
                  <Badge variant={
                    alert.level === 'critical' ? "destructive" :
                    alert.level === 'high' ? "destructive" :
                    alert.level === 'medium' ? "default" : "secondary"
                  }>
                    {alert.level.toUpperCase()}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )
      
      case 'news':
        return (
          <div className="space-y-4">
            {newsData.map((news, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <Newspaper className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{news.title}</h4>
                    <p className="text-sm text-muted-foreground">{news.source} - {news.timestamp.toLocaleTimeString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={news.sentiment === 'positive' ? "default" : news.sentiment === 'negative' ? "destructive" : "secondary"}>
                      {news.sentiment}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{news.impact} etki</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      
      case 'economic':
        return (
          <div className="space-y-4">
            {economicData.map((event, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.country} - {event.time.toLocaleString()}</p>
                    {event.forecast && (
                      <p className="text-xs text-muted-foreground">
                        Beklenti: {event.forecast} {event.actual && `| Gerçek: ${event.actual}`}
                      </p>
                    )}
                  </div>
                  <Badge variant={event.importance === 'high' ? "destructive" : event.importance === 'medium' ? "default" : "secondary"}>
                    {event.importance}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )
      
      default:
        return <div>Detay bilgisi bulunamadı</div>
    }
  }

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
      
      {/* Ana İçerik - Kompakt Modüler Tasarım */}
      <div className="pl-4 pr-[300px] pt-12 pb-4">
        <div className="space-y-2 mt-2 max-w-2xl">
          
          {/* İşlem Çifti Takip Listesi */}
          <CompactModule
            title="İşlem Çiftleri"
            icon={<Target className="w-3 h-3" />}
            {...getWatchlistSummary()}
            onClick={() => setSelectedModule('watchlist')}
            loading={watchlistData.length === 0}
          />
          
          {/* AI Tahmin Paneli */}
          <CompactModule
            title="AI Tahmin"
            icon={<Brain className="w-3 h-3" />}
            {...getPredictionSummary()}
            badge={isActive ? "Aktif" : "Pasif"}
            onClick={() => setSelectedModule('prediction')}
            loading={predictionData.length === 0}
          />
          
          {/* Teknik Sinyaller */}
          <CompactModule
            title="Teknik Sinyaller"
            icon={<Activity className="w-3 h-3" />}
            {...getSignalsSummary()}
            onClick={() => setSelectedModule('signals')}
            loading={signalsData.length === 0}
          />
          
          {/* Risk Uyarıları */}
          <CompactModule
            title="Risk Uyarıları"
            icon={<AlertTriangle className="w-3 h-3" />}
            {...getRiskSummary()}
            badge={riskData.length > 0 ? `${riskData.length}` : undefined}
            onClick={() => setSelectedModule('risk')}
          />
          
          {/* Canlı Haber Akışı */}
          <CompactModule
            title="Canlı Haberler"
            icon={<Newspaper className="w-3 h-3" />}
            {...getNewsSummary()}
            onClick={() => setSelectedModule('news')}
            loading={newsData.length === 0}
          />
          
          {/* Ekonomik Takvim */}
          <CompactModule
            title="Ekonomik Takvim"
            icon={<Calendar className="w-3 h-3" />}
            {...getEconomicSummary()}
            onClick={() => setSelectedModule('economic')}
            loading={economicData.length === 0}
          />
          
          {/* Strateji Performansı */}
          <CompactModule
            title="Strateji Performansı"
            icon={<TrendingUp className="w-3 h-3" />}
            value="Günlük: +2.4%"
            subtitle="3 aktif strateji"
            status="positive"
            onClick={() => setSelectedModule('performance')}
          />
          
          {/* Portföy Dağılımı */}
          <CompactModule
            title="Portföy Dağılımı"
            icon={<PieChart className="w-3 h-3" />}
            value="BTC 45% | ETH 25%"
            subtitle="8 farklı varlık"
            status="neutral"
            onClick={() => setSelectedModule('portfolio')}
          />
          
          {/* Son İşlemler */}
          <CompactModule
            title="Son İşlemler"
            icon={<History className="w-3 h-3" />}
            value="BTCUSDT ALIM"
            subtitle="2 dakika önce"
            status="positive"
            onClick={() => setSelectedModule('trades')}
          />
          
        </div>
      </div>

      {/* Detay Paneli */}
      <Sheet open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
        <SheetContent className="w-[600px] sm:max-w-[600px]">
          <SheetHeader>
            <SheetTitle>
              {selectedModule === 'watchlist' && '📊 İşlem Çiftleri Detayı'}
              {selectedModule === 'prediction' && '🧠 AI Tahmin Detayı'}
              {selectedModule === 'signals' && '📈 Teknik Sinyaller Detayı'}
              {selectedModule === 'risk' && '⚠️ Risk Uyarıları Detayı'}
              {selectedModule === 'news' && '📰 Canlı Haberler Detayı'}
              {selectedModule === 'economic' && '📅 Ekonomik Takvim Detayı'}
              {selectedModule === 'performance' && '🎯 Strateji Performansı'}
              {selectedModule === 'portfolio' && '🥧 Portföy Dağılımı'}
              {selectedModule === 'trades' && '📋 Son İşlemler'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 max-h-[calc(100vh-120px)] overflow-auto">
            {selectedModule && renderDetailContent(selectedModule)}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}