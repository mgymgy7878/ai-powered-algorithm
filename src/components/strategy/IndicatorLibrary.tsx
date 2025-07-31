import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Activity, BarChart, Zap, Search } from '@phosphor-icons/react'

interface Indicator {
  name: string
  displayName: string
  category: 'trend' | 'momentum' | 'volatility' | 'volume' | 'custom'
  description: string
  parameters: string[]
  usage: string
  icon: React.ReactNode
}

const indicators: Indicator[] = [
  // Trend İndikatörleri
  {
    name: 'SMA',
    displayName: 'Simple Moving Average',
    category: 'trend',
    description: 'Basit hareketli ortalama - fiyatların belirli dönem ortalaması',
    parameters: ['period'],
    usage: 'SMA sma = SMA(20);',
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    name: 'EMA',
    displayName: 'Exponential Moving Average',
    category: 'trend',
    description: 'Üstel hareketli ortalama - son fiyatlara daha fazla ağırlık verir',
    parameters: ['period'],
    usage: 'EMA ema = EMA(12);',
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    name: 'MACD',
    displayName: 'Moving Average Convergence Divergence',
    category: 'momentum',
    description: 'İki hareketli ortalamanın farkını hesaplayan momentum indikatörü',
    parameters: ['fast', 'slow', 'signal'],
    usage: 'MACD macd = MACD(12, 26, 9);',
    icon: <Activity className="w-4 h-4" />
  },
  {
    name: 'BollingerBands',
    displayName: 'Bollinger Bands',
    category: 'volatility',
    description: 'Volatilite bantları - ortalama etrafında standart sapma bantları',
    parameters: ['period', 'stdDev'],
    usage: 'BollingerBands bb = BollingerBands(20, 2);',
    icon: <BarChart className="w-4 h-4" />
  },
  
  // Momentum İndikatörleri
  {
    name: 'RSI',
    displayName: 'Relative Strength Index',
    category: 'momentum',
    description: 'Göreceli güç endeksi - aşırı alım/satım seviyelerini gösterir',
    parameters: ['period'],
    usage: 'RSI rsi = RSI(14);',
    icon: <Zap className="w-4 h-4" />
  },
  {
    name: 'Stochastic',
    displayName: 'Stochastic Oscillator',
    category: 'momentum',
    description: 'Fiyatın belirli dönemdeki en yüksek/düşük aralığındaki konumunu gösterir',
    parameters: ['kPeriod', 'dPeriod'],
    usage: 'Stochastic stoch = Stochastic(14, 3);',
    icon: <Activity className="w-4 h-4" />
  },
  {
    name: 'CCI',
    displayName: 'Commodity Channel Index',
    category: 'momentum',
    description: 'Fiyatın tipik fiyat ortalamasından sapmasını ölçer',
    parameters: ['period'],
    usage: 'CCI cci = CCI(20);',
    icon: <TrendingDown className="w-4 h-4" />
  },
  {
    name: 'Williams',
    displayName: 'Williams %R',
    category: 'momentum',
    description: 'Aşırı alım/satım seviyelerini gösteren osilatör',
    parameters: ['period'],
    usage: 'Williams williams = Williams(14);',
    icon: <Activity className="w-4 h-4" />
  },
  
  // Volatilite İndikatörleri
  {
    name: 'ATR',
    displayName: 'Average True Range',
    category: 'volatility',
    description: 'Ortalama gerçek aralık - volatilite ölçüsü',
    parameters: ['period'],
    usage: 'ATR atr = ATR(14);',
    icon: <BarChart className="w-4 h-4" />
  },
  {
    name: 'StandardDeviation',
    displayName: 'Standard Deviation',
    category: 'volatility',
    description: 'Standart sapma - fiyat dağılımının ölçüsü',
    parameters: ['period'],
    usage: 'StandardDeviation stdDev = StandardDeviation(20);',
    icon: <BarChart className="w-4 h-4" />
  },
  
  // Hacim İndikatörleri
  {
    name: 'VolumeMA',
    displayName: 'Volume Moving Average',
    category: 'volume',
    description: 'Hacim hareketli ortalaması',
    parameters: ['period'],
    usage: 'VolumeMA volMA = VolumeMA(20);',
    icon: <BarChart className="w-4 h-4" />
  },
  {
    name: 'OBV',
    displayName: 'On Balance Volume',
    category: 'volume',
    description: 'Birikimli hacim - fiyat yönüne göre hacim toplamı',
    parameters: [],
    usage: 'OBV obv = OBV();',
    icon: <BarChart className="w-4 h-4" />
  },
  {
    name: 'VWAP',
    displayName: 'Volume Weighted Average Price',
    category: 'volume',
    description: 'Hacim ağırlıklı ortalama fiyat',
    parameters: [],
    usage: 'VWAP vwap = VWAP();',
    icon: <BarChart className="w-4 h-4" />
  },
  
  // Trend İndikatörleri devam
  {
    name: 'ADX',
    displayName: 'Average Directional Index',
    category: 'trend',
    description: 'Trendin gücünü ölçen indikatör',
    parameters: ['period'],
    usage: 'ADX adx = ADX(14);',
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    name: 'ParabolicSAR',
    displayName: 'Parabolic SAR',
    category: 'trend',
    description: 'Trend değişim noktalarını belirleyen indikatör',
    parameters: ['acceleration', 'maximum'],
    usage: 'ParabolicSAR psar = ParabolicSAR(0.02, 0.2);',
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    name: 'Ichimoku',
    displayName: 'Ichimoku Cloud',
    category: 'trend',
    description: 'Kapsamlı trend analizi indikatörü',
    parameters: ['tenkan', 'kijun', 'senkou'],
    usage: 'Ichimoku ichimoku = Ichimoku(9, 26, 52);',
    icon: <TrendingUp className="w-4 h-4" />
  }
]

