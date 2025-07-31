import React, { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useKV } from '@github/spark/hooks'
interface ChatMessage {
import { Bot, User, Send, Loader2 } from 'lucide-react'

interface ChatMessage {

  role: 'user' | 'assistant'
  const [inputMes
  timestamp: Date


export function TradingAssistant() {
  const [messages, setMessages] = useKV<ChatMessage[]>('ai-chat-messages', [])
      id: Date.now().toString(),
      content: inputMessage.trim(),
    }

    setIsLoading(true)
    try {
      const systemPrompt = `Sen 
- Ekonomik takvimi ve haber akışını takip edip yorumlamak
- Hangi stratejiler çalışt


     


        content: response,
      }

      console.error('AI yanıt hatası:'
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // AI sistem promptu
      const systemPrompt = `Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:
- Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
- Ekonomik takvimi ve haber akışını takip edip yorumlamak
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
- Türkçe yanıtlar üretmek

Kullanıcı sorusu: ${userMessage.content}`

      // Spark AI API çağrısı
      const prompt = spark.llmPrompt`${systemPrompt}`
      const response = await spark.llm(prompt)

      const assistantMessage: ChatMessage = {
            </div>
          {isLoading && (
              <div classNa
              </div>
       

        </div>

        <Input
          onChange={(e) => setInputMessag
          placeholder="AI'a mesaj yazın.
          disabled={isLoad
        <Button 
          disabled={isLoading
       
            <Loader2 className="w-4 h-4 animate-sp
            <Send className="w-4 h-4" /
        </Butto
    </Card>
}










































            </div>










          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2 mt-auto">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}


















