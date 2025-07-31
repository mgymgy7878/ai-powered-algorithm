import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useKV } from '@github/spark/hooks'
import { Bot, User, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Chat mesaj arayüzü
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Piyasa verisi arayüzü
interface MarketSummary {
  totalValue: number
  totalPnl: number
  dailyPnl: number
  winRate: number
  activeStrategies: number
}

// Ekonomik olay arayüzü  
interface EconomicEvent {
  time: string
  currency: string
  event: string
  impact: 'low' | 'medium' | 'high'
  actual?: string
  forecast?: string
  previous?: string
}

export function TradingAssistant() {
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useKV<ChatMessage[]>('ai-chat-messages', [])
  const [strategies, setStrategies] = useKV<any[]>('trading-strategies', [])
  const [liveStrategies, setLiveStrategies] = useKV<any[]>('live-strategies', [])

  // Strateji başlatma fonksiyonu
  const startStrategy = async (strategyName: string) => {
    try {
      const strategy = strategies?.find((s: any) => s.name?.toLowerCase() === strategyName.toLowerCase())
      if (!strategy) {
        toast.error(`${strategyName} stratejisi bulunamadı`)
        return false
      }

      // Stratejiyi çalışan stratejiler listesine ekle
      const newLiveStrategy = {
        ...strategy,
        startTime: new Date(),
        status: 'running',
        pnl: 0
      }

      setLiveStrategies((prev: any[] = []) => [...prev, newLiveStrategy])
      toast.success(`${strategyName} stratejisi başlatıldı`)
      return true
    } catch (error) {
      console.error('Strateji başlatma hatası:', error)
      toast.error('Strateji başlatılamadı')
      return false
    }
  }

  // Strateji durdurma fonksiyonu
  const stopStrategy = async (strategyName: string) => {
    try {
      const strategyIndex = liveStrategies?.findIndex((s: any) => 
        s.name?.toLowerCase().includes(strategyName.toLowerCase())
      ) ?? -1
      
      if (strategyIndex === -1) {
        toast.error(`Çalışan ${strategyName} stratejisi bulunamadı`)
        return false
      }

      // Stratejiyi çalışan listesinden çıkar
      setLiveStrategies((prev: any[] = []) => prev.filter((_, index) => index !== strategyIndex))
      toast.success(`${strategyName} stratejisi durduruldu`)
      return true
    } catch (error) {
      console.error('Strateji durdurma hatası:', error)
      toast.error('Strateji durdurulamadı')
      return false
    }
  }

  // Portföy verisi getirme
  const fetchPortfolioData = async (): Promise<MarketSummary> => {
    try {
      // Gerçek veriler yerine örnek veriler
      const mockPortfolio: MarketSummary = {
        totalValue: 50000 + Math.random() * 10000,
        totalPnl: 8750.25 + Math.random() * 2000,
        dailyPnl: 1250.50 + Math.random() * 500,
        winRate: 68.5 + Math.random() * 10,
        activeStrategies: liveStrategies?.length ?? 0
      }
      return mockPortfolio
    } catch (error) {
      console.error('Portföy verisi alınırken hata:', error)
      throw error
    }
  }

  // Piyasa özeti getirme
  const fetchMarketSummary = async () => {
    try {
      // Mock piyasa verisi
      const mockMarket = {
        trend: ['yükseliş', 'düşüş', 'yatay'][Math.floor(Math.random() * 3)],
        volatility: ['düşük', 'orta', 'yüksek'][Math.floor(Math.random() * 3)],
        volume: 'normal',
        sentiment: ['pozitif', 'negatif', 'nötr'][Math.floor(Math.random() * 3)]
      }
      return mockMarket
    } catch (error) {
      console.error('Piyasa özeti alınırken hata:', error)
      throw error
    }
  }

  // Ekonomik takvim getirme
  const fetchEconomicCalendar = async (): Promise<EconomicEvent[]> => {
    try {
      // Mock ekonomik veriler
      const mockEvents: EconomicEvent[] = [
        {
          time: '14:30',
          currency: 'USD',
          event: 'İşsizlik Başvuruları',
          impact: 'medium',
          forecast: '220K',
          previous: '215K'
        },
        {
          time: '16:00',
          currency: 'USD', 
          event: 'Fed Faiz Kararı',
          impact: 'high',
          forecast: '5.25%',
          previous: '5.00%'
        }
      ]
      return mockEvents
    } catch (error) {
      console.error('Ekonomik takvim alınırken hata:', error)
      throw error
    }
  }

  // AI aksiyonlarını işleme fonksiyonu
  const handleAIActions = async (message: string) => {
    const content = message.toLowerCase()
    let actionPerformed = false

    // Strateji başlatma komutları
    if (content.includes('strateji başlat') || content.includes('strategi başlat')) {
      const strategyName = extractStrategyName(content) || 'scalper'
      const success = await startStrategy(strategyName)
      if (success) {
        actionPerformed = true
        addAIMessage(`${strategyName} stratejisi başarıyla başlatıldı ve çalışmaya başladı.`)
      }
    }

    // Strateji durdurma komutları
    if (content.includes('strateji durdur') || content.includes('strategi durdur') || content.includes('strateji kapat')) {
      const strategyName = extractStrategyName(content) || 'grid-bot'
      const success = await stopStrategy(strategyName)
      if (success) {
        actionPerformed = true
        addAIMessage(`${strategyName} stratejisi başarıyla durduruldu.`)
      }
    }

    // Portföy analizi
    if (content.includes('portföy') || content.includes('portfolio')) {
      try {
        const portfolio = await fetchPortfolioData()
        actionPerformed = true
        addAIMessage(`📊 **Portföy Analizi:**
• Toplam Değer: $${portfolio.totalValue.toFixed(2)}
• Toplam K/Z: $${portfolio.totalPnl.toFixed(2)}
• Günlük K/Z: $${portfolio.dailyPnl.toFixed(2)}
• Başarı Oranı: %${portfolio.winRate.toFixed(1)}
• Aktif Stratejiler: ${portfolio.activeStrategies}

${portfolio.dailyPnl > 0 ? '✅ Bugün kârlı gidiyorsunuz!' : '⚠️ Bugün zararda gidiyorsunuz.'}`)
      } catch (error) {
        addAIMessage('Portföy verilerini alırken bir hata oluştu.')
      }
    }

    // Piyasa özeti
    if (content.includes('piyasa') || content.includes('market')) {
      try {
        const summary = await fetchMarketSummary()
        actionPerformed = true
        addAIMessage(`📈 **Piyasa Özeti:**
• Trend: ${summary.trend}
• Volatilite: ${summary.volatility}
• Hacim: ${summary.volume}
• Yatırımcı Duygusu: ${summary.sentiment}

${summary.volatility === 'yüksek' ? '⚠️ Yüksek volatilite nedeniyle dikkatli olun!' : ''}`)
      } catch (error) {
        addAIMessage('Piyasa verilerini alırken bir hata oluştu.')
      }
    }

    // Ekonomik takvim
    if (content.includes('ekonomik') || content.includes('takvim') || content.includes('haber')) {
      try {
        const events = await fetchEconomicCalendar()
        actionPerformed = true
        const eventList = events.map(event => 
          `• ${event.time} - ${event.currency} - ${event.event} (${event.impact})`
        ).join('\n')
        
        addAIMessage(`📅 **Bugün Önemli Ekonomik Olaylar:**
${eventList}

${events.some(e => e.impact === 'high') ? '🚨 Yüksek etkili olaylar var, dikkatli olun!' : ''}`)
      } catch (error) {
        addAIMessage('Ekonomik takvim verilerini alırken bir hata oluştu.')
      }
    }

    return actionPerformed
  }

  // Strateji adını mesajdan çıkarma yardımcı fonksiyonu
  const extractStrategyName = (message: string): string | null => {
    const strategyKeywords = ['scalper', 'scalping', 'grid', 'grid-bot', 'momentum', 'trend', 'breakout']
    for (const keyword of strategyKeywords) {
      if (message.includes(keyword)) {
        return keyword
      }
    }
    return null
  }

  // AI mesajı ekleme yardımcı fonksiyonu
  const addAIMessage = (content: string) => {
    const aiMessage: ChatMessage = {
      id: (Date.now() + Math.random()).toString(),
      role: 'assistant',
      content,
      timestamp: new Date()
    }
    setMessages((prev: ChatMessage[] = []) => [...prev, aiMessage])
  }

  // Enter tuşu ile mesaj gönderme
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // AI'a mesaj gönderme fonksiyonu
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    // Kullanıcı mesajını oluştur
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    // Mesajı listeye ekle ve input'u temizle
    setMessages((prev: ChatMessage[] = []) => [...prev, userMessage])
    const currentMessage = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    try {
      // Önce aksiyonları kontrol et
      const actionPerformed = await handleAIActions(currentMessage)
      
      if (!actionPerformed) {
        // AI sistem promptu
        const systemPrompt = `Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:
- Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
- Ekonomik takvimi ve haber akışını takip edip yorumlamak
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
- Türkçe yanıtlar üretmek

Aktif stratejiler: ${liveStrategies?.length ?? 0}
Mevcut stratejiler: ${strategies?.length ?? 0}

Kullanıcı sorusu: ${currentMessage}`

        // AI API'sine prompt gönder
        const aiResponse = await (window as any).spark?.llm((window as any).spark?.llmPrompt`${systemPrompt}`)

        // AI yanıtını oluştur
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse || 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.',
          timestamp: new Date()
        }

        // AI yanıtını listeye ekle
        setMessages((prev: ChatMessage[] = []) => [...prev, assistantMessage])
      }

    } catch (error) {
      console.error('AI yanıt hatası:', error)
      
      // Hata mesajı oluştur
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date()
      }

      setMessages((prev: ChatMessage[] = []) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full h-full p-4 flex flex-col">
      <h3 className="text-lg font-bold mb-2">AI Trading Yöneticisi</h3>
      
      <ScrollArea className="flex-1 pr-2 mb-3">
        <div className="space-y-3">
          {(!messages || messages.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>AI Trading Yöneticiniz hazır!</p>
              <p className="text-sm">Piyasa analizi ve strateji önerisi için mesaj yazın.</p>
            </div>
          )}
          
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`px-3 py-2 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-3 py-2 rounded-lg text-sm bg-muted text-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2 mt-auto">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="AI'a mesaj yazın..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          onClick={sendMessage} 
          disabled={isLoading || !inputMessage.trim()} 
          size="icon"
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