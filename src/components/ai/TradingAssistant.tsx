import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/butto
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'

  id: string

}
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function TradingAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
  con
    anthropic:

  const messagesEndRef = useRef<HTMLDivElement>(null)
  // API anahtarı test etme
    i
    
      // Geçici olarak API anahtarını ayarla ve test e
        ...apiSettings,

      
      const testPrompt = spark.llmPrompt`Bu bir bağla

      setApiSettings(testSettings)
      setShowApiSettings(false)
      // Başarı mesajı ekle
   

      }
      
      console.er


  const scrollToBottom = () => {
  }

  }, [messages])
  // AI ile mesaj gönderme
    if (!inputMessa
    // API ayarları yoksa uyarı gös
      setShowApiSettings(tr
    }

      role: 'user',
      timestamp: new Da



      // AI prompt oluştur
      - Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
      - Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
      - Türkçe yanıtlar üretmek
      Kullanıcı mesajı: ${userMessage.content}
      Lütfen kısa, öz ve işe yarar bir yanıt ver. Gerekirse somut öneri
      const aiResponse = await 

        role: 'assistant',
      
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

      {/* Mesaj listesi - scrollable alan */}
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
            </div>
              <Loader2 className="w
            </div>
        )}
        <div ref={

      <div c
          value={inputMessage}
          onKeyDown={handleKeyDown}
          className="flex-1 text-xs h-8"
        />
          onCl
          size="
        >

            <Send className="w
        </Button>
    </Card>
}




































