import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { Brain, Send, Loader2, User, Settings } from '@phosphor-icons/react'

// Mesaj tipi tanımı
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
  const [apiSettings, setApiSettings] = useKV('api-settings', {})
  const [showApiSetup, setShowApiSetup] = useState(false)
  const [tempApiKey, setTempApiKey] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mesajlar değiştiğinde en alta kaydır
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // API anahtarını kaydetme
  const saveApiKey = () => {
    if (!tempApiKey.trim()) return
    
    const updatedSettings = {
      ...apiSettings,
      openai: {
        ...apiSettings?.openai,
        apiKey: tempApiKey.trim(),
        enabled: true
      }
    }
    
    setApiSettings(updatedSettings)
    setShowApiSetup(false)
    setTempApiKey('')
    
    // Başarı mesajı ekle
    const successMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'API anahtarınız başarıyla kaydedildi! Artık benimle konuşabilirsiniz.',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, successMessage])
  }

  // API ayarları kontrolü ve setup görünümü
  const checkApiSettings = () => {
    return apiSettings?.openai?.apiKey || apiSettings?.anthropic?.apiKey
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // AI ile mesaj gönderme
  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    // API ayarları kontrolü
    if (!checkApiSettings()) {
      setShowApiSetup(true)
      return
    }

    setIsLoading(true)

    // Kullanıcı mesajını ekle
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

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
            {checkApiSettings() ? 'Aktif' : 'API Gerekli'}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={() => setShowApiSetup(!showApiSetup)}
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* API Setup ekranı */}
      {showApiSetup && (
        <div className="p-3 border-b bg-muted/20">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">OpenAI API anahtarınızı girin:</p>
            <div className="flex gap-2">
              <Input
                placeholder="sk-..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="flex-1 text-xs h-7"
                type="password"
              />
              <Button onClick={saveApiKey} size="sm" className="h-7 text-xs">
                Kaydet
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              API anahtarınız güvenli şekilde saklanır ve sadece AI yanıtları için kullanılır.
            </p>
          </div>
        </div>
      )}

      {/* API yoksa bilgi mesajı */}
      {!checkApiSettings() && !showApiSetup && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-2">
            <Settings className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              AI ile konuşmak için API anahtarı gerekli
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowApiSetup(true)}
            >
              API Anahtarı Ekle
            </Button>
          </div>
        </div>
      )}

      {/* Mesaj listesi - sadece API varsa göster */}
      {checkApiSettings() && (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-2 scroll-smooth">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <div className={`max-w-[260px] px-2 py-1 rounded-md text-sm ${
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
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted px-2 py-1 rounded-md text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Düşünüyor...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Mesaj yazma alanı - sadece API varsa göster */}
          <div className="border-t p-3 flex gap-2 items-center bg-background">
            <Input
              placeholder="AI'a mesaj yaz..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-xs h-8"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
              className="h-8 w-8"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </>
      )}
    </Card>
  )
}