// Chart Data Resolver - Multi-Asset Support
export type AssetType = 'crypto' | 'stock' | 'forex' | 'index' | 'commodity'

export interface ChartData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export interface AssetInfo {
  symbol: string
  type: AssetType
  name: string
  source: string
}

// Otomatik sembol tanıma
export function detectAssetType(symbol: string): AssetType {
  const upperSymbol = symbol.toUpperCase()
  
  // Kripto tanıma - USDT, BUSD, BTC gibi suffixler
  if (upperSymbol.includes('USDT') || upperSymbol.includes('BUSD') || 
      upperSymbol.includes('BTC') || upperSymbol.includes('ETH')) {
    return 'crypto'
  }
  
  // Forex tanıma - 6 karakter ve USDTRY, EURUSD gibi
  if (upperSymbol.length === 6 && 
      (upperSymbol.includes('USD') || upperSymbol.includes('EUR') || 
       upperSymbol.includes('GBP') || upperSymbol.includes('TRY'))) {
    return 'forex'
  }
  
  // Emtia tanıma - XAU, WTI, BRENT gibi
  if (upperSymbol.startsWith('XAU') || upperSymbol.includes('WTI') || 
      upperSymbol.includes('BRENT') || upperSymbol.includes('OIL')) {
    return 'commodity'
  }
  
  // Endeks tanıma - SPX, NASDAQ gibi
  if (upperSymbol.includes('SPX') || upperSymbol.includes('NASDAQ') || 
      upperSymbol.includes('DJI') || upperSymbol.includes('BIST')) {
    return 'index'
  }
  
  // Varsayılan hisse senedi
  return 'stock'
}

// Binance Crypto Data
async function fetchFromBinance(symbol: string): Promise<ChartData[]> {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=100`
    )
    const data = await response.json()
    
    return data.map((candle: any[]) => ({
      time: candle[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5])
    }))
  } catch (error) {
    console.error('Binance API hatası:', error)
    return []
  }
}

// Yahoo Finance Stock Data (Proxy gerekebilir)
async function fetchFromYahoo(symbol: string): Promise<ChartData[]> {
  try {
    // Yahoo Finance için CORS proxy kullanılabilir
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1h&range=7d`
    )
    const data = await response.json()
    
    const result = data.chart.result[0]
    const timestamps = result.timestamp
    const prices = result.indicators.quote[0]
    
    return timestamps.map((time: number, index: number) => ({
      time: time * 1000,
      open: prices.open[index] || 0,
      high: prices.high[index] || 0,
      low: prices.low[index] || 0,
      close: prices.close[index] || 0,
      volume: result.indicators.quote[0].volume[index] || 0
    })).filter((item: ChartData) => item.close > 0)
  } catch (error) {
    console.error('Yahoo Finance API hatası:', error)
    return []
  }
}

// TwelveData Forex (API Key gerekir)
async function fetchFromTwelveData(symbol: string): Promise<ChartData[]> {
  try {
    // Demo data - gerçek implementasyon için API key gerekir
    const demoData: ChartData[] = []
    const now = Date.now()
    
    for (let i = 100; i >= 0; i--) {
      const basePrice = 34.5 // USDTRY demo fiyat
      const volatility = 0.02
      const price = basePrice + (Math.random() - 0.5) * volatility * basePrice
      
      demoData.push({
        time: now - (i * 3600000), // Her saat
        open: price,
        high: price * 1.005,
        low: price * 0.995,
        close: price * (1 + (Math.random() - 0.5) * 0.01),
        volume: Math.random() * 1000000
      })
    }
    
    return demoData
  } catch (error) {
    console.error('TwelveData API hatası:', error)
    return []
  }
}

// MarketStack Commodity Data
async function fetchFromMarketStack(symbol: string): Promise<ChartData[]> {
  try {
    // Demo altın fiyatı verisi
    const demoData: ChartData[] = []
    const now = Date.now()
    
    for (let i = 100; i >= 0; i--) {
      const basePrice = 2650 // Altın demo fiyat (USD/oz)
      const volatility = 0.015
      const price = basePrice + (Math.random() - 0.5) * volatility * basePrice
      
      demoData.push({
        time: now - (i * 3600000),
        open: price,
        high: price * 1.008,
        low: price * 0.992,
        close: price * (1 + (Math.random() - 0.5) * 0.008),
        volume: Math.random() * 50000
      })
    }
    
    return demoData
  } catch (error) {
    console.error('MarketStack API hatası:', error)
    return []
  }
}

// TradingView Embed Index Data
async function fetchFromTradingViewEmbed(symbol: string): Promise<ChartData[]> {
  try {
    // Demo S&P 500 verisi
    const demoData: ChartData[] = []
    const now = Date.now()
    
    for (let i = 100; i >= 0; i--) {
      const basePrice = 5800 // S&P 500 demo
      const volatility = 0.01
      const price = basePrice + (Math.random() - 0.5) * volatility * basePrice
      
      demoData.push({
        time: now - (i * 3600000),
        open: price,
        high: price * 1.003,
        low: price * 0.997,
        close: price * (1 + (Math.random() - 0.5) * 0.005),
        volume: Math.random() * 1000000000
      })
    }
    
    return demoData
  } catch (error) {
    console.error('TradingView API hatası:', error)
    return []
  }
}

// Ana chart data resolver fonksiyonu
export async function getChartData(symbol: string, type?: AssetType): Promise<ChartData[]> {
  const assetType = type || detectAssetType(symbol)
  
  switch (assetType) {
    case 'crypto':
      return await fetchFromBinance(symbol)
    case 'stock':
      return await fetchFromYahoo(symbol)
    case 'forex':
      return await fetchFromTwelveData(symbol)
    case 'index':
      return await fetchFromTradingViewEmbed(symbol)
    case 'commodity':
      return await fetchFromMarketStack(symbol)
    default:
      return []
  }
}

// Asset bilgisi
export function getAssetInfo(symbol: string): AssetInfo {
  const type = detectAssetType(symbol)
  
  const assetNames: Record<string, string> = {
    'BTCUSDT': 'Bitcoin',
    'ETHUSDT': 'Ethereum',
    'AAPL': 'Apple Inc.',
    'TSLA': 'Tesla Inc.',
    'USDTRY': 'USD/TRY',
    'EURUSD': 'EUR/USD',
    'XAUUSD': 'Gold',
    'SPX': 'S&P 500'
  }
  
  const sources: Record<AssetType, string> = {
    crypto: 'Binance',
    stock: 'Yahoo Finance',
    forex: 'TwelveData',
    index: 'TradingView',
    commodity: 'MarketStack'
  }
  
  return {
    symbol: symbol.toUpperCase(),
    type,
    name: assetNames[symbol.toUpperCase()] || symbol.toUpperCase(),
    source: sources[type]
  }
}