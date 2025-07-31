// TypeScript Binance Service Test
import { binanceService, KlineData, PositionInfo, BinanceOrder, AccountInfo, TickerInfo } from '../services/binanceService';

// Test that the service exports are working correctly
export const testBinanceService = async () => {
  try {
    // Test basic connectivity (doesn't require API keys)
    const isConnected = await binanceService.testConnection();
    console.log('Binance bağlantı testi:', isConnected ? 'Başarılı' : 'Başarısız');

    // Test 24hr ticker data (doesn't require API keys)
    const tickerData = await binanceService.getTicker24hr('BTCUSDT');
    console.log('BTCUSDT 24hr ticker:', tickerData);

    // Test kline data (doesn't require API keys)
    const klineData = await binanceService.getKlineData('BTCUSDT', '1h', 10);
    console.log('BTCUSDT kline verisi (10 adet):', klineData.length);

    return {
      connectivity: isConnected,
      tickerData,
      klineDataCount: klineData.length
    };
  } catch (error) {
    console.error('Binance service test hatası:', error);
    throw error;
  }
};

// Test authenticated methods (requires API keys)
export const testAuthenticatedMethods = async () => {
  try {
    // Test API keys
    const authTest = await binanceService.testApiConnection();
    console.log('API anahtarları geçerli:', authTest);

    if (authTest) {
      // Test account info
      const accountInfo = await binanceService.getAccountInfo();
      console.log('Hesap bilgileri:', accountInfo);

      // Test position info
      const positions = await binanceService.getPositionInformation();
      console.log('Pozisyon sayısı:', positions.length);
    }

    return {
      authenticationWorking: authTest
    };
  } catch (error) {
    console.error('Authenticated methods test hatası:', error);
    throw error;
  }
};

// Type checking tests
export const testTypes = () => {
  // Test that all interfaces are properly exported and typed
  const klineExample: KlineData = {
    openTime: Date.now(),
    open: '50000',
    high: '51000',
    low: '49000',
    close: '50500',
    volume: '100',
    closeTime: Date.now(),
    quoteAssetVolume: '5000000',
    numberOfTrades: 1000,
    takerBuyBaseAssetVolume: '60',
    takerBuyQuoteAssetVolume: '3000000',
    ignore: '0'
  };

  console.log('KlineData type test:', typeof klineExample === 'object');
  
  // Test PositionInfo type
  const positionExample: PositionInfo = {
    symbol: 'BTCUSDT',
    positionAmt: '0.001',
    entryPrice: '50000',
    markPrice: '50500',
    unRealizedProfit: '0.5',
    liquidationPrice: '45000',
    leverage: '10',
    maxNotionalValue: '1000000',
    marginType: 'isolated',
    isolatedMargin: '5000',
    isAutoAddMargin: 'false',
    positionSide: 'LONG',
    notional: '50.5',
    isolatedWallet: '5000',
    updateTime: Date.now()
  };

  console.log('PositionInfo type test:', typeof positionExample === 'object');
  
  return true;
};