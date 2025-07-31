import { useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { 
  Search, 
  TrendingUp, 
  Activity, 
  Target, 
  BarChart3, 
  Zap,
  Lightning,
  Shield,
  Timer,
  Brain
} from '@phosphor-icons/react'

interface StrategyTemplate {
  id: string
  name: string
  description: string
  category: 'momentum' | 'reversal' | 'breakout' | 'trend' | 'scalping' | 'swing'
  complexity: 'beginner' | 'intermediate' | 'advanced'
  indicators: string[]
  timeframes: string[]
  code: string
  performance: {
    winRate: number
    profitFactor: number
    drawdown: number
  }
}

const templates: StrategyTemplate[] = [
  {
    id: '1',
    name: 'RSI Mean Reversion',
    description: 'Basit RSI aşırı alım/satım seviyelerine dayalı strateji',
    category: 'reversal',
    complexity: 'beginner',
    indicators: ['RSI', 'SMA'],
    timeframes: ['15m', '1h', '4h'],
    performance: { winRate: 65, profitFactor: 1.4, drawdown: 8 },
    code: `using System;
using MatriksIQ.API;

public class RSIMeanReversionStrategy : Strategy
{
    private RSI rsi;
    private SMA sma200;
    
    public override void OnStart()
    {
        rsi = RSI(14);
        sma200 = SMA(200);
    }
    
    public override void OnBarUpdate()
    {
        if (Bars.Count < 200) return;
        
        // Trend filtresi - sadece trend yönünde işlem
        bool upTrend = Close[0] > sma200[0];
        bool downTrend = Close[0] < sma200[0];
        
        // RSI aşırı satım bölgesinde ve trend yukarı
        if (rsi[0] < 30 && upTrend && Position.MarketPosition == MarketPosition.Flat)
        {
            EnterLong(1, "RSI Long");
        }
        
        // RSI aşırı alım bölgesinde ve trend aşağı
        if (rsi[0] > 70 && downTrend && Position.MarketPosition == MarketPosition.Flat)
        {
            EnterShort(1, "RSI Short");
        }
        
        // Çıkış koşulları
        if (Position.MarketPosition == MarketPosition.Long && rsi[0] > 70)
        {
            ExitLong(Position.Quantity, "RSI Exit Long");
        }
        
        if (Position.MarketPosition == MarketPosition.Short && rsi[0] < 30)
        {
            ExitShort(Position.Quantity, "RSI Exit Short");
        }
    }
}`
  },
  {
    id: '2',
    name: 'MACD Crossover Pro',
    description: 'MACD histogram ve sinyal çizgisi kırılımları',
    category: 'momentum',
    complexity: 'intermediate',
    indicators: ['MACD', 'EMA', 'Volume'],
    timeframes: ['1h', '4h', '1d'],
    performance: { winRate: 58, profitFactor: 1.8, drawdown: 12 },
    code: `using System;
using MatriksIQ.API;

public class MACDCrossoverStrategy : Strategy
{
    private MACD macd;
    private EMA ema50;
    private VOL volume;
    private double avgVolume;
    
    public override void OnStart()
    {
        macd = MACD(12, 26, 9);
        ema50 = EMA(50);
        volume = VOL();
    }
    
    public override void OnBarUpdate()
    {
        if (Bars.Count < 50) return;
        
        // Ortalama hacmi hesapla
        avgVolume = SMA(volume, 20)[0];
        
        // MACD bullish crossover
        if (macd.Default[0] > macd.Avg[0] && 
            macd.Default[1] <= macd.Avg[1] &&
            Close[0] > ema50[0] &&
            volume[0] > avgVolume * 1.2 &&
            Position.MarketPosition == MarketPosition.Flat)
        {
            EnterLong(1, "MACD Bull Cross");
        }
        
        // MACD bearish crossover
        if (macd.Default[0] < macd.Avg[0] && 
            macd.Default[1] >= macd.Avg[1] &&
            Close[0] < ema50[0] &&
            volume[0] > avgVolume * 1.2 &&
            Position.MarketPosition == MarketPosition.Flat)
        {
            EnterShort(1, "MACD Bear Cross");
        }
        
        // Stop Loss ve Take Profit
        if (Position.MarketPosition == MarketPosition.Long)
        {
            double stopPrice = Position.AveragePrice * 0.97; // %3 stop
            double targetPrice = Position.AveragePrice * 1.06; // %6 target
            
            ExitLongStopMarket(Position.Quantity, stopPrice, "Stop Loss");
            ExitLongLimitMarket(Position.Quantity, targetPrice, "Take Profit");
        }
        
        if (Position.MarketPosition == MarketPosition.Short)
        {
            double stopPrice = Position.AveragePrice * 1.03;
            double targetPrice = Position.AveragePrice * 0.94;
            
            ExitShortStopMarket(Position.Quantity, stopPrice, "Stop Loss");
            ExitShortLimitMarket(Position.Quantity, targetPrice, "Take Profit");
        }
    }
}`
  },
  {
    id: '3',
    name: 'Bollinger Bands Breakout',
    description: 'Volatilite kırılımları ve geri dönüş stratejisi',
    category: 'breakout',
    complexity: 'intermediate',
    indicators: ['Bollinger Bands', 'ATR', 'Volume'],
    timeframes: ['5m', '15m', '1h'],
    performance: { winRate: 72, profitFactor: 2.1, drawdown: 15 },
    code: `using System;
using MatriksIQ.API;

public class BollingerBreakoutStrategy : Strategy
{
    private Bollinger bollinger;
    private ATR atr;
    private VOL volume;
    private double avgVolume;
    
    public override void OnStart()
    {
        bollinger = Bollinger(Close, 20, 2);
        atr = ATR(14);
        volume = VOL();
    }
    
    public override void OnBarUpdate()
    {
        if (Bars.Count < 50) return;
        
        avgVolume = SMA(volume, 20)[0];
        double bandWidth = (bollinger.Upper[0] - bollinger.Lower[0]) / bollinger.Middle[0];
        
        // Düşük volatilite sonrası kırılım
        if (bandWidth < 0.02) // Dar bantlar
        {
            // Üst bant kırılımı
            if (Close[0] > bollinger.Upper[0] && 
                Close[1] <= bollinger.Upper[1] &&
                volume[0] > avgVolume * 1.5 &&
                Position.MarketPosition == MarketPosition.Flat)
            {
                EnterLong(1, "BB Upper Breakout");
            }
            
            // Alt bant kırılımı
            if (Close[0] < bollinger.Lower[0] && 
                Close[1] >= bollinger.Lower[1] &&
                volume[0] > avgVolume * 1.5 &&
                Position.MarketPosition == MarketPosition.Flat)
            {
                EnterShort(1, "BB Lower Breakout");
            }
        }
        
        // ATR tabanlı stop loss
        if (Position.MarketPosition == MarketPosition.Long)
        {
            double stopPrice = Position.AveragePrice - (atr[0] * 2);
            double targetPrice = Position.AveragePrice + (atr[0] * 3);
            
            ExitLongStopMarket(Position.Quantity, stopPrice, "ATR Stop");
            ExitLongLimitMarket(Position.Quantity, targetPrice, "ATR Target");
        }
        
        if (Position.MarketPosition == MarketPosition.Short)
        {
            double stopPrice = Position.AveragePrice + (atr[0] * 2);
            double targetPrice = Position.AveragePrice - (atr[0] * 3);
            
            ExitShortStopMarket(Position.Quantity, stopPrice, "ATR Stop");
            ExitShortLimitMarket(Position.Quantity, targetPrice, "ATR Target");
        }
    }
}`
  },
  {
    id: '4',
    name: 'Scalping EMA Grid',
    description: 'Hızlı EMA kırılımları ile scalping',
    category: 'scalping',
    complexity: 'advanced',
    indicators: ['EMA', 'Stochastic', 'Volume'],
    timeframes: ['1m', '5m'],
    performance: { winRate: 68, profitFactor: 1.6, drawdown: 18 },
    code: `using System;
using MatriksIQ.API;

public class ScalpingEMAStrategy : Strategy
{
    private EMA ema8, ema13, ema21;
    private Stochastic stoch;
    private VOL volume;
    private int tradeCount = 0;
    
    public override void OnStart()
    {
        ema8 = EMA(8);
        ema13 = EMA(13);
        ema21 = EMA(21);
        stoch = Stochastic(5, 3, 3);
        volume = VOL();
    }
    
    public override void OnBarUpdate()
    {
        if (Bars.Count < 25) return;
        
        bool emaUpTrend = ema8[0] > ema13[0] && ema13[0] > ema21[0];
        bool emaDownTrend = ema8[0] < ema13[0] && ema13[0] < ema21[0];
        
        // Long koşulları - EMA sıralaması + Stochastic
        if (emaUpTrend && 
            stoch.K[0] > stoch.D[0] && 
            stoch.K[1] <= stoch.D[1] &&
            stoch.K[0] < 80 &&
            Position.MarketPosition == MarketPosition.Flat)
        {
            EnterLong(1, "Scalp Long");
            tradeCount++;
        }
        
        // Short koşulları
        if (emaDownTrend && 
            stoch.K[0] < stoch.D[0] && 
            stoch.K[1] >= stoch.D[1] &&
            stoch.K[0] > 20 &&
            Position.MarketPosition == MarketPosition.Flat)
        {
            EnterShort(1, "Scalp Short");
            tradeCount++;
        }
        
        // Hızlı çıkışlar - scalping için
        if (Position.MarketPosition == MarketPosition.Long)
        {
            double stopPrice = Position.AveragePrice * 0.995; // %0.5 stop
            double targetPrice = Position.AveragePrice * 1.01; // %1 target
            
            // EMA tersine döndüyse çık
            if (ema8[0] < ema13[0])
            {
                ExitLong(Position.Quantity, "EMA Reverse");
            }
            else
            {
                ExitLongStopMarket(Position.Quantity, stopPrice, "Quick Stop");
                ExitLongLimitMarket(Position.Quantity, targetPrice, "Quick Target");
            }
        }
        
        if (Position.MarketPosition == MarketPosition.Short)
        {
            double stopPrice = Position.AveragePrice * 1.005;
            double targetPrice = Position.AveragePrice * 0.99;
            
            if (ema8[0] > ema13[0])
            {
                ExitShort(Position.Quantity, "EMA Reverse");
            }
            else
            {
                ExitShortStopMarket(Position.Quantity, stopPrice, "Quick Stop");
                ExitShortLimitMarket(Position.Quantity, targetPrice, "Quick Target");
            }
        }
        
        // Günlük işlem limiti
        if (tradeCount >= 20)
        {
            if (Position.MarketPosition != MarketPosition.Flat)
            {
                ExitLong(Position.Quantity, "Daily Limit");
                ExitShort(Position.Quantity, "Daily Limit");
            }
        }
    }
}`
  }
]

interface StrategyTemplatesProps {
  onSelectTemplate: (template: StrategyTemplate) => void
}

export function StrategyTemplates({ onSelectTemplate }: StrategyTemplatesProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'Tümü', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'momentum', label: 'Momentum', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'reversal', label: 'Reversal', icon: <Target className="h-4 w-4" /> },
    { id: 'breakout', label: 'Breakout', icon: <Zap className="h-4 w-4" /> },
    { id: 'scalping', label: 'Scalping', icon: <Lightning className="h-4 w-4" /> },
    { id: 'trend', label: 'Trend', icon: <Activity className="h-4 w-4" /> }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.indicators.some(ind => ind.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return <Shield className="h-3 w-3" />
      case 'intermediate': return <Timer className="h-3 w-3" />
      case 'advanced': return <Brain className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Şablon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-8"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              <span className="ml-1">{category.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="cursor-pointer hover:shadow-md transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                  <Badge className={`${getComplexityColor(template.complexity)} flex items-center gap-1`}>
                    {getComplexityIcon(template.complexity)}
                    {template.complexity}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Indicators - güvenli şekilde göster */}
                <div className="flex flex-wrap gap-1">
                  {(template.indicators || []).slice(0, 3).map((indicator, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {indicator}
                    </Badge>
                  ))}
                  {(template.indicators || []).length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{(template.indicators || []).length - 3}
                    </Badge>
                  )}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-green-600">
                      {template.performance.winRate}%
                    </div>
                    <div className="text-muted-foreground">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">
                      {template.performance.profitFactor}
                    </div>
                    <div className="text-muted-foreground">Profit Factor</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">
                      {template.performance.drawdown}%
                    </div>
                    <div className="text-muted-foreground">Drawdown</div>
                  </div>
                </div>

                {/* Timeframes */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">Zaman:</span>
                  {template.timeframes.map((tf, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tf}
                    </Badge>
                  ))}
                </div>

                <Button 
                  onClick={() => onSelectTemplate(template)}
                  size="sm" 
                  className="w-full"
                >
                  Şablonu Kullan
                </Button>
              </CardContent>
            </Card>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <div className="text-muted-foreground text-sm">
                Arama kriterlerinize uygun şablon bulunamadı
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}