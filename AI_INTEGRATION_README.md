# AI API Entegrasyonu - Kurulum ve Kullanım Rehberi

Bu dokümantasyon, trading uygulamasındaki AI API entegrasyonunun nasıl kurulacağını ve kullanılacağını açıklar.

## 🚀 Özellikler

- **Gerçek AI API Entegrasyonu**: OpenAI ve Anthropic API'leri ile doğrudan bağlantı
- **Çoklu Model Desteği**: GPT-4, GPT-3.5 Turbo, Claude 3 Sonnet, Claude 3 Haiku
- **Akıllı Hata Yönetimi**: API hatalarını yakalar ve kullanıcı dostu mesajlar gösterir
- **Güvenli Saklama**: API anahtarları yerel olarak tarayıcıda saklanır
- **Performans İzleme**: API kullanımı ve token tüketimi takibi
- **Test Araçları**: API bağlantısını ve model performansını test etme araçları

## 📦 Kurulum

### 1. API Anahtarları

#### OpenAI API Anahtarı
1. [OpenAI Platform](https://platform.openai.com/) hesabı oluşturun
2. [API Keys](https://platform.openai.com/api-keys) sayfasından yeni anahtar oluşturun
3. [Billing](https://platform.openai.com/account/billing/overview) sayfasından kredi yükleyin

#### Anthropic API Anahtarı  
1. [Anthropic Console](https://console.anthropic.com/) hesabı oluşturun
2. [API Keys](https://console.anthropic.com/account/keys) sayfasından anahtar oluşturun
3. Billing ayarlarından ödeme yöntemi ekleyin

### 2. Uygulamada Kurulum

1. **Dashboard'da AI Ayarları butonuna tıklayın**
2. **API anahtarlarınızı girin**
3. **"Test Et" butonu ile bağlantıyı doğrulayın**
4. **Tercih ettiğiniz modeli seçin**
5. **Kaydet butonuna tıklayın**

## 🛠️ Kullanım

### Strateji Oluşturma

```typescript
// AI servisini kullanarak strateji oluşturma
const response = await aiService.generateStrategyCode(
  "Basit bir RSI stratejisi oluştur",
  currentCode // mevcut kod (opsiyonel)
)
```

### Kod Açıklama

```typescript
// Mevcut strateji kodunu açıklama
const explanation = await aiService.explainStrategy(strategyCode)
```

### Hata Düzeltme

```typescript
// Kodlardaki hataları bulma ve düzeltme
const fixes = await aiService.findAndFixErrors(strategyCode)
```

### Optimizasyon

```typescript
// Strateji optimizasyonu
const optimized = await aiService.optimizeStrategy(strategyCode)
```

### İndikatör Ekleme

```typescript
// Yeni indikatör ekleme
const updated = await aiService.addIndicator(strategyCode, "MACD")
```

## 🔧 Yapılandırma

### Model Ayarları

```typescript
interface AIConfig {
  openaiApiKey?: string
  anthropicApiKey?: string
  preferredModel: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-sonnet' | 'claude-3-haiku'
  temperature: number // 0.0 - 1.0
  maxTokens: number   // 500 - 4000
}
```

### Model Karşılaştırması

| Model | Hız | Kalite | Maliyet | En İyi Kullanım |
|-------|-----|--------|---------|-----------------|
| GPT-4 | Yavaş | En Yüksek | Yüksek | Karmaşık kod üretimi |
| GPT-3.5 Turbo | Hızlı | İyi | Düşük | Hızlı işlemler |
| Claude 3 Sonnet | Orta | Yüksek | Orta | Uzun kod analizi |
| Claude 3 Haiku | En Hızlı | İyi | En Düşük | Basit görevler |

## 🔒 Güvenlik

- **API anahtarları sadece tarayıcıda saklanır**
- **Sunucularımıza gönderilmez**
- **localStorage ile şifrelenir**
- **İstediğiniz zaman silebilirsiniz**

## 🧪 Test Araçları

### AI Test Paneli
Dashboard'dan "AI Test" butonuna tıklayarak:
- API bağlantısını test edin
- Farklı modelleri karşılaştırın
- Strateji oluşturma performansını ölçün

### Hata Ayıklama

```typescript
// Console'da AI servisi durumu
console.log(aiService.getConfig())

// API çağrısı test etme
try {
  const result = await aiService.generalQuestion("Test")
  console.log('AI çalışıyor:', result)
} catch (error) {
  console.error('AI hatası:', error)
}
```

## 💰 Maliyet Yönetimi

### Tahmini Maliyetler

- **Strateji oluşturma**: $0.10 - $0.50
- **Kod açıklama**: $0.05 - $0.15  
- **Hata düzeltme**: $0.15 - $0.30
- **Optimizasyon**: $0.20 - $0.40

### Maliyet Azaltma İpuçları

1. **GPT-3.5 Turbo kullanın** basit görevler için
2. **Temperature değerini düşürün** (0.3-0.5)
3. **MaxTokens limitini ayarlayın**
4. **Gereksiz API çağrılarından kaçının**

## 🔧 Sorun Giderme

### Sık Karşılaşılan Hatalar

#### "API anahtarı bulunamadı"
- AI Ayarları'ndan API anahtarınızı girin
- Anahtarın doğru formatda olduğunu kontrol edin

#### "Quota exceeded"
- API sağlayıcı hesabınızda kredi kalmamış
- Billing sayfasından kredi yükleyin

#### "Invalid API key"
- API anahtarı yanlış girilmiş
- Yeni anahtar oluşturup tekrar deneyin

#### "Rate limit exceeded"  
- Çok fazla istek gönderilmiş
- Birkaç saniye bekleyip tekrar deneyin

### Debug Modu

```typescript
// localStorage'da debug modunu açma
localStorage.setItem('ai-debug', 'true')

// Detaylı logları görmek için
console.log('AI Config:', aiService.getConfig())
```

## 📊 Performans İzleme

### API Kullanım İstatistikleri

```typescript
// Token kullanımını izleme
const response = await aiService.generateStrategyCode(prompt)
console.log('Token kullanımı:', response.usage)
```

### Önbellek Stratejileri

- Sık kullanılan promptları önbellekte tutun
- Benzer istekleri gruplandırın
- Batch işlemleri kullanın

## 🚀 Gelişmiş Kullanım

### Özel Prompt Şablonları

```typescript
const customPrompt = `
Sen bir trading uzmanısın. 
Kullanıcı isteği: ${userRequest}
Mevcut kod: ${currentCode}
Piyasa koşulu: ${marketCondition}

Lütfen bu stratejiyi optimize et...
`
```

### Çoklu Model Kullanımı

```typescript
// Farklı görevler için farklı modeller
const codeGeneration = await aiService.callOpenAI(prompt) // GPT-4
const explanation = await aiService.callAnthropic(prompt) // Claude
```

## 📚 API Referansı

### AIService Sınıfı

```typescript
class AIService {
  // Konfigürasyon
  updateConfig(config: Partial<AIConfig>): Promise<void>
  getConfig(): AIConfig
  
  // Strateji işlemleri
  generateStrategyCode(request: string, currentCode?: string): Promise<AIResponse>
  explainStrategy(code: string): Promise<AIResponse>
  findAndFixErrors(code: string): Promise<AIResponse>
  optimizeStrategy(code: string): Promise<AIResponse>
  addIndicator(code: string, indicator: string): Promise<AIResponse>
  
  // Genel sorgular
  generalQuestion(question: string, context?: string): Promise<AIResponse>
}
```

### AIResponse Arayüzü

```typescript
interface AIResponse {
  content: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
```

## 🎯 En İyi Uygulamalar

1. **Açık ve spesifik promptlar yazın**
2. **Hata durumlarını yakalayın**
3. **API limitlerini göz önünde bulundurun**
4. **Farklı modelleri test edin**
5. **Token kullanımını optimize edin**
6. **Güvenlik kurallarına uyun**

## 🤝 Destek

Sorunlarınız için:
- GitHub Issues açın
- Dokümantasyonu inceleyin
- AI Test panelini kullanın
- Community forumlarına başvurun

## 📝 Değişiklik Notları

### v1.0.0
- ✅ OpenAI API entegrasyonu
- ✅ Anthropic API entegrasyonu  
- ✅ Çoklu model desteği
- ✅ Güvenli anahtar saklama
- ✅ Test araçları
- ✅ Hata yönetimi

---

*Bu dokümantasyon sürekli güncellenmektedir. En son sürümü için repository'yi kontrol edin.*