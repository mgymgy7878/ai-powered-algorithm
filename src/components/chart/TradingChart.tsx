import React, { useState } from 'react';
import { TradingViewWidget } from './TradingViewWidget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Maximize2, Minimize2, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useKV } from '@github/spark/hooks';

interface Props {
  defaultSymbol?: string;
  compact?: boolean;
  className?: string;
}

interface SymbolInfo {
  symbol: string;
  name: string;
  type: 'crypto' | 'stock' | 'forex' | 'commodity' | 'index';
  exchange: string;
  fullSymbol: string; // TradingView format
}

// Popüler semboller ve TradingView formatları
const POPULAR_SYMBOLS: SymbolInfo[] = [
  // Kripto
  { symbol: 'BTCUSDT', name: 'Bitcoin', type: 'crypto', exchange: 'Binance', fullSymbol: 'BINANCE:BTCUSDT' },
  { symbol: 'ETHUSDT', name: 'Ethereum', type: 'crypto', exchange: 'Binance', fullSymbol: 'BINANCE:ETHUSDT' },
  { symbol: 'BNBUSDT', name: 'BNB', type: 'crypto', exchange: 'Binance', fullSymbol: 'BINANCE:BNBUSDT' },
  
  // Hisse Senetleri
  { symbol: 'AAPL', name: 'Apple', type: 'stock', exchange: 'NASDAQ', fullSymbol: 'NASDAQ:AAPL' },
  { symbol: 'TSLA', name: 'Tesla', type: 'stock', exchange: 'NASDAQ', fullSymbol: 'NASDAQ:TSLA' },
  { symbol: 'MSFT', name: 'Microsoft', type: 'stock', exchange: 'NASDAQ', fullSymbol: 'NASDAQ:MSFT' },
  
  // Döviz
  { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex', exchange: 'OANDA', fullSymbol: 'OANDA:EURUSD' },
  { symbol: 'GBPUSD', name: 'GBP/USD', type: 'forex', exchange: 'OANDA', fullSymbol: 'OANDA:GBPUSD' },
  { symbol: 'USDTRY', name: 'USD/TRY', type: 'forex', exchange: 'OANDA', fullSymbol: 'OANDA:USDTRY' },
  
  // Emtia
  { symbol: 'XAUUSD', name: 'Altın', type: 'commodity', exchange: 'OANDA', fullSymbol: 'OANDA:XAUUSD' },
  { symbol: 'XAGUSD', name: 'Gümüş', type: 'commodity', exchange: 'OANDA', fullSymbol: 'OANDA:XAGUSD' },
  
  // Endeksler
  { symbol: 'SPX', name: 'S&P 500', type: 'index', exchange: 'SPX', fullSymbol: 'SPX' },
  { symbol: 'NAS100', name: 'NASDAQ 100', type: 'index', exchange: 'OANDA', fullSymbol: 'OANDA:NAS100USD' }
];

export const TradingChart: React.FC<Props> = ({ 
  defaultSymbol = 'BINANCE:BTCUSDT',
  compact = false,
  className = '' 
}) => {
  const [selectedSymbol, setSelectedSymbol] = useKV<string>('selected-chart-symbol', defaultSymbol);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [interval, setInterval] = useState('30');

  // Arama filtreleme
  const filteredSymbols = POPULAR_SYMBOLS.filter(s => 
    s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sembol tipine göre renk
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'crypto': return 'bg-orange-500/20 text-orange-700 border-orange-200';
      case 'stock': return 'bg-blue-500/20 text-blue-700 border-blue-200';
      case 'forex': return 'bg-green-500/20 text-green-700 border-green-200';
      case 'commodity': return 'bg-yellow-500/20 text-yellow-700 border-yellow-200';
      case 'index': return 'bg-purple-500/20 text-purple-700 border-purple-200';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-200';
    }
  };

  // Kompakt görünüm (Dashboard'da küçük)
  if (compact && !isFullscreen) {
    return (
      <Card className={`p-3 ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">
              {POPULAR_SYMBOLS.find(s => s.fullSymbol === selectedSymbol)?.symbol || 'BTC'}
            </span>
            <Badge variant="outline" className="text-xs">
              {POPULAR_SYMBOLS.find(s => s.fullSymbol === selectedSymbol)?.type || 'crypto'}
            </Badge>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setIsFullscreen(true)}
            className="h-6 w-6"
          >
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>
        
        <TradingViewWidget 
          symbol={selectedSymbol}
          height={180}
          interval={interval}
          allowSymbolChange={false}
        />
      </Card>
    );
  }

  // Tam ekran görünüm
  return (
    <>
      {/* Ana grafik komponenti */}
      {!isFullscreen ? (
        <Card className={`p-4 ${className}`}>
          <div className="flex flex-col gap-4">
            {/* Üst kontroller */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Sembol arayın... (örn: BTCUSDT, AAPL)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                
                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1m</SelectItem>
                    <SelectItem value="5">5m</SelectItem>
                    <SelectItem value="15">15m</SelectItem>
                    <SelectItem value="30">30m</SelectItem>
                    <SelectItem value="60">1h</SelectItem>
                    <SelectItem value="240">4h</SelectItem>
                    <SelectItem value="D">1D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => setIsFullscreen(true)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Sembol seçenekleri */}
            {searchTerm && (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {filteredSymbols.slice(0, 12).map((symbol) => (
                  <Button
                    key={symbol.fullSymbol}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSymbol(symbol.fullSymbol);
                      setSearchTerm('');
                    }}
                    className={`${getTypeColor(symbol.type)} hover:opacity-80`}
                  >
                    <span className="text-xs font-medium">{symbol.symbol}</span>
                    <span className="text-xs text-muted-foreground ml-1">({symbol.exchange})</span>
                  </Button>
                ))}
              </div>
            )}

            {/* Grafik */}
            <TradingViewWidget 
              symbol={selectedSymbol}
              height={400}
              interval={interval}
              allowSymbolChange={true}
            />
          </div>
        </Card>
      ) : null}

      {/* Tam ekran modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-screen">
            {/* Tam ekran üst bar */}
            <div className="flex items-center justify-between p-4 border-b bg-card">
              <div className="flex items-center gap-4">
                <Badge className={getTypeColor(POPULAR_SYMBOLS.find(s => s.fullSymbol === selectedSymbol)?.type || 'crypto')}>
                  {POPULAR_SYMBOLS.find(s => s.fullSymbol === selectedSymbol)?.name || selectedSymbol}
                </Badge>
                
                <Select value={interval} onValueChange={setInterval}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1m</SelectItem>
                    <SelectItem value="5">5m</SelectItem>
                    <SelectItem value="15">15m</SelectItem>
                    <SelectItem value="30">30m</SelectItem>
                    <SelectItem value="60">1h</SelectItem>
                    <SelectItem value="240">4h</SelectItem>
                    <SelectItem value="D">1D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Sembol değiştir..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-48"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setIsFullscreen(false)}
                >
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Küçült
                </Button>
              </div>
            </div>

            {/* Hızlı sembol seçimi */}
            {searchTerm && (
              <div className="p-4 border-b bg-muted/50">
                <div className="flex flex-wrap gap-2">
                  {filteredSymbols.slice(0, 15).map((symbol) => (
                    <Button
                      key={symbol.fullSymbol}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSymbol(symbol.fullSymbol);
                        setSearchTerm('');
                      }}
                      className={`${getTypeColor(symbol.type)} hover:opacity-80`}
                    >
                      <span className="font-medium">{symbol.symbol}</span>
                      <span className="text-muted-foreground ml-1">({symbol.name})</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Tam ekran grafik */}
            <div className="flex-1 p-4">
              <TradingViewWidget 
                symbol={selectedSymbol}
                height="100%"
                interval={interval}
                allowSymbolChange={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};