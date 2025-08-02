import React, { useState } from 'react';
import { CompactModule } from './CompactModule';
import { TradingChart } from '../charts/TradingChart';
import { NotificationCenter } from '../ui/NotificationCenter';
import { TradingAssistant } from '../ai/TradingAssistant';
import { TradingViewWidget } from './TradingViewWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useKV } from '@github/spark/hooks';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Bot, 
  AlertTriangle,
  Calendar,
  Newspaper,
  Target,
  PieChart,
  History,
  Zap,
  Maximize2,
  Bell
} from 'lucide-react';

interface DetailPanelProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ title, children, onClose }) => (
  <Card className="w-72 max-h-72 overflow-y-auto bg-background border shadow-lg">
    <CardHeader className="pb-1">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xs font-semibold">{title}</CardTitle>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          ✕
        </button>
      </div>
    </CardHeader>
    <CardContent className="pt-0 p-3">
      {children}
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [notifications] = useKV('dashboard-notifications', [
    { id: '1', message: '🚀 Grid Bot başarıyla çalıştırıldı', time: '14:25', type: 'success' },
    { id: '2', message: '📊 BTCUSDT güçlü alım sinyali', time: '13:45', type: 'info' },
    { id: '3', message: '⚠️ Yüksek volatilite tespit edildi', time: '12:30', type: 'warning' },
    { id: '4', message: '💰 Scalper bot +$125 kazanç', time: '11:15', type: 'success' },
    { id: '5', message: '📰 Fed faiz kararı açıklandı', time: '10:00', type: 'info' }
  ]);
  
  const [portfolioData] = useKV('portfolio-data', {
    totalValue: 50000,
    dailyPnl: 1250.50,
    totalPnl: 8750.25,
    winRate: 68.5,
    activeStrategies: 3
  });

  const closeDetailPanel = () => setSelectedModule(null);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Üst sıra: Tüm temel göstergeler - sola hizalı, küçük, yatay */}
      <div className="flex items-center gap-1 px-2 py-2 ml-[70px] border-b border-border bg-card/50 flex-shrink-0">
        <CompactModule
          title="Portföy Değeri"
          value={`$${(portfolioData?.totalValue ?? 0).toLocaleString()}`}
          icon={<DollarSign className="w-3 h-3" />}
          variant="info"
          onClick={() => setSelectedModule('portfolio')}
          className="w-[95px] h-[48px] text-xs p-1 flex-shrink-0"
        />

        <CompactModule
          title="Günlük K/Z"
          value={`+$${(portfolioData?.dailyPnl ?? 0).toLocaleString()}`}
          icon={<TrendingUp className="w-3 h-3" />}
          variant="success"
          onClick={() => setSelectedModule('daily-pnl')}
          className="w-[95px] h-[48px] text-xs p-1 flex-shrink-0"
        />

        <CompactModule
          title="Toplam K/Z"
          value={`+$${(portfolioData?.totalPnl ?? 0).toLocaleString()}`}
          icon={<TrendingUp className="w-3 h-3" />}
          variant="success" 
          onClick={() => setSelectedModule('total-pnl')}
          className="w-[95px] h-[48px] text-xs p-1 flex-shrink-0"
        />

        <CompactModule
          title="Başarı Oranı"
          value={`${(portfolioData?.winRate ?? 0)}%`}
          icon={<Target className="w-3 h-3" />}
          variant="info"
          onClick={() => setSelectedModule('win-rate')}
          className="w-[95px] h-[48px] text-xs p-1 flex-shrink-0"
        />

        <CompactModule
          title="Aktif Stratejiler"
          value={portfolioData?.activeStrategies ?? 0}
          icon={<Bot className="w-3 h-3" />}
          variant="default"
          onClick={() => setSelectedModule('active-strategies')}
          className="w-[95px] h-[48px] text-xs p-1 flex-shrink-0"
        />

        <CompactModule
          title="Sistem Durumu"
          value="Aktif"
          icon={<Activity className="w-3 h-3" />}
          variant="success"
          onClick={() => setSelectedModule('system-status')}
          className="w-[95px] h-[48px] text-xs p-1 flex-shrink-0"
        />
      </div>

      {/* Ana İçerik Alanı - Üst kutular görünür şekilde altında */}
      <div className="flex flex-1 overflow-hidden pt-2">
        {/* Sol taraf: Diğer modüller alt alta - üsttekilerle aynı boyut */}
        <div className="w-[140px] p-1 space-y-1 overflow-y-auto">
          <CompactModule
            title="AI Tahmin"
            value="▲ %76"
            subtitle="BTCUSDT Güçlü Yükseliş"
            icon={<Bot className="w-3 h-3" />}
            variant="success"
            badge="Güçlü"
            onClick={() => setSelectedModule('ai-prediction')}
            className="w-full h-[58px] text-xs p-1"
          />

          <CompactModule
            title="Risk Uyarısı"
            value="Orta"
            subtitle="3 pozisyon izleniyor"
            icon={<AlertTriangle className="w-3 h-3" />}
            variant="warning"
            onClick={() => setSelectedModule('risk-alerts')}
            className="w-full h-[58px] text-xs p-1"
          />

          <CompactModule
            title="Teknik Sinyal"
            value="Doji"
            subtitle="ETH 4H - Dönüş"
            icon={<Activity className="w-3 h-3" />}
            variant="info"
            onClick={() => setSelectedModule('technical-signals')}
            className="w-full h-[58px] text-xs p-1"
          />

          <CompactModule
            title="Canlı Haberler"  
            value="Fed Kararı"
            subtitle="2 saat önce"
            icon={<Newspaper className="w-3 h-3" />}
            variant="info"
            onClick={() => setSelectedModule('news-feed')}
            className="w-full h-[58px] text-xs p-1"
          />

          <CompactModule
            title="Ekonomik Takvim"
            value="CPI Verisi"
            subtitle="Yarın 16:30"
            icon={<Calendar className="w-3 h-3" />}
            variant="danger"
            onClick={() => setSelectedModule('economic-calendar')}
            className="w-full h-[58px] text-xs p-1"
          />

          <CompactModule
            title="Son İşlemler"
            value="12"
            subtitle="Bugün"
            icon={<History className="w-3 h-3" />}
            variant="default"
            onClick={() => setSelectedModule('recent-trades')}
            className="w-full h-[58px] text-xs p-1"
          />

          <CompactModule
            title="En İyi Performans"
            value="Grid Bot"
            subtitle="+34.5% bu ay"
            icon={<Zap className="w-3 h-3" />}
            variant="success"
            onClick={() => setSelectedModule('best-strategy')}
            className="w-full h-[58px] text-xs p-1"
          />

          <CompactModule
            title="Portföy Performansı"
            value="+21.2%"
            subtitle="ROI (3 ay)"
            icon={<PieChart className="w-3 h-3" />}
            variant="success"
            onClick={() => setSelectedModule('portfolio-performance')}
            className="w-full h-[58px] text-xs p-1"
          />
        </div>

        {/* Orta kısım: Trading Grafiği - Doğru en/boy oranında */}
        <div className="flex-1 p-1">
          <Card className="h-full bg-white">
            <CardHeader className="pb-1 px-2 py-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold">Trading Grafiği</CardTitle>
                <div className="flex items-center gap-1">
                  <select className="text-[10px] border rounded px-1 py-0.5 bg-background">
                    <option value="BINANCE:BTCUSDT">BTCUSDT</option>
                    <option value="BINANCE:ETHUSDT">ETHUSDT</option>
                    <option value="BINANCE:BNBUSDT">BNBUSDT</option>
                  </select>
                  <select className="text-[10px] border rounded px-1 py-0.5 bg-background">
                    <option value="1m">1m</option>
                    <option value="5m">5m</option>
                    <option value="15m">15m</option>
                    <option value="1h">1h</option>
                    <option value="4h">4h</option>
                    <option value="1d">1d</option>
                  </select>
                  <button className="p-0.5 hover:bg-gray-100 rounded">
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-1 pt-0">
              <div className="w-full h-[calc(100vh-140px)] min-h-[400px] bg-muted/20 rounded-md overflow-hidden">
                <TradingViewWidget 
                  symbol="BINANCE:BTCUSDT" 
                  width="100%" 
                  height="100%" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sağ taraf: AI Trading Yöneticisi - 280px genişlik */}
        <div className="w-[280px] flex flex-col p-1">
          {/* AI Trading Yöneticisi - Uzatıldı */}
          <div className="flex-1 mb-1 h-[calc(100vh-180px)]">
            <TradingAssistant />
          </div>
          
          {/* Kalıcı Bildirim Kutusu - Kompakt */}
          <Card className="mb-1 h-[100px]">
            <CardHeader className="pb-0 px-1 py-0.5">
              <div className="flex items-center gap-1">
                <Bell className="w-2 h-2" />
                <CardTitle className="text-[9px] font-medium">Bildirimler</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-1 pt-0.5">
              <ScrollArea className="h-[75px]">
                <div className="space-y-0.5">
                  {notifications.slice(0, 3).map((notification) => (
                    <div 
                      key={notification.id}
                      className="text-[8px] p-0.5 rounded-md bg-muted/50 border"
                    >
                      <div className="flex justify-between items-start">
                        <span className="flex-1 pr-0.5 leading-3">{notification.message}</span>
                        <span className="text-muted-foreground whitespace-nowrap text-[7px]">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                  
                  {notifications.length > 3 && (
                    <div className="space-y-0.5 pt-0.5 border-t border-border">
                      {notifications.slice(3).map((notification) => (
                        <div 
                          key={notification.id}
                          className="text-[8px] p-0.5 rounded-md bg-muted/30 border opacity-80"
                        >
                          <div className="flex justify-between items-start">
                            <span className="flex-1 pr-0.5 leading-3">{notification.message}</span>
                            <span className="text-muted-foreground whitespace-nowrap text-[7px]">{notification.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detay Panelleri - Modal olarak */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-xl border border-border p-4 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">
                {selectedModule === 'ai-prediction' && 'AI Tahminleri'}
                {selectedModule === 'risk-alerts' && 'Risk Uyarıları'}
                {selectedModule === 'news-feed' && 'Canlı Haberler'}
                {selectedModule === 'economic-calendar' && 'Ekonomik Takvim'}
                {selectedModule === 'technical-signals' && 'Teknik Sinyaller'}
                {selectedModule === 'portfolio-distribution' && 'Portföy Dağılımı'}
                {selectedModule === 'recent-trades' && 'Son İşlemler'}
                {selectedModule === 'quick-actions' && 'Hızlı Eylemler'}
                {selectedModule === 'strategy-performance' && 'Strateji Performansı'}
                {selectedModule === 'best-strategy' && 'En İyi Performans Gösteren Stratejiler'}
                {selectedModule === 'portfolio-performance' && 'Portföy Performansı'}
                {selectedModule === 'portfolio' && 'Portföy Özeti'}
                {selectedModule === 'daily-pnl' && 'Günlük K/Z'}
                {selectedModule === 'total-pnl' && 'Toplam K/Z'}
                {selectedModule === 'win-rate' && 'Başarı Oranı'}
                {selectedModule === 'active-strategies' && 'Aktif Stratejiler'}
                {selectedModule === 'system-status' && 'Sistem Durumu'}
              </h3>
              <button 
                onClick={closeDetailPanel}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="text-sm">
              {selectedModule === 'ai-prediction' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>BTCUSDT</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">▲ %76</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    • Destek: $42,800<br/>
                    • Direnç: $45,200<br/>
                    • Hedef: $47,000
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>ETHUSDT</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">→ %52</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    • Destek: $2,650<br/>
                    • Direnç: $2,750<br/>
                    • Trend: Yatay
                  </div>
                </div>
              )}

              {selectedModule === 'risk-alerts' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span>BTC pozisyonu %85 marjin kullanımında</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Grid strateji son 4 işlemde zarar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span>Yüksek volatilite bekleniyor</span>
                  </div>
                </div>
              )}

              {selectedModule === 'news-feed' && (
                <div className="space-y-3">
                  <div>
                    <div className="font-medium">Fed faiz kararı açıklandı</div>
                    <div className="text-xs text-muted-foreground">2 saat önce • Pozitif etki</div>
                  </div>
                  <div>
                    <div className="font-medium">Bitcoin ETF onayı bekleniyor</div>
                    <div className="text-xs text-muted-foreground">4 saat önce • Pozitif etki</div>
                  </div>
                  <div>
                    <div className="font-medium">USDT market cap artışı</div>
                    <div className="text-xs text-muted-foreground">1 gün önce • Nötr etki</div>
                  </div>
                </div>
              )}

              {selectedModule === 'economic-calendar' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">CPI Verisi (ABD)</div>
                      <div className="text-xs text-muted-foreground">Yarın 16:30</div>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700">Yüksek</Badge>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">İşsizlik Verisi</div>
                      <div className="text-xs text-muted-foreground">Cuma 14:30</div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Orta</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    ⏰ CPI veri açıklamasına <strong>14:25:30</strong> kaldı
                  </div>
                </div>
              )}

              {selectedModule === 'technical-signals' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Doji (ETHUSDT 4H)</span>
                    <Badge variant="outline">Dönüş sinyali</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>RSI Aşırı Alım</span>
                    <Badge variant="outline" className="bg-red-50 text-red-700">BTCUSDT</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>MACD Kesişim</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">BNBUSDT</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-3 p-2 bg-muted rounded">
                    • EMA(20) > EMA(50): Yükseliş trendi<br/>
                    • Bollinger bantları daralıyor<br/>
                    • Hacim artış gösteriyor
                  </div>
                </div>
              )}

              {selectedModule === 'portfolio-distribution' && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>USDT (Stable)</span>
                    <span className="font-medium">65% ($32,500)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BTC</span>
                    <span className="font-medium">20% ($10,000)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ETH</span>
                    <span className="font-medium">10% ($5,000)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Altcoinler</span>
                    <span className="font-medium">5% ($2,500)</span>
                  </div>
                </div>
              )}

              {selectedModule === 'recent-trades' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">BTCUSDT Alım</div>
                      <div className="text-xs text-muted-foreground">Grid Bot • 14:25</div>
                    </div>
                    <span className="text-green-600 font-medium">+$125</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">ETHUSDT Satım</div>
                      <div className="text-xs text-muted-foreground">Scalper • 13:45</div>
                    </div>
                    <span className="text-green-600 font-medium">+$75</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">BNBUSDT Alım</div>
                      <div className="text-xs text-muted-foreground">RSI Bot • 12:30</div>
                    </div>
                    <span className="text-red-600 font-medium">-$25</span>
                  </div>
                </div>
              )}

              {selectedModule === 'quick-actions' && (
                <div className="space-y-3">
                  <button className="w-full p-2 bg-green-50 text-green-700 rounded-md text-sm font-medium hover:bg-green-100">
                    + Grid Bot Başlat
                  </button>
                  <button className="w-full p-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100">
                    + Scalping Bot
                  </button>
                  <button className="w-full p-2 bg-purple-50 text-purple-700 rounded-md text-sm font-medium hover:bg-purple-100">
                    + RSI Stratejisi
                  </button>
                  <button className="w-full p-2 bg-orange-50 text-orange-700 rounded-md text-sm font-medium hover:bg-orange-100">
                    🔄 Tüm Stratejileri Durdur
                  </button>
                </div>
              )}

              {selectedModule === 'strategy-performance' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Bu Hafta</span>
                    <span className="text-green-600 font-medium">+12.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bu Ay</span>
                    <span className="text-green-600 font-medium">+28.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bu Yıl</span>
                    <span className="text-green-600 font-medium">+145.2%</span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    En İyi Performans: Grid Bot (%34.5)<br/>
                    En Kötü: Manual Trading (-%4.2)
                  </div>
                </div>
              )}

              {selectedModule === 'portfolio' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Toplam Değer</span>
                    <span className="font-semibold">${portfolioData?.totalValue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kullanılabilir Bakiye</span>
                    <span>$32,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pozisyonlarda</span>
                    <span>$17,500</span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    ⚡ 24h Değişim: +2.1% ($1,050)<br/>
                    📊 Risk Seviyesi: Orta
                  </div>
                </div>
              )}

              {selectedModule === 'daily-pnl' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Grid Bot</span>
                    <span className="text-green-600">+$780</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scalper</span>
                    <span className="text-green-600">+$470</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RSI Bot</span>
                    <span className="text-red-600">-$20</span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-green-50 p-2 rounded">
                    💰 Toplam Günlük: +${portfolioData?.dailyPnl?.toLocaleString()}<br/>
                    📈 İşlem Sayısı: 47
                  </div>
                </div>
              )}

              {selectedModule === 'total-pnl' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Başlangıç Sermaye</span>
                    <span>$41,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mevcut Toplam</span>
                    <span className="font-semibold">$50,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Net K/Z</span>
                    <span className="text-green-600 font-semibold">+$8,750</span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-green-50 p-2 rounded">
                    📊 ROI: +21.2%<br/>
                    ⏱️ Ortalama günlük kazanç: $125
                  </div>
                </div>
              )}

              {selectedModule === 'win-rate' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Kazanan İşlem</span>
                    <span className="text-green-600">854</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kaybeden İşlem</span>
                    <span className="text-red-600">393</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Başarı Oranı</span>
                    <span className="font-semibold text-blue-600">{portfolioData?.winRate}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                    🎯 En yüksek seri: 12 kazanç üst üste<br/>
                    📉 En uzun kayıp: 4 işlem
                  </div>
                </div>
              )}

              {selectedModule === 'active-strategies' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Grid Bot (BTCUSDT)</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Çalışıyor</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Scalper (ETHUSDT)</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Çalışıyor</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>RSI Bot (BNBUSDT)</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Beklemede</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    ⚙️ Toplam {portfolioData?.activeStrategies} strateji aktif<br/>
                    🔋 Ortalama CPU kullanımı: %12
                  </div>
                </div>
              )}

              {selectedModule === 'system-status' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>API Bağlantısı</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">✓ Aktif</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Websocket</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">✓ Bağlı</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AI Asistanı</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">✓ Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Backtest Motoru</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">✓ Hazır</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground bg-green-50 p-2 rounded">
                    🟢 Tüm sistemler normal çalışıyor<br/>
                    ⚡ Uptime: 4d 12h 25m<br/>
                    📡 Son güncelleme: 2 saniye önce
                  </div>
                </div>
              )}

              {selectedModule === 'best-strategy' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Grid Bot (BTCUSDT)</div>
                      <div className="text-xs text-muted-foreground">Son 30 gün</div>
                    </div>
                    <span className="text-green-600 font-semibold">+34.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">Scalper (ETHUSDT)</div>
                      <div className="text-xs text-muted-foreground">Son 30 gün</div>
                    </div>
                    <span className="text-green-600 font-semibold">+28.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">RSI Bot (BNBUSDT)</div>
                      <div className="text-xs text-muted-foreground">Son 30 gün</div>
                    </div>
                    <span className="text-green-600 font-semibold">+15.7%</span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-green-50 p-2 rounded">
                    🏆 Grid Bot bu ay en yüksek performansı gösterdi<br/>
                    📊 Ortalama günlük kazanç: $287<br/>
                    ⚡ Toplam işlem: 1,247 (89% başarılı)
                  </div>
                </div>
              )}

              {selectedModule === 'portfolio-performance' && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Son 7 Gün</span>
                    <span className="text-green-600 font-medium">+8.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Son 30 Gün</span>
                    <span className="text-green-600 font-medium">+21.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Son 90 Gün</span>
                    <span className="text-green-600 font-medium">+47.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bu Yıl (YTD)</span>
                    <span className="text-green-600 font-medium">+156.3%</span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
                    📈 Sharpe Oranı: 2.34 (Mükemmel)<br/>
                    📉 Max Drawdown: -8.2%<br/>
                    💎 En iyi ay: Kasım (+34.1%)<br/>
                    🔥 Kazanç sırası: 12 gün üst üste
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};