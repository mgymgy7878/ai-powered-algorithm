import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useKV } from '@github/spark/hooks'
import { Brain, Send, Loader2, User, Settings, ChevronDown, ChevronUp } from '@phosphor-icons/react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function TradingAssistant() {
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
  const [apiKey, setApiKey] = useKV<string>('openai-api-key', '')
  const [model, setModel] = useKV<string>('ai-model', 'gpt-4o')
  const [showSuggestions, setShowSuggestions] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // AI önerileri listesi - kullanıcı tarafından tanımlanan komutlar
  const suggestions = [
    { label: "Portföyü değerlendir", command: "portföyü değerlendir" },
    { label: "Strateji başlat (grid bot)", command: "grid bot stratejisini başlat" },
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
- Ekonomik takvimi ve haber akışını takip edip yorumlamak
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
- Türkçe yanıtlar üretmek

Kullanıcı mesajı: ${userMessage.content}`

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

  const saveApiKey = () => {
    // API key zaten useKV ile otomatik kaydediliyor
    console.log('API key kaydedildi')
  }
  const sendMessage = async () => {

    if (!inputMessage.trim() || isLoading) return
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
- Ekonomik takvimi ve haber akışını takip edip yorumlamak
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
- Türkçe yanıtlar üretmek

Kullanıcı mesajı: ${userMessage.content}`

      // AI'dan yanıt al - seçilen modeli kullan
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

    } catch (error) {
      console.error('AI yanıt hatası:', error)
      
      // Hata mesajı ekle
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

  // AI ajan aksiyonlarını işleme fonksiyonu - yeni komutlara göre güncellendi
  const handleAgentActions = async (message: string) => {
    const content = message.toLowerCase()

    // Grid bot stratejisi başlatma
    if (content.includes("grid bot") && content.includes("başlat")) {
      await startStrategy("grid-bot")
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '✅ Grid-bot stratejisi başarıyla başlatıldı.',
        timestamp: new Date()
      }])
    }

    // Genel strateji durdurma
    if (content.includes("durdur") || content.includes("kapat")) {
      await stopStrategy("aktif-strateji")
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: '⏹️ Aktif strateji durduruldu.',
        timestamp: new Date()
      }])
    }

    // Portföy değerlendirmesi
    if (content.includes("portföyü değerlendir") || content.includes("portföy analizi")) {
      const p = await fetchPortfolioData()
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

  return (
    <Card className="w-full h-[520px] flex flex-col bg-background border rounded-md shadow-md overflow-hidden">
      {/* Başlık ve Model Seçimi */}
      <div className="p-3 border-b bg-muted/50 flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <h3 className="text-sm font-semibold">AI Trading Yöneticisi</h3>
        </div>
        
        {/* Model Seçimi */}
        <Select onValueChange={setModel} value={model}>
          <SelectTrigger className="w-32 text-xs h-7">
            <SelectValue placeholder="Model Seç" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* API Key Ayarı */}
      {!apiKey && (
        <div className="p-2 bg-yellow-50 border-b">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="OpenAI API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-xs"
              type="password"
            />
            <Button onClick={saveApiKey} size="sm">Kaydet</Button>
          </div>
        </div>
      )}

      {/* Mesaj Listesi */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                  <Brain className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              
              <div
                className={`rounded-md text-sm px-2 py-1 max-w-[85%] whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-8'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.content}
              </div>

              {message.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center mt-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-1">
                <Brain className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="bg-muted text-foreground rounded-md px-2 py-1 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* AI Önerileri Paneli */}
      {showSuggestions && (
        <div className="border-t bg-muted/30 p-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-medium text-muted-foreground">AI Önerileri</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(false)}
              className="h-5 w-5 p-0"
            >
              <ChevronUp className="w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-2 bg-muted rounded-md p-3 text-sm">
            {suggestions.map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground">{item.label}</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleSuggestionApply(item.command)}
                  disabled={isLoading}
                  className="text-xs h-6 px-2"
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
        <div className="border-t p-2 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSuggestions(true)}
            className="text-xs h-6"
          >
            <ChevronDown className="w-3 h-3 mr-1" />
            AI Önerilerini Göster
          </Button>
        </div>
      )}

      {/* Mesaj Gönderme Alanı */}
      <div className="border-t p-3 flex gap-2 items-center bg-background">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="AI'a mesaj yaz..."
          className="flex-1 text-sm"
          disabled={isLoading}
        />
        <Button 
          onClick={sendMessage} 
          disabled={!inputMessage.trim() || isLoading} 
          size="icon"
          className="h-9 w-9"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </Card>
  )
}