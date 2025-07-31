# OpenAI ve Anthropic API Anahtarları Konfigürasyonu

Bu uygulama, AI destekli trading stratejileri üretmek için OpenAI ve Anthropic API'lerini kullanır.

## API Anahtarları Nasıl Alınır

### OpenAI API Anahtarı
1. [OpenAI Platform](https://platform.openai.com/api-keys) adresine gidin
2. Hesabınızla giriş yapın veya yeni hesap oluşturun
3. "Create new secret key" butonuna tıklayın
4. Anahtarı kopyalayın (sk-... ile başlar)

### Anthropic API Anahtarı
1. [Anthropic Console](https://console.anthropic.com/settings/keys) adresine gidin
2. Hesabınızla giriş yapın veya yeni hesap oluşturun
3. "Create Key" butonuna tıklayın
4. Anahtarı kopyalayın (sk-ant-... ile başlar)

## Uygulama İçinde Ayarlama

1. Uygulamayı açın
2. Sol menüde "API Ayarları" butonuna tıklayın
3. API anahtarlarınızı ilgili alanlara yapıştırın
4. İstediğiniz modeli seçin:
   - **OpenAI**: GPT-4 (en iyi kalite), GPT-4 Turbo (hızlı), GPT-3.5 Turbo (ekonomik)
   - **Anthropic**: Claude 3 Opus (en iyi kalite), Claude 3 Sonnet (dengeli), Claude 3 Haiku (hızlı)
5. "Test Et" butonlarıyla bağlantıyı doğrulayın
6. "Kaydet" butonuna tıklayın

## Güvenlik Notları

- API anahtarlarınız yalnızca tarayıcınızda yerel olarak saklanır
- Anahtarlar hiçbir sunucuya gönderilmez
- Güvenlik için anahtarları düzenli olarak yenileyin

## Önerilen Ayarlar

- **Başlangıç için**: OpenAI GPT-4 Turbo (hızlı ve güvenilir)
- **En iyi kalite**: OpenAI GPT-4 veya Anthropic Claude 3 Opus
- **Maliyet odaklı**: OpenAI GPT-3.5 Turbo

## Sorun Giderme

Eğer API bağlantı hatası alıyorsanız:
1. API anahtarının doğru kopyalandığından emin olun
2. Hesabınızda yeterli kredi olduğunu kontrol edin
3. İnternet bağlantınızı kontrol edin
4. API sağlayıcının servis durumunu kontrol edin