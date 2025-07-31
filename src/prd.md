# AI Destekli Algoritmik Trading Platformu - PRD

## Proje Özeti
MatrixIQ Algo Modülü'nden esinlenen, Cursor Agent seviyesinde yapay zeka desteği sunan Windows masaüstü algoritmik trading IDE'si.

## Temel Özellikler
- **AI Destekli Strateji Üretimi**: Doğal dil ile strateji tanımlama ve otomatik C# kod üretimi
- **Cursor-benzeri Kod Editörü**: Akıllı kod tamamlama, hata düzeltme ve optimizasyon
- **MatrixIQ Uyumlu Arayüz**: Tanıdık strateji yönetimi ve backtest sonuçları
- **Gerçek Zamanlı AI Pilot**: Piyasa koşullarına göre otomatik strateji geçişi
- **Türkçe Lokalizasyon**: Tam Türkçe arayüz ve AI etkileşimi

## Teknoloji Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Kütüphanesi**: shadcn/ui components
- **AI Entegrasyonu**: OpenAI GPT-4o, Anthropic Claude
- **İkonlar**: Phosphor Icons
- **Bildirimler**: Sonner
- **Veri Saklama**: Spark KV Store

## Mevcut Durum
- ✅ Temel UI framework kurulumu tamamlandı
- ✅ Strateji üretici komponenti geliştirildi
- ✅ AI entegrasyonu için tip tanımlamaları eklendi
- ✅ Paylaşılan tip sistemi oluşturuldu
- ✅ Temel hata düzeltmeleri yapıldı

## Düzeltilen Hatalar
1. **Spark Global Type Tanımı**: `window.spark` için TypeScript tip tanımlamaları eklendi
2. **Komponent Prop Uyumsuzluğu**: AIAssistant bileşeninde prop isim uyumsuzluğu düzeltildi
3. **Veri Tipi Tutarsızlığı**: TradingStrategy interface'i bütün bileşenler için standartlaştırıldı
4. **İndikatör Tipi Uyumsuzluğu**: string[] vs Indicator[] uyumsuzluğu çözüldü

## Sonraki Adımlar
1. Gerçek AI API entegrasyonlarının test edilmesi
2. Backtest motorunun geliştirilmesi  
3. Canlı veri akışı entegrasyonu
4. AI pilot modülünün geliştirilmesi
5. Kapsamlı test senaryolarının oluşturulması

## Kullanıcı Deneyimi
- Modern, minimalist arayüz tasarımı
- Cursor benzeri AI asistan deneyimi
- MatrixIQ'ya aşina kullanıcılar için tanıdık workflow
- Tam yerelleştirme ile Türkçe kullanıcı deneyimi