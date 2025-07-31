import React, { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui
import { aiService } from '@/services/aiServi
interface ChatMessage {
  role: 'user' | 'assistant'
  timestamp: Date

  const [messages, setM
  const [isL

  useEffect(() =>
  }, [messages])
 

    const userMessage: ChatMessage =
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mesajlar güncellendiğinde scroll'u en alta kaydır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // AI mesaj gönderme fonksiyonu
  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),

      content: inputMessage,
      const aiResponse = aw
    }

    setMessages(prev => [...prev, userMessage])
        timestamp: new 
    setIsLoading(true)

    try {
      const systemPrompt = `Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:
- Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
- Ekonomik takvimi ve haber akışını takip edip yorumlamak
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
      setMessages(prev => [...prev, errorMessage])
- Türkçe yanıtlar üretmek

Kullanıcı sorusu: ${inputMessage}`

      const aiResponse = await aiService.generateResponse(systemPrompt)
      
      const assistantMessage: ChatMessage = {
                <div className="flex-shr
                    <User 
                    <Bot cla
                </div>
       

                  }`}
                  <p 
                    {message.timestamp.toLocal
                      minute: '2-digit'
                  </p>
              </div>
          ))}
          {isLoading && (
       
                <div className="bg-muted rounded-l
               
                  </div>
     
   


        <Input
          onChange={(e) => setInputMessage(
          placeholder="A
          disabled=
     
   

          
            <Send className="w-4 h-4" />
        </Button>
    </
}






























                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >




















































