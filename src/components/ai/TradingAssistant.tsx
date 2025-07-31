import React, { useState, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigg
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
  Brain,
  Aler
  Zap,
} from 
import { a

interface ChatM
  role: 'us
  timest

  const [message
  const [isLo
  cons

  useEffect(() => {
  }, [messages])
  // AI mesaj gönderme fonksiyonu
    if (!inputMessage.trim() || isLoading) return

      role: 'user',
      timestamp: new Da

    setInputMessage('')

  timestamp: Date
}

export function TradingAssistant() {
  const [messages, setMessages] = useKV<ChatMessage[]>('ai-chat-messages', [])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [strategies] = useKV<TradingStrategy[]>('trading-strategies', [])
  const [liveStrategies] = useKV<TradingStrategy[]>('live-strategies', [])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mesajları otomatik kaydırma
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // AI mesaj gönderme fonksiyonu
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
  const handleKeyPress = (e: React.KeyboardE
      e.preventDefault()
    }

    <div className="flex flex-col h-screen bg-background">
      <div className="border-b bg-card p-6">
        <p className="tex



          <TabsTrigger valu
        </TabsList>

          <div className="flex-1 flex gap-6">
            <div className="flex-1">
                <CardHeade
                    <Brain
                  </CardTitle
       
      
                      {messages.length === 0 && (
                     
                          <p>Size piyasa anali
                      )}
                      {messages.map((mes
                          
                              ? 'bg-primary text-primary-foreground' 
                          }`}
       
                              <div className="flex
               
                         
     
   

                        <
     
                              
                          </div>
                      )}
      

                  <div className
                      value={inputMessag
                      onKeyPress={handleKeyPress}
      
     
                      onClic
                      size="icon"
                      {isLoading ? (
      
     
                  </div>
              </Card>

     
   

                  </CardH
                    <div className="space-y-2">
                        <But
   

                        >
                          {cmd.label}
                      ))}
                  </Card

     
   

          
                        <Badge variant="secondary">{strate
                    
                        <Badge variant="defa
                      <div className="flex items-center justify-betwe
                        <Badge variant="outline" c
                          Aktif
            
            

                <Card>
                    <CardTitle className="text-sm">AI 
                  <CardContent>
                      <p>• Piyasa analizi için zaman dilimi 
                      <p>• Risk yönetimi tavsiyeleri</p>
                   

            </div>
        </TabsContent>
        {/* Analysis Tab */}
          <div className="grid gap-4">
              <CardHeader>
                  <TrendingUp className="w-5 h-5" />
                </CardTitle>
              <CardContent>
                    <Brain className="w-5 h-5" />
                    AI Asistan Sohbeti
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {/* Mesajlar */}
                  <ScrollArea className="flex-1 pr-4 mb-4">
                    <div className="space-y-4">
                      {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Merhaba! Ben AI Trading Yöneticinizim.</p>
                          <p>Size piyasa analizi, strateji önerileri ve portföy yönetimi konularında yardımcı olabilirim.</p>
                        </div>
                      )}
                      
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <div className="flex items-start gap-2">
                              {message.role === 'assistant' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                              {message.role === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                              <div className="flex-1">
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                <div className="text-xs opacity-70 mt-2">
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
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="AI'a mesaj yazın... (örn: 'BTC'nin teknik analizini yap')"
                      disabled={isLoading}
                      className="flex-1"
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

                </CardContent>
              </Card>
            </div>

            {/* Sağ Panel - Hızlı Komutlar ve Bilgiler */}
            <div className="w-80">
              <div className="space-y-4">
                {/* Hızlı Komutlar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Hızlı Komutlar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {quickCommands.map((cmd, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => useQuickCommand(cmd.command)}
                          className="w-full justify-start gap-2"
                        >

                          {cmd.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sistem Durumu */}
                <Card>

                    <CardTitle className="text-sm">Sistem Durumu</CardTitle>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Toplam Strateji</span>
                        <Badge variant="secondary">{strategies.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Çalışan Strateji</span>
                        <Badge variant="default">{liveStrategies.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Durumu</span>
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Aktif
                        </Badge>
                      </div>

                  </CardContent>



                <Card>

                    <CardTitle className="text-sm">AI Önerileri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Piyasa analizi için zaman dilimi belirtin</p>
                      <p>• Strateji önerileri ve optimizasyon</p>
                      <p>• Risk yönetimi tavsiyeleri</p>
                      <p>• Portföy dengeleme önerileri</p>
                    </div>

                </Card>

            </div>

        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 p-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />

                </CardTitle>

              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+2.4%</div>
                    <div className="text-sm text-muted-foreground">BTC/USDT</div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">-1.2%</div>
                    <div className="text-sm text-muted-foreground">ETH/USDT</div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+0.8%</div>
                    <div className="text-sm text-muted-foreground">BNB/USDT</div>

                </div>

            </Card>

            <Card>

                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Strateji Performansı

              </CardHeader>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Aktif Stratejiler</span>

                  </div>

                    <span className="text-sm">Toplam Stratejiler</span>
                    <Badge variant="outline">{strategies.length}</Badge>
                  </div>

              </CardContent>

          </div>


        {/* Insights Tab */}
        <TabsContent value="insights" className="flex-1 p-4">

            <Alert>

              <AlertDescription>
                <strong>Ekonomik Takvim:</strong> Bu hafta Fed faiz kararı ve NFP verisi açıklanacak. 
                Yüksek volatilite bekleniyor.

            </Alert>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>AI Önerisi:</strong> Mevcut piyasa koşullarında grid bot stratejileri 
                daha uygun görünüyor. Volatilite düşük seviyelerde.

            </Alert>

            <Alert>

              <AlertDescription>
                <strong>Risk Uyarısı:</strong> Portföy toplam değerinin %15'i tek bir varlıkta. 
                Çeşitlendirme önerilir.

            </Alert>

        </TabsContent>

    </div>

}