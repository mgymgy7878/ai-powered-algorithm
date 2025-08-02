# WebSocket Gerçek Zamanlı Veri Akışı Sistemi

Bu döküman, AI Trading Platform'un WebSocket tabanlı gerçek zamanlı veri akışı sisteminin kullanımını ve test süreçlerini açıklamaktadır.

## 🚀 Sistem Özellikleri

### WebSocket Bağlantı Türleri
- **Ticker Stream**: 24 saatlik fiyat değişim verileri
- **Kline Stream**: Mum (candlestick) verileri (1m, 5m, 1h, 1d, vb.)
- **Depth Stream**: Emir defteri (order book) verileri
- **Trade Stream**: Gerçek zamanlı işlem verileri
- **Multi-Ticker Stream**: Çoklu sembol takibi

### Performans Özellikleri
- Otomatik yeniden bağlanma (exponential backoff)
- Bağlantı sağlığı izleme
- Gerçek zamanlı performans metrikleri
- Hata yönetimi ve loglama
- Throughput ve latency ölçümü

## 📡 WebSocket Servisi Kullanımı

### Temel Kullanım

```typescript
import { websocketService } from '@/services/websocketService'

// Ticker verisi dinleme
websocketService.subscribeToTicker('BTCUSDT', (data) => {
  console.log('Price:', data.price, 'Change:', data.changePercent)
})

// Kline verisi dinleme
websocketService.subscribeToKline('ETHUSDT', '1m', (data) => {
  console.log('OHLCV:', data.open, data.high, data.low, data.close, data.volume)
})
```

### Çoklu Sembol Takibi

```typescript
const symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT']

websocketService.subscribeToMultipleTickers(symbols, (data) => {
  console.log(`${data.symbol}: $${data.price} (${data.changePercent}%)`)
})
```

### Bağlantı Yönetimi

```typescript
// Bağlantı durumunu kontrol et
const status = websocketService.getConnectionStatus('ticker-BTCUSDT')
console.log('Connection status:', status)

// Belirli bir bağlantıyı kapat
websocketService.disconnect('ticker-BTCUSDT')

// Tüm bağlantıları kapat
websocketService.disconnectAll()

// Aktif bağlantıları listele
const activeConnections = websocketService.getActiveConnections()
console.log('Active connections:', activeConnections)
```

## 🧪 Test Sistemleri

### 1. Otomatik Test Suite

Platform, kapsamlı bir otomatik test sistemi içerir:

```typescript
import { webSocketTestSuite } from '@/utils/webSocketTestSuite'

// Tüm testleri çalıştır
const results = await webSocketTestSuite.runAllTests()
console.log(`Passed: ${results.passed}, Failed: ${results.failed}`)

// Test raporu oluştur
const report = webSocketTestSuite.generateReport()
console.log(report)
```

**Test Kapsamı:**
- Ticker bağlantısı testi
- Kline bağlantısı testi  
- Depth bağlantısı testi
- Trade bağlantısı testi
- Multi-ticker bağlantısı testi
- Bağlantı durumu kontrolü
- Bağlantı kapatma testi
- Yeniden bağlanma testi

### 2. Manuel Test Arayüzü

WebSocket Test sayfası (`/websocket-test`) üzerinden:

- Farklı veri türleri için manuel bağlantı testleri
- Gerçek zamanlı veri görüntüleme
- Bağlantı durumu izleme
- Performans metrikleri takibi
- Log kayıtları inceleme

### 3. Performans İzleme

Gerçek zamanlı sistem performansı takibi:

```typescript
import { useWebSocketMonitoring } from '@/hooks/useWebSocketMonitoring'
import { useNetworkPerformance } from '@/hooks/useNetworkPerformance'

const {
  connectionHealth,
  performanceMetrics,
  getHealthStatus
} = useWebSocketMonitoring()

const {
  performance,
  startMonitoring,
  stopMonitoring
} = useNetworkPerformance()
```

**İzlenen Metrikler:**
- Ağ gecikmesi (latency)
- Veri aktarım hızı (throughput)
- Paket/saniye oranı
- Bağlantı süresi
- Yeniden bağlanma sayısı
- Hata oranları

