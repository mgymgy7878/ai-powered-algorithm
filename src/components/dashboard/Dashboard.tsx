import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { TrendingUp, BarChart } from 'lucide-react'
import { TradingAssistant } from '../ai/TradingAssistant'
import { NotificationCenter } from '../ui/NotificationCenter'
import { useActivity } from '../../contexts/ActivityContext'

export function Dashboard() {
  const { activities, addActivity } = useActivity()
  
  // Otomatik demo bildirimler sistemi
  useEffect(() => {
    // Demo bildirimleri global pushNotification ile gönder
    const sendInitialNotification = () => {
      if ((window as any).pushNotification) {
        (window as any).pushNotification('AI Trading Platformu başarıyla başlatıldı. Tüm sistemler aktif.', 'success')
      }
    }

    // 2 saniye sonra başlat
    setTimeout(sendInitialNotification, 2000)

    // Periyodik demo bildirimler
    const interval = setInterval(() => {
      if ((window as any).pushNotification) {
        const demoNotifications = [
          { message: 'BTCUSDT için güçlü trend sinyali tespit edildi.', type: 'info' },
          { message: 'Grid Bot stratejisi pozisyon güncelledi.', type: 'success' },
          { message: 'Volatilite artışı tespit edildi.', type: 'warning' },
          { message: 'ETHUSDT için alım sinyali oluştu.', type: 'info' }
        ]
        
        const randomNotification = demoNotifications[Math.floor(Math.random() * demoNotifications.length)]
        ;(window as any).pushNotification(randomNotification.message, randomNotification.type)
      }
    }, 45000) // Her 45 saniyede bir

    return () => {
      clearInterval(interval)
    }
  }, [])

  // Ana metrikler - sadece önemli 5 tanesi
  const mainMetrics = [
    { label: "Portföy Değeri", value: "$50,000.00", color: "text-blue-700" },
    { label: "Günlük K/Z", value: "$1,250.50", color: "text-green-600" },
    { label: "Toplam K/Z", value: "$8,750.25", color: "text-green-600" },
    { label: "Başarı Oranı", value: "68.50%", color: "text-blue-600" },
    { label: "Aktif Stratejiler", value: "3", color: "text-primary" }
  ]

  return (
    <div className="relative min-h-screen bg-background">
      {/* Ana Metrikler ve Bildirim Merkezi - Tek satırda hizalı */}
      <div className="absolute top-2 left-[60px] right-4 z-40 flex items-center gap-0 overflow-hidden">
        {/* Metrik kutuları */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {mainMetrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-muted rounded-md px-2 py-1 text-[10px] min-w-[100px] max-w-[120px] text-center shadow-sm flex-shrink-0"
            >
              <p className="text-muted-foreground truncate font-medium">{metric.label}</p>
              <p className={`font-semibold text-sm ${metric.color} truncate`}>{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Bildirim Merkezi - Metriklerden hemen sonra başlayacak şekilde genişletilmiş */}
        <div className="flex-1 ml-2 z-50">
          <NotificationCenter />
        </div>
      </div>
      
      {/* Yapay Zeka Trading Yöneticisi - Bildirim kutusunun altında */}
      <div className="absolute top-14 right-4 w-[280px] z-40">
        <TradingAssistant />
      </div>
      
      {/* Ana İçerik Alanı - Sol kenara hizalı, sağda AI için boşluk, üstte metrikler için boşluk */}
      <div className="pl-4 pr-[300px] pt-16">
        {/* Ana Grafik ve Analiz Alanı */}
        <div className="grid grid-cols-1 gap-4 mt-2">
          {/* Portföy Performans Grafiği */}
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BarChart className="h-4 w-4" />
                Portföy Performansı
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[200px] flex items-center justify-center bg-muted/50 rounded-lg">
                <p className="text-muted-foreground text-sm">Grafik yükleniyor...</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Strategies */}
        <Card className="mt-4">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm">En İyi Performans Gösteren Stratejiler</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">Grid Bot BTCUSDT</p>
                    <p className="text-[10px] text-muted-foreground">Son 7 gün</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600 text-xs">+12.4%</p>
                  <Badge variant="secondary" className="text-[10px] px-1">
                    247 işlem
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <BarChart className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">RSI Scalper ETHUSDT</p>
                    <p className="text-[10px] text-muted-foreground">Son 7 gün</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600 text-xs">+8.7%</p>
                  <Badge variant="secondary" className="text-[10px] px-1">
                    89 işlem
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">Moving Average Cross</p>
                    <p className="text-[10px] text-muted-foreground">Son 7 gün</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600 text-xs">+5.2%</p>
                  <Badge variant="secondary" className="text-[10px] px-1">
                    34 işlem
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Metrics bölümünü kaldır - artık üstte tek satırda gösteriliyor */}
      </div>
    </div>
  );
}