interface IndicatorLibraryProps {
  onSelectIndicator: (indicator: Indicator) => void
}

export function IndicatorLibrary({ onSelectIndicator }: IndicatorLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredIndicators = indicators.filter(indicator => {
    const matchesSearch = indicator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indicator.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indicator.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || indicator.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trend': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'momentum': return 'bg-green-100 text-green-700 border-green-200'
      case 'volatility': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'volume': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'custom': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'trend': return 'Trend'
      case 'momentum': return 'Momentum'
      case 'volatility': return 'Volatilite'
      case 'volume': return 'Hacim'
      case 'custom': return 'Özel'
      default: return category
    }
  }

  const getIndicatorsByCategory = (category: string) => {
    return indicators.filter(ind => ind.category === category)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="İndikatör ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-5 mx-3 mb-2">
          <TabsTrigger value="all" className="text-xs">Tümü</TabsTrigger>
          <TabsTrigger value="trend" className="text-xs">Trend</TabsTrigger>
          <TabsTrigger value="momentum" className="text-xs">Momentum</TabsTrigger>
          <TabsTrigger value="volatility" className="text-xs">Volatilite</TabsTrigger>
          <TabsTrigger value="volume" className="text-xs">Hacim</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {searchTerm ? (
              // Search Results
              <>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Arama Sonuçları ({filteredIndicators.length})
                </div>
                {filteredIndicators.map((indicator) => (
                  <IndicatorCard 
                    key={indicator.name} 
                    indicator={indicator} 
                    onSelect={onSelectIndicator}
                    getCategoryColor={getCategoryColor}
                    getCategoryName={getCategoryName}
                  />
                ))}
              </>
            ) : (
              // Category View
              <>
                {selectedCategory === 'all' ? (
                  // Show all categories
                  <>
                    {['trend', 'momentum', 'volatility', 'volume'].map(category => (
                      <div key={category} className="mb-4">
                        <div className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                          {getCategoryName(category)} İndikatörleri ({getIndicatorsByCategory(category).length})
                        </div>
                        {getIndicatorsByCategory(category).map((indicator) => (
                          <IndicatorCard 
                            key={indicator.name} 
                            indicator={indicator} 
                            onSelect={onSelectIndicator}
                            getCategoryColor={getCategoryColor}
                            getCategoryName={getCategoryName}
                          />
                        ))}
                      </div>
                    ))}
                  </>
                ) : (
                  // Show selected category
                  <>
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      {getCategoryName(selectedCategory)} İndikatörleri ({filteredIndicators.length})
                    </div>
                    {filteredIndicators.map((indicator) => (
                      <IndicatorCard 
                        key={indicator.name} 
                        indicator={indicator} 
                        onSelect={onSelectIndicator}
                        getCategoryColor={getCategoryColor}
                        getCategoryName={getCategoryName}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  )
}

interface IndicatorCardProps {
  indicator: Indicator
  onSelect: (indicator: Indicator) => void
  getCategoryColor: (category: string) => string
  getCategoryName: (category: string) => string
}

function IndicatorCard({ indicator, onSelect, getCategoryColor, getCategoryName }: IndicatorCardProps) {
  return (
    <Card className="p-3 mb-2 cursor-pointer hover:bg-accent transition-colors">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {indicator.icon}
            <div>
              <h4 className="font-medium text-sm">{indicator.name}</h4>
              <p className="text-xs text-muted-foreground">{indicator.displayName}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs ${getCategoryColor(indicator.category)}`}
          >
            {getCategoryName(indicator.category)}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground leading-relaxed">
          {indicator.description}
        </p>
        
        {indicator.parameters.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {indicator.parameters.map((param, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {param}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="bg-muted p-2 rounded text-xs font-mono">
          {indicator.usage}
        </div>
        
        <Button
          size="sm"
          className="w-full h-7 text-xs"
          onClick={() => onSelect(indicator)}
        >
          Koda Ekle
        </Button>
      </div>
    </Card>
  )
}