## 🔧 Yapılandırma

### Binance WebSocket Endpoints

```typescript
// Mainnet endpoints
const BINANCE_WEBSOCKET_URL = 'wss://stream.binance.com:9443'

// Ticker stream
wss://stream.binance.com:9443/ws/btcusdt@ticker

// Kline stream  
wss://stream.binance.com:9443/ws/btcusdt@kline_1m

// Depth stream
wss://stream.binance.com:9443/ws/btcusdt@depth10@100ms

// Trade stream
wss://stream.binance.com:9443/ws/btcusdt@trade

// Multi-stream
wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker
```

### Yeniden Bağlanma Ayarları

```typescript
class WebSocketService {
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000 // ms
  
  // Exponential backoff: 1s, 2s, 4s, 8s, 16s
  private calculateDelay(attempts: number): number {
    return this.reconnectDelay * Math.pow(2, attempts)
  }
}
```

## 📈 Kullanım Senaryoları

### 1. Dashboard'da Canlı Fiyat Gösterimi

```typescript
// Dashboard bileşeninde
import { MarketDashboard } from '@/components/market/MarketDashboard'

<MarketDashboard />
```

### 2. Trading Stratejilerinde Veri Kullanımı

```typescript
// Strateji içinde canlı veri dinleme
websocketService.subscribeToKline(symbol, interval, (klineData) => {
  if (klineData.isClosed) {
    // Yeni mum tamamlandı, strateji sinyali kontrol et
    const signal = analyzeStrategy(klineData)
    if (signal.action === 'BUY') {
      executeTrade(signal)
    }
  }
})
```

### 3. AI Trading Assistant'ta Piyasa Analizi

```typescript
// AI asistanı için piyasa verisi toplama
const marketSummary = {
  btc: await getLatestTicker('BTCUSDT'),
  eth: await getLatestTicker('ETHUSDT'),
  timestamp: new Date()
}

// AI'a piyasa durumu gönder
const aiResponse = await spark.llm(
  spark.llmPrompt`Piyasa durumu: ${JSON.stringify(marketSummary)}`
)
```

## 🛠️ Hata Giderme

### Sık Karşılaşılan Sorunlar

1. **Bağlantı Kurulamıyor**
   - İnternet bağlantısını kontrol edin
   - Firewall ayarlarını kontrol edin
   - Binance API'sinin erişilebilir olduğunu doğrulayın

2. **Sık Sık Kopma**
   - Ağ kararlılığını kontrol edin
   - Yeniden bağlanma ayarlarını gözden geçirin
   - Rate limiting kontrolü yapın

3. **Veri Gecikmesi**
   - Latency metriklerini kontrol edin
   - Alternatif endpoint'leri deneyin
   - Buffer boyutlarını optimize edin

### Debug Komutları

```javascript
// Konsol üzerinden test çalıştır
await window.runWebSocketTests()

// Bağlantı durumunu kontrol et
console.log(websocketService.getConnectionHealth())

// Performans metriklerini görüntüle
console.log(websocketService.getPerformanceMetrics())
```

## 📊 Başarı Metrikleri

İyi çalışan bir WebSocket sistemi için hedef değerler:

- **Latency**: < 100ms (mükemmel), < 200ms (iyi)
- **Uptime**: > 99% bağlantı süresi
- **Throughput**: Veri kaybı olmadan sürekli akış
- **Reconnection**: < 5 saniyede yeniden bağlanma
- **Error Rate**: < 1% hata oranı

## 🔮 Gelecek Geliştirmeler

- [ ] WebSocket compression (gzip) desteği
- [ ] Daha fazla exchange entegrasyonu (Coinbase, Kraken)
- [ ] Özel websocket proxy servisi
- [ ] Advanced filtering ve data aggregation
- [ ] Real-time alerting sistemi
- [ ] Performance optimization için connection pooling

---

*Bu döküman sürekli güncellenmektedir. Yeni özellikler ve iyileştirmeler eklendiğinde döküman da güncellenecektir.*