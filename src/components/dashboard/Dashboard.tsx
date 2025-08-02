import React, { useState } from 'react';
import { CompactModule } from './CompactModule';
import { TradingChart } from '../charts/TradingChart';
import { NotificationCenter } from '../ui/NotificationCenter';
import { TradingAssistant } from '../ai/TradingAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Maximize2
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
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);
  const [chartSymbol, setChartSymbol] = useState('BINANCE:BTCUSDT');
  
  const [portfolioData] = useKV('portfolio-data', {
    totalValue: 50000,
    dailyPnl: 1250.50,
    totalPnl: 8750.25,
    winRate: 68.5,
    activeStrategies: 3
  });

  const closeDetailPanel = () => setSelectedModule(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Layout Bölgesi 1: Üst Metrik Kartları */}
      <div className="h-16 flex items-center px-4 border-b border-border bg-muted/10">
        {/* Sol boşluk menü butonu için - menü butonunun sağından başlayan alan */}
        <div className="w-20 flex-shrink-0"></div>
        
        {/* Metrik kartları - küçültülmüş ve optimize edilmiş */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2">
          <CompactModule
            title="Portföy"
            value={`$${(portfolioData?.totalValue ?? 0).toLocaleString()}`}
            icon={<DollarSign className="w-3 h-3" />}
            variant="info"
            onClick={() => setSelectedModule('portfolio')}
            className="min-w-[100px] max-w-[100px] min-h-[56px] max-h-[56px]"
          />
          <CompactModule
            title="Günlük K/Z"
            value={`+$${(portfolioData?.dailyPnl ?? 0).toLocaleString()}`}
            icon={<TrendingUp className="w-3 h-3" />}
            variant="success"
            onClick={() => setSelectedModule('daily-pnl')}
            className="min-w-[100px] max-w-[100px] min-h-[56px] max-h-[56px]"
          />
          <CompactModule
            title="Toplam K/Z"
            value={`+$${(portfolioData?.totalPnl ?? 0).toLocaleString()}`}
            icon={<TrendingUp className="w-3 h-3" />}
            variant="success" 
            onClick={() => setSelectedModule('total-pnl')}
            className="min-w-[100px] max-w-[100px] min-h-[56px] max-h-[56px]"
          />
          <CompactModule
            title="Başarı Oranı"
            value={`${(portfolioData?.winRate ?? 0)}%`}
            icon={<Target className="w-3 h-3" />}
            variant="info"
            onClick={() => setSelectedModule('win-rate')}
            className="min-w-[96px] max-w-[96px] min-h-[56px] max-h-[56px]"
          />
          <CompactModule
            title="Stratejiler"
            value={portfolioData?.activeStrategies ?? 0}
            icon={<Bot className="w-3 h-3" />}
            variant="default"
            onClick={() => setSelectedModule('active-strategies')}
            className="min-w-[90px] max-w-[90px] min-h-[56px] max-h-[56px]"
          />
        </div>

        {/* Bildirim paneli - Stratejiler kutusundan sonra başlayıp sağ kenara kadar uzayan */}
        <div className="flex-1 ml-3 min-w-0">
          <NotificationCenter />
        </div>
      </div>

      {/* Layout Bölgesi 2: Ana İçerik - Optimized L Şekilli Yerleşim */}
      <div className="flex">
        {/* Sol taraf: L Şekilli Grid Layout - Optimize edilmiş */}
        <div className="flex-1 p-3">
          {/* Perfect L-Shape Layout: 4x4 Grid with chart spanning 2x3 area */}
          <div className="grid grid-cols-4 gap-2 h-[calc(100vh-140px)]">
            
            {/* ÜST SIRA - 4 kart (eşit boyut, hizalı) */}
            <CompactModule
              title="AI Tahmin"
              value="▲ %76"
              subtitle="BTCUSDT Güçlü Yükseliş"
              icon={<Bot className="w-4 h-4" />}
              variant="success"
              badge="Güçlü"
              onClick={() => setSelectedModule('ai-prediction')}
              className="h-[90px] text-sm"
            />

            <CompactModule
              title="Risk Uyarı"
              value="Orta Seviye"
              subtitle="3 pozisyon izleniyor"
              icon={<AlertTriangle className="w-4 h-4" />}
              variant="warning"
              onClick={() => setSelectedModule('risk-alerts')}
              className="h-[90px] text-sm"
            />

            <CompactModule
              title="Canlı Haber"
              value="Fed Kararı"
              subtitle="2 saat önce açıklandı"
              icon={<Newspaper className="w-4 h-4" />}
              variant="info"
              onClick={() => setSelectedModule('news-feed')}
              className="h-[90px] text-sm"
            />

            <CompactModule
              title="Ekonomik Takvim"
              value="CPI Verisi"
              subtitle="Yarın 16:30 (Yüksek Etki)"
              icon={<Calendar className="w-4 h-4" />}
              variant="danger"
              onClick={() => setSelectedModule('economic-calendar')}
              className="h-[90px] text-sm"
            />

            {/* İKİNCİ SIRA - Sol 1 kart + GRAFIK (2 sütun) + Sağ 1 kart */}
            <CompactModule
              title="Teknik Sinyal"
              value="Doji Formasyon"
              subtitle="ETH 4H - Dönüş sinyali"
              icon={<Activity className="w-4 h-4" />}
              variant="info"
              onClick={() => setSelectedModule('technical-signals')}
              className="h-[90px] text-sm"
            />

            {/* GRAFIK PANELİ - Ortada, 2x3 alan (2 sütun, 3 satır) */}
            <div className="col-span-2 row-span-3 bg-white rounded-xl shadow-sm border border-border p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chartSymbol}
                    onChange={(e) => setChartSymbol(e.target.value.toUpperCase())}
                    placeholder="BINANCE:BTCUSDT"
                    className="text-xs px-2 py-1 border rounded-md w-28"
                  />
                  <select 
                    className="text-xs px-2 py-1 border rounded-md"
                    defaultValue="1h"
                  >
                    <option value="1m">1m</option>
                    <option value="5m">5m</option>
                    <option value="15m">15m</option>
                    <option value="1h">1h</option>
                    <option value="4h">4h</option>
                    <option value="1D">1D</option>
                  </select>
                </div>
                <button 
                  onClick={() => setIsChartFullscreen(true)}
                  className="p-1 hover:bg-gray-100 rounded-md"
                >
                  <Maximize2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <TradingChart
                symbol={chartSymbol}
                height={300}
                isFullscreen={isChartFullscreen}
                onFullscreenChange={setIsChartFullscreen}
              />
            </div>

            <CompactModule
              title="Strateji Performans"
              value="+12.3%"
              subtitle="Bu hafta kazanç oranı"
              icon={<TrendingUp className="w-4 h-4" />}
              variant="success"
              onClick={() => setSelectedModule('strategy-performance')}
              className="h-[90px] text-sm"
            />

            {/* ÜÇÜNCÜ SIRA - Sol 1 kart + Grafik devam + Sağ 1 kart */}
            <CompactModule
              title="Portföy Dağılım"
              value="65% USDT"
              subtitle="Stabil coin ağırlığı"
              icon={<PieChart className="w-4 h-4" />}
              variant="default"
              onClick={() => setSelectedModule('portfolio-distribution')}
              className="h-[90px] text-sm"
            />

            {/* Grafik paneli burada devam ediyor (row-span-3) */}

            <CompactModule
              title="Son İşlemler"
              value="12 İşlem"
              subtitle="Bugün gerçekleştirilen"
              icon={<History className="w-4 h-4" />}
              variant="default"
              onClick={() => setSelectedModule('recent-trades')}
              className="h-[90px] text-sm"
            />

            {/* DÖRDÜNCÜ SIRA - Sol 1 kart + Grafik bitiyor + Sağ 1 kart */}
            <CompactModule
              title="Hızlı Eylem"
              value="Strateji Başlat"
              subtitle="Yeni bot yapılandır"
              icon={<Zap className="w-4 h-4" />}
              variant="info"
              onClick={() => setSelectedModule('quick-actions')}
              className="h-[90px] text-sm"
            />

            {/* Grafik paneli burada son buluyor */}

            <CompactModule
              title="Sistem Durumu"
              value="Aktif"
              subtitle="Tüm botlar çalışıyor"
              icon={<Activity className="w-4 h-4" />}
              variant="success"
              onClick={() => setSelectedModule('system-status')}
              className="h-[90px] text-sm"
            />
          </div>
        </div>

        {/* Sağ taraf: AI Trading Yöneticisi - daha dar */}
        <div className="w-[260px] border-l border-border">
          <TradingAssistant />
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};