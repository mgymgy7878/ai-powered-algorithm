import React, { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Send, User, Brain, Settings, Check, X } from 'lucide-react'
import { useKV } from '@github/spark/hooks'
import { aiService } from '@/services/aiService'

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
  const [showApiSettings, setShowApiSettings] = useState(false)
  const [tempApiKey, setTempApiKey] = useState('')
  const [apiStatus, setApiStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  
  // API ayarlarını KV'den al
  const [apiSettings, setApiSettings] = useKV('api-settings', {
    openai: { apiKey: '', model: 'gpt-4', enabled: true },
    anthropic: { apiKey: '', model: 'claude-3-sonnet', enabled: false }
  })

  // Mesaj scroll container referansı
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // API anahtarı test etme
  const testApiKey = async () => {
    if (!tempApiKey.trim()) return
    
    setApiStatus('testing')
    try {
      // Geçici olarak API anahtarını ayarla ve test et
      const testSettings = {
        ...apiSettings,
        openai: { ...apiSettings.openai, apiKey: tempApiKey }
      }
      aiService.setSettings(testSettings)
      
      // Basit bir test mesajı gönder
      const testPrompt = spark.llmPrompt`Bu bir bağlantı testidir. Sadece "Test başarılı" yanıtını ver.`
      await spark.llm(testPrompt)
      
      // Başarılıysa API ayarlarını kaydet
      setApiSettings(testSettings)
      setApiStatus('success')
      setShowApiSettings(false)
      
      // Başarı mesajı ekle
      const successMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '✅ API bağlantısı başarılı! Artık sorularınızı cevaplayabilirim.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, successMessage])
      
    } catch (error) {
      console.error('API test hatası:', error)
      setApiStatus('error')
    }
  }

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

    // API ayarları yoksa uyarı göster
    if (!aiService.isConfigured()) {
      setShowApiSettings(true)
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
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. API ayarlarınızı kontrol edin.',
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
      {/* Sabit başlık - API ayarları ile */}
      <div className="px-3 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm">AI Trading Yöneticisi</h3>
          
          {/* API durumu badge */}
          {aiService.isConfigured() ? (
            <Badge variant="secondary" className="text-xs px-1 py-0 bg-green-100 text-green-700">
              <Check className="w-3 h-3 mr-1" />
              Bağlı
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs px-1 py-0">
              <X className="w-3 h-3 mr-1" />
              API Yok
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            className="h-6 w-6 p-0 ml-auto"
            onClick={() => setShowApiSettings(!showApiSettings)}
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
        
        {/* API ayarları - kompakt form */}
        {showApiSettings && (
          <div className="mt-2 p-2 bg-background border rounded-md">
            <div className="flex gap-2 items-center mb-2">
              <Input
                placeholder="OpenAI API Key"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="text-xs h-7 flex-1"
                type="password"
              />
              <Button 
                onClick={testApiKey} 
                disabled={!tempApiKey.trim() || apiStatus === 'testing'}
                size="sm" 
                className="h-7 px-2 text-xs"
              >
                {apiStatus === 'testing' ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : apiStatus === 'success' ? (
                  <Check className="w-3 h-3" />
                ) : apiStatus === 'error' ? (
                  <X className="w-3 h-3" />
                ) : (
                  'Test'
                )}
              </Button>
            </div>
            
            {apiStatus === 'error' && (
              <p className="text-xs text-destructive">API bağlantısı başarısız</p>
            )}
          </div>
        )}
      </div>

      {/* Mesaj listesi - daha kompakt padding */}
      <div className="flex-1 overflow-y-auto px-3 py-1 scroll-smooth">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-2 mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Brain className="w-3 h-3 text-primary" />
              </div>
            )}
            
            <div className={`max-w-[260px] px-2 py-1 rounded-md text-xs leading-relaxed ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-foreground'
            }`}>
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              <p className="text-xs opacity-50 mt-1">
                {message.timestamp.toLocaleTimeString('tr-TR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            
            {message.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}

        {/* Loading mesajı - kompakt */}
        {isLoading && (
          <div className="flex gap-2 justify-start mb-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Brain className="w-3 h-3 text-primary" />
            </div>
            <div className="bg-muted text-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Düşünüyor...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Mesaj input alanı - kompakt, her zaman altta sabit */}
      <div className="border-t px-3 py-2 flex gap-2 items-center bg-background">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="AI'a mesaj yaz..."
          className="flex-1 text-xs h-8"
          disabled={isLoading}
        />
        <Button 
          onClick={sendMessage} 
          disabled={!inputMessage.trim() || isLoading} 
          size="sm"
          className="h-8 w-8 p-0"
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