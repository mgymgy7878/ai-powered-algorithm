import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

import { Card } from '@/components/ui/card'
import { Bot, User, Send, Loader2 } from 'lucide-react'

interface ChatMessage {
    {
      role: 'assistant',
      timestamp: 
  ])
 

    
    
     
        id: Da
        content: inputMe
      }
      // Mesajı listeye ekl
     
    
- Farklı zaman dilimlerinde tüm piyasa enstrümanlarını
- Kullanıcının portföyünü değerlendirerek özet çıka

      try {
        const prompt = spark.llmProm
- Ri
- Trading sinyalleri d
Kısa
        /
      // Kullanıcı mesajını oluştur
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: inputMessage,
        timestamp: new Date()
      }
      
      // Mesajı listeye ekle ve input'u temizle
      setMessages(prev => [...prev, userMessage])
      setInputMessage('')
      
      // AI sistem promptu
      const systemPrompt = `Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:
- Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
- Ekonomik takvimi ve haber akışını takip edip yorumlamak
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
- Türkçe yanıtlar üretmek`

      try {
        // AI prompt oluştur
        const prompt = spark.llmPrompt`Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Kullanıcı sorusu: "${inputMessage}". Türkçe yanıt ver ve şu konularda yardımcı ol:
- Piyasa analizi ve strateji önerileri
- Risk yönetimi tavsiyeleri  
- Portföy optimizasyonu
- Trading sinyalleri değerlendirmesi

Kısa ve öz bir yanıt ver.`
      
        // AI'dan yanıt al
        const aiResponse = await spark.llm(prompt)
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse || 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.',
          timestamp: new Date()
    } fin
        
        setMessages(prev => [...prev, assistantMessage])
        
    if (e.key === 'Enter'
        console.error('AI API hatası:', aiError)
        
        // Fallback yanıt
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
      
          content: `${inputMessage} hakkında analiz yapıyorum. Bu konuda size şu önerileri sunabilirim:

• Piyasa durumunu değerlendirdiğimde, mevcut volatilite seviyeleri orta düzeyde
• Risk yönetimi açısından position size'ınızı kontrol etmenizi öneriyorum
• Teknik göstergelere göre trend analizi yapabilir, uygun stratejiyi önerebilirim

Hangi konuda daha detaylı yardım istersiniz?`,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, assistantMessage])
       
      
                  cla
      console.error('AI yanıt hatası:', error)
      
      const errorMessage: ChatMessage = {
                  <p className="whitespa
        role: 'assistant',
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      </ScrollArea>
    }
   

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
          disabled={isLo
      sendMessage()
     
  }

  return (
    <Card className="w-full h-full p-4 flex flex-col">
      <h3 className="text-lg font-bold mb-2">AI Trading Yöneticisi</h3>
      
      <ScrollArea className="flex-1 pr-2 mb-3">
        <div className="space-y-3">
          {messages.map((message) => (

              key={message.id}


























































