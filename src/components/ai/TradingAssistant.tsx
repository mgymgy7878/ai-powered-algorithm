import React, { useState, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
interface ChatMessage {
  role: 'user' | 'assistant'
  timestamp: Date

  const [messages, setM
  const [isL

  useEffect(() =>
  }, [messages])
 

    const userMessage: ChatMessage =
      role: 'user',
      timestamp: new Date()

    setInputMessage('')

      const systemPrompt = `Sen yapay zekâ destekli bi
- Ekonomik takvimi 
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek


      
        id: (Date.now() + 1).toStri
        content: aiResponse,

      setMessages(prev => [...prev, as
      console.error('AI yanıt ha
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const systemPrompt = `Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:
- Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
- Ekonomik takvimi ve haber akışını takip edip yorumlamak
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
- Türkçe yanıtlar üretmek

Kullanıcı sorusu: ${inputMessage}`

      const aiResponse = await aiService.generateResponse(systemPrompt)
      
      const assistantMessage: ChatMessage = {
                  </p>

                  <div class
                  </div>
       

          {isLoading && (
              <div cl
                  <Bot className="w-4 h-4 text
                <div className="bg-muted 
                    <Loader2 className="
                  </div>
              </div>
          )}
       

        <Input
          onChange={(e) =
     
   

          
        >
        </Button>
    </
}






































          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 p-1 bg-primary/10 rounded-full">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">AI düşünüyor...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="flex gap-2 mt-auto">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="AI'a mesaj yazın..."
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          disabled={isLoading}
        />
        <Button 
          onClick={sendMessage} 
          disabled={isLoading || !inputMessage.trim()} 
          size="icon"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </Card>
  )
}