import React, { useState } from 'react'
import { Button } from '@/components/ui/but
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bot, User, Send, Loader2 } from 'l
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, User, Send, Loader2 } from 'lucide-react'

  content: string
interface ChatMessage {

  role: 'user' | 'assistant'
  const [isLoadin
  timestamp: Date
}



      // Kullanıcı mesajını oluştur
        id: Date.now().toString(),

      }
      // Mesajı listeye ekle ve input'u temizle
      setInputMessage('')
      // AI sistem promp
- Farklı zaman dili
- Kul
- T

      // AI API'sine prompt gönder

        id: (Date.now() + 1).toString(),

    setIsLoading(true)

    try {
      // Kullanıcı mesajını oluştur
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: inputMessage.trim(),
        timestamp: new Date()
       

      // Mesajı listeye ekle ve input'u temizle
      setMessages(prev => [...prev, userMessage])
      setInputMessage('')

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

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('AI yanıt hatası:', error)
      
      const errorMessage: ChatMessage = {
                  )}
        role: 'assistant',
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date()
       

      setMessages(prev => [...prev, errorMessage])
    } finally {
            </div>
    }
   

  return (
    <Card className="w-full h-full p-4 flex flex-col">
      <h3 className="text-lg font-bold mb-2">AI Trading Yöneticisi</h3>
      
              </div>
        <div className="space-y-3">
          {(!messages || messages.length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>AI Trading Yöneticiniz hazır!</p>
              <p className="text-sm">Piyasa analizi ve strateji önerisi için mesaj yazın.</p>
            </div>
          cl
          
        <Button 
            <div
          size="icon"
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            <
              <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}

                <div
                  className={`px-3 py-2 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'

                >
                  {message.content}
                </div>

            </div>

          

            <div className="flex gap-3 justify-start">

                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-3 py-2 rounded-lg text-sm bg-muted text-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>

          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2 mt-auto">

          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="AI'a mesaj yazın..."
          className="flex-1"

        />

          onClick={sendMessage} 

          size="icon"

          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}

      </div>

  )
