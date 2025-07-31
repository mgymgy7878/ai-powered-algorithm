import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/butto
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useKV } from '@github/spark/hooks'

  id: string
  content: string
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
 

  useEffect(() => {
    if (scrollAreaRef.current) {
    }

    if (!inputMessage.trim() || isLoading) return
    const userMessage: ChatMessage = {

      timestamp: ne

    setInputMessage('')

      // AI sistem promp
- Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
- Kullanıcının portföyünü d
- Tür
Kullanıcı sorusu: ${userMessage.c


        'Sen yapay 
      )
      const assistantMessage: Ch
        role: 'assistant',
     


      const errorMessage: ChatMessa
        role: 'assistant',

      setMessages(prev => [...prev, er
      setIsLoading(false)
  }
  const handleKeyPress = (e: React.
      e.preventDefault()
    }

    <Card className="w-full h-full p-4 flex fle
      
        <div className

         
              }`}
              {message.role === 'assistant' && (
                  <Bot className="w-4 h-4 text-primary-foreground" 
              )}
              <div
                  message.role === 'user'
                    : 'bg

                <p className="text-xs op
                    hour: '2-digit',

              </div>

                  <User className="w-4 h-4 text-secondary-foreground"
      
          ))}
          {isLoading && (
              <div classNa
              </div>
                <Loader2 clas
       


        <Input
          onChange={(e) => setInputMessage(e.t
          placeholder="AI'a mesaj yazın..
          disabled={isLoading}
        <Button 
          disabled={isLoading || !inputMessage.trim()} 
        >
       
            <Send className="w-4 h-4" />
        </Butto
    </Card>
}
























































































