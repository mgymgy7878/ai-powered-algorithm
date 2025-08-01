import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, Send, Loader2, User, Settin
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { Brain, Send, Loader2, User, Settings } from '@phosphor-icons/react'

  content: string
interface ChatMessage {

  role: 'user' | 'assistant'
    {
  timestamp: Date
}

export function TradingAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
  con
      id: '1',
      role: 'assistant',
      content: 'Merhaba! AI Trading Yöneticinizim. Size piyasa analizi, strateji önerileri ve portföy değerlendirmesi konularında yardımcı olabilirim. Nasıl yardımcı olabilirim?',
  useEffect(() => {
    }

  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiSettings] = useKV('api-settings', {})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mesajlar değiştiğinde en alta kaydır
  useEffect(() => {
    }
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // AI ile mesaj gönderme
  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    // API ayarları kontrolü
    if (!apiSettings?.openai?.apiKey && !apiSettings?.anthropic?.apiKey) {
      // API ayarları sayfasına yönlendir
      window.dispatchEvent(new CustomEvent('navigate-to-settings'))
      return
    }

    if (!inputMessage.

    if (!checkApiSettings()) {
    const userMessage: ChatMessage = {
    }
      role: 'user',

      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    try {
    } finally {
    }

  const handleKeyDown = (e: React.KeyboardEvent) => {
      e.preventDefault()
    }


      <div className="p-3 border-b bg-muted/30

          <Badge variant="secondary" className="text-xs ml-auto">

            variant="ghost"
      
          >
          </Button>
      </div>
      {/* API Setup ekranı *
        <div className="p-3 b
       

                value={tempApiKey}
                class
              />
                Kaydet
            </div>
              API anahtarı
          </div>
      )}
      {
        <div className="flex-1 flex items-center j
            <Se
              AI ile konu
     
   

            </Button>
        </div>

      {checkApiSettings(
          <div clas
     
   

          
                  message.role === 'user' 
                    : 'bg-
                  <p className="whitespace-pre-w
                    {message.timestamp.toLocaleTi
                      minute: '2-digit' 
                  </p>

                 
                  
              
            

                  <Brain className="w-4 h-4 t
                <div className="bg-muted px-2 py-1 rounded-md text-sm 
                  <span>Düşünüyor...
              </div>
            <div ref={messagesEndRef} />

          <div className="border-t p-3 flex gap-2 items-ce
              placeh
              
            
            <Button
              disabled={!inputMessage.
              className="h-8 w-8"
              {isLoading ? (
              ) 
              )}
          </div>
      )}
  )



















































