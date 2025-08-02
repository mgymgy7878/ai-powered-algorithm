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
      <div className="h-14 flex items-center px-4 border-b border-border">
        {/* Sol boşluk menü butonu için */}
        <div className="w-16 flex-shrink-0"></div>
        
        {/* Metrik kartları - menü butonunun sağından başlar */}
        <div className="flex items-center gap-2 overflow-x-auto flex-1">
          <CompactModule
            title="Portföy"
            value={`$${(portfolioData?.totalValue ?? 0).toLocaleString()}`}
            icon={<DollarSign className="w-3 h-3" />}
            variant="info"
            onClick={() => setSelectedModule('portfolio')}
            className="min-w-[100px] h-[40px] text-xs"
          />
          <CompactModule
            title="Günlük K/Z"
            value={`$${(portfolioData?.dailyPnl ?? 0).toLocaleString()}`}
            icon={<TrendingUp className="w-3 h-3" />}
            variant="success"
            onClick={() => setSelectedModule('daily-pnl')}
            className="min-w-[100px] h-[40px] text-xs"
          />
          <CompactModule
            title="Toplam K/Z"
            value={`$${(portfolioData?.totalPnl ?? 0).toLocaleString()}`}
            icon={<TrendingUp className="w-3 h-3" />}
            variant="success"
            onClick={() => setSelectedModule('total-pnl')}
            className="min-w-[100px] h-[40px] text-xs"
          />
          <CompactModule
            title="Başarı"
            value={`${portfolioData.winRate}%`}
            icon={<Target className="w-3 h-3" />}
            variant="info"
            onClick={() => setSelectedModule('win-rate')}
            className="min-w-[80px] h-[40px] text-xs"
          />
          <CompactModule
            title="Stratejiler"
            value={portfolioData.activeStrategies}
            icon={<Bot className="w-3 h-3" />}
            variant="default"
            onClick={() => setSelectedModule('active-strategies')}
            className="min-w-[90px] h-[40px] text-xs"
          />
        </div>

        {/* Bildirim paneli - genişletildi, stratejiler modülüne kadar uzanıyor */}
        <div className="w-[320px] flex-shrink-0">
          <NotificationCenter />
        </div>
      </div>

      {/* Layout Bölgesi 2: Ana İçerik */}
      <div className="flex">
        {/* Sol taraf: Modüller */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {/* AI Tahmin Paneli */}
            <CompactModule
              title="AI Tahmin"
              value="▲ %76"
              subtitle="BTCUSDT"
              icon={<Bot className="w-4 h-4" />}
              variant="success"
              badge="Güçlü"
              onClick={() => setSelectedModule('ai-prediction')}
              className="h-[68px]"
            />

            {/* Risk Uyarı Kartları */}
            <CompactModule
              title="Risk Uyarısı"
              value="Orta"
              subtitle="3 pozisyon"
              icon={<AlertTriangle className="w-4 h-4" />}
              variant="warning"
              onClick={() => setSelectedModule('risk-alerts')}
              className="h-[68px]"
            />

            {/* Canlı Haber Akışı */}
            <CompactModule
              title="Son Haber"
              value="Fed Kararı"
              subtitle="2 saat önce"
              icon={<Newspaper className="w-4 h-4" />}
              variant="info"
              onClick={() => setSelectedModule('news-feed')}
              className="h-[68px]"
            />

            {/* Ekonomik Takvim */}
            <CompactModule
              title="Ekonomik"
              value="CPI Verisi"
              subtitle="Yarın 16:30"
              icon={<Calendar className="w-4 h-4" />}
              variant="warning"
              onClick={() => setSelectedModule('economic-calendar')}
              className="h-[68px]"
            />

            {/* Grafik Formasyon & Teknik Sinyal */}
            <CompactModule
              title="Teknik"
              value="Doji"
              subtitle="ETH 4H"
              icon={<Activity className="w-4 h-4" />}
              variant="info"
              onClick={() => setSelectedModule('technical-signals')}
              className="h-[68px]"
            />

            {/* Strateji Performansı */}
            <CompactModule
              title="Performans"
              value="+12.3%"
              subtitle="Bu hafta"
              icon={<TrendingUp className="w-4 h-4" />}
              variant="success"
              onClick={() => setSelectedModule('strategy-performance')}
              className="h-[68px]"
            />

            {/* Portföy Dağılımı */}
            <CompactModule
              title="Dağılım"
              value="65% USDT"
              subtitle="35% Kripto"
              icon={<PieChart className="w-4 h-4" />}
              variant="default"
              onClick={() => setSelectedModule('portfolio-distribution')}
              className="h-[68px]"
            />

            {/* Son İşlemler */}
            <CompactModule
              title="İşlemler"
              value="12"
              subtitle="Bugün"
              icon={<History className="w-4 h-4" />}
              variant="default"
              onClick={() => setSelectedModule('recent-trades')}
              className="h-[68px]"
            />
          </div>

          {/* Grafik Paneli */}
          <div className="w-full">
            <TradingChart
              symbol={chartSymbol}
              height={380}
              isFullscreen={isChartFullscreen}
              onFullscreenChange={setIsChartFullscreen}
            />
          </div>
        </div>

        {/* Sağ taraf: AI Trading Yöneticisi */}
        <div className="w-[280px] border-l border-border">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};