import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui
import { Bot, User, Send, Loader2 } from 'luc

interface ChatMessage {
  role: 'user' | 'assistant'

// Chat mesaj arayüzü
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function TradingAssistant() {
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useKV<ChatMessage[]>('ai-chat-messages', [])

  // Enter tuşu ile mesaj gönderme
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
  con
  }

  // AI'a mesaj gönderme fonksiyonu
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    // Kullanıcı mesajını oluştur
      }
      id: Date.now().toString(),
      const newLive
      content: inputMessage.trim(),
        status: 'running',
    }

    // Mesajı listeye ekle ve input'u temizle
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
      toast.error('Str

  }
      // AI sistem promptu
      const systemPrompt = `Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:
- Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
- Ekonomik takvimi ve haber akışını takip edip yorumlamak
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
- Türkçe yanıtlar üretmek

Kullanıcı sorusu: ${userMessage.content}`

      // AI API'sine prompt gönder
      const aiResponse = await spark.llm(spark.llmPrompt`${systemPrompt}`)

      return false
      const assistantMessage: ChatMessage = {

        role: 'assistant',
        content: aiResponse || 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.',
        timestamp: new Date()
       

        winRate: 68.5 + Math.rand
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
    }
    }
  /

      // M
    <Card className="w-full h-full p-4 flex flex-col">
      <h3 className="text-lg font-bold mb-2">AI Trading Yöneticisi</h3>
      
      <ScrollArea className="flex-1 pr-2 mb-3">
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
          currency: 'USD', 
              <p>AI Trading Yöneticiniz hazır!</p>
              <p className="text-sm">Piyasa analizi ve strateji önerisi için mesaj yazın.</p>
            </div>
      ]
          
      console.error('Ekonomik takvim a
            <div
  }
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
  const handl
              <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
    }
                <div
    if (content.includes('strateji durdur') || content.includ
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
      }
                >
    // Portföy analizi
                </div>
        const portfo
            </div>
• Toplam Değe
          
• Başarı Oranı: %${portfo
            <div className="flex gap-3 justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
    // Piyasa özeti
                <div className="px-3 py-2 rounded-lg text-sm bg-muted text-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
• Trend: ${summary
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2 mt-auto">
    }
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="AI'a mesaj yazın..."
          className="flex-1"
        ).join('\n')
        />
${eventList}
          onClick={sendMessage} 
          disabled={isLoading || !inputMessage.trim()} 
          size="icon"
    }
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    }
  )
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