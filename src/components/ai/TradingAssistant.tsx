import React, { useState, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Send, Loader2, User, Bot, Play, Pause, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { aiService } from '@/services/aiService'
import { binanceService } from '@/services/binanceService'
import { useKV } from '@github/spark/hooks'
import { TradingStrategy } from '@/types/trading'
import { toast } from 'sonner'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  actionType?: 'strategy_start' | 'strategy_stop' | 'market_analysis' | 'portfolio_analysis'
  actionData?: any
}

interface SystemData {
  strategies: TradingStrategy[]
  accountInfo: any
  marketPrices: any[]
  portfolioValue: number
  activeTrades: number
}

export function TradingAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [strategies, setStrategies] = useKV<TradingStrategy[]>('trading-strategies', [])
  const [liveStrategies, setLiveStrategies] = useKV<TradingStrategy[]>('live-strategies', [])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // System data gathering
  const [systemData, setSystemData] = useState<SystemData>({
    strategies: [],
    accountInfo: null,
    marketPrices: [],
    portfolioValue: 0,
    activeTrades: 0
  })

  // Gather system data
  const collectSystemData = async (): Promise<SystemData> => {
    try {
      const [accountInfo, marketPrices] = await Promise.all([
        binanceService.getAccountInfo(),
        binanceService.getSymbolPrices()
      ])

      const portfolioValue = accountInfo?.totalWalletBalance 
        ? parseFloat(accountInfo.totalWalletBalance) 
        : 0

      const activeTrades = accountInfo?.positions?.filter(pos => 
        parseFloat(pos.positionAmt) !== 0
      ).length || 0

      return {
        strategies,
        accountInfo,
        marketPrices: marketPrices.slice(0, 10), // Top 10 symbols
        portfolioValue,
        activeTrades
      }
    } catch (error) {
      console.error('System data collection error:', error)
      return {
        strategies: [],
        accountInfo: null,
        marketPrices: [],
        portfolioValue: 0,
        activeTrades: 0
      }
    }
  }

  useEffect(() => {
    // Initialize system data
    const initializeData = async () => {
      const data = await collectSystemData()
      setSystemData(data)
    }
    
    initializeData()

    // Welcome message with system context
    const welcomeMessage: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: `Merhaba! AI Trading Yöneticinizim. 

🔍 **Mevcut Durum:**
• ${strategies.length} strateji mevcut
• ${liveStrategies.length} aktif strateji çalışıyor
• Portföy değeri analiz ediliyor...

📈 **Yapabileceklerim:**
• Piyasa analizi ve strateji önerileri
• Stratejilerinizi başlatma/durdurma
• Portföy risk değerlendirmesi  
• Performans analizi

Hangi konuda yardımcı olabilirim?`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [strategies.length, liveStrategies.length])

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
      // Collect fresh system data
      const currentSystemData = await collectSystemData()
      setSystemData(currentSystemData)

      // Check for action commands
      const message = inputMessage.trim().toLowerCase()
      let actionResult = ''
      
      // Strategy management commands
      if (message.includes('başlat') || message.includes('çalıştır') || message.includes('start')) {
        const strategyMatch = strategies.find(s => 
          message.includes(s.name.toLowerCase()) || 
          message.includes(s.id)
        )
        if (strategyMatch && strategyMatch.status === 'ready') {
          actionResult = await executeStrategyAction('start', strategyMatch.id)
          toast.success(actionResult)
        }
      } else if (message.includes('durdur') || message.includes('stop')) {
        const strategyMatch = liveStrategies.find(s => 
          message.includes(s.name.toLowerCase()) || 
          message.includes(s.id)
        )
        if (strategyMatch) {
          actionResult = await executeStrategyAction('stop', strategyMatch.id)
          toast.success(actionResult)
        }
      }

      // Enhanced system prompt with real data
      const systemPrompt = `Sen yapay zeka destekli bir algoritmik trader yöneticisisin. 

MEVCUT SİSTEM DURUMU:
• Toplam Strateji: ${currentSystemData.strategies.length}
• Aktif Stratejiler: ${liveStrategies.length}
• Portföy Değeri: $${currentSystemData.portfolioValue.toFixed(2)}
• Aktif İşlemler: ${currentSystemData.activeTrades}

MEVCUT STRATEJİLER:
${currentSystemData.strategies.map(s => 
  `- ${s.name} (${s.status}) - ${s.category} kategorisi`
).join('\n')}

AKTİF STRATEJİLER:
${liveStrategies.map(s => 
  `- ${s.name} - PnL: $${s.liveStats?.currentPnL || 0}`
).join('\n')}

PIYASA VERİLERİ (Top 5):
${currentSystemData.marketPrices.slice(0, 5).map(p => 
  `- ${p.symbol}: $${parseFloat(p.price).toFixed(4)} (${p.priceChangePercent}%)`
).join('\n')}

GÖREVLERİN:
1. Piyasa verilerini analiz et ve trend tahminleri yap
2. Strateji performanslarını değerlendir
3. Risk yönetimi önerileri sun
4. Gerekirse strateji başlatma/durdurma komutları ver
5. Portföy optimizasyonu öner
6. Türkçe yanıtlar ver

${actionResult ? `\nSON YAPILAN İŞLEM: ${actionResult}` : ''}

KULLANICI SORUSU: ${inputMessage.trim()}`

      const response = await aiService.generateResponse(systemPrompt)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        actionType: actionResult ? 'strategy_start' : undefined
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI yanıt hatası:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen API ayarlarınızı kontrol edin ve tekrar deneyin.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      
      // Navigate to settings if connection issue
      if (error && error.toString().includes('bağlantı')) {
        window.dispatchEvent(new Event('navigate-to-settings'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'portfolio_analysis':
        setInputMessage('Portföyümü analiz et ve risk değerlendirmesi yap')
        break
      case 'market_summary':
        setInputMessage('Güncel piyasa durumunu özetle ve trend analizi yap')
        break
      case 'strategy_recommendations':
        setInputMessage('Mevcut piyasa koşullarına göre hangi stratejileri önerirsin?')
        break
      case 'risk_alert':
        setInputMessage('Portföyümde risk oluşturacak durumlar var mı?')
        break
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <Card className="w-full h-full p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold">AI Trading Yöneticisi</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {systemData.portfolioValue > 0 ? `$${systemData.portfolioValue.toFixed(0)}` : 'N/A'}
          </span>
          <span className="flex items-center gap-1">
            <Play className="w-3 h-3" />
            {liveStrategies.length}
          </span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-1 mb-3">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-6"
          onClick={() => handleQuickAction('portfolio_analysis')}
        >
          📊 Portföy Analizi
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-6"
          onClick={() => handleQuickAction('market_summary')}
        >
          📈 Piyasa Durumu
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-6"
          onClick={() => handleQuickAction('strategy_recommendations')}
        >
          🎯 Strateji Önerisi
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-6"
          onClick={() => handleQuickAction('risk_alert')}
        >
          ⚠️ Risk Kontrolü
        </Button>
      </div>
      
      <ScrollArea className="flex-1 pr-2 mb-3" ref={scrollAreaRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex gap-2 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {message.actionType && (
                      <span className="text-xs px-1 py-0.5 bg-accent text-accent-foreground rounded">
                        {message.actionType === 'strategy_start' && '▶️'}
                        {message.actionType === 'strategy_stop' && '⏹️'}
                        {message.actionType === 'market_analysis' && '📊'}
                        {message.actionType === 'portfolio_analysis' && '💼'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">AI analiz yapıyor...</span>
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