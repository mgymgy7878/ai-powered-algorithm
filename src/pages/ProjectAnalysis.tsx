import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Copy, Check } from 'lucide-react'

const ProjectAnalysis: React.FC = () => {
  const [markdown, setMarkdown] = useState('📋 Proje analizi yükleniyor...')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // ProjectAnalysis.md içeriğini yükle
    fetch('/docs/ProjectAnalysis.md')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        return res.text()
      })
      .then(setMarkdown)
      .catch(() => {
        // Eğer dosya bulunamazsa varsayılan içerik göster
        setMarkdown(`# 📊 Proje Durumu

## 🔍 Mevcut Özellikler

- **Strateji Yönetimi:** Strateji oluşturma, başlatma ve silme
- **AI Trading Yöneticisi:** Yapay zeka destekli öneri sistemi ve sohbet arayüzü
- **Dashboard:** Portföy göstergeleri, performans metrikleri
- **Bildirim Sistemi:** Gerçek zamanlı bildirimler
- **Grafik Paneli:** TradingView entegreli gelişmiş grafik görüntüleme
- **API Entegrasyonu:** OpenAI, Claude ve Binance API desteği

## 🔧 Geliştirilmesi Gerekenler

- [ ] AI modeli seçici ve API key yönetimi
- [ ] Gerçek zamanlı WebSocket veri akışı
- [ ] Backtest motoru optimizasyonu
- [ ] Strateji performans raporlama
- [ ] Risk yönetimi araçları
- [ ] Mobil responsive tasarım

## 📁 Teknik Altyapı

- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **UI Kütüphanesi:** shadcn/ui bileşenleri
- **State Yönetimi:** Spark KV store
- **Grafik:** TradingView widget entegrasyonu
- **AI:** OpenAI ve Anthropic API desteği

## 🗓 Güncel Durum

Bu sayfa projenin mevcut durumunu, eksik özellikleri ve gelecek planlarını takip etmek için oluşturulmuştur.

---

**Son Güncelleme:** ${new Date().toLocaleDateString('tr-TR')}`)
      })
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Kopyalama hatası:', err)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">📊 Proje Durumu</h1>
          </div>
          
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Kopyalandı
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Prompt Olarak Kopyala
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Proje Analizi ve Geliştirme Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProjectAnalysis