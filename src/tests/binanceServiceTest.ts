// TypeScript Binance Service Test
import { binanceService, KlineData, PositionInfo, OrderInfo, AccountInfo, Ticker24hr } from '../services/binanceService';

// Test that the service exports are working correctly
export const testBinanceService = async () => {
  try {
    // Test basic connectivity (doesn't require API keys)
    const isConnected = await binanceService.testConnectivity();
    console.log('Binance bağlantı testi:', isConnected ? 'Başarılı' : 'Başarısız');

    // Test server time (doesn't require API keys)
    const serverTime = await binanceService.getServerTime();
    console.log('Binance server zamanı:', new Date(serverTime));

    // Test 24hr ticker data (doesn't require API keys)
    const tickerData = await binanceService.get24hrTicker('BTCUSDT');
    console.log('BTCUSDT 24hr ticker:', tickerData);

    // Test symbol prices (doesn't require API keys)
    const priceData = await binanceService.getSymbolPrices('BTCUSDT');
    console.log('BTCUSDT fiyat verisi:', priceData);

    // Test kline data (doesn't require API keys)
    const klineData = await binanceService.getKlineData('BTCUSDT', '1h', 10);
    console.log('BTCUSDT kline verisi (10 adet):', klineData.length);

    // Test multi-timeframe data (doesn't require API keys)
    const multiData = await binanceService.getMultiTimeframeData('BTCUSDT', ['1m', '5m', '1h'], 5);
    console.log('Çoklu zaman dilimi verisi:', Object.keys(multiData));

    return {
      connectivity: isConnected,
      serverTime,
      tickerData,
      priceData,
      klineDataCount: klineData.length,
      multiTimeframes: Object.keys(multiData)
    };
  } catch (error) {
    console.error('Binance service test hatası:', error);
    throw error;
  }
};

// Test authenticated methods (requires API keys)
export const testAuthenticatedMethods = async () => {
  try {
    // These methods require valid API keys
    const isValidCredentials = binanceService.validateCredentials();
    console.log('API anahtarları geçerli:', isValidCredentials);

    if (isValidCredentials) {
      // Test authenticated connection
      const authTest = await binanceService.testConnection();
      console.log('Authenticated bağlantı testi:', authTest ? 'Başarılı' : 'Başarısız');

      if (authTest) {
        // Test account info
        const accountInfo = await binanceService.getAccountInfo();
        console.log('Hesap bilgileri:', accountInfo);

        // Test position info
        const positions = await binanceService.getPositionInfo();
        console.log('Pozisyon sayısı:', positions.length);
      }
    }

    return {
      hasCredentials: isValidCredentials,
      authenticationWorking: isValidCredentials ? await binanceService.testConnection() : false
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
    symbol: 'BTCUSDT',
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