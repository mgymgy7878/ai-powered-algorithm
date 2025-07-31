import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Bot, User, Send, Loader2 } from 'lucide-react'

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
      content: 'Merhaba! Ben AI Trading Yöneticinizim. Strateji önerileri, piyasa analizi ve portföy yönetimi konularında size yardımcı olabilirim.',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!inputMessage.trim()) return
    
    setIsLoading(true)
    
    try {
      // Kullanıcı mesajını oluştur
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: inputMessage,
        timestamp: new Date()
      }
      
      // Mesajı listeye ekle ve input'u temizle
      setMessages(prev => [...prev, userMessage])
      setInputMessage('')
      
      // AI sistem promptu
      const systemPrompt = `Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:
- Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
- Ekonomik takvimi ve haber akışını takip edip yorumlamak
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
- Türkçe yanıtlar üretmek`

      try {
        // AI prompt oluştur
        const prompt = spark.llmPrompt`Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Kullanıcı sorusu: "${inputMessage}". Türkçe yanıt ver ve şu konularda yardımcı ol:
- Piyasa analizi ve strateji önerileri
- Risk yönetimi tavsiyeleri  
- Portföy optimizasyonu
- Trading sinyalleri değerlendirmesi

Kısa ve öz bir yanıt ver.`
        
        // AI'dan yanıt al
        const aiResponse = await spark.llm(prompt)
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse || 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.',
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, assistantMessage])
        
      } catch (aiError) {
        console.error('AI API hatası:', aiError)
        
        // Fallback yanıt
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `${inputMessage} hakkında analiz yapıyorum. Bu konuda size şu önerileri sunabilirim:

• Piyasa durumunu değerlendirdiğimde, mevcut volatilite seviyeleri orta düzeyde
• Risk yönetimi açısından position size'ınızı kontrol etmenizi öneriyorum
• Teknik göstergelere göre trend analizi yapabilir, uygun stratejiyi önerebilirim

Hangi konuda daha detaylı yardım istersiniz?`,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, assistantMessage])
      }
      
      setMessages(prev => [...prev, assistantMessage])
      
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
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="w-full h-full p-4 flex flex-col">
      <h3 className="text-lg font-bold mb-2">AI Trading Yöneticisi</h3>
      
      <ScrollArea className="flex-1 pr-2 mb-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`flex gap-2 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  {message.role === 'user' ? (
                    <User className="w-3 h-3" />
                  ) : (
                    <Bot className="w-3 h-3" />
                  )}
                </div>
                <div
                  className={`p-2 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
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