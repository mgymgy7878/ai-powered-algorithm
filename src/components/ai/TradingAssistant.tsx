import React, { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { aiService } from '@/services/aiSer
import { Send, Loader2, User, Bot, Play, Pause, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { aiService } from '@/services/aiService'
import { binanceService } from '@/services/binanceService'
  timestamp: Date
  actionData?: any


  marketPrices: any[]
  activeTrad

  const [messages
  timestamp: Date
 

  const [systemData, setSystemData] 
    accountInfo: null,
    portfolioValue: 0,
  })
  // Gather system data

        binanceServ
      ])
      const portfolioValue = accountInfo?
      id: '1',
      const activeTrades
      ).length || 0
      return {
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    // Yeni mesaj geldiğinde scroll'u aşağı kaydır
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
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
      const systemPrompt = `Sen yapay zeka destekli bir algoritmik trader yöneticisisin. Görevin:
- Farklı zaman dilimlerinde tüm piyasa enstrümanlarını analiz etmek
- Ekonomik takvimi ve haber akışını takip edip yorumlamak  
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
    }

    setIsLoading(true)

      const currentSystemData = await collectSystemData()

      const message = inputMessage.trim().toL
      
      if (message.includes
          message.includes
        )
       

        const strategyMatch = liveStrategies.find(s =>
          message.inc
        if (strategyMatch) {
          toast.success(actionResult)
      }
      // Enhanced system p

• Toplam Strateji: ${currentS
• Portf

${currentSystem
).join('\n')}
AKTİF
  `

${currentSystemData.marketPrices.slice(0, 5).map(p => 
).join('\n')}
GÖREVLERİN:
2. Strateji perform
4. Ge
6. 

KULLANICI 
      const response = await aiService.generateRespons
      const assistantMessage: ChatMessage = {
      
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, as
      console.er
        id: (Date.now() + 1).t
        content: 'Üzgünüm, şu anda bir 
      }
      
      if (err
      }
      setIsLoading(false)
  }
  const handleQuick
      case 'por
        break
        setInputMessage('Güncel piyasa dur
      case 'strategy_recommendations':
        break
        setInputMess
    }

    if (e.key === 'Ente
      sendMessage()
  }
  return (
                <div
        <div className="flex items-center gap-2
            <TrendingUp className="w-3 h-3"
          </span>
            <Play className="w-3 h-3" />
          </span>
      </div>
      {/* Quick Action Buttons */}
                  <p className="text-xs opacity-70 mt-1">
          variant="outline" 
          onClick={() => handleQuickAc
          📊 Portföy Analizi
                    })}
          variant="out
                </div>
          📈 Piyasa 
            </div>
          var
          
          🎯 Strateji Öne
        <Button 
          variant="outline" 
          onClick={() => handleQuickAction(
          ⚠️ Risk Ko
      </div>
      <ScrollArea className="flex-1 pr-2 mb-3" ref={scrol
          {messages.map((message) => (
              key={message.id}
                messag
            >
            </div>
            
        </div>
                   

                    <User className="w-4 h
        <Input
                </div>
          onChange={(e) => setInputMessage(e.target.value)}
                      ? 'bg-primary t
                  }`}
                  <p classNa
                    <p classNa
          
        <Button 
                    {message.act
                        {message.actionType === 'strate
                     
        >
                  </div>
              </div>
          ))}
          {isLoading && (
            
              </d
            
    </Card>
   
}            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-2 mt-auto">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="AI'a mesaj yazın veya komut verin..."
          className="flex-1 text-sm"
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