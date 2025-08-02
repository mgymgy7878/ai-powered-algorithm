import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Brain, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, Send } from 'lucide-react'

interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MarketData {
  symbol: string
  price: number
  change: number
  volume: number
}

interface Portfolio {
  totalValue: number
  dailyPnL: number
  positions: number
  winRate: number
}

export default function TradingApp() {
  // States
  const [messages, setMessages] = useKV<AIMessage[]>('ai-messages', [])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [portfolio] = useKV<Portfolio>('portfolio', {
    totalValue: 50000,
    dailyPnL: 1250.50,
    positions: 5,
    winRate: 68.5
  })
  
  const [marketData] = useKV<MarketData[]>('market-data', [
    { symbol: 'BTC/USDT', price: 43250.50, change: 2.45, volume: 1250000 },
    { symbol: 'ETH/USDT', price: 2650.80, change: -1.20, volume: 850000 },
    { symbol: 'SOL/USDT', price: 98.45, change: 4.20, volume: 450000 },
    { symbol: 'ADA/USDT', price: 0.485, change: -0.85, volume: 320000 }
  ])

  // AI Chat fonksiyonu
  const sendMessage = async () => {
    if (!inputMessage.trim()) return
    
    setIsLoading(true)
    
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    
    try {
      // AI yanıtı simülasyonu - gerçek uygulamada spark.llm kullanılabilir
      const aiResponse = generateAIResponse(inputMessage)
      
      const assistantMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }
      
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage])
        setIsLoading(false)
      }, 1000)
      
    } catch (error) {
      console.error('AI yanıt hatası:', error)
      setIsLoading(false)
    }
  }

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('bitcoin') || input.includes('btc')) {
      return '📈 Bitcoin analizi: Mevcut trend yükselişte. $43,250 seviyesinde güçlü destek var. Kısa vadede $45,000 hedefi mümkün. Risk/getiri oranı olumlu.'
    }
    
    if (input.includes('portföy') || input.includes('portfolio')) {
      return `💼 Portföy durumunuz: Toplam değer $${portfolio.totalValue.toLocaleString()}, günlük K/Z +$${portfolio.dailyPnL}. %${portfolio.winRate} başarı oranı ile güçlü performans gösteriyorsunuz.`
    }
    
    if (input.includes('strateji') || input.includes('strategy')) {
      return '🎯 Strateji önerisi: Mevcut piyasa koşullarında DCA (Dollar Cost Averaging) stratejisi önerilir. Volatiliteden yararlanmak için %20 stop-loss kullanın.'
    }
    
    if (input.includes('risk')) {
      return '⚠️ Risk analizi: Portföyünüzde %15 risk seviyesi tespit edildi. Pozisyon büyüklüklerini gözden geçirmenizi öneririm. Diversifikasyon artırılabilir.'
    }
    
    return '🤖 Size nasıl yardımcı olabilirim? Piyasa analizi, strateji önerileri, portföy değerlendirmesi ve risk yönetimi konularında destek sağlayabilirim.'
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🤖 AI Trading Assistant</h1>
          <p className="text-gray-600">Yapay zeka destekli akıllı trading platformu</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Portfolio Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Portföy Özeti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Toplam Değer</span>
                <span className="text-xl font-bold">${portfolio.totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Günlük K/Z</span>
                <span className={`text-lg font-semibold ${portfolio.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio.dailyPnL >= 0 ? '+' : ''}${portfolio.dailyPnL}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Açık Pozisyon</span>
                <span className="text-lg font-semibold">{portfolio.positions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Başarı Oranı</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  %{portfolio.winRate}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Market Data */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Piyasa Verileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  {marketData.map((item) => (
                    <div key={item.symbol} className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
                      <div>
                        <div className="font-semibold text-sm">{item.symbol}</div>
                        <div className="text-xs text-gray-600">${item.price.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-1 text-sm font-semibold ${
                          item.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {item.change >= 0 ? '+' : ''}{item.change}%
                        </div>
                        <div className="text-xs text-gray-500">Vol: {(item.volume / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* AI Chat */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Asistan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-48 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm">
                      AI asistanınızla konuşmaya başlayın...
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {message.content}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-600">
                        AI düşünüyor...
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="AI'a sorunuzu yazın..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={isLoading || !inputMessage.trim()}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              AI Önerileri ve Uyarılar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-800">Alım Fırsatı</span>
                </div>
                <p className="text-sm text-green-700">
                  BTC/USDT çiftinde güçlü destek seviyesi. %85 olasılıkla yükseliş bekleniyor.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-amber-800">Risk Uyarısı</span>
                </div>
                <p className="text-sm text-amber-700">
                  Volatilite artışı bekleniyor. Stop-loss seviyelerini gözden geçirin.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-800">Strateji Önerisi</span>
                </div>
                <p className="text-sm text-blue-700">
                  DCA stratejisi ile pozisyon büyüklüğünü artırabilirsiniz.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}