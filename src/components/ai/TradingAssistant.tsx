import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Bot, 
  User,
  Send,
  Loader2, 
  Brain, 
  TrendingUp,
  TrendingDown, 
  DollarSign,
  CheckCircle,
  Clock,
  Zap,
  Activity,
  AlertTriangle
} from 'lucide-react'
import { useKV } from '@github/spark/hooks'
import { aiService } from '@/services/aiService'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function TradingAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [strategies] = useKV('trading-strategies', [])
  const [liveStrategies] = useKV('live-strategies', [])

  const quickCommands = [
    { label: 'Piyasa Analizi (1H)', icon: TrendingUp, command: 'BTC ve ETH için 1 saatlik teknik analiz yap' },
    { label: 'Strateji Önerisi', icon: Brain, command: 'Mevcut piyasa koşullarına uygun strateji öner' },
    { label: 'Risk Analizi', icon: AlertTriangle, command: 'Portföy risk analizimi yap' },
    { label: 'Günlük Özet', icon: Activity, command: 'Bugün için piyasa özetini ver' }
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // AI mesaj gönderme fonksiyonu
  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // AI sistem promptu - Türkçe trading asistanı
      const systemPrompt = `Sen yapay zekâ destekli bir algoritmik trader yöneticisisin. Görevin:
- Farklı zaman dilimlerinde (1D, 4H, 1H, 15M, 1M) tüm piyasa enstrümanlarını analiz etmek
- Ekonomik takvimi ve haber akışını takip edip yorumlamak
- Kullanıcının portföyünü değerlendirerek özet çıkarım yapmak
- Hangi stratejiler çalıştırılmalı/durdurulmalı bunu tahmin etmek
- Türkçe yanıtlar üretmek

Kullanıcıya profesyonel, anlaşılır ve eyleme dönük öneriler sun.`

      const prompt = spark.llmPrompt`${systemPrompt}

Kullanıcı sorusu: ${inputMessage}

Lütfen detaylı ve yardımcı bir yanıt ver.`

      const response = await spark.llm(prompt)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI yanıt hatası:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const useQuickCommand = (command: string) => {
    setInputMessage(command)
    setTimeout(() => {
      sendMessage()
    }, 100)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Trading Yöneticisi</h1>
            <p className="text-xs text-muted-foreground">Yapay zeka destekli trading asistanınız</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="chat" className="text-xs">Sohbet</TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs">Analiz</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">Öngörüler</TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 p-3">
          <div className="flex-1 flex gap-3">
            {/* Ana Sohbet Alanı */}
            <div className="flex-1">
              <Card className="h-[350px] flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Brain className="w-4 h-4" />
                    AI Asistan Sohbeti
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-3">
                  {/* Mesajlar */}
                  <ScrollArea className="flex-1 pr-2 mb-3">
                    <div className="space-y-2">
                      {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                          <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">Merhaba! Ben AI Trading Yöneticinizim.</p>
                          <p className="text-xs">Size piyasa analizi ve strateji önerileri konularında yardımcı olabilirim.</p>
                        </div>
                      )}
                      
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg p-2 ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <div className="flex items-start gap-1">
                              {message.role === 'assistant' && <Bot className="w-3 h-3 mt-1 flex-shrink-0" />}
                              {message.role === 'user' && <User className="w-3 h-3 mt-1 flex-shrink-0" />}
                              <div className="flex-1">
                                <p className="whitespace-pre-wrap text-xs">{message.content}</p>
                                <div className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString('tr-TR')}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>AI düşünüyor...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </ScrollArea>

                  {/* Mesaj Input */}
                  <div className="flex gap-1">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="AI'a mesaj yazın..."
                      disabled={isLoading}
                      className="flex-1 text-xs"
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      size="sm"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Send className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sağ Panel - Hızlı Komutlar */}
            <div className="w-32">
              <div className="space-y-2">
                {/* Hızlı Komutlar */}
                <Card>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-xs">Hızlı Komutlar</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      {quickCommands.slice(0, 2).map((cmd, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => useQuickCommand(cmd.command)}
                          className="w-full justify-start gap-1 text-xs h-6"
                        >
                          <cmd.icon className="w-3 h-3" />
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sistem Durumu */}
                <Card>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-xs">Durum</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Strateji</span>
                        <Badge variant="secondary" className="text-xs h-4">{strategies.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Aktif</span>
                        <Badge variant="default" className="text-xs h-4">{liveStrategies.length}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 p-3">
          <div className="space-y-2">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-1 text-sm">
                  <TrendingUp className="w-3 h-3" />
                  Piyasa Durumu
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-sm font-bold text-green-600">+2.4%</div>
                    <div className="text-xs text-muted-foreground">BTC</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-red-600">-1.2%</div>
                    <div className="text-xs text-muted-foreground">ETH</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-green-600">+0.8%</div>
                    <div className="text-xs text-muted-foreground">BNB</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="flex-1 p-3">
          <div className="space-y-2">
            <Alert>
              <AlertTriangle className="h-3 w-3" />
              <AlertDescription className="text-xs">
                <strong>Volatilite Uyarısı:</strong> BTC'de yüksek volatilite bekleniyor.
              </AlertDescription>
            </Alert>

            <Alert>
              <Brain className="h-3 w-3" />
              <AlertDescription className="text-xs">
                <strong>AI Önerisi:</strong> Grid bot stratejileri daha uygun görünüyor.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}