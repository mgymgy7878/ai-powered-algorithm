import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Loader2, Send, User, Brain } from '@phosphor-icons/react'

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
      content: 'Merhaba! Ben AI Trading Yöneticinizim. Size piyasa analizi, strateji önerileri ve portföy yönetimi konularında yardımcı olabilirim. Nasıl yardımcı olabilirim?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mesaj scroll container referansı
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Yeni mesaj eklendiğinde scroll'u en alta kaydır
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // AI ile mesaj gönderme
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
      // AI prompt oluştur
      const prompt = spark.llmPrompt`Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:
      - Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
      - Ekonomik takvimi ve haber akışını takip edip yorumlamak
      - Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
      - Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
      - Türkçe yanıtlar üretmek
      
      Kullanıcı mesajı: ${userMessage.content}
      
      Lütfen kısa, öz ve işe yarar bir yanıt ver. Gerekirse somut öneriler sun.`

      const aiResponse = await spark.llm(prompt)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
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

  // Enter tuşu ile mesaj gönderme
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="w-full h-[460px] flex flex-col bg-background border rounded-md shadow-md overflow-hidden">
      {/* Sabit başlık */}
      <div className="p-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-sm">AI Trading Yöneticisi</h3>
          <Badge variant="secondary" className="text-xs ml-auto">
            Aktif
          </Badge>
        </div>
      </div>

      {/* Mesaj listesi - scrollable, sabit yükseklik */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scroll-smooth">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div className={`max-w-[260px] p-3 rounded-lg text-sm ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'
              }`}>
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          
          {/* Loading mesajı */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted text-foreground p-3 rounded-lg text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Düşünüyor...</span>
              </div>
            </div>
          )}
          
          {/* Scroll referansı */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Mesaj input alanı - her zaman altta sabit */}
      <div className="border-t p-3 flex gap-2 items-center bg-background">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="AI'a mesaj yaz..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          onClick={sendMessage} 
          disabled={!inputMessage.trim() || isLoading} 
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