import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/butto
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useKV } from '@github/spark/hooks'
import { Bot, User, Send, Loader2 } from 'lucide-react'

  content: string
interface ChatMessage {

  role: 'user' | 'assistant'
  const [inputMes
  timestamp: Date
}

      e.preventDefault()
    }

  const sendMessage = async () => {


      role: 'user',
      timestamp: ne

    setMessages(prev => [...prev, userMessage])
    s
    try {

- Ekonomik takvimi ve haber akışı
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu t

      e.preventDefault()
      sendMessage()
    }
  }

  // AI'a mesaj gönderme fonksiyonu
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    // Kullanıcı mesajını oluştur
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    // Mesajı listeye ekle ve input'u temizle
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

                </div>
            </div>
          

              <div className="w-8 
              </div>
                <Loader2 className="w-4 
            </div>
        </div>

      <

          onKeyPress={handleKeyPr
          className="flex-1"

          onClick={se
          size="icon"
      
          ) : (
          )}
      </div>
  )






















































































