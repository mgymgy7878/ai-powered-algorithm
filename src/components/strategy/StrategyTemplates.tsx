import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Activity, Grid3x3, Target, Zap } from '@phosphor-icons/react'

interface StrategyTemplate {
  id: string
  name: string
  description: string
  category: 'scalping' | 'grid' | 'trend' | 'breakout' | 'mean_reversion'
  indicators: string[]
  code: string
  icon: React.ReactNode
}

const templates: StrategyTemplate[] = [
  {
    id: 'rsi-scalping',
    name: 'RSI Scalping',
    description: 'RSI aşırı alım/satım seviyelerini kullanan hızlı scalping stratejisi',
    category: 'scalping',
    indicators: ['RSI', 'EMA'],
    icon: <Zap className="w-4 h-4" />,
    code: `using System;
using MatriksIQ.API;

public class RSIScalpingStrategy : Strategy
{
    private int rsiPeriod = 14;
    private double oversoldLevel = 30;
    private double overboughtLevel = 70;
    private double stopLoss = 0.5; // %0.5
    private double takeProfit = 1.0; // %1.0
    
    private RSI rsi;
    private EMA emaFast;
    private EMA emaSlow;
    
    public override void OnStart()
    {
        rsi = RSI(rsiPeriod);
        emaFast = EMA(9);
        emaSlow = EMA(21);
    }
    
    public override void OnBarUpdate()
    {
        if (Bars.Count < Math.Max(rsiPeriod, 21)) return;
        
        // Trend kontrolü
        bool upTrend = emaFast.Value > emaSlow.Value;
        bool downTrend = emaFast.Value < emaSlow.Value;
        
        // Alış sinyali: RSI oversold ve yukarı trend
        if (rsi.Value < oversoldLevel && upTrend && Position.MarketPosition == MarketPosition.Flat)
        {
            EnterLong();
            SetStopLoss(CalculationMode.Percent, stopLoss);
            SetProfitTarget(CalculationMode.Percent, takeProfit);
        }
        
        // Satış sinyali: RSI overbought ve aşağı trend
        if (rsi.Value > overboughtLevel && downTrend && Position.MarketPosition == MarketPosition.Flat)
        {
            EnterShort();
            SetStopLoss(CalculationMode.Percent, stopLoss);
            SetProfitTarget(CalculationMode.Percent, takeProfit);
        }
    }
}`
  },
  {
    id: 'grid-bot',
    name: 'Grid Bot',
    description: 'Yatay piyasalarda alım-satım seviyeleri belirleyerek çalışan grid stratejisi',
    category: 'grid',
    indicators: ['Bollinger Bands', 'ATR'],
    icon: <Grid3x3 className="w-4 h-4" />,
    code: `using System;
using System.Collections.Generic;
using MatriksIQ.API;

public class GridBotStrategy : Strategy
{
    private double gridSpacing = 1.0; // %1 grid aralığı
    private int maxPositions = 5;
    private double positionSize = 0.1;
    
    private BollingerBands bb;
    private ATR atr;
    private List<double> gridLevels = new List<double>();
    
    public override void OnStart()
    {
        bb = BollingerBands(20, 2);
        atr = ATR(14);
        CreateGridLevels();
    }
    
    private void CreateGridLevels()
    {
        if (Bars.Count < 20) return;
        
        double currentPrice = Close[0];
        double spacing = currentPrice * (gridSpacing / 100);
        
        gridLevels.Clear();
        
        // Grid seviyelerini oluştur
        for (int i = -maxPositions; i <= maxPositions; i++)
        {
            gridLevels.Add(currentPrice + (i * spacing));
        }
    }
    
    public override void OnBarUpdate()
    {
        if (Bars.Count < 20) return;
        
        // Volatilite kontrolü - düşük volatilitede grid çalıştır
        if (atr.Value > bb.Width * 0.5) return;
        
        double currentPrice = Close[0];
        
        foreach (double level in gridLevels)
        {
            // Alış seviyesi
            if (currentPrice <= level && !HasPositionAtLevel(level, "Long"))
            {
                if (GetLongPositionCount() < maxPositions)
                {
                    EnterLong(positionSize, "Grid_Long_" + level.ToString("F2"));
                }
            }
            
            // Satış seviyesi
            if (currentPrice >= level && !HasPositionAtLevel(level, "Short"))
            {
                if (GetShortPositionCount() < maxPositions)
                {
                    EnterShort(positionSize, "Grid_Short_" + level.ToString("F2"));
                }
            }
        }
    }
    
    private bool HasPositionAtLevel(double level, string direction)
    {
        // Pozisyon kontrol mantığı
        return false;
    }
    
    private int GetLongPositionCount() { return 0; }
    private int GetShortPositionCount() { return 0; }
}`
  },
  {
    id: 'macd-trend',
    name: 'MACD Trend Following',
    description: 'MACD sinyalleri ile trend takip stratejisi',
    category: 'trend',
    indicators: ['MACD', 'SMA'],
    icon: <TrendingUp className="w-4 h-4" />,
    code: `using System;
using MatriksIQ.API;

public class MACDTrendStrategy : Strategy
{
    private int macdFast = 12;
    private int macdSlow = 26;
    private int macdSignal = 9;
    private int smaPeriod = 50;
    
    private MACD macd;
    private SMA sma50;
    
    public override void OnStart()
    {
        macd = MACD(macdFast, macdSlow, macdSignal);
        sma50 = SMA(smaPeriod);
    }
    
    public override void OnBarUpdate()
    {
        if (Bars.Count < smaPeriod) return;
        
        // Trend belirleme
        bool longTrend = Close[0] > sma50.Value;
        bool shortTrend = Close[0] < sma50.Value;
        
        // MACD sinyalleri
        bool macdBullish = macd.Value > macd.Signal && macd.Value[1] <= macd.Signal[1];
        bool macdBearish = macd.Value < macd.Signal && macd.Value[1] >= macd.Signal[1];
        
        // Long pozisyon
        if (longTrend && macdBullish && Position.MarketPosition != MarketPosition.Long)
        {
            if (Position.MarketPosition == MarketPosition.Short)
                ExitShort();
            
            EnterLong();
            SetStopLoss(CalculationMode.Price, sma50.Value);
        }
        
        // Short pozisyon
        if (shortTrend && macdBearish && Position.MarketPosition != MarketPosition.Short)
        {
            if (Position.MarketPosition == MarketPosition.Long)
                ExitLong();
            
            EnterShort();
            SetStopLoss(CalculationMode.Price, sma50.Value);
        }
    }
}`
  },
  {
    id: 'breakout',
    name: 'Breakout Strategy',
    description: 'Bollinger Bands kırılımlarını takip eden breakout stratejisi',
    category: 'breakout',
    indicators: ['Bollinger Bands', 'Volume', 'RSI'],
    icon: <Target className="w-4 h-4" />,
    code: `using System;
using MatriksIQ.API;

public class BreakoutStrategy : Strategy
{
    private int bbPeriod = 20;
    private double bbStdDev = 2.0;
    private double volumeThreshold = 1.5; // Ortalama hacmin 1.5 katı
    private int rsiPeriod = 14;
    
    private BollingerBands bb;
    private SMA volumeAvg;
    private RSI rsi;
    
    public override void OnStart()
    {
        bb = BollingerBands(bbPeriod, bbStdDev);
        volumeAvg = SMA(Volume, 20);
        rsi = RSI(rsiPeriod);
    }
    
    public override void OnBarUpdate()
    {
        if (Bars.Count < Math.Max(bbPeriod, 20)) return;
        
        double currentPrice = Close[0];
        double upperBand = bb.Upper;
        double lowerBand = bb.Lower;
        double currentVolume = Volume[0];
        double avgVolume = volumeAvg.Value;
        
        // Hacim kontrolü
        bool highVolume = currentVolume > avgVolume * volumeThreshold;
        
        // Üst band kırılımı (Bullish Breakout)
        if (currentPrice > upperBand && 
            Close[1] <= bb.Upper[1] && 
            highVolume && 
            rsi.Value < 80 &&
            Position.MarketPosition == MarketPosition.Flat)
        {
            EnterLong();
            SetStopLoss(CalculationMode.Price, bb.Middle);
            SetProfitTarget(CalculationMode.Price, currentPrice + (currentPrice - bb.Middle));
        }
        
        // Alt band kırılımı (Bearish Breakout)
        if (currentPrice < lowerBand && 
            Close[1] >= bb.Lower[1] && 
            highVolume && 
            rsi.Value > 20 &&
            Position.MarketPosition == MarketPosition.Flat)
        {
            EnterShort();
            SetStopLoss(CalculationMode.Price, bb.Middle);
            SetProfitTarget(CalculationMode.Price, currentPrice - (bb.Middle - currentPrice));
        }
        
        // Pozisyon çıkış kontrolü (Orta banda dönüş)
        if (Position.MarketPosition == MarketPosition.Long && currentPrice <= bb.Middle)
        {
            ExitLong();
        }
        
        if (Position.MarketPosition == MarketPosition.Short && currentPrice >= bb.Middle)
        {
            ExitShort();
        }
    }
}`
  },
  {
    id: 'mean-reversion',
    name: 'Mean Reversion',
    description: 'Ortalamaya dönüş stratejisi - aşırı sapmaları yakalayan strateji',
    category: 'mean_reversion',
    indicators: ['RSI', 'Bollinger Bands', 'SMA'],
    icon: <Activity className="w-4 h-4" />,
    code: `using System;
using MatriksIQ.API;

public class MeanReversionStrategy : Strategy
{
    private int rsiPeriod = 14;
    private int bbPeriod = 20;
    private double bbStdDev = 2.5;
    private int smaPeriod = 200;
    
    private RSI rsi;
    private BollingerBands bb;
    private SMA sma200;
    
    public override void OnStart()
    {
        rsi = RSI(rsiPeriod);
        bb = BollingerBands(bbPeriod, bbStdDev);
        sma200 = SMA(smaPeriod);
    }
    
    public override void OnBarUpdate()
    {
        if (Bars.Count < smaPeriod) return;
        
        double currentPrice = Close[0];
        double rsiValue = rsi.Value;
        double lowerBand = bb.Lower;
        double upperBand = bb.Upper;
        double smaValue = sma200.Value;
        
        // Genel trend (uzun vadeli)
        bool inUpTrend = currentPrice > smaValue;
        bool inDownTrend = currentPrice < smaValue;
        
        // Aşırı satım koşulları (Long girişi)
        if (rsiValue < 25 && 
            currentPrice < lowerBand && 
            inUpTrend && // Uzun vadeli trend yukarı
            Position.MarketPosition == MarketPosition.Flat)
        {
            EnterLong();
            SetStopLoss(CalculationMode.Percent, 2.0);
            SetProfitTarget(CalculationMode.Price, bb.Middle);
        }
        
        // Aşırı alım koşulları (Short girişi)
        if (rsiValue > 75 && 
            currentPrice > upperBand && 
            inDownTrend && // Uzun vadeli trend aşağı
            Position.MarketPosition == MarketPosition.Flat)
        {
            EnterShort();
            SetStopLoss(CalculationMode.Percent, 2.0);
            SetProfitTarget(CalculationMode.Price, bb.Middle);
        }
        
        // Erken çıkış koşulları
        if (Position.MarketPosition == MarketPosition.Long)
        {
            if (rsiValue > 60 || currentPrice >= bb.Middle)
            {
                ExitLong();
            }
        }
        
        if (Position.MarketPosition == MarketPosition.Short)
        {
            if (rsiValue < 40 || currentPrice <= bb.Middle) 
            {
                ExitShort();
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
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'scalping': return 'bg-red-100 text-red-700 border-red-200'
      case 'grid': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'trend': return 'bg-green-100 text-green-700 border-green-200'
      case 'breakout': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'mean_reversion': return 'bg-orange-100 text-orange-700 border-orange-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'scalping': return 'Scalping'
      case 'grid': return 'Grid Bot'
      case 'trend': return 'Trend Takip'
      case 'breakout': return 'Breakout'
      case 'mean_reversion': return 'Mean Reversion'
      default: return category
    }
  }

  return (
    <ScrollArea className="h-full p-3">
      <div className="space-y-3">
        <div className="text-sm font-medium text-muted-foreground px-1">
          Hazır Strateji Şablonları
        </div>
        
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className="p-3 cursor-pointer hover:bg-accent transition-colors border-l-4 border-l-primary"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {template.icon}
                  <h4 className="font-medium text-sm">{template.name}</h4>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getCategoryColor(template.category)}`}
                >
                  {getCategoryName(template.category)}
                </Badge>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                {template.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {template.indicators.map((indicator, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {indicator}
                  </Badge>
                ))}
              </div>
              
              <Button
                size="sm"
                className="w-full h-7 text-xs"
                onClick={() => onSelectTemplate(template)}
              >
                Şablonu Kullan
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}