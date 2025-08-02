import React, { useState } from 'react';
import { CompactModule } from './CompactModule';
import { TradingChart } from '../charts/TradingChart';
import { NotificationCenter } from '../ui/NotificationCenter';
import { TradingAssistant } from '../ai/TradingAssistant';
import { DraggableDashboard } from './DraggableDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  LayoutGrid, 
  Maximize2,
  Grid3X3,
  Move
} from 'lucide-react';

interface DetailPanelProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ title, children, onClose }) => (
  <Card className="w-80 max-h-80 overflow-y-auto bg-background border shadow-lg">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ✕
        </button>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      {children}
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);
  const [chartSymbol, setChartSymbol] = useState('BINANCE:BTCUSDT');
  const [viewMode, setViewMode] = useKV<'classic' | 'draggable'>('dashboard-view-mode', 'draggable');
  
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
      top: '84px',
      right: '20px',
      zIndex: 40
    };
  };

  const closeDetailPanel = () => setSelectedModule(null);

  // Sürükle-bırak modundaysa DraggableDashboard'ı render et
  if (viewMode === 'draggable') {
    return (
      <div className="min-h-screen bg-background p-4">
        {/* Görünüm değiştirici */}
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
          <Button
            variant={viewMode === 'classic' ? 'outline' : 'default'}
            size="sm"
            onClick={() => setViewMode('classic')}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="w-4 h-4" />
            Klasik
          </Button>
          <Button
            variant={viewMode === 'draggable' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('draggable')}
            className="flex items-center gap-2"
          >
            <Move className="w-4 h-4" />
            Sürükle & Bırak
          </Button>
        </div>
        
        <DraggableDashboard className="pt-16" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Görünüm değiştirici */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <Button
          variant={viewMode === 'classic' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('classic')}
          className="flex items-center gap-2"
        >
          <Grid3X3 className="w-4 h-4" />
          Klasik
        </Button>
        <Button
          variant={viewMode === 'draggable' ? 'outline' : 'default'}
          size="sm"
          onClick={() => setViewMode('draggable')}
          className="flex items-center gap-2"
        >
          <Move className="w-4 h-4" />
          Sürükle & Bırak
        </Button>
      </div>

      {/* Üst metrik kartları */}
      <div className="absolute top-2 left-[200px] right-[300px] z-30 px-2 flex items-center gap-2 overflow-x-auto">
        <CompactModule
          title="Portföy Değeri"
          value={`$${(portfolioData?.totalValue ?? 0).toLocaleString()}`}
          icon={<DollarSign className="w-4 h-4" />}
          variant="info"
          onClick={() => setSelectedModule('portfolio')}
        />
        <CompactModule
          title="Günlük K/Z"
          value={`$${(portfolioData?.dailyPnl ?? 0).toLocaleString()}`}
          icon={<TrendingUp className="w-4 h-4" />}
          variant="success"
          onClick={() => setSelectedModule('daily-pnl')}
        />
        <CompactModule
          title="Toplam K/Z"
          value={`$${(portfolioData?.totalPnl ?? 0).toLocaleString()}`}
          icon={<TrendingUp className="w-4 h-4" />}
          variant="success"
          onClick={() => setSelectedModule('total-pnl')}
        />
        <CompactModule
          title="Başarı Oranı"
          value={`${portfolioData.winRate}%`}
          icon={<Target className="w-4 h-4" />}
          variant="info"
          onClick={() => setSelectedModule('win-rate')}
        />
        <CompactModule
          title="Aktif Stratejiler"
          value={portfolioData.activeStrategies}
          icon={<Bot className="w-4 h-4" />}
          variant="default"
          onClick={() => setSelectedModule('active-strategies')}
        />
      </div>

      {/* Bildirim paneli */}
      <div className="absolute top-2 right-4 w-[280px] z-40">
        <NotificationCenter />
      </div>

      {/* AI Trading Yöneticisi */}
      <div className="absolute top-16 right-4 w-[280px] h-[460px] z-30">
        <TradingAssistant />
      </div>

      {/* Ana dashboard modülleri */}
      <div className="pt-16 px-4 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1 mb-6">
          {/* AI Tahmin Paneli */}
          <CompactModule
            title="AI Tahmin"
            value="▲ %76"
            subtitle="BTCUSDT Yükseliş"
            icon={<Bot className="w-4 h-4" />}
            variant="success"
            badge="Güçlü"
            onClick={() => setSelectedModule('ai-prediction')}
          />

          {/* Risk Uyarı Kartları */}
          <CompactModule
            title="Risk Uyarısı"
            value="Orta"
            subtitle="3 aktif pozisyon"
            icon={<AlertTriangle className="w-4 h-4" />}
            variant="warning"
            onClick={() => setSelectedModule('risk-alerts')}
          />

          {/* Canlı Haber Akışı */}
          <CompactModule
            title="Son Haber"
            value="Fed Kararı"
            subtitle="2 saat önce"
            icon={<Newspaper className="w-4 h-4" />}
            variant="info"
            onClick={() => setSelectedModule('news-feed')}
          />

          {/* Ekonomik Takvim */}
          <CompactModule
            title="Ekonomik Takvim"
            value="CPI Verisi"
            subtitle="Yarın 16:30"
            icon={<Calendar className="w-4 h-4" />}
            variant="warning"
            onClick={() => setSelectedModule('economic-calendar')}
          />

          {/* Grafik Formasyon & Teknik Sinyal */}
          <CompactModule
            title="Teknik Sinyal"
            value="Doji"
            subtitle="ETHUSDT 4H"
            icon={<Activity className="w-4 h-4" />}
            variant="info"
            onClick={() => setSelectedModule('technical-signals')}
          />

          {/* Strateji Performansı */}
          <CompactModule
            title="Strateji Performansı"
            value="+12.3%"
            subtitle="Bu hafta"
            icon={<TrendingUp className="w-4 h-4" />}
            variant="success"
            onClick={() => setSelectedModule('strategy-performance')}
          />

          {/* Portföy Dağılımı */}
          <CompactModule
            title="Portföy Dağılımı"
            value="65% USDT"
            subtitle="35% Kripto"
            icon={<PieChart className="w-4 h-4" />}
            variant="default"
            onClick={() => setSelectedModule('portfolio-distribution')}
          />

          {/* Son İşlemler */}
          <CompactModule
            title="Son İşlemler"
            value="12"
            subtitle="Bugün"
            icon={<History className="w-4 h-4" />}
            variant="default"
            onClick={() => setSelectedModule('recent-trades')}
          />
        </div>

        {/* Gelişmiş Grafik Paneli */}
        <div className="mb-6">
          <TradingChart
            symbol={chartSymbol}
            height={280}
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
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>BTCUSDT</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">▲ %76 Güven</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  • Destek: $42,800<br/>
                  • Direnç: $45,200<br/>
                  • Hedef: $47,000
                </div>
                
                <div className="flex justify-between items-center">
                  <span>ETHUSDT</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">→ %52 Nötr</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  • Destek: $2,650<br/>
                  • Direnç: $2,750<br/>
                  • Trend: Yatay
                </div>
              </div>
            </DetailPanel>
          )}

          {selectedModule === 'risk-alerts' && (
            <DetailPanel title="Risk Uyarıları" onClose={closeDetailPanel}>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span>BTC pozisyonu %85 marjin kullanımında</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Grid stratejisi son 4 işlemde zarar etti</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span>Yüksek volatilite algılandı</span>
                </div>
              </div>
            </DetailPanel>
          )}

          {selectedModule === 'news-feed' && (
            <DetailPanel title="Canlı Haberler" onClose={closeDetailPanel}>
              <div className="space-y-3 text-sm">
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
            </DetailPanel>
          )}

          {selectedModule === 'economic-calendar' && (
            <DetailPanel title="Ekonomik Takvim" onClose={closeDetailPanel}>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">CPI Verisi (ABD)</div>
                    <div className="text-xs text-muted-foreground">Yarın 16:30</div>
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700">Yüksek Etki</Badge>
                </div>
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">İşsizlik Verisi</div>
                    <div className="text-xs text-muted-foreground">Cuma 14:30</div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Orta Etki</Badge>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
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