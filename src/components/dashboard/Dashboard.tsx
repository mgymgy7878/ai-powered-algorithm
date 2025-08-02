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

  // Modül detay paneli pozisyonunu hesapla
  const getDetailPosition = () => {
    return {
      position: 'absolute' as const,
      top: '68px',
      right: '16px',
      zIndex: 50
    };
  };

  const closeDetailPanel = () => setSelectedModule(null);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Üst metrik kartları - düzenleme */}
      <div className="absolute top-1 left-[200px] right-[270px] z-30 px-1 flex items-center gap-1 overflow-x-hidden">
        <CompactModule
          title="Portföy"
          value={`$${(portfolioData?.totalValue ?? 0).toLocaleString()}`}
          icon={<DollarSign className="w-3 h-3" />}
          variant="info"
          onClick={() => setSelectedModule('portfolio')}
          className="w-[110px] h-[48px] p-2"
        />
        <CompactModule
          title="Günlük K/Z"
          value={`$${(portfolioData?.dailyPnl ?? 0).toLocaleString()}`}
          icon={<TrendingUp className="w-3 h-3" />}
          variant="success"
          onClick={() => setSelectedModule('daily-pnl')}
          className="w-[110px] h-[48px] p-2"
        />
        <CompactModule
          title="Toplam K/Z"
          value={`$${(portfolioData?.totalPnl ?? 0).toLocaleString()}`}
          icon={<TrendingUp className="w-3 h-3" />}
          variant="success"
          onClick={() => setSelectedModule('total-pnl')}
          className="w-[110px] h-[48px] p-2"
        />
        <CompactModule
          title="Başarı"
          value={`${portfolioData.winRate}%`}
          icon={<Target className="w-3 h-3" />}
          variant="info"
          onClick={() => setSelectedModule('win-rate')}
          className="w-[90px] h-[48px] p-2"
        />
        <CompactModule
          title="Stratejiler"
          value={portfolioData.activeStrategies}
          icon={<Bot className="w-3 h-3" />}
          variant="default"
          onClick={() => setSelectedModule('active-strategies')}
          className="w-[100px] h-[48px] p-2"
        />
      </div>

      {/* Bildirim paneli - küçültülmüş */}
      <div className="absolute top-1 right-4 w-[260px] z-40">
        <NotificationCenter />
      </div>

      {/* AI Trading Yöneticisi - küçültülmüş */}
      <div className="absolute top-14 right-4 w-[260px] h-[420px] z-30">
        <TradingAssistant />
      </div>

      {/* Ana dashboard modülleri - küçültülmüş */}
      <div className="pt-14 px-2 pb-2">
        <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-1 mb-4">
          {/* AI Tahmin Paneli */}
          <CompactModule
            title="AI Tahmin"
            value="▲ %76"
            subtitle="BTCUSDT"
            icon={<Bot className="w-3 h-3" />}
            variant="success"
            badge="Güçlü"
            onClick={() => setSelectedModule('ai-prediction')}
            className="h-[52px] p-2"
          />

          {/* Risk Uyarı Kartları */}
          <CompactModule
            title="Risk Uyarısı"
            value="Orta"
            subtitle="3 pozisyon"
            icon={<AlertTriangle className="w-3 h-3" />}
            variant="warning"
            onClick={() => setSelectedModule('risk-alerts')}
            className="h-[52px] p-2"
          />

          {/* Canlı Haber Akışı */}
          <CompactModule
            title="Son Haber"
            value="Fed Kararı"
            subtitle="2 saat önce"
            icon={<Newspaper className="w-3 h-3" />}
            variant="info"
            onClick={() => setSelectedModule('news-feed')}
            className="h-[52px] p-2"
          />

          {/* Ekonomik Takvim */}
          <CompactModule
            title="Ekonomik"
            value="CPI Verisi"
            subtitle="Yarın 16:30"
            icon={<Calendar className="w-3 h-3" />}
            variant="warning"
            onClick={() => setSelectedModule('economic-calendar')}
            className="h-[52px] p-2"
          />

          {/* Grafik Formasyon & Teknik Sinyal */}
          <CompactModule
            title="Teknik"
            value="Doji"
            subtitle="ETH 4H"
            icon={<Activity className="w-3 h-3" />}
            variant="info"
            onClick={() => setSelectedModule('technical-signals')}
            className="h-[52px] p-2"
          />

          {/* Strateji Performansı */}
          <CompactModule
            title="Performans"
            value="+12.3%"
            subtitle="Bu hafta"
            icon={<TrendingUp className="w-3 h-3" />}
            variant="success"
            onClick={() => setSelectedModule('strategy-performance')}
            className="h-[52px] p-2"
          />

          {/* Portföy Dağılımı */}
          <CompactModule
            title="Dağılım"
            value="65% USDT"
            subtitle="35% Kripto"
            icon={<PieChart className="w-3 h-3" />}
            variant="default"
            onClick={() => setSelectedModule('portfolio-distribution')}
            className="h-[52px] p-2"
          />

          {/* Son İşlemler */}
          <CompactModule
            title="İşlemler"
            value="12"
            subtitle="Bugün"
            icon={<History className="w-3 h-3" />}
            variant="default"
            onClick={() => setSelectedModule('recent-trades')}
            className="h-[52px] p-2"
          />
        </div>

        {/* Gelişmiş Grafik Paneli - optimize edilmiş */}
        <div className="mb-4">
          <TradingChart
            symbol={chartSymbol}
            height={320}
            isFullscreen={isChartFullscreen}
            onFullscreenChange={setIsChartFullscreen}
          />
        </div>
      </div>

      {/* Detay panelleri */}
      {selectedModule && (
        <div style={getDetailPosition()}>
          {selectedModule === 'ai-prediction' && (
            <DetailPanel title="AI Tahminleri" onClose={closeDetailPanel}>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span>BTCUSDT</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-[9px]">▲ %76</Badge>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  • Destek: $42,800<br/>
                  • Direnç: $45,200<br/>
                  • Hedef: $47,000
                </div>
                
                <div className="flex justify-between items-center">
                  <span>ETHUSDT</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-[9px]">→ %52</Badge>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  • Destek: $2,650<br/>
                  • Direnç: $2,750<br/>
                  • Trend: Yatay
                </div>
              </div>
            </DetailPanel>
          )}

          {selectedModule === 'risk-alerts' && (
            <DetailPanel title="Risk Uyarıları" onClose={closeDetailPanel}>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                  <span className="text-[10px]">BTC pozisyonu %85 marjin</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <span className="text-[10px]">Grid strateji 4 zarar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-yellow-600" />
                  <span className="text-[10px]">Yüksek volatilite</span>
                </div>
              </div>
            </DetailPanel>
          )}

          {selectedModule === 'news-feed' && (
            <DetailPanel title="Canlı Haberler" onClose={closeDetailPanel}>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="font-medium text-[10px]">Fed faiz kararı açıklandı</div>
                  <div className="text-[9px] text-muted-foreground">2 saat önce • Pozitif</div>
                </div>
                <div>
                  <div className="font-medium text-[10px]">Bitcoin ETF onayı</div>
                  <div className="text-[9px] text-muted-foreground">4 saat önce • Pozitif</div>
                </div>
                <div>
                  <div className="font-medium text-[10px]">USDT market cap artışı</div>
                  <div className="text-[9px] text-muted-foreground">1 gün önce • Nötr</div>
                </div>
              </div>
            </DetailPanel>
          )}

          {selectedModule === 'economic-calendar' && (
            <DetailPanel title="Ekonomik Takvim" onClose={closeDetailPanel}>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium text-[10px]">CPI Verisi (ABD)</div>
                    <div className="text-[9px] text-muted-foreground">Yarın 16:30</div>
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700 text-[8px] h-4">Yüksek</Badge>
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium text-[10px]">İşsizlik Verisi</div>
                    <div className="text-[9px] text-muted-foreground">Cuma 14:30</div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-[8px] h-4">Orta</Badge>
                </div>
                <div>
                  <div className="text-[9px] text-muted-foreground">
                    ⏰ CPI veri açıklamasına <strong>14:25:30</strong> kaldı
                  </div>
                </div>
              </div>
            </DetailPanel>
          )}

          {selectedModule === 'technical-signals' && (
            <DetailPanel title="Teknik Sinyaller" onClose={closeDetailPanel}>
              <div className="space-y-3 text-sm">
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
                <div className="text-xs text-muted-foreground">
                  • EMA(20) > EMA(50): Yükseliş trendi<br/>
                  • Bollinger bantları daralıyor<br/>
                  • Hacim artış gösteriyor
                </div>
              </div>
            </DetailPanel>
          )}

          {selectedModule === 'portfolio-distribution' && (
            <DetailPanel title="Portföy Dağılımı" onClose={closeDetailPanel}>
              <div className="space-y-2 text-sm">
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
            </DetailPanel>
          )}

          {selectedModule === 'recent-trades' && (
            <DetailPanel title="Son İşlemler" onClose={closeDetailPanel}>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">BTCUSDT Alım</div>
                    <div className="text-xs text-muted-foreground">Grid Bot • 14:25</div>
                  </div>
                  <span className="text-green-600">+$125</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">ETHUSDT Satım</div>
                    <div className="text-xs text-muted-foreground">Scalper • 13:45</div>
                  </div>
                  <span className="text-green-600">+$75</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">BNBUSDT Alım</div>
                    <div className="text-xs text-muted-foreground">RSI Bot • 12:30</div>
                  </div>
                  <span className="text-red-600">-$25</span>
                </div>
              </div>
            </DetailPanel>
          )}
        </div>
      )}
    </div>
  );
};