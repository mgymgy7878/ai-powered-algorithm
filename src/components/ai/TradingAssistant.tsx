import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useKV } from '@github/spark/hooks'
import { useActivity } from '@/contexts/ActivityContext'
import { Brain, Send, Loader2, User, Settings, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react'
import { APISettings } from '../../types/api'
import { aiService } from '../../services/aiService'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function TradingAssistant() {
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
  const [showSuggestions, setShowSuggestions] = useState(false) // ilk başta kapalı başlasın
  const [showSettings, setShowSettings] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState({ openai: false, anthropic: false })
  
  // API Settings state - App.tsx'ten gelen global ayarları kullan
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

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // AI önerileri listesi
  const suggestions = [
    { label: "Portföyü değerlendir", command: "portföyü değerlendir" },
    { label: "Bugünkü önemli ekonomik olayları göster", command: "bugünkü yüksek etkili ekonomik olayları listele" },
    { label: "Sonraki 24 saatteki kritik olaylar", command: "gelecek 24 saatte hangi önemli ekonomik olaylar var" },
    { label: "Grid bot stratejisini başlat", command: "grid bot stratejisini başlat" },
    { label: "AI'dan piyasa özeti al", command: "bugünkü piyasa özetini sun" },
    { label: "Risk analizi yap", command: "portföy risk analizi yap" }
  ]

  // Öneri uygulama fonksiyonu
  const handleSuggestionApply = async (command: string) => {
    if (isLoading) return
    
    setInputMessage(command)
    setTimeout(() => {
      sendMessage(command)
    }, 100)
  }

  // Ana mesaj gönderme fonksiyonu
  const sendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim()
    if (!text || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // AI yanıtını al
      const prompt = spark.llmPrompt`
        Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:
        - Farklı zaman dilimlerinde piyasa enstrümanlarını analiz etmek
        - Ekonomik takvimi ve haber akışını takip edip yorumlamak  
        - Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
        - Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
        - Türkçe yanıtlar üretmek
        
        Kullanıcı sorusu: ${text}
        
        Kısa, net ve uygulanabilir öneriler ver. Mümkün olduğunca spesifik ol.
      `

      const response = await spark.llm(prompt)
      
      // Güvenli yanıt kontrolü
      const safeResponse = response || 'AI yanıtı alınamadı.'

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: safeResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Aktivite log'a ekle - güvenli substring kullanımı
      const safeText = text && typeof text === 'string' ? text : 'Bilinmeyen sorgu'
      addActivity(`AI analiz tamamlandı: ${safeText.substring(0, 50)}...`, 'success')

      // Bildirim gönder
      if ((window as any).pushNotification) {
        ;(window as any).pushNotification('🤖 AI analiz tamamlandı', 'success')
      }

    } catch (error) {
      console.error('AI yanıt hatası:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. API ayarlarınızı kontrol edin veya daha sonra tekrar deneyin.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      
      if ((window as any).pushNotification) {
        ;(window as any).pushNotification('❌ AI yanıt hatası - API ayarlarını kontrol edin', 'error')
      }
    }
    
    setIsLoading(false)
  }

  // Enter tuşu ile mesaj gönderme
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // API ayarlarını kaydetme
  const saveApiSettings = () => {
    setApiSettings({ ...apiSettings })
    aiService.setSettings(apiSettings)
    setShowSettings(false)
    
    if ((window as any).pushNotification) {
      ;(window as any).pushNotification('✅ API ayarları kaydedildi', 'success')
    }
  }

  // Hangi modelin aktif olduğunu belirle
  const getActiveModel = () => {
    try {
      if (apiSettings?.openai?.enabled === true && apiSettings.openai?.apiKey?.trim()) {
        return `GPT-${apiSettings.openai.model}`
      } else if (apiSettings?.anthropic?.enabled === true && apiSettings.anthropic?.apiKey?.trim()) {
        return `Claude ${apiSettings.anthropic.model}`
      }
      return 'Model Seçiniz'
    } catch (error) {
      console.warn('Model selection error:', error)
      return 'Model Seçiniz'
    }
  }

  return (
    <Card className="w-full h-[calc(100vh-100px)] flex flex-col bg-background border rounded-md shadow-md overflow-hidden">
      {/* Header ultra kompakt - başlık, model seçici ve ayarlar yan yana */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
            <Brain className="w-3 h-3" />
            <span>AI Yöneticisi</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-[8px] px-1 py-0 h-3">
              {getActiveModel()}
            </Badge>
            
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSettings(true)}
                className="h-4 w-4 p-0"
              >
                <Settings className="w-3 h-3" />
              </Button>
                
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>API Ayarları</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* OpenAI Settings */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">OpenAI</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, openai: !prev.openai }))}
                      >
                        {showApiKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Input
                      type={showApiKeys.openai ? "text" : "password"}
                      placeholder="OpenAI API Key"
                      value={apiSettings.openai?.apiKey || ''}
                      onChange={(e) => setApiSettings(prev => ({
                        ...prev,
                        openai: { ...prev.openai!, apiKey: e.target.value }
                      }))}
                    />
                    <Select
                      value={apiSettings.openai?.model || 'gpt-4'}
                      onValueChange={(value) => setApiSettings(prev => ({
                        ...prev,
                        openai: { ...prev.openai!, model: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Anthropic Settings */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Anthropic Claude</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, anthropic: !prev.anthropic }))}
                      >
                        {showApiKeys.anthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Input
                      type={showApiKeys.anthropic ? "text" : "password"}
                      placeholder="Anthropic API Key"
                      value={apiSettings.anthropic?.apiKey || ''}
                      onChange={(e) => setApiSettings(prev => ({
                        ...prev,
                        anthropic: { ...prev.anthropic!, apiKey: e.target.value }
                      }))}
                    />
                    <Select
                      value={apiSettings.anthropic?.model || 'claude-3-sonnet'}
                      onValueChange={(value) => setApiSettings(prev => ({
                        ...prev,
                        anthropic: { ...prev.anthropic!, model: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                        <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={saveApiSettings} className="w-full">
                    Ayarları Kaydet
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Öneri toggle butonu - ayrı satır, kompakt */}
        <div className="px-2 pb-0.5">
          <Button
            onClick={() => setShowSuggestions(!showSuggestions)}
            variant="ghost"
            className="text-[9px] px-2 py-0 h-4 w-full justify-center"
          >
            {showSuggestions ? (
              <>
                <ChevronUp className="w-2 h-2 mr-1" />
                Önerileri Gizle
              </>
            ) : (
              <>
                <ChevronDown className="w-2 h-2 mr-1" />
                Önerileri Göster
              </>
            )}
          </Button>
        </div>
      </div>
      {/* AI Önerileri - Gizlenebilir panel - taşma sorunu düzeltildi */}
      {showSuggestions && (
        <div className="px-2 py-0.5 bg-muted/30 border-b">
          <div className="flex flex-wrap gap-1">
            {suggestions.map((item, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionApply(item.command)}
                disabled={isLoading}
                className="text-[8px] h-5 px-1.5 justify-start flex-shrink-0"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      {/* Chat Messages - Kaydırılabilir alan - padding azaltıldı */}
      <ScrollArea className="flex-1 px-2 py-1">
        <div className="space-y-2">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Brain className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              
              <div className={`rounded-lg px-2 py-1 max-w-[85%] text-xs ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}>
                <p className="whitespace-pre-wrap leading-tight">{message.content}</p>
                <p className={`text-[10px] mt-0.5 opacity-70 ${
                  message.role === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}>
                  {message.timestamp && message.timestamp instanceof Date 
                    ? message.timestamp.toLocaleTimeString('tr-TR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    : 'Şimdi'
                  }
                </p>
              </div>
              
              {message.role === 'user' && (
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3 h-3 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Brain className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-lg px-2 py-1 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-xs text-muted-foreground">Düşünüyor...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      {/* Input Area - Sabit alt bar - padding azaltıldı */}
      <div className="border-t px-2 py-1 bg-background">
        <div className="flex gap-1 items-center">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="AI'a mesaj yaz..."
            className="flex-1 text-xs h-7"
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <Button 
            onClick={() => sendMessage()} 
            disabled={!inputMessage.trim() || isLoading} 
            size="sm"
            className="flex-shrink-0 h-7 w-7 p-0"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Send className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}