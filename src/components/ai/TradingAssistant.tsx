import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useKV } from '@github/spark/hooks'
import { useActivity } from '@/contexts/ActivityContext'
import { Brain, Send, Loader2, User, Settings, ChevronDown, ChevronUp, Eye, EyeOff } from '@phosphor-icons/react'
import { APISettings } from '../../types/api'
import { aiService } from '../../services/aiService'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface TradingAssistantProps {}

export function TradingAssistant({}: TradingAssistantProps = {}) {
  const { addActivity } = useActivity()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Merhaba! AI Trading Yöneticinizim. Size piyasa analizi, strateji önerileri ve portföy değerlendirmesi konularında yardımcı olabilirim. Nasıl yardımcı olabilirim?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useKV<string>('ai-model', 'gpt-4o')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState({ openai: false, anthropic: false })
  
  // API Settings state
  const [apiSettings, setApiSettings] = useKV<APISettings>('api-settings', {
    openai: {
      apiKey: '',
      model: 'gpt-4',
      enabled: true
    },
    anthropic: {
      apiKey: '',
      model: 'claude-3-sonnet',
      enabled: false
    },
    binance: {
      apiKey: '',
      secretKey: '',
      testnet: true,
      enabled: false
    }
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize AI service with settings
  useEffect(() => {
    if (apiSettings && aiService) {
      aiService.setSettings(apiSettings)
    }
  }, [apiSettings])

  // AI önerileri listesi - ekonomik takvim entegrasyonu eklendi
  const suggestions = [
    { label: "Portföyü değerlendir", command: "portföyü değerlendir" },
    { label: "Bugünkü önemli ekonomik olayları göster", command: "bugünkü yüksek etkili ekonomik olayları listele" },
    { label: "Sonraki 24 saatteki kritik olaylar", command: "gelecek 24 saatte hangi önemli ekonomik olaylar var" },
    { label: "Ekonomik takvime göre strateji öner", command: "ekonomik takvim analizi yaparak strateji önerisi ver" },
    { label: "Grid bot stratejisini başlat", command: "grid bot stratejisini başlat" },
    { label: "AI'dan piyasa özeti al", command: "bugünkü piyasa özetini sun" },
    { label: "Kazanç/zarar analizi", command: "kazanç zarar analizi yap" }
  ]

  // Öneri uygulama fonksiyonu - kullanıcı tarafından tanımlanan komutları kullanır
  const handleSuggestionApply = async (command: string) => {
    if (isLoading) return // Zaten işlem devam ediyorsa yeni işlem başlatma
    
    // Input alanına komutu yaz (kullanıcının görmesi için)
    setInputMessage(command)
    
    // Kısa bir gecikme sonrası otomatik gönder
    setTimeout(async () => {
      // Kullanıcı mesajını otomatik gönder
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: command,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, userMessage])
      setInputMessage('') // Input alanını temizle
      setIsLoading(true)

      try {
        const prompt = spark.llmPrompt`Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:
- Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
- Ekonomik takvimi ve haber akışını takip edip yorumlamak (Fed faiz kararları, istihdam verileri, enflasyon, GSYİH gibi)
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
- Ekonomik olayların piyasa etkilerini öngörmek ve strateji önerileri sunmak
- Türkçe yanıtlar üretmek

Önemli: Ekonomik takvim sorularında güncel ekonomik olayları (Fed kararları, ECB toplantıları, istihdam verileri vb.) dikkate al ve bunların piyasa volatilitesine etkilerini değerlendir.

Kullanıcı mesajı: ${userMessage.content}`

        // Spark LLM API doğru kullanımı: spark.llm(prompt, modelName?, jsonMode?)
        const response = await spark.llm(prompt, model)

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])
        await handleAgentActions(userMessage.content)

      } catch (error) {
        console.error('AI yanıt hatası:', error)
        
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.',
          timestamp: new Date()
        }

        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms gecikme ile kullanıcı mesajı görür
  }

  // Otomatik kaydırma - yeni mesaj geldiğinde en alta git
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    // Check if AI is configured
    if (!aiService?.isConfigured()) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '⚠️ AI servisleri yapılandırılmamış. Lütfen sağ üstteki ayarlar ikonuna tıklayarak API anahtarlarınızı girin.',
        timestamp: new Date()
      }])
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // AI yanıtı için prompt oluştur
      const prompt = spark.llmPrompt`Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:
- Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
- Ekonomik takvimi ve haber akışını takip edip yorumlamak (Fed faiz kararları, istihdam verileri, enflasyon, GSYİH gibi)
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
- Ekonomik olayların piyasa etkilerini öngörmek ve strateji önerileri sunmak
- Türkçe yanıtlar üretmek

Önemli: Ekonomik takvim sorularında güncel ekonomik olayları (Fed kararları, ECB toplantıları, istihdam verileri vb.) dikkate al ve bunların piyasa volatilitesine etkilerini değerlendir.

Kullanıcı mesajı: ${userMessage.content}`

      // Spark LLM API doğru kullanımı - API key otomatik sistem tarafından yönetiliyor
      // Model seçimi için sadece model ismini geçiyoruz
      const response = await spark.llm(prompt, model)

      // AI yanıtını ekle
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // AI yanıtından sonra ajan aksiyonlarını kontrol et
      await handleAgentActions(userMessage.content)
      
      // AI etkileşimi için aktivite ekle
      addActivity(`AI ile etkileşim: ${userMessage.content.slice(0, 50)}...`, 'info')

      // Her AI yanıtından sonra bildirim gönder
      if ((window as any).pushNotification) {
        ;(window as any).pushNotification(`AI yanıtı: ${response.slice(0, 80)}...`, 'info')
      }

    } catch (error) {
      console.error('AI yanıt hatası:', error)
      
      // Hata mesajı ekle
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen API ayarlarınızı kontrol edin veya daha sonra tekrar deneyin.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Mock fonksiyonlar - gerçek API entegrasyonları için
  const startStrategy = async (strategyName: string) => {
    console.log(`${strategyName} stratejisi başlatılıyor...`)
    // Gerçek implementasyon: strateji başlatma API çağrısı
    return { success: true, strategy: strategyName }
  }

  const stopStrategy = async (strategyName: string) => {
    console.log(`${strategyName} stratejisi durduruluyor...`)
    // Gerçek implementasyon: strateji durdurma API çağrısı
    return { success: true, strategy: strategyName }
  }

  const fetchPortfolioData = async () => {
    // Mock portföy verisi
    return {
      total: 50000,
      dailyPnl: 1250.50,
      totalPnl: 8750.25,
      activeStrategies: 3,
      successRate: 68.5
    }
  }

  // AI ajan aksiyonlarını işleme fonksiyonu - ekonomik takvim entegrasyonu eklendi
  const handleAgentActions = async (message: string) => {
    const content = message.toLowerCase()

    // Strateji başlatma komutları
    if (content.includes("strateji başlat") || content.includes("grid bot")) {
      try {
        await startStrategy("grid-bot")
        addActivity('Grid Bot stratejisi AI tarafından başlatıldı', 'success')
        
        // Global bildirim merkezi bildirimi gönder
        if ((window as any).pushNotification) {
          ;(window as any).pushNotification('Grid Bot stratejisi AI tarafından başarıyla başlatıldı ve çalışmaya başladı.', 'success')
        }
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: '✅ Grid Bot stratejisi başarıyla başlatıldı ve çalışmaya başladı.',
          timestamp: new Date()
        }])
      } catch (error) {
        addActivity('Grid Bot stratejisi başlatılamadı', 'error')
        if ((window as any).pushNotification) {
          ;(window as any).pushNotification('Grid Bot stratejisi başlatılamadı. Lütfen ayarları kontrol edin.', 'error')
        }
      }
    }

    // Strateji durdurma komutları
    if (content.includes("strateji durdur") || content.includes("stratejileri durdur")) {
      try {
        await stopStrategy("scalper")
        addActivity('Scalper stratejisi AI tarafından durduruldu', 'warning')
        
        // Global bildirim merkezi bildirimi gönder
        if ((window as any).pushNotification) {
          ;(window as any).pushNotification('Aktif stratejiler AI tarafından güvenlik sebebiyle durduruldu.', 'warning')
        }
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: '⏸️ Aktif stratejiler durduruldu.',
          timestamp: new Date()
        }])
      } catch (error) {
        addActivity('Strateji durdurulamadı', 'error')
        if ((window as any).pushNotification) {
          ;(window as any).pushNotification('Strateji durdurma işlemi başarısız oldu.', 'error')
        }
      }
    }

    // Ekonomik takvim sorguları
    if (content.includes("ekonomik olay") || content.includes("yüksek etkili")) {
      try {
        const { economicCalendarService } = await import('@/services/economicCalendarService')
        const todayEvents = await economicCalendarService.getTodayHighImpactEvents()
        
        if (todayEvents.length > 0) {
          const eventsList = todayEvents.map(event => 
            `🔔 ${event.time} - ${event.olay} (${event.currency}) - Etki: ${event.etki}`
          ).join('\n')
          
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: `📅 **Bugünkü Yüksek Etkili Ekonomik Olaylar:**\n\n${eventsList}\n\n⚠️ Bu olaylar piyasada volatiliteye neden olabilir. Strateji ayarlamalarınızı buna göre planlayın.`,
            timestamp: new Date()
          }])
        } else {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: '📅 Bugün yüksek etkili ekonomik olay bulunmuyor. Piyasalar sakin seyredebilir.',
            timestamp: new Date()
          }])
        }
      } catch (error) {
        console.error('Ekonomik takvim hatası:', error)
      }
    }

    // Gelecek 24 saatteki olaylar
    if (content.includes("24 saat") || content.includes("gelecek") && content.includes("ekonomik")) {
      try {
        const { economicCalendarService } = await import('@/services/economicCalendarService')
        const upcomingEvents = await economicCalendarService.getUpcomingHighImpactEvents()
        
        if (upcomingEvents.length > 0) {
          const eventsList = upcomingEvents.map(event => 
            `📅 ${event.date} ${event.time} - ${event.olay} (${event.currency})`
          ).join('\n')
          
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: `⏰ **Gelecek 24 Saatteki Kritik Olaylar:**\n\n${eventsList}\n\n🚨 Bu olaylar öncesinde pozisyonlarınızı gözden geçirmenizi öneririm.`,
            timestamp: new Date()
          }])
        } else {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: '⏰ Gelecek 24 saatte yüksek etkili ekonomik olay bulunmuyor.',
            timestamp: new Date()
          }])
        }
      } catch (error) {
        console.error('Ekonomik takvim hatası:', error)
      }
    }

    // Ekonomik takvim bazlı strateji önerisi
    if (content.includes("ekonomik takvim") && content.includes("strateji")) {
      try {
        const { economicCalendarService } = await import('@/services/economicCalendarService')
        const todayEvents = await economicCalendarService.getTodayHighImpactEvents()
        const upcomingEvents = await economicCalendarService.getUpcomingHighImpactEvents()
        
        let recommendation = '📊 **Ekonomik Takvim Bazlı Strateji Önerisi:**\n\n'
        
        if (todayEvents.length > 0 || upcomingEvents.length > 0) {
          recommendation += '⚠️ **Yüksek Volatilite Beklentisi:**\n'
          recommendation += '• Grid bot stratejilerini durdurun\n'
          recommendation += '• Scalping stratejilerini aktifleştirin\n'
          recommendation += '• Stop-loss seviyelerini daraltın\n'
          recommendation += '• Pozisyon boyutlarını azaltın\n\n'
          recommendation += '🎯 **Önerilen Aksiyonlar:**\n'
          recommendation += '• Haber öncesi 30 dakika pozisyon almayın\n'
          recommendation += '• Haber sonrası ilk 15 dakika momentum takibi yapın\n'
          recommendation += '• ATR bazlı stop-loss kullanın'
        } else {
          recommendation += '😌 **Düşük Volatilite Ortamı:**\n'
          recommendation += '• Grid bot stratejileri ideal\n'
          recommendation += '• Range trading stratejileri çalıştırabilirsiniz\n'
          recommendation += '• Carry trade pozisyonları değerlendirin\n'
          recommendation += '• Uzun vadeli trend takibi yapabilirsiniz'
        }
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: recommendation,
          timestamp: new Date()
        }])
      } catch (error) {
        console.error('Ekonomik takvim analizi hatası:', error)
      }
    }

    // Portföy analizi
    if (content.includes("portföy") && (content.includes("değerlendir") || content.includes("analiz"))) {
      const p = await fetchPortfolioData()
      addActivity('AI portföy analizi tamamlandı', 'info')
      
      // Global bildirim merkezi bildirimi gönder
      if ((window as any).pushNotification) {
        ;(window as any).pushNotification(`Portföy değerlendirmesi tamamlandı. Toplam değer: $${p.total.toLocaleString()}, Günlük K/Z: $${p.dailyPnl}`, 'info')
      }
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `📊 **Portföy Değerlendirmesi:**\n\n💰 Toplam Bakiye: $${p.total.toLocaleString()}\n📈 Günlük K/Z: $${p.dailyPnl}\n💹 Toplam K/Z: $${p.totalPnl}\n🎯 Başarı Oranı: %${p.successRate}\n🤖 Aktif Stratejiler: ${p.activeStrategies}`,
        timestamp: new Date()
      }])
    }

    // Piyasa özeti
    if (content.includes("piyasa özeti") || content.includes("piyasa özetini sun")) {
      // Mock piyasa verisi
      const marketData = {
        btc: { price: 42500, change: 2.5 },
        eth: { price: 2850, change: -1.2 },
        general: "Kripto piyasalar pozitif seyirde"
      }
      
      addActivity('AI piyasa özeti oluşturuldu', 'info')
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `📈 **Günlük Piyasa Özeti:**\n\n₿ BTC: $${marketData.btc.price.toLocaleString()} (${marketData.btc.change > 0 ? '+' : ''}${marketData.btc.change}%)\nⒺ ETH: $${marketData.eth.price.toLocaleString()} (${marketData.eth.change > 0 ? '+' : ''}${marketData.eth.change}%)\n\n📊 Genel Durum: ${marketData.general}`,
        timestamp: new Date()
      }])
    }

    // Kazanç/zarar analizi
    if (content.includes("kazanç zarar analizi") || content.includes("k/z analizi")) {
      const analysisData = {
        weeklyPnl: 3250.75,
        monthlyPnl: 12450.30,
        winRate: 72.5,
        avgWin: 185.50,
        avgLoss: -95.25
      }
      
      addActivity('AI K/Z analizi tamamlandı', 'info')
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `💹 **Kazanç/Zarar Analizi:**\n\n📊 Haftalık K/Z: $${analysisData.weeklyPnl}\n📈 Aylık K/Z: $${analysisData.monthlyPnl}\n🎯 Kazanma Oranı: %${analysisData.winRate}\n💚 Ortalama Kazanç: $${analysisData.avgWin}\n🔴 Ortalama Kayıp: $${analysisData.avgLoss}`,
        timestamp: new Date()
      }])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const updateAPISettings = (provider: 'openai' | 'anthropic', updates: any) => {
    setApiSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev?.[provider],
        ...updates
      }
    }))
  }

  const testAPIConnection = async (provider: 'openai' | 'anthropic', apiKey: string) => {
    try {
      const isValid = await aiService?.testConnection(provider, apiKey)
      if (isValid) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `✅ ${provider === 'openai' ? 'OpenAI' : 'Anthropic'} bağlantısı başarılı! Artık bu sağlayıcıyı kullanabilirsiniz.`,
          timestamp: new Date()
        }])
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: `❌ ${provider === 'openai' ? 'OpenAI' : 'Anthropic'} bağlantısı başarısız. API anahtarınızı kontrol edin.`,
          timestamp: new Date()
        }])
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `❌ Bağlantı testi sırasında hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`,
        timestamp: new Date()
      }])
    }
  }

  return (
    <Card className="w-full h-[520px] flex flex-col bg-background border rounded-md shadow-md overflow-hidden">
      {/* Başlık ve Ayarlar */}
      <div className="p-2 border-b bg-muted/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          <h3 className="text-sm font-semibold">AI Trading Yöneticisi</h3>
        </div>
        
        {/* Model Seçici */}
        <div className="flex items-center gap-2">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="w-32 text-xs h-7">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
            </SelectContent>
          </Select>
          
          {/* API Ayarları Dialog */}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>AI API Ayarları</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* OpenAI Settings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">OpenAI</Label>
                  <Switch
                    checked={apiSettings?.openai?.enabled ?? false}
                    onCheckedChange={(enabled) => updateAPISettings('openai', { enabled })}
                  />
                </div>
                
                {apiSettings?.openai?.enabled && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type={showApiKeys.openai ? "text" : "password"}
                        placeholder="OpenAI API Key (sk-...)"
                        value={apiSettings?.openai?.apiKey ?? ''}
                        onChange={(e) => updateAPISettings('openai', { apiKey: e.target.value })}
                        className="text-xs pr-8"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, openai: !prev.openai }))}
                      >
                        {showApiKeys.openai ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </div>
                    
                    <Select
                      value={apiSettings?.openai?.model ?? 'gpt-4'}
                      onValueChange={(value) => updateAPISettings('openai', { model: value })}
                    >
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testAPIConnection('openai', apiSettings?.openai?.apiKey ?? '')}
                      className="w-full h-7 text-xs"
                      disabled={!apiSettings?.openai?.apiKey?.trim()}
                    >
                      Bağlantıyı Test Et
                    </Button>
                  </div>
                )}
              </div>

              {/* Anthropic Settings */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Anthropic Claude</Label>
                  <Switch
                    checked={apiSettings?.anthropic?.enabled ?? false}
                    onCheckedChange={(enabled) => updateAPISettings('anthropic', { enabled })}
                  />
                </div>
                
                {apiSettings?.anthropic?.enabled && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type={showApiKeys.anthropic ? "text" : "password"}
                        placeholder="Anthropic API Key (sk-ant-...)"
                        value={apiSettings?.anthropic?.apiKey ?? ''}
                        onChange={(e) => updateAPISettings('anthropic', { apiKey: e.target.value })}
                        className="text-xs pr-8"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, anthropic: !prev.anthropic }))}
                      >
                        {showApiKeys.anthropic ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                    </div>
                    
                    <Select
                      value={apiSettings?.anthropic?.model ?? 'claude-3-sonnet'}
                      onValueChange={(value) => updateAPISettings('anthropic', { model: value })}
                    >
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                        <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testAPIConnection('anthropic', apiSettings?.anthropic?.apiKey ?? '')}
                      className="w-full h-7 text-xs"
                      disabled={!apiSettings?.anthropic?.apiKey?.trim()}
                    >
                      Bağlantıyı Test Et
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Badge variant="secondary" className="text-xs">
          {apiSettings?.openai?.enabled ? 'OpenAI' : apiSettings?.anthropic?.enabled ? 'Claude' : 'Spark LLM'}
        </Badge>
      </div>
    </div>

      {/* Mesaj Listesi */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-1">
                  <Brain className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              
              <div
                className={`rounded-md text-xs px-2 py-1 max-w-[85%] whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-6'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.content}
              </div>

              {message.role === 'user' && (
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-1">
                <Brain className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="bg-muted text-foreground rounded-md px-2 py-1 text-xs">
                <Loader2 className="w-3 h-3 animate-spin" />
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* AI Önerileri Paneli */}
      {showSuggestions && (
        <div className="border-t bg-muted/30 p-2">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs font-medium text-muted-foreground">AI Önerileri</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(false)}
              className="h-4 w-4 p-0"
            >
              <ChevronUp className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-1 bg-muted rounded-md p-2 text-xs max-h-24 overflow-y-auto">
            {suggestions.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground flex-1 truncate">{item.label}</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleSuggestionApply(item.command)}
                  disabled={isLoading}
                  className="text-xs h-5 px-1"
                >
                  Uygula
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Öneriler Göster/Gizle Butonu - Kapalıyken */}
      {!showSuggestions && (
        <div className="border-t p-1 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSuggestions(true)}
            className="text-xs h-5"
          >
            <ChevronDown className="w-3 h-3 mr-1" />
            AI Önerileri
          </Button>
        </div>
      )}

      {/* Mesaj Gönderme Alanı */}
      <div className="border-t p-2 flex gap-2 items-center bg-background">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="AI'a mesaj yaz..."
          className="flex-1 text-xs h-8"
          disabled={isLoading}
        />
        <Button 
          onClick={sendMessage} 
          disabled={!inputMessage.trim() || isLoading} 
          size="icon"
          className="h-8 w-8"
        >
          {isLoading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Send className="w-3 h-3" />
          )}
        </Button>
      </div>
    </Card>
  )
}